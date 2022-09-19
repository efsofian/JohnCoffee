import { createApi } from "unsplash-js";

const unsplash = createApi({
	accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStoresPhotos = async () => {
	try {
		const photos = await unsplash.search.getPhotos({
			query: "coffee shop",
			page: 1,
			perPage: 30,
		});
		const dataFiltered = photos.response.results.map((result) => {
			return result.urls["small"];
		});
		return dataFiltered;
	} catch (e) {
		console.log(e);
	}
};

export const fetchCoffeeStores = async () => {
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: process.env.FOURSQUARE_API_KEY,
		},
	};
	try {
		const photos = await getListOfCoffeeStoresPhotos();
		const response = await fetch(
			getUrlForCoffeeStores(
				"43.653833032607096%2C-79.37896808855945",
				"coffee",
				"6"
			),
			options
		);
		const json = await response.json();
		console.log(json);
		const dataFormated = json.results.map((result, i) => {
			const neighborhood = result.location.neighborhood;
			return {
				id: result.fsq_id,
				address: result.location.address,
				name: result.name,
				neighborhood:
					neighborhood && neighborhood.length > 0 ? neighborhood[0] : "",

				imgUrl: photos.length > 0 ? photos[i] : null,
			};
		});
		console.log("test");
		console.log(dataFormated);
		return dataFormated;
	} catch (e) {
		console.log(e);
	}
};
