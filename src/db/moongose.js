const mongoose = require('mongoose');

// console.log("From hjere", process.env.MONGODB_URL);
const connectionURL = process.env.MONGODB_URL;

mongoose.connect(connectionURL);