const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const Auth = require('../middleware/Auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail,sendFollowupEmail} =require('../emails/account')
// CREATE NEW USER(Signup Task)
router.post('/users', async (req, res) => {
    // console.log(req.body)
    // res.send('testing')
    const user = new User(req.body)


    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token= await user.generateAuthToken()
        res.status(201).send({
            user,
            token

        })
    } catch (e) {
        res.status(400).send(e)

    }

    // user.save().then((result) => {
    //     res.status(201).send(user)
    //     console.log(result)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // res.send(error.errors)
    // console.log(error)
    // })

})

// LOGOUT
router.post('/users/logout',Auth,async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
        
    }

})

// LOGOUT FORM ALL DEVICES
router.post('/users/logoutall',Auth,async (req,res)=>{
    try {
        req.user.tokens=[]
        await req.user.save()
        res.status(200).send()
    } catch (error) {
        res.status(500).send()
    }

})
// (Login Task)
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)  //This will call a static function created by us in user model with the req.body.email and req.body.password as an agruments
        const token = await user.generateAuthToken()
        console.log('back to router')
        res.send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send()

    }
})

// GET USERS
router.get('/users/me',Auth, async (req, res) => {

    res.send(req.user)

    // try {
    //     const user = await User.find({})
    //     res.send(user)
    // } catch (error) {
    //     res.status(500).send(error)
    // }
    // User.find({}).then((result) => {
    //     res.send(result)

    // }).catch((error) => {
    //     res.status(500).send(error)

    // })
})

const upload=multer({
    // dest:'avatar',
    limits:{
        fileSize:1000000 //1mb
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload JPG,JPEG,PNG files'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar',Auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer

    await req.user.save()
    res.send('avatar added')
    

},(error,req,res,next)=>{
    res.status(500).send({error:error.message})
})


router.delete('/users/me/avatar',Auth,async (req,res)=>{

    try {
        req.user.avatar=undefined
        await req.user.save()
        res.send().status(200)
        
    } catch (error) {
        res.send(error).status(500)
        
    }
   
})

router.get('/users/:id/avatar',async (req,res)=>{
    try {
        const user=await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','images/png')
        
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }

})

// // GET SPECIFIC USERS
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(400).send(error)

//     }

//     // User.findById(_id).then((result) => {
//     //     if (!result) {
//     //         return res.status(404).send()
//     //     }
//     //     res.send(result)
//     // }).catch((error) => {
//     //     res.status(500).send()
//     //     console.log(error)
//     // })


//     // console.log(req.params)
// })



// DELETE THE USER
router.delete('/users/me',Auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send({ error: "not found task" })
        // }
        await req.user.remove()
        sendFollowupEmail(req.user.email,req.user.name)
        
        res.send(req.user)
    } catch (error) {
        res.status(500).send()

    }
})


// UPDATE USER
router.patch('/users/me', Auth,async (req, res) => {
    // const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']

    const isValid = updates.every((val) => {
        return allowedUpdates.includes(val)
    })
    if (!isValid) {
        return res.status(400).send({ error: "invalid operation" })
    }
    try {
        // const userU = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        // const user = await User.findById(req.user._id)
        const user=req.user
        

        updates.forEach((update) => {
            user[update] = req.body[update]

        })
        await user.save()

        // if (!user) {
        //     return res.status(404).send()
        // }
        res.send(user)
    } catch (error) {
        res.status(404).send(error)
    }
    console.log(_id)
})
module.exports = router