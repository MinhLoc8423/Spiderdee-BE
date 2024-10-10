const jwt = require('jsonwebtoken');
const passport = require('passport');
const passwordUtils = require('../utils/passwordUtils');
const validateUtils = require('../utils/validateUtils');
const User = require('../models/userModel');
const transporter = require('../config/emailConfig');
require('dotenv').config();


exports.localLogin = (req, res, next) => {
    const { email, password } = req.body;
    var check = validateUtils.validateEmail(email)
    if (check.valid) {
        return res.status(400).json(check.message);
    }
    check = validateUtils.validatePassword(password)
    if (check.valid) {
        return res.status(400).json(check.message);
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(400).json({ status: 400, message: "Authentication Error", errors: err });
        }
        if (!user) {
            return res.status(401).json({ status: 401, message: 'Incorrect email or password.' });
        }

        // Create JWT
        const token = jwt.sign({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role_id: user.role_id,
            phone_number: user.phone_number,
            avatar: user.avatar,
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            status: 200,
            message: "Login successful",
            data: { user: user, token: token },
        });
    })(req, res, next);
};

exports.localRegister = async (req, res) => {
    const { first_name, last_name, email, password, phone_number, avatar, google_id, role_id } = req.body;
    var check = validateUtils.validateEmail(email)
    if (check.valid) {
        return res.status(400).json(check.message);
    }
    check = validateUtils.validatePassword(password)
    if (check.valid) {
        return res.status(400).json(check.message);
    }
    check = validateUtils.validateString(first_name)
    if (check.valid) {
        return res.status(400).json(check.message);
    }
    check = validateUtils.validateString(last_name)
    if (check.valid) {
        return res.status(400).json(check.message);
    }
    check = validateUtils.validatePhone(phone_number)
    if (check.valid) {
        return res.status(400).json(check.message);
    }
    check = validateUtils.validateString(role_id)
    if (check.valid) {
        return res.status(400).json(check.message);
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: 'Email already exists' });
        }

        // Create new user
        const user = new User({
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone_number: phone_number,
            avatar: avatar,
            password: await passwordUtils.hashPassword(password),
            google_id: google_id,
            role_id: role_id,
        });
        await user.save();
        return res.status(201).json({ status: 201, message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: 'Server error', errors: error });
    }
};

exports.googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleLoginCallback = async (req, res) => {
    try {
        // Create JWT token when login is successful
        const token = jwt.sign({
            id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            role_id: req.user.role_id,
            phone_number: req.user.phone_number,
            avatar: req.user.avatar,
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            status: 200,
            message: 'Login successful',
            data: { user: req.user, token: token },
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            errors: error
        });
    }
};



// Send OTP via email
exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    var check = validateUtils.validateEmail(email)
    if (check.valid) {
        return res.status(400).json(check.message);
    }

    const generateOTP = () => {
        // Generate a random number between 100000 and 999999
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Create OTP
    const otp = generateOTP();
    const otpExpiration = Date.now() + 1 * 60 * 1000; // OTP expiration 5 minutes

    try {
        // Find User in database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 404, message: `User doesn't exist` });
        }

        // Update otp expiration
        user.otp = otp;
        user.expiresAt = otpExpiration;
        await user.save();

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'OTP Code Reset Password',
            text: `Your OTP code is: ${otp}. This code will expire in 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ status: 200, message: 'OTP has been sent to your email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: "An error occurred while sending OTP", errors: err });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    var check = validateUtils.validateEmail(email)
    if (check.valid) {
        return res.status(400).json(check.message);
    }
    check = validateUtils.validateString(otp)
    if (check.valid) {
        return res.status(400).json(check.message);
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 400, message: 'User does not exist' });
        }

        // Check OTP and expiration time
        if (user.otp !== otp) {
            return res.status(400).json({ status: 400, message: 'Invalid OTP' });
        }

        if (Date.now() > user.expiresAt) {
            return res.status(400).json({ status: 400, message: 'OTP has expired. Please request a new code.' });
        }

        // If OTP is valid, generate temporary token to allow user to update password
        const otpToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1m' }); // Token expires after 15 minutes
        res.status(200).json({
            status: 200,
            message: 'Valid OTP. Please enter new password.',
            data: { token: otpToken },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'An error occurred while verifying OTP', errors: err });
    }
};

// Update password
exports.resetPassword = async (req, res) => {
    const { otpToken, newPassword } = req.body;

    var check = validateUtils.validatePassword(newPassword)
    if (check.valid) {
        return res.status(400).json(check.message);
    }
    check = validateUtils.validateString(otpToken)
    if (check.valid) {
        return res.status(400).json(check.message);
    }

    try {
        // Xác thực token OTP
        const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ status: 400, message: 'User does not exist' });
        }

        // Cập nhật mật khẩu và xóa OTP
        user.password = await passwordUtils.hashPassword(newPassword);;
        user.otp = null;  // Xóa OTP
        user.expiresAt = null; // Xóa thời gian hết hạn OTP
        await user.save();
        res.status(200).json({ status: 200, message: 'Password updated successfully.' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 401, message: 'OTP token has expired. Please request a new OTP.' });
        }
        res.status(500).json({ status: 500, message: 'An error occurred while updating password.', errors: err });
    }
};