import passport from "passport";

import {
  Strategy as GoogleStrategy,
} from "passport-google-oauth20";

import User from "../models/UserModel.js";


//  reusable user resolver
async function resolveGoogleUser(
  profile
) {

  let user =
    await User.findOne({
      googleId: profile.id,
    });

  if (!user) {

    user =
      await User.create({

        googleId:
          profile.id,

        name:
          profile.displayName,

        email:
          profile.emails[0].value,

        avatar:
          profile.photos[0].value,

      });

  }

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

      callbackURL:
        "/api/v1/auth/google/admin/callback",

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
