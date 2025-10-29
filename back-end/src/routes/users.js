import { Router } from 'express'
import controller from '../controllers/users.js'
const router = Router()

router.post('/login', controller.login) // Novo método login do controller (01/10)
router.post('/logout', controller.logout)
router.get('/me', controller.me)

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

export default router