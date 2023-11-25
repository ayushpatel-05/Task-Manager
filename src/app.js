//This file is used while testing 
//It uses test.env instead of .env to test in a different envoirnment


const express = require('express');
require('dotenv').config({path: 'config/test.env'});//For Testing
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
require('./db/moongose');


const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


module.exports = app;