import { createApi } from "unsplash-js";

const unsplash = createApi({
	accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStoresPhotos = async () => {
	try {
		const photos = await unsplash.search.getPhotos({
			query: "coffee shop",
			page: 1,
			perPage: 40,
		});
		const dataFiltered = photos.response.results.map((result) => {
			return result.urls["small"];
		});
		return dataFiltered;
	} catch (e) {
		console.log(e);
	}
};

export const fetchCoffeeStores = async (
	latLong = "43.653833032607096%2C-79.37896808855945",
	limit = 6
) => {
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
		},
	};
	try {
		const photos = await getListOfCoffeeStoresPhotos();
		const response = await fetch(
			getUrlForCoffeeStores(latLong, "coffee", limit),
			options
		);
		const json = await response.json();
		const dataFormated = json.results.map((result, i) => {
			const neighborhood = result.location.neighborhood;
			return {
				id: result.fsq_id,
				address: result.location.address,
				name: result.name,
				neighbourhood:
					neighborhood && neighborhood.length > 0 ? neighborhood[0] : "",

				imgUrl: photos.length > 0 ? photos[i] : null,
			};
		});
		return dataFormated;
	} catch (e) {
		console.log(e);
	}
};
