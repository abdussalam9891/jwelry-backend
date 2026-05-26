import passport from "passport";

import {
  Strategy as GoogleStrategy,
} from "passport-google-oauth20";

import User from "../models/UserModel.js";


async function resolveGoogleUser(profile) {
  const email =
    profile.emails?.[0]?.value
      ?.toLowerCase()
      .trim();

  if (!email) {
    throw new Error(
      "Google account has no email"
    );
  }

  // 1) already linked google account
  let user =
    await User.findOne({
      googleId: profile.id,
    });

  if (user) return user;

  // 2) existing account with same email
  user =
    await User.findOne({
      email,
    });

  if (user) {
    // link google account
    if (!user.googleId) {
      user.googleId =
        profile.id;

      if (
        profile.photos?.[0]
          ?.value
      ) {
        user.avatar =
          profile.photos[0].value;
      }

      await user.save();
    }

    return user;
  }

  // 3) brand new google user
  user =
    await User.create({
      googleId:
        profile.id,
      name:
        profile.displayName,
      email,
      avatar:
        profile.photos?.[0]
          ?.value || "",
      isVerified: true,
    });

  return user;
}


//  STOREFRONT GOOGLE
passport.use(

  "google",

  new GoogleStrategy(

    {

      clientID:
        process.env
          .GOOGLE_CLIENT_ID,

      clientSecret:
        process.env
          .GOOGLE_CLIENT_SECRET,

      callbackURL:
        "/api/v1/auth/google/callback",

    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {

      try {

        const user =
          await resolveGoogleUser(
            profile
          );

        return done(
          null,
          user
        );

      } catch (err) {

        return done(
          err,
          null
        );

      }

    }

  )

);


//  ADMIN GOOGLE
passport.use(

  "google-admin",

  new GoogleStrategy(

    {

      clientID:
        process.env
          .GOOGLE_CLIENT_ID,

      clientSecret:
        process.env
          .GOOGLE_CLIENT_SECRET,

      callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/admin/callback`,

    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {

      try {

        const user =
          await resolveGoogleUser(
            profile
          );

        return done(
          null,
          user
        );

      } catch (err) {

        return done(
          err,
          null
        );

      }

    }

  )

);





export default passport;
