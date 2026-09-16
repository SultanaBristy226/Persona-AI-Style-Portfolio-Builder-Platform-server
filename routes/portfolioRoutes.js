import express from 'express'
import {
  getMyPortfolio,
  updatePortfolio,
  publishPortfolio,
  getPublicPortfolio,
} from '../controllers/portfolioController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// Public route first so it isn't shadowed by protected ones.
router.get('/public/:username', getPublicPortfolio)

router.get('/', protect, getMyPortfolio)
router.put('/', protect, updatePortfolio)
router.post('/publish', protect, publishPortfolio)

export default router
