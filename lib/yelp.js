const axios = require('axios');
const dotenv = require('dotenv');
let cache = require('../cache');

dotenv.config();

const YELP_API = process.env.YELP_API_KEY;

class Restaurant {
	constructor(name, img, address, url, price, rating, review_count) {
		this.name = name;
		this.img = img;
		this.address = address;
		this.url = url;
		this.price = price;
		this.rating = rating;
		this.review_count = review_count;
	}
}

yelpHandler = (request, response) => {
	let city = request.query;
	let restaurants = `${city}, Restaurants`;

	if(cache[restaurants] !== undefined){
		response.json(cache[restaurants])
	} else {
		const options = {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${YELP_API}`
			}
		};

		axios.get('https://api.yelp.com/v3/businesses/search?location=seattle&term=food&open_now=true&sort_by=best_match&limit=20', options)
		.then(yelpResponse => {
			cache[restaurants] = cache[restaurants] || {};
			cache[restaurants].data = yelpResponse.data.businesses.map(restaurant =>{
				return new Restaurant(restaurant.name, restaurant.image_url, restaurant.location.display_address.join(', '), restaurant.url, restaurant.price, restaurant.rating, restaurant.review_count)
			})
			response.json(cache[restaurants].data)
		}
		)
		.catch(err => console.error(err));
	}
}

module.exports = yelpHandler;
