const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();



//User Creation(Sign Up)
//We cant save the same user again, with same email
//Bcoz in my scheema defination property unique is set true
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    console.log(user);
    try {
        console.log("Here");
        await user.save();
        console.log("Here");
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }
    catch(error) {  
        console.log(error);
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




//Get (xAll Usersx) profile
router.get('/users/me', auth, async (req, res) => {
    // try {
    //     const userList = await User.find();
    //     res.status(200).send(userList);
    // }
    // catch(error) {
    //     res.status(500).send(error);
    // }
    res.send(req.user);
});





//Get Perticular user
router.get('/users/:id', auth, async (req, res) => {
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




//Update user details
router.patch('/users/:id', auth, async (req, res) => {
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
router.delete('/users/:id', auth, async (req, res) => {
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