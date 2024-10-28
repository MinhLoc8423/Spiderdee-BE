// Function to validate email
exports.validateEmail = function (email) {
    if (!email) {
        return { valid: true, message: { status: 400, message: 'Email cannot be empty.' } };
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return { valid: true, message: { status: 400, message: 'Invalid email format.' } };
    }

    return { valid: false };
}

exports.validatePassword = function (password) {

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!password) {
        return { valid: true, message: { status: 400, message: 'Password cannot be empty.' } };
    }
    else if (password.length < 8) { 
        return { valid: true, message: { status: 400, message: 'Password must be at least 8 characters long.' } };
    }
    else if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        return { valid: true, message: { status: 400, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.' } };
    }

    return { valid: false };
}

exports.validateString = function (input) {
    if (!input) {
        return { valid: true, message: { status: 400, message: 'String cannot be empty.' } };
    }

    if (input.length < 1) {
        return { valid: true, message: { status: 400, message: 'String must be at least 1 character long.' } };
    }

    return { valid: false };
}

exports.validateNumber = function (input) {
    if (!input) {
        return { valid: true, message: { status: 400, message: 'Number cannot be empty.' } };
    }

    if (isNaN(input)) {
        return { valid: true, message: { status: 400, message: 'Input must be a valid number.' } };
    }

    return { valid: false };
}

exports.validatePhone = function (phone) {
    if (!phone) {
        return { valid: true, message: { status: 400, message: 'Phone number cannot be empty.' } };
    }

    const phonePattern = /^\d{11}$/; 

    if (!phonePattern.test(phone)) {
        return { valid: true, message: { status: 400, message: 'Phone number must be 11 digits long.' } };
    }

    return { valid: false };
}

