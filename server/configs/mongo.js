var mongoose = require("mongoose");
const dbURI = 'mongodb+srv://ladynskaya1995:foramen1magnum@cluster0.oexyk.mongodb.net/Cluster0?retryWrites=true&w=majority';

mongoose.Promise = global.Promise;
mongoose.connect(dbURI, {
    useNewUrlParser: true
});

mongoose.connection.on('connected', function () {
    console.info("Mongoose connected to " + dbURI);
});

mongoose.connection.on('error', function (req, res, next) {
    console.info("Mongoose error " + dbURI);
});

mongoose.connection.on('disconnected', function () {
    console.info("Mongoose disconnected " + dbURI);
});


module.exports = mongoose;