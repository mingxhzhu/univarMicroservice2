import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import routes from './routes'
import mongodb from 'mongodb'
import assert from 'assert'

const PORT = process.env.PORT || 8080
const DB = process.env.MONGO_DB || 'test'
const MONGO_URI = process.env.MONGO_URI || null

assert.notEqual(MONGO_URI, null)

const app = express()
app.use(cors())
app.use('/customer', routes.customer);
// global error handler
app.use((error, req, res, next) => {
    res.status(500)
    res.json({ message: error.message})
})

const MongoClient = mongodb.MongoClient
const client = new MongoClient(MONGO_URI)
client.connect(err => {
    if(err){
        console.log(`Failed to connect to database ... \n ${err}`)
        process.exit(1)
    }
    console.log('MongoDB connected ...')
    app.locals.mongodb = client.db(DB);
    console.log(`Using mongo database: ${DB}`)
    app.listen(3000, () =>
        console.log(`Server started and listening on port ${PORT}`)
    )
})


