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
        "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8=",
    },
    coverPhoto: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1575318080244-dd217d9db1e2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
