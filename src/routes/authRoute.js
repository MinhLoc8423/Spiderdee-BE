const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// Sign in with the given username and password
router.post('/login', authController.localLogin);

// Register a new user with the given username and password
router.post('/register', authController.localRegister);

// Sign in with google
router.get('/google', authController.googleLogin);

// Callback from googleLoginCallback
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleLoginCallback);

// OTP-based authentication
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
