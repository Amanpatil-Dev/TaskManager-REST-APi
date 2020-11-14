// CRUD OPERATIONS

// const { ObjectID } = require("mongodb")

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const objectID=mongodb.ObjectID


// DESTRUCTURING THE ABOVE CODE
const {MongoClient,ObjectID, Cursor, DBRef}=require('mongodb')


const connectionURL = 'mongodb://127.0.0.1:27017'

const DatabaseName = 'task-manager'


// const id = new ObjectID()
// console.log(id.id.length)
// console.log(id.getTimestamp())
// console.log(id.toHexString().length)

// console.log(ObjectID("5f8209150e433a336483a86f").getTimestamp())

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('Unable to Connect to Database')
    }

    console.log('Connected Successfully')

    const db = client.db(DatabaseName)




    


})