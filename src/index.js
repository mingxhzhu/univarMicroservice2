import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import routes from './routes'
import mongodb from "mongodb";

const PORT = process.env.PORT || 8080
const DB = process.env.MONGO_DB || 'test'

const app = express()
app.use(cors())
 
app.use('/customer', routes.customer);

const MongoClient = mongodb.MongoClient
const client = new MongoClient(process.env.MONGO_URI)
client.connect(err => {
    if(err){
        console.log('Failed to connect to database ...')
        process.exit(1)
    }
    console.log('MongoDB connected ...')
    app.listen(3000, () =>
    console.log(`Server started and listening on port ${PORT}`)
    );
    // run quick query
    const collection = client.db(DB).collection('Customer');
    collection.findOne({}, (err, customer) => {
        console.log(customer)
    })
    client.close()
})


