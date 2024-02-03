'use strict';

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const weatherResponse = require('./lib/weather')
const moviesResponse = require('./lib/movies')
const yelpResponse = require('./lib/yelp');
dotenv.config();

const PORT = process.env.PORT;


const app = express();

app.use(cors());


app.get('/weather', weatherResponse)
app.get('/movies', moviesResponse)
app.get('/yelp', yelpResponse)

// A way for the server to stay on
app.listen(PORT, () => {
    console.log('App is listening!!', PORT);
});