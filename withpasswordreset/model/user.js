const mongoose = require('mongoose');
const userScehma = mongoose.Schema({
    username : {
        type: String,
        // required: true
    },
    password : {
        type: String,
        // required: true
    },
    email : {
        type: String,
        // required:true
    },
    image: {
        type: String,
        // required: true
    },
    token: {
        type: String,
        default: ''
      
    },
    
}, {timestamps: true});



module.exports = mongoose.model("user",userScehma);