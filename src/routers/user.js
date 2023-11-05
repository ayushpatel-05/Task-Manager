const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const auth = require('../middleware/auth');
const sharp =require('sharp');

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
        //console.log('User Getting Deleted');
        await req.user.deleteOne();
       // console.log('User Got Deleted')
        res.send(req.user);
    }
    catch(error)
    {
        res.status(500).send(error);
    }
});






//Upload Avatars
const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match( /\.(jpg|jpeg|png)$/ )) {
            return cb(new Error('Please upload a jpg/jpeg/png file only'));
        }
        cb(undefined, true);
        // cb(new Error('File must be PDF'));
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send();
}
, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});


//Delete Avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.status(200).send();
    }
    catch(error) {
        res.status(500).send();
    }
});


//View User Avater
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar) {
            throw new Error('User avatar does not exist');
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }
    catch(error) {
        // console.log(error);
        res.status(404).send(error.message);
    }
})






module.exports = router;