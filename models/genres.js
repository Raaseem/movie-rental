const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 100
    }
})

const Genre = mongoose.model('Genre', genreSchema);

function validateGenres(genre) {
    const schema = {
        name: Joi.string().min(10).required()
    }

    return Joi.validate(genre, schema);

}

exports.genreSchema = genreSchema;
exports.validate = validateGenres;
exports.Genre = Genre;