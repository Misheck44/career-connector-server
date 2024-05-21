const jwt = require('jsonwebtoken');

// Middleware to verify company JWT token
const isCompanyAuthenticated = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  // Check for token presence
  if (!token) {
    return next(new ErrorResponse('Unauthorized access: No token provided', 401));
  }

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_COMPANY_SECRET);
    req.company = decoded; // Attach decoded company ID to request object
    next();
  } catch (error) {
    return next(new ErrorResponse('Unauthorized access: Invalid token', 401));
  }
};

module.exports = { isCompanyAuthenticated };
