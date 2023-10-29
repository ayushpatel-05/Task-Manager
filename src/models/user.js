const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
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