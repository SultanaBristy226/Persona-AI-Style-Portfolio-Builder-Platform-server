import Portfolio from "../models/Portfolio.js";

// Get my portfolio (auth)
export const getMyPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) return res.status(404).json({ message: "Not found" });
    res.json(portfolio);
  } catch (error) {
    next(error);
  }
};

// Update my portfolio (auth)
export const updateMyPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) return res.status(404).json({ message: "Not found" });

    const allowed = [
      "personalInfo",
      "skills",
      "projects",
      "education",
      "experience",
      "certificates",
      "socialLinks",
      "template",
      "customization",
      "published",
    ];

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) portfolio[key] = req.body[key];
    });

    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    next(error);
  }
};

// Public portfolio by slug
export const getPublicPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug });
    if (!portfolio || !portfolio.published) {
      return res.status(404).json({ message: "Portfolio not found" });
    }
    portfolio.views += 1;
    await portfolio.save();
    res.json(portfolio);
  } catch (error) {
    next(error);
  }
};