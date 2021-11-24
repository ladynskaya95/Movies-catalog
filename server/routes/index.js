const express = require('express');
const router = express.Router();

const fs = require("fs");
const readline = require('readline');
const mongoose = require('mongoose');

router.patch('/', function (req, res, next) {

  res.render('index', {
    title: 'Express'
  });

});

module.exports = router;