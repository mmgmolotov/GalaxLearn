const data = require('../models/data');

// Fetch all data records from the database
exports.getAllData = async () => {
  return await data.find();
};

// Create or update a data record in the database
exports.createData = async (data) => {
  const newData = new data(data);
  return await newData.save();
};
