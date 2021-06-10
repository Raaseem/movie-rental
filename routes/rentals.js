const { Rental, validate } = require('../models/rentals');
const { Movie } = require('../models/movies');
const { Customer } = require('../models/customers');
const mongoose = require('mongoose');
const Fawn = require("fawn");
const express = require('express');
const router = express.Router();

Fawn.init(mongoose);


router.get('/', async (req, res) => {
    const rental = await Rental.find().sort('-dateOut');
    res.send(rental);
    console.log(rental);
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) res.status(400).send("id is not found");

    const movie = await Movie.findById(req.body.movieId)
    if (!movie) res.status(400).send("id is not found");

    if (movie.numberInStock === 0) return res.status(400).send("Movie is Not");

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        new Fawn.Task()
            .save("rentals", rental)
            .update(
                "movies",
                { _id: movie._id },
                {
                    $inc: { numberInStock: -1 }
                }
            )
            .run();

        res.send(rental);
        console.log(rental);
    } catch (ex) {
        res.status(500).send("Something failed.");
    }
})


module.exports = router;