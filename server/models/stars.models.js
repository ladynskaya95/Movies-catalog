var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var starsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: {
        type: String,
        min: 1,
        max: 60,
        required: [
            true, 'First name is required'
        ]
    },
    lastName: {
        type: String,
        required: [
            true, 'Last Name is required'
        ]
    },
    movieIDList: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Movie'
    }],
    last_updated: Date

});


starsSchema.virtual('fullname').get(function () {
    return this.firstName + ' ' + this.lastName;
});

starsSchema.pre('save', function (next) {
    this.last_updated = Date.now();
    next();
});

starsSchema.index({
    '$**': 'text'
});

starsSchema.plugin(mongoosePaginate);

var Stars = mongoose.model('Stars', starsSchema, 'stars_list');

module.exports = Stars;