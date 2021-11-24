const express = require('express');
const router = express.Router();

const movieController = require("../controllers/movie.controller");
const actorController = require("../controllers/stars.controller");

const importTXTController = require('../controllers/importTXT');

const saveTxtFile = require('../middleware/saveTxt').saveFiles


//Добавить фильм 
router.post('/movie', movieController.addNewMovie);
//Удалить фильм
router.delete('/movie/:movieID', movieController.removeMovie);
//Показать информацию о фильме
router.get('/movie/:movieID', movieController.findOneMovie);

// Получить список фильмов
router.get('/movie', movieController.getMovieList);

//Найти фильм 
router.get('/search/global', movieController.searchMovies);
//Редактировать информацию о фильме
router.patch('/movie/:movieID', movieController.editMovie);


router.patch('/import', saveTxtFile, importTXTController);

//Добавить актера 
router.post('/actor', actorController.addNewActor);
router.post(':movieID/actor', actorController.addNewActor);
module.exports = router;