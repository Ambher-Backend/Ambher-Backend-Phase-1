// Internal Imports
const seeder = require("../../config/database/seeder");


//function to generate 5 admin data or on the basis of request
const generateDummyProducts = async (reqBody) => {
	const verdict = await seeder.productSeeder(reqBody.deleteExisting, reqBody.total);
	return verdict;
};


module.exports = {generateDummyProducts};