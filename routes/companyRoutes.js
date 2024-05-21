const express = require('express');
const router = express.Router();
const { companySignup } = require('../controllers/companyAuthController');
const { isCompanyAuthenticated } = require('../middleware/companyAuth');
const {
  createCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  postJob,
} = require('../controllers/companyController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.post('/api/company/signup', companySignup);

// Create a new company (public)
router.post('/api/company/create',  isAuthenticated, createCompany);

// Get all companies (optional, depending on your requirements)
router.get('/', getAllCompanies);

// Get a single company by ID
router.get('/:id', getCompany);

// Update a company (restricted to authenticated companies)
router.put('/:companyId', async (req, res, next) => {
  try {
    const companyId = req.params.companyId;
    const updatedCompanyData = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(companyId, updatedCompanyData, { new: true, runValidators: true });
    if (!updatedCompany) {
      return next(new ErrorResponse('Company not found', 404));
    }

    res.status(200).json({
      success: true,
      company: updatedCompany,
    });
  } catch (error) {
    next(error);
  }
});

// Delete a company (restricted to authenticated companies)
router.delete('/:companyId', async (req, res, next) => {
  try {
    const companyId = req.params.companyId;
    const deletedCompany = await Company.findByIdAndDelete(companyId);

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
});

// Company posts a job (requires company authentication)
router.post('/jobs', isCompanyAuthenticated, postJob);

router.get('/users/:userId', isCompanyAuthenticated, async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await getUserDetails(userId);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});





module.exports = router;
