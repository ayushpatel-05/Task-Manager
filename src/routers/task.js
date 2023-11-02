const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = express.Router();


//Task Creation
router.post('/tasks', auth, async (req, res) => {
    req.body.owner = req.user._id;
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    }
    catch(error) {
        res.status(400).send(error);
    }
});


//Get All Tasks of a User
router.get('/tasks', auth, async (req, res) => {
    try{
        // const taskList = await Task.find({owner: req.user._id}); Alternate
        await req.user.populate('tasks');
        res.send(req.user.tasks);
        //res.send(taskList);
    }
    catch(error) {
        console.log(error);
        res.status(500).send(error);
    }

});



//Get Task By Id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try{
        //const task = await task.find({_id});
        const task = await Task.findOne({_id, owner: req.user._id});

        if(!task)
            return res.status(404).send();
        res.send(task);
    }
    catch(error) {
        //console.log(error);
        res.status(500).send(error);
    }
});







//Update task details
router.patch('/tasks/:id', auth, async (req, res) => {
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
        // const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        const task = await Task.findOne({_id, owner: req.user._id});

        if(!task)
            return res.status(404).send();

        keys.forEach(key => {
            task[key] = req.body[key];
        });
        await task.save();

        
        res.send(task);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send(error);
    }
});


//Delete Tasks
router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try{
        const task = await Task.findOneAndDelete({_id, owner: req.user._id});

        if(!task)
            return res.status(404).send({error: 'Invalid task id'});
        res.send(task);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send(error);
    }
})

module.exports = router;