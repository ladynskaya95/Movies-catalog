const { Schema, model } = require('mangoose');

const movieSchema = new Schema({
   _id: Schema.Types.ObjectId,
   title: {
      type: String,
      min: 1,
      max: 60,
      required: [
         true, 'Title is required'
      ]
   },
   releaseYear: {
      type: Date,
      required: [
         true, 'Release Year is required'
      ]
   },
   format: {
      type: String,
      enum: [
         'VHS', 'DVD', 'Blu-Ray'
      ],
   },
   starsList: [{
      type: Schema.ObjectId,
      ref: 'Stars'
   }],
   last_updated: Date
});
   


const Movie = model('Movie', movieSchema, 'movie_list');

module.exports = Movie;