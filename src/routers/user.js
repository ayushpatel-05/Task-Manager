const express = require('express');
const User = require('../models/user');

const router = new express.Router();

//User Creation(Sign Up)
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }
    catch(error) {  
        res.status(400).send(error);
    }
});


//Login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
        //res.send(user);
    }
    catch(error) {
        console.log(error);
        res.status(400).send(error);
    }
})


//Get Perticular user
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if(!user) {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch(error) {
        res.status(500).send(error);
    }
});



//Get All Users
router.get('/users', async (req, res) => {
    try {
        const userList = await User.find();
        res.status(200).send(userList);
    }
    catch(error) {
        res.status(500).send(error);
    }

});

//Update user details
router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((updates) => {
        return allowedUpdates.includes(updates);
    });

    if(!isValidOperation)
    {
        return res.status(400).send({error: 'Invalid updatets!'});
    }

    const _id = req.params.id;
    try {
        //findByIdAndUpdate wil bypass the middleware so we will use findById,
        //then update the field mannually and then save the document
        //const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        const user = await User.findById(_id);
        updates.forEach((update) => {
            user[update] = req.body[update];
        });
        await user.save();

        if(!user)
        {
            res.status(404).send();
        }
        res.send(user);
    }
    catch(error) {
        res.status(500).send(error);
    }
});


//Delete Users
router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try{
        const user = await User.findByIdAndDelete(_id);

        if(!user)
            return res.status(404).send({error: 'Invalid user id'});
        res.send(user);
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});

module.exports = router;