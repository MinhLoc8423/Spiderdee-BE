const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passwordUtils = require('../utils/passwordUtils');

passport.use(
    new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email }).populate('role_id');
            if (!user) return done(null, false, { message: 'Incorrect email or password.' });

            const isMatch = await passwordUtils.matchPassword(password, user.password);
            if (!isMatch) return done(null, false, { message: 'Incorrect email or password.' });

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
        let user = await User.findOne({ google_id: profile.id });
        if (user) {
            done(null, user); 
        } else {
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

passport.use(new BearerStrategy(
    async function (token, done) {
        try {
            if (!token) 
            return done(null, false);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) {
                return done(null, false);
            }
            user.password = null;
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    }
));
