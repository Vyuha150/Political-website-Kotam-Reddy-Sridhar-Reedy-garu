const express = require('express');
const mongoose = require('mongoose');
const FormData = require('./models/formData'); // Adjust path as necessary
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/form';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/form.html');
});

app.post('/submit-form', (req, res) => {
    const formData = new FormData({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        locality: req.body.locality,
        problemCategory: req.body.problemCategory,
        problem: req.body.problem,
        complaintHistory: req.body.complaintHistory === 'true',
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        address: req.body.address
    });

    formData.save()
        .then(() => {
            // Redirect to success.html upon successful form submission
            res.redirect('/success.html');
        })
        .catch(err => {
            console.error('Error saving form data:', err);
            res.status(500).send('Error submitting form data.');
        });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:3000/`);
});
