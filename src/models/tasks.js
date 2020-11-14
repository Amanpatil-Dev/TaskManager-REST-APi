const mongoose = require('mongoose')
const validator = require('validator')

const TaskSchemas=new mongoose.Schema({
    Description: {
        type: String,
        trim:true,
        required:true

    },
    completed: {
        type: Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})
// CREATING A MODEL
const Tasks = mongoose.model('Tasks', TaskSchemas)

module.exports= Tasks