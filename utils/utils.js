const User = require('../models/userModel');

async function getUserDetails(userId) {
  try {
    const user = await User.findById(userId).select('-password'); // Exclude password
    return user;
  } catch (error) {
    throw error; // Re-throw the error for handling in the route
  }
}

module.exports = getUserDetails; // Export the function for use in other files
