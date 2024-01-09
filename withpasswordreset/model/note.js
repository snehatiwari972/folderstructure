const mongoose = require('mongoose');
const noteScehma = mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
}, {timestamps: true});
module.exports = mongoose.model("note",noteScehma);