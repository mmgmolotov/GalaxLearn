const dataService = require('../services/dataService');

// Get all data records
exports.getAllData = async (req, res) => {
  try {
    const data = await dataService.getAllData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};

// Create or update a data record
exports.createData = async (req, res) => {
  try {
    const data = await dataService.createData(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error creating data', error });
  }
};
