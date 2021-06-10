const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minLength: 9,
        maxLength: 10
    }
})

const Customer = mongoose.model('Customer', customerSchema);


function validateCustomers(customer) {
    const schema = {
        name: Joi.string().required().min(5),
        isGold: Joi.boolean(),
        phone: Joi.string()
    }

    return Joi.validate(customer, schema)
};
exports.Customer = Customer;
exports.validate = validateCustomers;