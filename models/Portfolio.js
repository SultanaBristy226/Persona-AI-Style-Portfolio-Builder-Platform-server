import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  technologies: String,
  github: String,
  liveDemo: String,
  image: String,
}, { _id: false })

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  department: String,
  startYear: String,
  endYear: String,
  description: String,
}, { _id: false })

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  startDate: String,
  endDate: String,
  description: String,
}, { _id: false })

const certificateSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  date: String,
  credentialUrl: String,
  image: String,
}, { _id: false })

const skillSchema = new mongoose.Schema({
  name: String,
  level: { type: Number, min: 1, max: 5, default: 3 },
}, { _id: false })

// A single document holds everything needed to render a portfolio in
// ANY template — template choice is just one more field, so switching
// templates never touches the underlying data.
const portfolioSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    username: { type: String, unique: true, sparse: true, lowercase: true, index: true },

    personal: {
      photo: String,
      fullName: String,
      title: String,
      location: String,
      shortBio: String,
      about: String,
    },

    skills: [skillSchema],
    projects: [projectSchema],
    education: [educationSchema],
    experience: [experienceSchema],
    certificates: [certificateSchema],

    social: {
      github: String,
      linkedin: String,
      facebook: String,
      instagram: String,
      behance: String,
      dribbble: String,
    },

    template: { type: String, default: 'minimal' },
    accentColor: { type: String, default: 'purple' },
    theme: { type: String, default: 'dark' },

    visibleSections: {
      about: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      education: { type: Boolean, default: true },
      certificates: { type: Boolean, default: true },
      contact: { type: Boolean, default: true },
    },

    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Portfolio', portfolioSchema)
