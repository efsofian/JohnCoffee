import {
	table,
	getMinifiedRecords,
	findRecordByFilter,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
	if (req.method === "POST") {
		const { id, name, neighbourhood, address, imgUrl, voting } = req.body;
		try {
			if (id) {
				const records = await findRecordByFilter(id);
				if (records.length !== 0) {
					res.json(records);
				} else {
					if (name) {
						const createRecords = await table.create([
							{
								fields: {
									id,
									name,
									address,
									neighbourhood,
									voting,
									imgUrl,
								},
							},
						]);
						const records = getMinifiedRecords(createRecords);
						res.json(records);
					} else {
						res.status(400).json({ message: "name is missing" });
					}
				}
			} else {
				res.status(400).json({ message: "id is missing" });
			}
		} catch (e) {
			console.error("error finding or creating store\n", e);
			res.status(500).json({
				message: `something went wrong requesting coffee store: ${e.message}`,
			});
		}
	} else {
		res.json({ method: "get" });
	}
};

export default createCoffeeStore;
