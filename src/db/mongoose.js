const mongoose = require('mongoose')
// const validator = require('validator')


mongoose.connect(process.env.MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:false

})


// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required:true,
//         trim:true
//     },
//     age: {
//         type: Number,
//         default:0,
//         required:true,
//         validate(v){
//             if(v < 0){
//                 throw new Error('Age Must Be Postitive number')
//             }
//         }
//     },
//     email:{
//         type:String,
//         required:true,
//         trim:true,
//         lowercase:true,
//         validate(v){
//             if(!validator.isEmail(v)){
//                 throw Error('Email is Invalid')

//             }
//         }
//     },
//     password:{
//         type:String,
//         required:true,
//         minlength:7,
//         trim:true,
//         validate(v){
//             if(v.toLowerCase().includes('Password')){
//                 throw Error('Cannot set Password as',v)
//             }
//         }


//     }
// })


// const me = new User({
//     name:'  Aman  ',
//     email:'PATILAMAN080@gmail.com  ',
//     age:23,
//     password:'Passwors'


    
// })

// me.save().then((result)=>{
//     console.log(result)

// }).catch((error)=>{
//     console.log(error.errors)
// })


// // CREATING A MODEL
// const Tasks = mongoose.model('Tasks', {
//     Description: {
//         type: String,
//         trim:true,
//         required:true

//     },
//     completed: {
//         type: Boolean,
//         default:false
//     }
// })


// CREATING AN MODEL INSTANCE
// const taskInst = new Tasks({
//     Description: "Web Dev Internship    ",
//     // completed: true
// })


// SAVING OUR MODEL
// taskInst.save().then((result) => {
//     console.log(result)

// }).catch((error) => {
//     console.log(error)

// })