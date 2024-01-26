const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();


const WEATHER_API = process.env.WEATHER_API_KEY;


class Forecast {
	constructor(date, description) {
		this.date = date;
		this.description = description
	}
}

weatherHandler = (request, response) => {

	const { lat, lon } = request.query;


	axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHER_API}&include=minutely`)

	.then( weatherResponse => {

		let cityForecast = weatherResponse.data.data.map((element, idx) => {
			return new Forecast(element.datetime, element.weather.description);
		});

		response.json(cityForecast);
	}) .catch(error => {
		let errorObject = {
			status: error.response.status,
			response: error.response.statusText,
			dataMessage: error.response.data.status_message
		}
		response.status(errorObject.status).json(errorObject);
	})

};

module.exports = weatherHandler;