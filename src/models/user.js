const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const Tasks = require('./tasks')
const { Binary } = require('mongodb')
const UserSchemas = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        required: true,
        validate(v) {
            if (v < 0) {
                throw new Error('Age Must Be Postitive number')
            }
        }
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(v) {
            if (!validator.isEmail(v)) {
                throw Error('Email is Invalid')

            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(v) {
            if (v.toLowerCase().includes('Password')) {
                throw Error('Cannot set Password as', v)
            }
        }


    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

UserSchemas.virtual('tasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})




UserSchemas.methods.toJSON=function(){
    const user=this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar
    return userObj

}



UserSchemas.methods.generateAuthToken=async function(){

    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

    user.tokens=user.tokens.concat({ token })
    await user.save()
    return token


}






// Login method
UserSchemas.statics.findByCredentials=async(email,Password)=>{
    const user= await User.findOne({email:email})
    console.log('statics function called')

    if(!user){
        throw new Error('unable to log in')
    }

    const isMatch= await bcrypt.compare(Password, user.password)
    if(!isMatch){
        throw new Error('unable to mathc the password')
    }
    return user

}


// Hashing Password
UserSchemas.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)


    }

    next()

})

// delete user task when user is removed
UserSchemas.pre('remove',async function(next){
    const user=this
    await Tasks.deleteMany({owner:user._id})
    next()

})
const User = mongoose.model('User', UserSchemas)

module.exports = User