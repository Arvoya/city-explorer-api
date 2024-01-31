const axios = require('axios');
const dotenv = require('dotenv');
let cache = require('../cache');
dotenv.config();

const WEATHER_API = process.env.WEATHER_API_KEY;

class Forecast {
	constructor(date, imgCode, temp, description) {
		this.date = this.formatDate(date);
		this.img = `https://www.weatherbit.io/static/img/icons/${imgCode}.png`;
		this.temp = temp
		this.description = description
	}

	formatDate(inputDate) {
		const parsedDate = new Date(inputDate);
		return `${parsedDate.toLocaleDateString('en-US', {month: 'numeric', day: 'numeric' })}`;
	}
}

weatherHandler = (request, response) => {

	const { city, lat, lon } = request.query;
	let weather = `${city} Weather`

	if(cache[weather] !== undefined && !isCacheExpired(cache[weather])){
		response.json(cache[weather].data)
	} else {
		axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${WEATHER_API}&include=minutely`)
		.then( weatherResponse => {
			cache[weather] = cache[weather] || {};
			cache[weather].data = weatherResponse.data.data.map((element, idx) => {
				return new Forecast(element.datetime, element.weather.icon, element.temp, element.weather.description);
			});
			cache[weather].timestamp = Date.now()
			console.log(cache[weather].data)
			response.json(cache[weather].data);
		}) .catch(error => {
			console.log('weather', error)
			let errorObject = {
				status: error.response ? error.response.status : 500,
				response: error.response ? error.response.statusText : 'Internal Server Error',
				dataMessage: error.response ? error.response.data.status_message : 'Unknown Error',
			}
			response.status(errorObject.status).json(errorObject);
		})
	}
};
isCacheExpired = (cacheWeatherDate) => {
	const firstDay = cacheWeatherDate.data[0].date
	const firstDayTimestamp = new Date(firstDay).getTime()
	return firstDayTimestamp >= Date.now();
}

module.exports = weatherHandler;