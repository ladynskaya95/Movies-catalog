
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
var cors = require('cors');

require('./configs/mongo');


const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    success: false,
    error: err.message
  });


});

module.exports = app;

















// const express = require('express');
// const mongoose = require('mongoose');
// const config = require("config");

// const app = express()

// app.use('/api/auth', require('./routes/auth.routes'));

// const PORT = config.get("serverPort");
// const start = async () => {
//    try {
//       await mongoose.connect(config.get('dbUrl'), {
            
//          })

//       app.listen(PORT, () => {
//          console.log(`Server running at port :${PORT}`);
//        })
//    }
//    catch (e) {
//       console.log('Server Error', e.message);
//       process.exit(1);
//    }
// }
// start()


// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//    next(createError(404));
//  });
 
//  // error handler
//  app.use(function (err, req, res, next) {
//    // set locals, only providing error in development
//    res.locals.message = err.message;
//    res.locals.error = req.app.get('env') === 'development' ? err : {};
 
//    // render the error page
//    res.status(err.status || 500);
//    res.json({
//      success: false,
//      error: err.message
//    });
 
 
//  });






