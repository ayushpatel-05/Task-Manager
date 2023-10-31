const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
require('./db/moongose');


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