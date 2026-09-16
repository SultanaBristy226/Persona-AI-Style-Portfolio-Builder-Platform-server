import User from '../models/User.js'
import Portfolio from '../models/Portfolio.js'
import generateToken from '../utils/generateToken.js'

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered' })

    const user = await User.create({ name, email, password })

    // Give every new user an empty portfolio document up front.
    await Portfolio.create({ user: user._id, personal: { fullName: name } })

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, username: user.username },
    })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, username: user.username },
    })
  } catch (err) {
    next(err)
  }
}

export async function me(req, res) {
  res.json({ user: req.user })
}
