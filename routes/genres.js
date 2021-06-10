const auth = require('../middleware/auth');
const Joi = require('joi');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genres');

router.get('/', async (req, res) => {
    const genres = await Genre.find();
    res.send(genres);
    console.log(genres)
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    }
    const genre = new Genre({
        name: req.body.name
    });
    await genre.save();
    res.send(genre);
    console.log(genre);
});


router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre)
        res.status(404).send("the given id not found");
    else
        res.send(genre);
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return
    }

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, { new: true });

    if (!genre) res.status(404).send('not found this id');

    res.send(genre);
});


router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) res.status(404).send("given genreId not found");
    res.send(genre);
})


module.exports = router;
