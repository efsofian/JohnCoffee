import {
	table,
	getMinifiedRecords,
	findRecordByFilter,
} from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
	const { id } = req.query;
	try {
		if (id) {
			const records = await findRecordByFilter(id);
			if (records.length !== 0) {
				res.json(records);
			} else {
				res.status(400).json({ message: "id could not be found" });
			}
		} else {
			res.status(500).json({ message: `id is missing` });
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({ message: `Something went wrong: ${e.message}` });
	}
};

export default getCoffeeStoreById;
