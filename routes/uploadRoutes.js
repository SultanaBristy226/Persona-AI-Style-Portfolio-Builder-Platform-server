import express from 'express'
import multer from 'multer'
import { uploadImage } from '../controllers/uploadController.js'
import protect from '../middleware/auth.js'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

const router = express.Router()

router.post('/', protect, upload.single('image'), uploadImage)

export default router
