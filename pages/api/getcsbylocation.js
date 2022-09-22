import { fetchCoffeeStores } from "../../lib/coffee_store";

const getCoffeeStoresByLocation = async (req, res) => {
	try {
		const { latLong, limit } = req.query;
		const response = await fetchCoffeeStores(latLong, limit);
		res.status(200).json(response);
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: e.message });
	}
};

export default getCoffeeStoresByLocation;
