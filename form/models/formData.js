// formData.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for form data
const formDataSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    locality: { type: String, required: true },
    problemCategory: { type: String, required: true },
    problem: { type: String, required: true },
    complaintHistory: { type: Boolean, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
});

// Create model based on schema
const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData;
