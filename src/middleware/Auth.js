const jwt=require('jsonwebtoken')
const { findOne } = require('../models/user')
const User=require('../models/user')

const Auth = async (req,res,next)=>{
    try {
        const token=req.header('Authorization').replace('Bearer ','')
        // console.log(token)
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        // console.log(decoded)
        const user=await User.findOne({ _id:decoded._id,'tokens.token':token })
        console.log(user)
        if(!user){
            throw new Error()
        }
        req.token=token
        req.user=user

        next()


    } catch (error) {
        res.status(401).send({error:'Please Authenticate'})
    }
    
}

module.exports=Auth