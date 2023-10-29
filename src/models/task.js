const mongoose = require('mongoose');

const Tasks = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true,
    },

    completed: {
        type: Boolean,
        default: false,
    }
});


module.exports = Tasks;
// const task1 = new Tasks({
//     description: '   Study Backend   ',
//     completed: true,
// });

// task1.save().then((task1) => {
//     console.log(task1);
// }).catch((error) => {
//     console.log(error);
// });