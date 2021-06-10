const mongoose = require('mongoose');
const express = require('express');
const { Customer, validate } = require('../models/customers')
const router = express.Router();

router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
});

router.post('/', async function (req, res) {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.message);
    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })

    customer = await customer.save();
    res.send(customer);
    console.log(customer);
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, { new: true })

    if (!customer) res.status(404).send("not found id");

})

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) res.status(404).send("given genreId not found");
    res.send(customer);
})



module.exports = router;