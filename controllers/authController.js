import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import generateToken from "../utils/generateToken.js";
import { slugify } from "../utils/slugify.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password });

    let baseSlug = slugify(name) || "user";
    let slug = baseSlug;
    let n = 1;
    while (await Portfolio.findOne({ slug })) {
      slug = `${baseSlug}-${n++}`;
    }

    await Portfolio.create({
      user: user._id,
      slug,
      personalInfo: { fullName: name },
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      slug,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const portfolio = await Portfolio.findOne({ user: user._id });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      slug: portfolio?.slug || "",
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      slug: portfolio?.slug || "",
    });
  } catch (error) {
    next(error);
  }
};