const express = require('express');
// require('dotenv').config({path: 'config/.env'});
require('dotenv').config({path: 'config/.env'});//For Testing
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
require('./db/moongose');

// console.log();
// dotenv.config({path: 'task-manager/config/.env'});
console.log(process.env.PORT);

// C:\Users\ayush\Desktop\Backend Udemy\task-manager\config
const app = express();
const port = process.env.PORT || 3000;

// //Mentainance Mode
// app.use((req, res, next) => {
//     res.status(503).send('Site is currrently down. Come back soon!');
// });


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('Sever up and running!');
})