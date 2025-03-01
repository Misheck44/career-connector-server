const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require('cors');
const multer = require('multer');
// import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobTypeRoute = require('./routes/jobsTypeRoutes');
const jobRoute = require('./routes/jobsRoutes');
const companyRoutes = require('./routes/companyRoutes'); // Import the company routes

const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");


//database connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({limit:'5mb', extended: true}));
app.use(cookieParser());
app.use(cors());

// Include company routes under the `/api/companies` prefix
app.use('/api/companies', companyRoutes); // Add company routes with the prefix

// Include other routes under the `/api` prefix (assuming they don't require company authentication)
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', jobTypeRoute);
app.use('/api', jobRoute);

// error middleware
app.use(errorHandler);


//port
const port = process.env.PORT || 9000

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
