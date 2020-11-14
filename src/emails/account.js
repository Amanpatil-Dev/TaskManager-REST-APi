
const sgm=require('@sendgrid/mail')


sgm.setApiKey(process.env.SENDGRID_API_KEY)

// sgm.send({
//     to:'patilaman080@gmail.com',
//     from:'patilaman080@gmail.com',
//     subject:'hii aman bro',
//     text:'hii how are you'
// })

const sendWelcomeEmail=(email,name)=>{
    sgm.send({
        to:email,
        from:'patilaman080@gmail.com',
        subject:'Thanks For Joining in',
        text:`Welcome to The The App ${name}.Let Me know How You get Along`
        // html:''
    })

}

const sendFollowupEmail=(email,name)=>{
    sgm.send({
        to:email,
        from:'patilaman080@gmail.com',
        subject:'Your Account Cancelled Successfully',
        text:`Account canceled succesfully by username${email}.It Was Amazing Experience With You ${name} !! Hope u Feel the same Before going can know the reason why You cancelled the account `
    })
}

module.exports={
    sendWelcomeEmail,
    sendFollowupEmail
}