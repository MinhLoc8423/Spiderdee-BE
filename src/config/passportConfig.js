const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');
const passport = require('passport');
const passwordUtils = require('../utils/passwordUtils');

passport.use(
    new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: 'Incorrect email or password.' });

            const isMatch = await passwordUtils.matchPassword(password, user.password);
            if (!isMatch) return done(null, false, { message: 'Incorrect email or password.' });

            // Remove sensitive data before returning the user
            user.password = undefined;

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if the user already has data 
        let user = await User.findOne({ google_id: profile.id });
        if (user) {
            done(null, user); // If the user already has, return
        } else {
            // If not, create a new user profile
            user = await new User({
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                email: profile.emails[0].value,
                phone_number: "",
                avatar: profile.photos[0].value,
                password: "",
                google_id: profile.id,
                role_id: "67021d1a856304348fd9b3c9",
            })
            user.save();
            done(null, user);
        }
    } catch (err) {
        done(err, null);
    }
}));
