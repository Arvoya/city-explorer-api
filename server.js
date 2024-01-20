'use strict';

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const weather = require('./data/weather');

dotenv.config();

const PORT = process.env.PORT;
const WEATHER_API = process.env.WEATHER_API_KEY;


const app = express();

app.use(cors());

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description
    }
}


app.get('/weather', (request, response) => {

    const { lat, lon } = request.query;


    axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHER_API}&include=minutely`)

        .then( weatherResponse => {

            let cityForecast = weatherResponse.data.data.map((element, idx) => {
                return new Forecast(element.datetime, element.weather.description);
            });

            //
            // const weatherData = {
            //     date: weatherResponse.data.data[0].datetime,
            //     description: weatherResponse.data.data[0].weather.description
            // }
            // console.log('THIS IS THE DATA I AM LOGGING!', weatherResponse.data.data.weather)
            // console.log('I am the response! ', weatherResponse.data);
            response.json(cityForecast);
        }) .catch(error => {
            console.log(error.response);
            let errorObject = {
                status: error.response.status,
                response: error.response.statusText,
                dataMessage: error.response.data.status_message
            }
            console.log('I am the object errorObject: ', errorObject);
            response.status(errorObject.status).json(errorObject);
    })

});

// A way for the server to stay on
app.listen(PORT, () => {
    console.log('App is listening!!', PORT);
});