import mongoose from "mongoose";
let userSchema = new mongoose.Schema(
  {
    // Authentication
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.facebookId && !this.appleId;
      },
    },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    appleId: { type: String, unique: true, sparse: true },
    slug: { type: String, unique: true },
    phone: { type: String },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    // Profile
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    profilePicture: {
      type: String,
      default:
        "https://connectify-app-nu.vercel.app/profile.png",
    },
    coverPhoto: {
      type: String,
      default:
        "https://connectify-app-nu.vercel.app/coverphoto.png",
    },
    bio: { type: String, default: "", maxlength: 500 },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    // Account Type

    userType: {
      type: String,
      enum: ["attendee", "organizer", "admin"],
      default: "attendee",
    },
    // Location
    location: {
      city: { type: String },
      country: { type: String },
      district: { type: String },
      isoCountryCode: { type: String },
      name: { type: String },
      postalCode: { type: String },
      region: { type: String },
      street: { type: String },
      streetNumber: { type: String },
      streetAddress: { type: String },
      timezone: { type: String },
      coordinates: {
        type: { type: String, enum: ["point"], default: "point" },
        coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
      },
    },
    // Social
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Events" }],
    // Settings
    preferences: {
      language: { type: String, default: "en" },
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      notifications: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      privacy: {
        profilePublic: { type: Boolean, default: true },
        showAttendance: { type: Boolean, default: true },
        allowMessages: { type: Boolean, default: true },
      },
    },
    // Interest

    // Verification & Moderation
    emailVerificationOtp: { type: String },
    emailVerificationOtpExpiresAt: { type: String },

    phoneVerificationOtp: { type: String },
    phoneVerificationOtpExpiresAt: { type: String },

    resetPasswordVerificationOtp: { type: String },
    resetPasswordVerificationOtpExpiresAt: { type: String },
    isSuspended: { type: Boolean, default: false },
    suspensionReason: { type: String },
    suspensionDate: { type: Date },
    // Stats
    totalEventsAttended: { type: Number, default: 0 },
    averageRatings: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0, max: 5, min: 0 },
    // Additional fields can be added as needed
    lastLogin: { type: Date },
    lastActive: { type: Date },
  },
  { timestamps: true },
);

let User = mongoose.models.user || mongoose.model("User", userSchema);
export default User;
