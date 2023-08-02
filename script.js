const express = require('express');
const cors = require("cors");
const path = require('path')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/router');
const mongoose = require('mongoose');
require('dotenv').config();
const flash = require('connect-flash');


// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
connectToMongoDB();

const app = express();

app.use(cookieParser());
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5000000 }
  }));

  //to prevent going back after logout on the login page
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });
// Set up connect-flash middleware
app.use(flash());

app.use((req, res, next) => {
  res.locals.successMessage = req.flash('successMessage');
  next();
});

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("views"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/' ,indexRouter);

const PORT = process.env.PORT || 3002;

app.listen(PORT);
