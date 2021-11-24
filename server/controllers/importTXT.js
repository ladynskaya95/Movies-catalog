const fs = require("fs");
const readline = require('readline');
const mongoose = require('mongoose');

const removeTXTFileFromServer = require('../middleware/saveTxt').removeFile

const movieController = require("../controllers/movie.controller");
const actorController = require("../controllers/stars.controller");
module.exports = async function (req, res, next) {

  let moviesListArr = [];
  let uniqueActorsList = [];

  let filmItem = {};

  let readableStream$ = fs.createReadStream(__dirname + req.filePath);
  readableStream$.on('error', err => res.status(400).json(err.stack));

  readline.createInterface({
      input: readableStream$,
    })
    .on('error', err => res.json(400, err.stack))
    .on('line', async function (line) {

      const [key, value] = line.toString().split(":");

      if (value) {

        if (key === 'Title') {
          filmItem._id = new mongoose.Types.ObjectId();
          filmItem.title = value.trim();

        } else if (key === 'Release Year') {
          filmItem.releaseYear = value.trim();

        } else if (key === 'Format') {
          filmItem.format = value.trim();

        } else if (key === 'Stars') {
          let starsList = getActorsList(value, filmItem);

          filmItem.starsList = starsList.map(starItem => starItem._id);

          starsList.forEach(actorItem => {
            checkUniqueActors(uniqueActorsList, actorItem);
          });

        }

      } else {
        Object.keys(filmItem).length && moviesListArr.push(filmItem);
        filmItem = {};
      }

    })
    .on('close', async () => {
      try {
        removeTXTFileFromServer(__dirname + req.filePath);

        let createdMovies = await movieController.insertManyMoviesToDb(moviesListArr);
        let createdActors = await actorController.insertManyActorsToDb(uniqueActorsList)

        let result = {
          moviesList: createdMovies,
          actorsList: createdActors
        };

        res.status(201).json({
          success: true,
          importResult: result
        });

      } catch (error) {
        return next(error);
      }

    });


};

function checkUniqueActors(uniqueActorsList, actorItem) {

  for (let i = 0; i < uniqueActorsList.length; i++) {
    if (
      actorItem.firstName === uniqueActorsList[i].firstName &&
      actorItem.lastName === uniqueActorsList[i].lastName
    ) {
      uniqueActorsList[i].movieIDList.push(actorItem.movieIDList);
      return;
    }
  }

  uniqueActorsList.push({
    _id: actorItem._id,
    movieIDList: [actorItem.movieIDList],
    firstName: actorItem.firstName,
    lastName: actorItem.lastName
  });

}

function getActorsList(starsListArr, filmItem) {
  return starsListArr.split(",")
    .map(starsFullName => {
      const [firstName, lastName] = starsFullName.trim().split(" ");
      return {
        _id: new mongoose.Types.ObjectId(),
        movieIDList: filmItem._id,
        firstName: firstName,
        lastName: lastName
      };
    });
}