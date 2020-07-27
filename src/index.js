import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import routes from './routes'


const PORT = process.env.PORT || 8080
 
const app = express()
app.use(cors())
 
app.use('/customer', routes.customer);

app.listen(3000, () =>
  console.log(`Server started and listening on port ${PORT}`)
);