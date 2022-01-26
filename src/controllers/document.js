// Internal Imports
const seeder = require('../../config/database/seeder');


const generateDummyDocuments = async (reqBody) => {
  const verdict = await seeder.documentSeeder(reqBody.deleteExisting, reqBody.total);
	return verdict;
};


module.exports = {generateDummyDocuments};