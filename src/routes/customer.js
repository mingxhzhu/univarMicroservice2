import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import {body, validationResult } from 'express-validator'
 
const router = Router()
const CUSTOMER_COLLECTION = 'Customer';
const CUSTOMER_ID = 'CustomerId'

// get all customers
router.get('/', asyncHandler( async (req, res, next) => {
  const mongodb = req.app.locals.mongodb
  const customers = await mongodb.collection(CUSTOMER_COLLECTION).find({}).toArray();
  return res.send(customers)
}))

// get customer by id
router.get('/:id', asyncHandler( async (req, res, next) => {
  const mongodb = req.app.locals.mongodb
  const customer = await mongodb.collection(CUSTOMER_COLLECTION).findOne({[CUSTOMER_ID]: req.params.id});
  if(!!customer) {
    return res.send(customer)
  }
  return res.status(404).send({message: `Customer {req.params.id} not found`})
}))

// create customer
router.put('/', [
    body('Name').trim().notEmpty(),
    body('_created_at').isDate(),
    body('CustomerId').trim().notEmpty()
  ],
  asyncHandler( async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array() })
    }
    const mongodb = req.app.locals.mongodb
    const customer = await mongodb.collection(CUSTOMER_COLLECTION).insertOne(req.body)
    return res.send(customer)
}))

// update customer
router.post('/:id', [
  body('Name').trim().notEmpty(),
  body('_updated_at').isDate(),
  body('CustomerId').trim().notEmpty()
],
asyncHandler( async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() })
  }
  const mongodb = req.app.locals.mongodb
  // need to add body clean up to include only fields allowed
  const customer = await mongodb.collection(CUSTOMER_COLLECTION)
                      .updateOne(
                        {[CUSTOMER_ID]: req.params.id},
                        {$set: req.body})
  return res.send(customer)
}))
 
export default router