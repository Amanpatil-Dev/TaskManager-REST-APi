const { response } = require('express')
const express = require('express')
const app = express()
require('./db/mongoose')
// const User = require('./models/user')
// const Tasks = require('./models/tasks')
const e = require('express')
const { ObjectID } = require('mongodb')
const userRouter=require('./routers/user')
const taskRounter=require('./routers/task')
const port = process.env.PORT 
// console.log(port)
const multer=require('multer')
// MIDDLEWARE IN ACTION
// app.use((req,res,next)=>{
//     console.log(req.method,req.path)
//     if(req.method==='GET'){
//         res.send('not allowed')
//     }else{
//         next()
//     }

// })

// app.use((req,res,next)=>{
//     if(req.method){
//         res.send('In Maintaninance Mode')
//     }else{
//         next()
//     }

// })

const upload=multer({
    dest:'images',
    limits:{
        fileSize:1000000 //1 megabytes

    },
    fileFilter(req,file,cb){
    
        if(!file.originalname.match(/\.(doc|docx)$/))
        {
            return cb(new Error('please upload a word doc'))

        }
        cb(undefined,true)
        // cb(new Error('file must be pdf'))
        // cb(undefined,true)
        // cb(undefined,false)


    }
    
})

app.post('/uploads',upload.single('uploads'),(req,res)=>{
    res.send('uploaded').status(200)

},(error,req,res,next)=>{
    res.status(500).send({error:error.message})
})










app.use(express.json())
app.use(userRouter)
app.use(taskRounter)




// ROUTE HANDLER
// WAY TO USE ROUTER THAT CAN HELP US TO USE CODE FROM DIFFERENT FILES
// const router= new express.Router()
// router.get('/test',(req,res)=>{
//     res.send('testing')
// })
// app.use(router)



// CREATE NEW USER
// app.post('/users', async (req, res) => {
    // console.log(req.body)
    // res.send('testing')   
//     const user = new User(req.body)

//     try {
//         await user.save()
//         res.status(201).send(user)
//     } catch (e) {
//         res.status(400).send(e)

//     }

    // user.save().then((result) => {
    //     res.status(201).send(user)
    //     console.log(result)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // res.send(error.errors)
    // console.log(error)
    // })

// })

// GET USERS
// app.get('/users', async (req, res) => {

//     try {
//         const user = await User.find({})
//         res.send(user)
//     } catch (error) {
//         res.status(500).send(error)
//     }
    // User.find({}).then((result) => {
    //     res.send(result)

    // }).catch((error) => {
    //     res.status(500).send(error)

    // })
// })

// GET SPECIFIC USERS
// app.get('/users/:id', async (req, res) => {
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

    // User.findById(_id).then((result) => {
    //     if (!result) {
    //         return res.status(404).send()
    //     }
    //     res.send(result)
    // }).catch((error) => {
    //     res.status(500).send()
    //     console.log(error)
    // })


    // console.log(req.params)
// })
// DELETE THE USER
// app.delete('/users/:id',async(req,res)=>{
//     try {
//         const user=await User.findByIdAndDelete(req.params.id)
//         if(!user){
//             return res.status(404).send({error:"not found task"})
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(500).send()
        
//     }
// })


// UPDATE USER
// app.patch('/users/:id', async (req, res) => {
//     const _id = req.params.id
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'age', 'email', 'password']

//     const isValid = updates.every((val) => {
//         return allowedUpdates.includes(val)
//     })
//     if (!isValid) {
//         return res.status(400).send({ error: "invalid operation" })
//     }
//     try {
//         const userU = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

//         if (!userU) {
//             return res.status(404).send()
//         }
//         res.send(userU)
//     } catch (error) {
//         res.status(404).send(error)
//     }
//     console.log(_id)
// })

// CREATE NEW TASK
// app.post('/tasks', async (req, res) => {
//     const tasks = new Tasks(req.body)
//     try {
//         await tasks.save()
//         res.status(201).send(tasks)
//     } catch (error) {
//         res.status(400).send(error)

//     }
    // tasks.save().then((result) => {
    //     res.status(201).send(result)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
// })


// GET ALL TASKS
// app.get('/tasks', async (req, res) => {

//     try {
//         const Tfind = await Tasks.find({})
//         res.status(200).send(Tfind)
//     } catch (error) {
//         res.status(500).send(error)

//     }
    // Tasks.find({}).then((result) => {
    //     res.status(200).send(result)

    // }).catch((error) => {
    //     res.status(500).send(error)

    // })
// })

// GET SPECIFIC TASKS
// app.get('/tasks/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const TfindS = await Tasks.findById(_id)
//         if (!TfindS) {
//             return res.status(404)
//         }
//         res.send(TfindS)
//     } catch (error) {
//         res.status(404).send(error)

//     }
    // Tasks.findById(_id).then((result) => {
    //     if (!result) {
    //         return res.status(500).send()
    //     }
        // res.status(200).send(result)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
// })

// UPDATE THE TASK
// app.patch('/tasks/:id', async (req, res) => {
//     const _id = req.params.id
//     const updates = Object.keys(req.body)
//     const onlyParams = ["Description", "completed"]
//     const isValid = updates.every((val) => {
//         return onlyParams.includes(val)
//     })
//     if(!isValid){
//         return res.status(500).send({error:"not a valid field to update"})
//     }

//     try {
//         const newupdates = await Tasks.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
//         if(!newupdates){
//             return res.status(404).send()
//         }
//         res.send(newupdates)
//     } catch (error) {
//         res.status(404).send(error)

//     }
    // console.log(_id)
// })

// app.delete('/tasks/:id',async(req,res)=>{
//     try {
//         const task=await Tasks.findByIdAndDelete(req.params.id)
//         if(!task){
//             return res.status(404).send({error:"not found task"})
//         }
//         res.send(task)
//     } catch (error) {
//         res.status(500).send()
        
//     }
// })


// BCRYPT ALGORITHUM

// const bcrypt=require('bcryptjs')

const jwt=require('jsonwebtoken')


// const myFunc=async()=>{
//     //Encrypting the password
//     // const password='amanpatilkjlmn'
//     // const pass='amanpatilkjlmnu'
//     // const hashpass= await bcrypt.hash(password,8)

//     // console.log(password)
//     // console.log(hashpass)

//     // // Matching the pASSWORD
//     // const isMatch = await bcrypt.compare(pass,hashpass)
//     // console.log(isMatch)

//    const token= jwt.sign({ _id:'abc123' },'thisismynodejsera',{expiresIn:'7 days'})
//    console.log(token)

//    const data=jwt.verify(token,'thisismynodejsera')
//    console.log(data)




// }
// myFunc()






app.listen(port, () => {
    console.log('server is up and running',port)
})

// 5f9539f98a3d860c14be4be4

const Task=require('../src/models/tasks')
const User=require('../src/models/user')

const main=async()=>{
    // const task=await Task.findById('5f9539f98a3d860c14be4be4')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)


    // // take user find the task
    // const user=await User.findById('5f96576829f2a62944baf5b1')
    // await user.populate('tasks').execPopulate()
    // console.log(user.tasks)


}
main()