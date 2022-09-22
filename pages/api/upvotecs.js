import { findRecordByFilter, getMinifiedRecords } from "../../lib/airtable";
import { table } from "../../lib/airtable";

const UpVoteCoffeeStore = async (req, res) => {
	if (req.method === "PUT") {
		try {
			const { id } = req.body;
			if (id) {
				const records = await findRecordByFilter(id);
				if (records.length !== 0) {
					const record = records[0];
					const calculateVoting = parseInt(record.voting) + 1;
					const updateRecord = await table.update([
						{
							id: record.recordId,
							fields: {
								voting: calculateVoting,
							},
						},
					]);
					if (updateRecord) {
						const minifiedRecord = getMinifiedRecords(updateRecord);
						res.json(minifiedRecord);
					}
				} else {
					res.status(400).json({ message: "coffee store doesnt exist" });
				}
			} else {
				res.status(400).json({ message: "no id provided" });
			}
		} catch (e) {
			console.error(e);
			res.status(500).json({
				message: `something went wrong trying upvoting..  ${e.message}`,
			});
		}
	}
};

export default UpVoteCoffeeStore;
