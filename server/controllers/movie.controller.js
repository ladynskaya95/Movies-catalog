var MovieModel = require('../models/movie.model');
var mongoose = require('mongoose');

const actorController = require("./stars.controller");

const addNewMovie = async function (req, res, next) {
    try {
        const movieTitle = req.body.title.trim();

        let isUniqueMovieTitle = await MovieModel.findOne({
            title: movieTitle
        });

        if (!isUniqueMovieTitle) {
            let movieItem = {
                _id: new mongoose.Types.ObjectId(),
                title: movieTitle,
                releaseYear: req.body.releaseYear.trim(),
                format: req.body.format.trim(),
            };

            const createdMovie = await MovieModel.create(movieItem);

            res.status(201).json({
                success: true,
                createdMovie: createdMovie
            });

        } else {
            let errorMessage = `Movie ${movieTitle} already existing in database`;

            res.status(409).json({
                success: false,
                error: errorMessage
            });
        }

    } catch (err) {
        return next(err);
    }
};

const getMovieList = async function (req, res, next) {
    try {

        const query = setQueryOption(req);

        const paginationOptions = setPaginationOptions(req);
        const movieList = await MovieModel.paginate(query, paginationOptions);

        res.status(200).json({
            success: true,
            movieList: movieList
        });

    } catch (err) {
        return next(err);
    }
}

function setQueryOption(req) {
    let queryItem = {};

    if (req.query.query) {
        queryItem = {
            $text: {
                $search: req.query.query
            }
        }
    }

    return queryItem;
}

function setPaginationOptions(req) {
    const itemPerPage = 50;
    const pageNumber = Math.max(0, req.query.page || 1);

    return {
        populate: {
            path: 'starsList',
            select: "firstName lastName",
        },
        sort: {
            title: 1
        },
        lean: true,
        page: pageNumber,
        limit: itemPerPage

    };
}

const findOneMovie = async function (req, res, next) {
    try {
        let conditionQuery = {
            _id: req.params.movieID
        };

        const movieItem = await MovieModel.findOne(conditionQuery).populate(
            'starsList');

        if (!movieItem) {
            res.status(400).json({
                success: false,
                error: "no movie exist for this id"
            })
        }

        res.status(200).json({
            success: true,
            movieItem: movieItem
        })

    } catch (err) {
        return next(err);
    }

}
const editMovie = async function (req, res, next) {
    try {
        let conditionQuery = {
            _id: req.params.movieID
        };

        let editFields = {
            title: req.body.title.trim(),
            releaseYear: req.body.releaseYear.trim(),
            format: req.body.format.trim(),
        }

        const movieItem = await MovieModel.findOneAndUpdate(conditionQuery, editFields);

        res.status(201).json(movieItem)

    } catch (err) {
        return next(err);
    }
}

const removeMovie = async function (req, res, next) {
    try {
        const movieID = req.params.movieID;

        let conditionQuery = {
            _id: movieID
        };

        let removedMovie = await MovieModel.findOneAndRemove(conditionQuery);
        res.status(200).json({
            success: true,
            removedMovie: removedMovie
        });

    } catch (err) {
        console.log(err)
        return next(err);
    }
}

const searchMovies = async function (req, res, next) {
    try {
        const searchString = req.query.query;
        if (!searchString) {
            let err = new Error('Empty query');
            err.status = 400;
            throw err;
        }

        const paginationOptions = setPaginationOptions(req);

        let moviesList = await findMoviesByFullTextSearch(searchString, paginationOptions);

        //search movie by part Text Search( movie title)
        if (!moviesList.docs.length) {
            moviesList = await findMoviesByPartTextSearchInTitle(searchString, moviesList, paginationOptions);
        }

        if (moviesList.docs.length) {
            res.status(200).json({
                success: true,
                searchResult: moviesList
            });
        } else {
            //search actors by full Text Search and part text search ( first name)
            const actorsList = await actorController.searchActors(searchString);

            moviesList = await getMoviesByIdList(actorsList, paginationOptions);

            res.status(200).json({
                success: true,
                searchResult: moviesList
            });

        }

    } catch (err) {
        return next(err);
    }

}

const findMoviesByFullTextSearch = async function (searchString, paginationOptions) {
    const fullTextSearchOption = {
        $text: {
            $search: searchString
        }
    };
    //search movie by full Text Search
    const movieList = await MovieModel.paginate(fullTextSearchOption, paginationOptions);
    return movieList;
}

const findMoviesByPartTextSearchInTitle = async function (searchString, paginationOptions) {
    const partTextSearch = {
        'title': {
            $regex: searchString,
            $options: 'i'
        }
    };
    const movieList = await MovieModel.paginate(partTextSearch, paginationOptions);
    return movieList;
}


const getMoviesByIdList = async function (actorsList, paginationOptions) {
    console.log(228, actorsList);

    let movieIDList = [];
    actorsList.forEach(actorItem => {
        if (actorItem.movieIDList.length) {
            actorItem.movieIDList.forEach(
                id => movieIDList.push(id)
            )
        }
    })

    let conditionQuery = {
        _id: {
            $in: movieIDList
        }
    };

    const movieList = await MovieModel.paginate(conditionQuery, paginationOptions);
    return movieList;
}

const insertManyMoviesToDb = async function (moviesListArr) {
    return await MovieModel.insertMany(moviesListArr);
}

module.exports = {
    getMovieList,
    addNewMovie,
    findOneMovie,
    removeMovie,
    editMovie,
    searchMovies,
    insertManyMoviesToDb
}