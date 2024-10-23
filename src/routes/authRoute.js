const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');


router.post('/login', authController.localLogin);

router.post('/register', authController.localRegister);

router.get('/google', authController.googleLogin);

router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleLoginCallback);

router.post('/send-otp', authController.sendOTP);

router.post('/verify-otp', authController.verifyOTP);

router.post('/reset-password', authController.resetPassword);

module.exports = router;
