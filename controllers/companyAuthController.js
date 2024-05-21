const Company = require('../models/companyModel');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

// Function to generate JWT token for company
const generateCompanyToken = (companyId) => {
  const payload = { id: companyId };
  return jwt.sign(payload, process.env.JWT_COMPANY_SECRET, {
    expiresIn: process.env.JWT_COMPANY_EXPIRE,
  });
};

// Company signup (registration)
exports.companySignup = async (req, res, next) => {
  const { name, email,password} = req.body;

  try {
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return next(new ErrorResponse('A company with this email already exists', 400));
    }

    const newCompany = await Company.create({
      name,
      email,password,
    });

    const token = generateCompanyToken(newCompany._id);

    res.status(201).json({
      success: true,
      company: newCompany,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Company signin (login)
exports.companySignin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validate email and password presence
    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Check for existing company
    const company = await Company.findOne({ email }).select('+password'); // Include password field
    if (!company) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Verify password
    const isMatch = await company.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Generate token and send response
    const token = generateCompanyToken(company._id);
    res.status(200).json({
      success: true,
      company,
      token,
    });
  } catch (error) {
    next(error);
  }
};
exports.companySignup = async (req, res, next) => {
  const { name, email, password } = req.body;

  const companyExists = await Company.findOne({ email });

  if (companyExists) {
    return next(new ErrorResponse('Company already exists', 400));
  }

  const company = await Company.create({ name, email, password });

  sendTokenResponse(company, 201, res);
};
