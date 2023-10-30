const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        unique: true,
        require: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value))
            {
                throw new Error('Email is invalid');
            }
        }
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password'))
            {
                //return false;
                throw new Error('Password cannot contain password');
            }
        }
        // validate: {
        //     validator: function(v) {
        //         if(v.toLowerCase().includes('password'))return false;
        //     },
        //     message: 'Password cannot contain password',
        // }
    },

    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0)
            {
                throw new Error('Age must be a postive number');
            }
        }
    }
});
//What is the use of next?
//If we are performing an asynchronous function before save then we should only save the document after the 
//asynchronous function is done. In order to do that we will call next() after the asynchronous task is done 
//from inside the async function

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user)
    {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch)
    {
        throw new Error('Unable to login');
    }

    return user;
}


//Hash plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    // console.log(user.isModified('password'));
    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password, 8);
        // console.log(user.password);
    }

    next();
})

const User = mongoose.model('User', userSchema);


// const me = new User({
//     name: ' Ayush  ',
//     //age: 10,
//     password: 'helpAsswordoji',
//     email: 'paTELji@gmail.com',
// });

// me.save().then((m) => {
//     console.log(m);
// }).catch((error) => {
//     console.log(error);
// })

module.exports = User;