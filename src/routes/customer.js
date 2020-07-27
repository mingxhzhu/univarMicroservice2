import { Router } from 'express'
import asyncHandler from 'express-async-handler'
 
const router = Router()
const CUSTOMER_COLLECTION = 'Customer';
router.get('/', asyncHandler( async (req, res, next) => {
  const mongodb = req.app.locals.mongodb
  const customers = await mongodb.collection(CUSTOMER_COLLECTION).find({}).toArray();
  return res.send(customers)
}))
router.get('/:id', asyncHandler( async (req, res, next) => {
  const mongodb = req.app.locals.mongodb
  const customer = await mongodb.collection(CUSTOMER_COLLECTION).findOne({_id: req.params.id});
  if(!!customer) {
    return res.send(customer)
  }
  return res.status(404).send({message: `Customer {req.params.id} not found`})
}))
 
export default router