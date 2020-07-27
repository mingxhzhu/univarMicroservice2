import { Router } from 'express'
 
const router = Router()
 
router.get('/', (req, res) => {
  return res.send('All customers')
})
router.get('/:id', (req, res) => {
    return res.send(`customer with id : ${req.params.id}`)
})
 
export default router