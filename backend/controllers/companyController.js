const Company = require('../models/Company');

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching companies' });
  }
};

const createCompany = async (req, res) => {
  try {
    const { name, profileLink } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Company name is required' });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({ name: name.trim() });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company already exists' });
    }

    const company = new Company({
      name: name.trim(),
      profileLink: profileLink || ''
    });

    await company.save();
    res.status(201).json(company);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Company name must be unique' });
    }
    res.status(500).json({ error: 'Error creating company' });
  }
};

module.exports = {
  getAllCompanies,
  createCompany
};

