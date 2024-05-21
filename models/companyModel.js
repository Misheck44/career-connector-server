const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = require('./userModel'); // Assuming userModel.js is in the same directory

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true,
    required: [true, 'Company name is required'],
    maxlength: 100,
  },
  user: {
        type: ObjectId,
        ref: "User",
        required: true
    },
  email: {
    type: String,
    trim: true,
    lowercase: true, // Ensure email is always lowercase for case-insensitive validation
    unique: true, // Enforce unique email constraint
    required: [true, 'Company email is required'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid company email address',
    ],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'company description is required'],
    maxlength: 200,
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'password is required'],
    minlength: [6, 'password must have at least (6) characters'],
},
location: {
  type: String,
  trim: true,
  required: [true, 'company description is required'],
  maxlength: 100,
},
role: {
    type: Number,
    default: 1
}
}, { timestamps: true });

// Validate email uniqueness on create and update operations (including updates to email field)
companySchema.pre('validate', async function(next) {
  if (!this.isModified('email')) {
    return next();
  }
  const existingCompany = await companyModel.findOne({ email: this.email });
  if (existingCompany) {
    return next(new Error('A company with this email already exists'));
  }
  next();
});

// Create the company model
const companyModel = mongoose.model('Company', companySchema);

module.exports = companyModel;
