'use strict';

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const weatherResponse = require('./lib/weather')
const moviesResponse = require('./lib/movies')
dotenv.config();

const PORT = process.env.PORT;


const app = express();

app.use(cors());


app.get('/weather', weatherResponse)
app.get('/movies', moviesResponse)


// A way for the server to stay on
app.listen(PORT, () => {
    console.log('App is listening!!', PORT);
});