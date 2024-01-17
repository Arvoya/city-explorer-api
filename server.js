'use strict';

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const weather = require('./data/weather');

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description;
    }

}

console.log('Hello! You have made the server!')

app.get('/data/weather', (request, response) => {

    const { city, lat, lon } = request.query;

    const cityData = weather.find(element =>
        element.city_name.toLowerCase() === city ||
        element.lat === lat ||
        element.lon === lon
    );

    let responseData = {};

    if(cityData) {
        responseData = {
            message: 'You have hit weather!',
            data: cityData
        };
    response.json(responseData);
    } else {
        response.status(404).json({ message: 'City not found!' });
    }

});

// A way for the server to stay on
app.listen(PORT, () => {
    console.log('App is listening!!');
});