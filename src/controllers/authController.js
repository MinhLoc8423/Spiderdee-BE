const jwt = require('jsonwebtoken');
const passport = require('passport');
const passwordUtils = require('../utils/passwordUtils');
const validateUtils = require('../utils/validateUtils');
const User = require('../models/userModel');
const transporter = require('../config/emailConfig');
const Role = require('../models/roleModel');
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
            return res.status(401).json({ status: 401, message: info.message });
        }

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
            data: {
                user_id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role_id: user.role_id,
                phone_number: user.phone_number,
                avatar: user.avatar,
            },
            token: token
        });
    })(req, res, next);
};

exports.localRegister = async (req, res) => {
    const { first_name, last_name, email, password, phone_number } = req.body;
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

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: 'Email already exists' });
        }
        const existRole = await Role.findOne({ "role_name": "User" });
        if (!existRole) {
            return res.status(400).json({ status: 400, message: 'Role don\'t exists' });
        }
        const user = new User({
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone_number: phone_number,
            avatar: "",
            password: await passwordUtils.hashPassword(password),
            google_id: "",
            role_id: existRole._id,
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
            data: {
                user: {
                    _id: req.user._id,
                    first_name: req.user.first_name,
                    last_name: req.user.last_name,
                    email: req.user.email,
                    role_id: req.user.role_id,
                    phone_number: req.user.phone_number,
                    avatar: req.user.avatar,
                }, token: token
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            errors: error
        });
    }
};

exports.sendOTP = async (req, res) => {
    const { email } = req.body;

    var check = validateUtils.validateEmail(email)
    if (check.valid) {
        return res.status(400).json(check.message);
    }

    const generateOTP = () => {
        return Math.floor(1000 + Math.random() * 9000).toString();
    };

    const otp = generateOTP();
    const otpExpiration = Date.now() + 1 * 60 * 1000;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: 404, message: `User doesn't exist` });
        }

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

        if (user.otp !== otp) {
            return res.status(400).json({ status: 400, message: 'Invalid OTP' });
        }

        if (Date.now() > user.expiresAt) {
            return res.status(400).json({ status: 400, message: 'OTP has expired. Please request a new code.' });
        }

        const otpToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1m' });
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
        const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ status: 400, message: 'User does not exist' });
        }

        user.password = await passwordUtils.hashPassword(newPassword);;
        user.otp = null;
        user.expiresAt = null;
        await user.save();
        res.status(200).json({ status: 200, message: 'Password updated successfully.' });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ status: 401, message: 'OTP token has expired. Please request a new OTP.' });
        }
        res.status(500).json({ status: 500, message: 'An error occurred while updating password.', errors: err });
    }
};