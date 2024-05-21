const Company = require('../models/companyModel'); // Import the company model
const User = require('../models/userModel'); // Import the user model for accessing user details
const ErrorResponse = require('../utils/errorResponse'); // Import error response handler

exports.createCompany = async (req, res, next) => {
  try {
    const newCompany = new Company(req.body); // Create a new company object

    // Validate company data using Mongoose schema validation (optional)
    await newCompany.validate(); // Throws an error if validation fails

    await newCompany.save(); // Save the new company to database

    res.status(201).json({
      success: true,
      message: 'Company created successfully!',
      company: newCompany,
    });
  } catch (error) {
    next(new ErrorResponse(error.message, 400)); // Handle validation or other errors
  }
};
exports.createCompany = async (req, res, next) => {
  try {
      const newCompany = await Company.create({
          companyName: req.body.companyName,
          user: req.user.id
      });
      res.status(201).json({
          success: true,
          company
      })
  } catch (error) {
      next(error);
  }
}


// Get all companies (optional, depending on your requirements)
exports.getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find();
    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single company by ID
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return next(new ErrorResponse('Company not found', 404));
    }
    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
};

// Update a company (restricted to authorized companies, implement authorization middleware)
exports.updateCompany = async (req, res, next) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // Ensure validation is applied on update
    });
    if (!updatedCompany) {
      return next(new ErrorResponse('Company not found', 404));
    }
    res.status(200).json({
      success: true,
      company: updatedCompany,
    });
  } catch (error) {
    next(new ErrorResponse(error.message, 400)); // Handle validation errors or other errors
  }
};

// Delete a company (restricted to authorized companies, implement authorization middleware)
exports.deleteCompany = async (req, res, next) => {
  try {
    const deletedCompany = await Company.findByIdAndRemove(req.params.id);
    if (!deletedCompany) {
      return next(new ErrorResponse('Company not found', 404));
    }
    res.status(200).json({
      success: true,
      message: 'Company deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// Company posts a job (assuming companies have a "jobs" array in their schema)
exports.postJob = async (req, res, next) => {
  const { title, description, salary, location, ...otherJobDetails } = req.body;

  try {
    const company = await Company.findById(req.user._id); // Assuming authorization middleware sets req.user
    if (!company) {
      return next(new ErrorResponse('Company not found', 404));
    }

    company.jobs.push({ title, description, salary, location, ...otherJobDetails });
    await company.save();

    res.status(200).json({
      success: true,
      message: 'Job posted successfully!',
      company,
    });
  } catch (error) {
    next(error);
  }
};

// Company accesses user details (restricted access based on roles or permissions)
exports.getUserDetails = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
  
      if (!user) {
        // Improved error handling:
        throw new UserNotFoundError(`User with ID '${req.params.userId}' not found`);
      }
  
      // Send the user data in the response:
      res.status(200).json({ user }); // Send user object as JSON
    } catch (err) {
      // Handle errors thrown from the try block or middleware:
      next(err); // Pass the error to the error handling middleware
    }
  };
  