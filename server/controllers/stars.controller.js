var StarsModel = require('../models/stars.models');
var mongoose = require('mongoose');

const addNewActor = async function (req, res, next) {
    try {
        const firstName = req.body.firstName.trim();
        const lastName = req.body.lastName.trim();

        let isUniqueActor = await StarsModel.findOne({
            firstName: firstName,
            lastName: lastName
        });

        if (!isUniqueActor) {
            let actorItem = {
                _id: new mongoose.Types.ObjectId(),
                firstName: firstName,
                lastName: lastName
            };

            const createdActor = await StarsModel.create(actorItem);

            res.status(201).json({
                success: true,
                createdActor: createdActor
            });

        } else {
            let errorMessage = `Actor ${firstName} ${lastName} already existing in database`;

            res.status(409).json({
                success: false,
                error: errorMessage
            });
        }

    } catch (err) {
        return next(err);
    }
};

const searchActors = async function (searchString) {
    try {
        const fullTextSearchOption = {
            $text: {
                $search: searchString
            }
        };
        const partTextSearch = {
            'firstName': {
                $regex: searchString,
                $options: 'i'
            }
        };

        let actorsList = await StarsModel.find(fullTextSearchOption).lean();

        if (!actorsList.length) {
            actorsList = await StarsModel.find(partTextSearch).lean();
        }

        if (!actorsList.length) {
            actorsList = await StarsModel.find({
                'lastName': {
                    $regex: searchString,
                    $options: 'i'
                }
            }).lean();
        }

        return actorsList;
    } catch (err) {
        return err;
    }

}

const insertManyActorsToDb = async function (actorsListArr) {
    return await StarsModel.insertMany(actorsListArr);
}


module.exports = {
    addNewActor,
    searchActors,
    insertManyActorsToDb
}