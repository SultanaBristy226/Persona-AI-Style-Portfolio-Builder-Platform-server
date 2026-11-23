import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    slug: { type: String, required: true, unique: true, lowercase: true },

    personalInfo: {
      profilePhoto: { type: String, default: "" },
      fullName: { type: String, default: "" },
      professionalTitle: { type: String, default: "" },
      location: { type: String, default: "" },
      shortBio: { type: String, default: "" },
      aboutMe: { type: String, default: "" },
    },

    skills: [
      {
        name: { type: String, required: true },
        level: { type: Number, min: 0, max: 100, default: 70 },
      },
    ],

    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        githubLink: String,
        liveDemoLink: String,
        image: String,
      },
    ],

    education: [
      {
        institution: String,
        degree: String,
        department: String,
        startYear: String,
        endYear: String,
        description: String,
      },
    ],

    experience: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    certificates: [
      {
        name: String,
        issuer: String,
        date: String,
        credentialUrl: String,
        image: String,
      },
    ],

    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      behance: { type: String, default: "" },
      dribbble: { type: String, default: "" },
    },

    template: {
      type: String,
      enum: ["minimal", "developer", "creative", "professional"],
      default: "minimal",
    },

    customization: {
      accentColor: { type: String, default: "purple" },
      theme: { type: String, enum: ["dark", "light"], default: "dark" },
      font: { type: String, default: "sans" },
      visibleSections: {
        about: { type: Boolean, default: true },
        skills: { type: Boolean, default: true },
        projects: { type: Boolean, default: true },
        experience: { type: Boolean, default: true },
        education: { type: Boolean, default: true },
        certificates: { type: Boolean, default: true },
        contact: { type: Boolean, default: true },
      },
    },

    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema);