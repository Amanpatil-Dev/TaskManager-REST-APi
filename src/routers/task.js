const express=require('express')
const router = new express.Router()
const Auth=require('../middleware/Auth')
const Tasks=require('../models/tasks')


// CREATE NEW TASK
router.post('/tasks',Auth, async (req, res) => {
    // const tasks = new Tasks(req.body)
    console.log('Task')
    const tasks = new Tasks({
        ...req.body,
        owner:req.user._id
    })
    try {
        await tasks.save()
        res.status(201).send(tasks)
    } catch (error) {
        res.status(400).send(error)

    }
    // tasks.save().then((result) => {
    //     res.status(201).send(result)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
})


// GET ALL TASKS
router.get('/tasks',Auth, async (req, res) => {
    console.log(req.query.sortBy)

    // to take to query string from url and convert it to boolean value(FILTERING THE DATA)
    const match={}
    if(String(req.query.completed).toLowerCase() == "true"){
        match.completed=String(req.query.completed)
    }

    // orderby
    const sort={}
    if(req.query.sortBy){
        const substr=req.query.sortBy.split(':')
        console.log(substr[1])
        sort[substr[0]]=substr[1] === 'desc' ? -1 : 1
    }


    // LIMIT & SKIP(Pagination)
    try {
        // const Tfind = await Tasks.find({ owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
                    // createdAt:1
                    // completed:1
                
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)

    }
    // Tasks.find({}).then((result) => {
    //     res.status(200).send(result)

    // }).catch((error) => {
    //     res.status(500).send(error)

    // })
})

// GET SPECIFIC TASKS
router.get('/tasks/:id',Auth, async (req, res) => {
    const _id = req.params.id

    try {
        // const TfindS = await Tasks.findById(_id)
        const TfindS = await Tasks.findOne({_id, owner:req.user._id})
        console.log(TfindS)
        if (!TfindS) {
            return res.status(404)
        }
        res.send(TfindS)
    } catch (error) {
        res.status(404).send(error)

    }
    // Tasks.findById(_id).then((result) => {
    //     if (!result) {
    //         return res.status(500).send()
    //     }
    //     res.status(200).send(result)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

// UPDATE THE TASK
router.patch('/tasks/:id', Auth,async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const onlyParams = ["Description", "completed"]
    const isValid = updates.every((val) => {
        return onlyParams.includes(val)
    })
    if(!isValid){
        return res.status(500).send({error:"not a valid field to update"})
    }

    try {
        // const newupdates = await Tasks.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        const newupdates = await Tasks.findOne({_id,owner:req.user._id})
      
        if(!newupdates){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            newupdates[update]=req.body[update]
        })
        await newupdates.save()
        res.send(newupdates)
    } catch (error) {
        res.status(404).send(error)

    }
    // console.log(_id)
})

router.delete('/tasks/:id',Auth,async(req,res)=>{
    const _id=req.params.id
    // console.log('thisis',_id,req.user._id)
    try {
        const task=await Tasks.findOneAndDelete({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send({error:"not found task"})
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
        
    }
})

module.exports=router