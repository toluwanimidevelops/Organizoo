import appleSignin from "apple-signin-auth";
import jwt from "jsonwebtoken";
import User from "../models/User.schema.js";

// Same token shape/expiry your login and signup routes already issue —
// match whatever you're actually using there if it differs.
const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Shared logic across all three providers: link to an existing account by
// email if one exists, otherwise create a new one.
const findOrCreateSocialUser = async ({
  provider,
  providerId,
  email,
  firstName,
  lastName,
  profilePicture,
}) => {
  const providerField = `${provider}Id`; // googleId | facebookId | appleId

  let user = await User.findOne({
    $or: [{ [providerField]: providerId }, { email }],
  });

  if (user) {
    if (!user[providerField]) {
      user[providerField] = providerId;
      await user.save();
    }
    return user;
  }

  user = await User.create({
    email,
    firstName: firstName || "New",
    lastName: lastName || "User",
    profilePicture: profilePicture || "",
    [providerField]: providerId,
    emailVerified: true, // the provider has already verified this email
    userType: "attendee",
  });

  return user;
};

// POST /api/auth/google
// Body: { accessToken } — from the frontend's useGoogleLogin() call
export const googleAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;

    // Confirm the token actually belongs to YOUR app before trusting it —
    // otherwise anyone could send an access token for a different app.
    const tokenInfoRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`,
    );
    const tokenInfo = await tokenInfoRes.json();

    if (tokenInfo.aud !== process.env.GOOGLE_WEB_CLIENT_ID) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const profile = await profileRes.json();

    const user = await findOrCreateSocialUser({
      provider: "google",
      providerId: profile.id,
      email: profile.email,
      firstName: profile.given_name,
      lastName: profile.family_name,
      profilePicture: profile.picture,
    });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    console.log("Google auth error:", error.message);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

// POST /api/auth/facebook
// Body: { accessToken } — from the Facebook JS SDK on the frontend
export const facebookAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;

    const fbResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture&access_token=${accessToken}`,
    );
    const profile = await fbResponse.json();

    if (profile.error) {
      return res
        .status(401)
        .json({ message: "Facebook authentication failed" });
    }

    const user = await findOrCreateSocialUser({
      provider: "facebook",
      providerId: profile.id,
      email: profile.email,
      firstName: profile.first_name,
      lastName: profile.last_name,
      profilePicture: profile.picture?.data?.url,
    });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    console.log("Facebook auth error:", error.message);
    res.status(401).json({ message: "Facebook authentication failed" });
  }
};

// POST /api/auth/apple
// Body: { identityToken, firstName?, lastName? }
// Apple only ever sends firstName/lastName on the user's FIRST sign-in —
// the frontend must capture and forward those the one time it gets them.
export const appleAuth = async (req, res) => {
  try {
    const { identityToken, firstName, lastName } = req.body;

    const appleData = await appleSignin.verifyIdToken(identityToken, {
      audience: process.env.APPLE_SERVICES_ID, // your Services ID, not the App ID
    });

    const user = await findOrCreateSocialUser({
      provider: "apple",
      providerId: appleData.sub,
      email: appleData.email,
      firstName,
      lastName,
    });

    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    console.log("Apple auth error:", error.message);
    res.status(401).json({ message: "Apple authentication failed" });
  }
};
