const axios = require("axios");
const dotenv = require('dotenv');
let cache = require('../cache');
dotenv.config();

const MOVIE_API = process.env.MOVIE_API_KEY;
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

moviesResponse = (request, response) => {
	let value = Object.values(request.query)
	let movies = `${value} Movies`;
	if(cache[movies] !== undefined){
		response.json(cache[movies])
	} else{
		axios.get(`https://api.themoviedb.org/3/search/movie?query=${value}&api_key=${MOVIE_API}&include_adult=true&language=en-US&page=1`)
		.then(movieResponse => {
			cache[movies] = movieResponse.data.results.filter(element => element.poster_path).map((element) => {
				return new Movies(element.title, element.overview, element.vote_average, element.vote_count, element.poster_path, element.popularity, element.release_date)
			})
			response.json(cache[movies])
		}) .catch(error => {
			console.log('movie', error);
			response.status(error.status).json(error);
		})
	}
};

module.exports = moviesResponse;
