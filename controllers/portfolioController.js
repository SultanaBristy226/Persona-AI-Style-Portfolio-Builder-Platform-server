import Portfolio from '../models/Portfolio.js'
import User from '../models/User.js'
import slugify from '../utils/slugify.js'

// GET /api/portfolio — logged-in user's own portfolio (draft or published)
export async function getMyPortfolio(req, res, next) {
  try {
    let portfolio = await Portfolio.findOne({ user: req.user._id })
    if (!portfolio) {
      portfolio = await Portfolio.create({ user: req.user._id })
    }
    res.json(portfolio)
  } catch (err) {
    next(err)
  }
}

// PUT /api/portfolio — save draft
export async function updatePortfolio(req, res, next) {
  try {
    const updates = { ...req.body }
    // These are server-controlled; never trust them from the client.
    delete updates.user
    delete updates.views
    delete updates.published
    delete updates.username

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, upsert: true }
    )

    res.json(portfolio)
  } catch (err) {
    next(err)
  }
}

// POST /api/portfolio/publish — validate and go live
export async function publishPortfolio(req, res, next) {
  try {
    const updates = { ...req.body }
    delete updates.user
    delete updates.views
    delete updates.published
    delete updates.username

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, upsert: true }
    )

    if (!portfolio.personal?.fullName || !portfolio.personal?.title) {
      return res.status(400).json({ message: 'Full name and professional title are required' })
    }

    // Assign a public slug once, then keep it stable across republishes.
    if (!portfolio.username) {
      let base = slugify(portfolio.personal.fullName) || 'user'
      let candidate = base
      let n = 1
      while (await Portfolio.findOne({ username: candidate })) {
        candidate = `${base}-${n++}`
      }
      portfolio.username = candidate
      await User.findByIdAndUpdate(req.user._id, { username: candidate })
    }

    portfolio.published = true
    await portfolio.save()

    res.json({ username: portfolio.username, published: true })
  } catch (err) {
    next(err)
  }
}

// GET /api/portfolio/public/:username — no auth required
export async function getPublicPortfolio(req, res, next) {
  try {
    const portfolio = await Portfolio.findOneAndUpdate(
      { username: req.params.username.toLowerCase(), published: true },
      { $inc: { views: 1 } },
      { new: true }
    ).select('-user -__v')

    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' })

    res.json(portfolio)
  } catch (err) {
    next(err)
  }
}
