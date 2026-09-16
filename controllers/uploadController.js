import cloudinary from '../config/cloudinary.js'

// POST /api/upload — accepts a single image, returns its hosted URL.
export async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    const result = await cloudinary.uploader.upload(base64, { folder: 'persona' })

    res.json({ url: result.secure_url, publicId: result.public_id })
  } catch (err) {
    next(err)
  }
}
