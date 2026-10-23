import { Router } from 'express'
import { 
  startUtilization, 
  endUtilization, 
  getUtilizations 
} from '../controllers/utilizationController.js'

const router = Router()

router.post('/', startUtilization)
router.patch('/:id/end', endUtilization)
router.get('/', getUtilizations)

export default router