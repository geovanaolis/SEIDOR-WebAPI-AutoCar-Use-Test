import { Router } from 'express'
import { 
  createAutomobile, 
  getAutomobiles, 
  getAutomobileById, 
  updateAutomobile, 
  deleteAutomobile 
} from '../controllers/automobileController.js'

const router = Router()

router.post('/', createAutomobile)
router.get('/', getAutomobiles)
router.get('/:id', getAutomobileById)
router.put('/:id', updateAutomobile)
router.delete('/:id', deleteAutomobile)

export default router