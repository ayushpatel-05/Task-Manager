const express = require('express');
const Task = require('../models/task');

const router = express.Router();


//Task Creation
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    // task.save().then(() => {
    //     res.status(201).send(task);
    // }).catch((error) => {
    //     res.status(400).send(error);
    // })
    try {
        await task.save();
        res.status(201).send(task);
    }
    catch(error) {
        res.status(400).send(error);
    }
});


//Get Task By Id
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    // Task.find({_id}).then((value) => {
    //     if(value.length === 0)
    //     {
    //         return res.status(404).send();
    //     }
    //     res.send(value);
    // }).catch((error) => {
    //     res.status(500).send(error);
    // });
    try{
        const task = await task.find({__id});
        if(task.length === 0)
            return res.status(404).send();
        res.send(task);
    }
    catch(error) {
        res.status(500).send(error);
    }
});



//Get All Tasks
router.get('/tasks', async (req, res) => {
    // Task.find().then((value) => {
    //     res.send(value);
    // }).catch((error) => {
    //     res.status(500).send(error);
    // });
    try{
        const taskList = await Task.find();
        res.send(taskList);
    }
    catch(error) {
        res.status(500).send(error);
    }

});




//Update task details
router.patch('/tasks/:id', async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];

    const isValidOperation = keys.every((value) => {
        if(allowedUpdates.includes(value))return true;
        else
            return false;
    });

    if(!isValidOperation)
    {
        res.status(400).send({error: 'Invalid Operation'});
    }

    const _id = req.params.id;

    try{
        const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        console.log(task);
        if(!task)
        {
            return res.status(404).send();
        }
        res.send(task);
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});


//Delete Tasks
router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try{
        const task = await Task.findByIdAndDelete(_id);

        if(!task)
            return res.status(404).send({error: 'Invalid task id'});
        res.send(task);
    }
    catch(error)
    {
        res.status(500).send(error);
    }
})

module.exports = router;