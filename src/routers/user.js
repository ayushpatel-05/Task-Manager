const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = new express.Router();



//User Creation(Sign Up)
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
        // res.send({ user: user.getPublicProfile(), token });
        //res.send(user);
    }
    catch(error) {
        console.log(error);
        res.status(400).send(error);
    }
})


//Logout
router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.send();
    }
    catch(error) {
        res.status(500).send();
    }
})


//Logout All
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();

        res.send();
    }
    catch(error) {
        res.status(500).send();
    }
});






//Get profile (xPreviously Get All Usersx) 
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


//Update user details
router.patch('/users/me', auth, async (req, res) => {
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
        //const user = await User.findById(_id);
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });
        await req.user.save();

        // if(!user)
        // {
        //     res.status(404).send();
        // }
        res.send(req.user);
    }
    catch(error) {
        res.status(500).send(error);
    }
});


//Delete Users
router.delete('/users/me', auth, async (req, res) => {
    const _id = req.user._id;

    try{
        await req.user.deleteOne();
        res.send(req.user);
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});





module.exports = router;