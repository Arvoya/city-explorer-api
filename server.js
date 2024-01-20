'use strict';

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
// const weather = require('./data/weather');

dotenv.config();

const PORT = process.env.PORT;
const WEATHER_API = process.env.WEATHER_API_KEY;
const MOVIE_API = process.env.MOVIE_API_KEY;


const app = express();

app.use(cors());

class Forecast {
    constructor(date, description) {
        this.date = date;
        this.description = description
    }
}

class Movies {
    constructor(title, overview, vote_average, vote_count, poster_path, popularity, released_date) {
        this.title = title;
        this.overview = overview;
        this.average_votes = vote_average;
        this.total_votes = vote_count;
        this.image_url = poster_path;
        this.populatiry = popularity;
        this.released_on = released_date;
    }
}


app.get('/weather', (request, response) => {

    const { lat, lon } = request.query;


    axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHER_API}&include=minutely`)

        .then( weatherResponse => {

            let cityForecast = weatherResponse.data.data.map((element, idx) => {
                return new Forecast(element.datetime, element.weather.description);
            });

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

app.get('/movies', (request, response) => {
    let value = Object.values(request.query)
    console.log(value);
    axios.get(`https://api.themoviedb.org/3/search/movie?query=${value}&api_key=${MOVIE_API}&include_adult=true&language=en-US&page=1`)
        .then(movieResponse => {
            // console.log(movieResponse.data.results)
            let movieList = movieResponse.data.results.map((element) => {
                return new Movies(element.title, element.overview, element.vote_average, element.vote_count, element.poster_path, element.populatiry, element.release_date)
            })
            response.json(movieList)
        }) .catch(error => {
            console.log(error.response);
    })
})

// A way for the server to stay on
app.listen(PORT, () => {
    console.log('App is listening!!', PORT);
});