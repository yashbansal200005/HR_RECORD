const HRRecord = require('../models/HRRecord');
const Company = require('../models/Company');
const { validationResult } = require('express-validator');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone validation regex (allows digits, spaces, hyphens, parentheses, plus sign)
const phoneRegex = /^[\d\s\-\+\(\)]+$/;

const getAllHRRecords = async (req, res) => {
  try {
    const { companyId, companyName } = req.query;
    let query = {};

    if (companyId) {
      query.companyId = companyId;
    }
    if (companyName) {
      query.companyName = { $regex: companyName, $options: 'i' };
    }

    const records = await HRRecord.find(query)
      .populate('companyId', 'name profileLink')
      .sort({ createdAt: -1 });
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching HR records' });
  }
};

const createHRRecord = async (req, res) => {
  try {
    const {
      companyName,
      companyProfileLink,
      hrName,
      hrProfileLink,
      hrEmail,
      hrPhone,
      active
    } = req.body;

    // Validation
    if (!companyName || companyName.trim() === '') {
      return res.status(400).json({ error: 'Company name is required' });
    }
    if (!hrName || hrName.trim() === '') {
      return res.status(400).json({ error: 'HR name is required' });
    }
    if (!hrEmail || hrEmail.trim() === '') {
      return res.status(400).json({ error: 'HR email is required' });
    }
    // Email format validation
    if (!emailRegex.test(hrEmail.trim())) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    // Phone format validation (optional field)
    if (hrPhone && hrPhone.trim() !== '' && !phoneRegex.test(hrPhone.trim())) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Find or create company
    let company = await Company.findOne({ name: companyName.trim() });
    if (!company) {
      company = new Company({
        name: companyName.trim(),
        profileLink: companyProfileLink || ''
      });
      await company.save();
    }

    const hrRecord = new HRRecord({
      companyId: company._id,
      companyName: company.name,
      companyProfileLink: companyProfileLink || company.profileLink || '',
      hrName: hrName.trim(),
      hrProfileLink: hrProfileLink || '',
      hrEmail: hrEmail.trim().toLowerCase(),
      hrPhone: hrPhone && hrPhone.trim() !== '' ? hrPhone.trim() : '',
      active: active !== undefined ? active : true
    });

    await hrRecord.save();
    const populatedRecord = await HRRecord.findById(hrRecord._id)
      .populate('companyId', 'name profileLink');
    
    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error creating HR record' });
  }
};

const updateHRRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      companyName,
      companyProfileLink,
      hrName,
      hrProfileLink,
      hrEmail,
      hrPhone,
      active
    } = req.body;

    const record = await HRRecord.findById(id);
    if (!record) {
      return res.status(404).json({ error: 'HR record not found' });
    }

    // Validation
    if (hrEmail && !emailRegex.test(hrEmail.trim())) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (hrPhone && !phoneRegex.test(hrPhone.trim())) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Handle company name change
    if (companyName && companyName.trim() !== record.companyName) {
      let company = await Company.findOne({ name: companyName.trim() });
      if (!company) {
        company = new Company({
          name: companyName.trim(),
          profileLink: companyProfileLink || ''
        });
        await company.save();
      }
      record.companyId = company._id;
      record.companyName = company.name;
    }

    // Update fields
    if (companyProfileLink !== undefined) record.companyProfileLink = companyProfileLink;
    if (hrName !== undefined) record.hrName = hrName.trim();
    if (hrProfileLink !== undefined) record.hrProfileLink = hrProfileLink;
    if (hrEmail !== undefined) record.hrEmail = hrEmail.trim().toLowerCase();
    if (hrPhone !== undefined) record.hrPhone = hrPhone.trim();
    if (active !== undefined) record.active = active;

    await record.save();
    const updatedRecord = await HRRecord.findById(id)
      .populate('companyId', 'name profileLink');
    
    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error updating HR record' });
  }
};

const toggleActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await HRRecord.findById(id);
    
    if (!record) {
      return res.status(404).json({ error: 'HR record not found' });
    }

    record.active = !record.active;
    await record.save();
    
    const updatedRecord = await HRRecord.findById(id)
      .populate('companyId', 'name profileLink');
    
    res.json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: 'Error toggling active status' });
  }
};

module.exports = {
  getAllHRRecords,
  createHRRecord,
  updateHRRecord,
  toggleActiveStatus
};

