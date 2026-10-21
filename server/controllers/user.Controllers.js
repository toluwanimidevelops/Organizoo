import User from "../models/User.schema.js";
import Event from "../models/Events.schema.js"; // <-- ADD THIS LINE to register the "Events" model
import bcrypt from "bcryptjs";
import transporter from "../configs/nodemailer.js";
import jwt from "jsonwebtoken";
import {
  renderOtpEmail,
  renderWelcomeEmail,
} from "../configs/emailTemplates.js";
const otpGenerator = () => Math.floor(1000 + Math.random() * 9000);

const saltRounds = 10;

export const SignUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        type: "validation",
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        type: "email",
        message: "User already exists",
      });
    }

    const otp = otpGenerator();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 1. Send the OTP first. If this fails, nothing is created.
    let info;
    try {
      info = await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Verify Your Account - OTP Code",
        text: `${firstName}, your verification code is: ${otp}`,
        html: renderOtpEmail({ firstName, otp }),
      });
    } catch (mailErr) {
      console.error("OTP email failed:", mailErr);
      return res.status(502).json({
        success: false,
        type: "email",
        message: "Could not send verification email. Please try again.",
      });
    }

    // Some transports resolve even when the address was rejected
    if (!info.accepted || info.accepted.length === 0) {
      return res.status(400).json({
        success: false,
        type: "email",
        message: "Could not deliver to this email address.",
      });
    }

    // 2. OTP is out, now create the user
    const user = await User.create({
      firstName,
      lastName,
      password: hashedPassword,
      email,
      emailVerificationOtp: otp,
      emailVerificationOtpExpiresAt: Date.now() + 10 * 60 * 1000,
    });

    // 3. Welcome email is non-critical: don't fail signup over it
    transporter
      .sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to Connectify",
        text: `Welcome ${firstName}, thank you for choosing Connectify`,
        html: renderWelcomeEmail({ firstName }),
      })
      .catch((e) => console.error("Welcome email failed:", e));

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token: jwtToken,
    });
  } catch (err) {
    console.error(err);

    // Duplicate key from a race between two simultaneous signups
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        type: "email",
        message: "User already exists",
      });
    }

    return res.status(500).json({
      success: false,
      type: "server",
      message: "Something went wrong",
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        type: "email",
        message: "User not found",
      });
    }

    // Compare password
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        type: "password",
        message: "Password is incorrect",
      });
    }
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // If email not verified
    if (!user.emailVerified) {
      const otp = otpGenerator();

      user.emailVerificationOtp = otp;

      user.emailVerificationOtpExpiresAt = new Date(
        Date.now() + 10 * 60 * 1000,
      );

      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Verify Your Account - OTP Code",
        text: `${user.firstName}, your verification code is: ${otp}`,
        html: renderOtpEmail({ firstName: user.firstName, otp }),
      };

      await transporter.sendMail(mailOption);

      await user.save();
      // Generate token

      return res.status(200).json({
        success: true,
        otpRequired: true,
        message: "Please verify your email. OTP sent.",
        token: jwtToken,
      });
    }

    res.status(200).json({
      success: true,
      message: "User login successfully",
      token: jwtToken,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify Email
export const VerifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const { userId } = req;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (otp !== user.emailVerificationOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Otp doesn't match" });
    }
    if (Date.now() > user.emailVerificationOtpExpiresAt) {
      return res
        .status(400)
        .json({ success: false, message: "Otp has expired" });
    }
    user.emailVerified = true;
    user.emailVerificationOtp = "";
    user.emailVerificationOtpExpiresAt = "";
    await user.save();
    res.status(200).json({
      success: true,
      message: "Your email Account has been verified",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Resend Email Otp
export const ResendEmailOtp = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User Unauthorized" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (user.emailVerified) {
      return res
        .status(200)
        .json({ success: false, message: "Email already verified" });
    }
    // Generate OTP
    const otp = otpGenerator();
    user.emailVerificationOtp = otp;
    user.emailVerificationOtpExpiresAt = Date.now() + 10 * 60 * 1000;
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify Your Account - OTP Code",
      text: `${user.firstName}, your verification code is: ${otp}`,
      html: renderOtpEmail({ firstName: user.firstName, otp }),
    };
    await transporter.sendMail(mailOption);
    await user.save();
    res.status(200).json({
      success: true,
      message: "An Email has been sent to provided email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Reset Password Otp
export const ResendPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(401)
        .json({ success: false, message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Generate OTP
    const otp = otpGenerator();
    user.resetPasswordVerificationOtp = otp;
    resetPasswordVerificationOtpExpiresAt = Date.now() + 10 * 60 * 1000;
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset - OTP Code",
      text: `${user.firstName}, your reset otp code is: ${otp}`,
      html: `
        <h3>Welcome ${user.firstName}!</h3>
        <p>Your reset otp code is: <b>${otp}</b></p>
      `,
    };
    await transporter.sendMail(mailOption);
    await user.save();
    res.status(200).json({
      success: true,
      message: "An Otp has been sent to your provided email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Check if ResetPassword Otp matches
export const CheckResetPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: " Email and Otp is required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    if (user.resetPasswordVerificationOtp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Otp doesn't match" });
    }
    if (Date.now() > resetPasswordVerificationOtpExpiresAt) {
      return res.status(400).json({ success: false, message: "Otp Expires" });
    }
    res.status(200).json({ success: true, message: "Otp Verified" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Reset Password
export const ResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const user = await User.findOne(email);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (otp !== user.resetPasswordVerificationOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Otp doesn't match" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Complete Profile
export const CompleteProfile = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User unautorized" });
    }
    const {
      firstName,
      slug,
      lastName,
      phone,
      bio,
      gender,
      dateOfBirth,
      settings,
      country,
      city,
      streetAddress,
      postalCode,
      stateRegion,
    } = req.body;
    if (!firstName || !lastName || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill up the required field" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        slug,
        phone,
        bio,
        gender,
        dateOfBirth,
        // preferences: {
        //   language: settings.language,
        //   theme: setting.theme,
        //   notifications: settings.notifications,
        //   privacy: settings.privacy,
        // },
        location: {
          city,
          country,
          streetAddress,
          postalCode,
          region: stateRegion,
        },
      },
      { new: true },
    );
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(201)
      .json({ success: true, message: "User updated successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get Profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User Unautorized" });
    }
    const user = await User.findById(userId)
      .select("-password")
      .populate("followers", "-password")
      .populate("following", "-password")
      .populate("savedEvents");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// getUserProfileById
export const getProfileByID = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.body;
    if (!userId)
      res.status(401).json({ success: false, message: "User Unautorized" });
    if (!id)
      res.status(400).json({ success: false, message: "User id is needed" });
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const followUser = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.body;
    if (!userId)
      res.status(401).json({ status: false, message: "User Unautorized" });
    if (!id)
      res.status(400).json({ success: false, message: "User id is needed" });
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const added = await User.findByIdAndUpdate(
      id,
      { $push: { followers: userId } },
      { new: true },
    );
    const added2 = await User.findByIdAndUpdate(
      userId,
      { $push: { followers: id } },
      { new: true },
    );
    res.status(200).json({
      success: true,
      message: `You are now following ${added.firstName}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addLocation = async (req, res) => {
  try {
    const location = req.body;
    const { userId } = req;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User Unauthorized",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          city: location.city,
          country: location.country,
          district: location.district,
          isoCountryCode: location.isoCountryCode,
          name: location.name,
          postalCode: location.postalCode,
          region: location.region,
          street: location.street,
          streetNumber: location.streetNumber,
          timezone: location.timezone,
          coordinates: {
            type: "point",
            coordinates: [location.longitude, location.latitude],
          },
        },
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const checkIfSlugisAvailable = async (req, res) => {
  try {
    const { slug } = req.body;
    const findSlug = await User.findOne({ slug: slug });
    if (findSlug) return res.status(400).json({ success: false }); // taken
    return res.status(200).json({ success: true }); // available
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
