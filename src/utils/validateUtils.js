// Function to validate email
exports.validateEmail = function (email) {
    // Check if the string is empty
    if (!email) {
        return { valid: true, message: { status: 400, message: 'Email cannot be empty.' } };
    }

    // Regular expression to check email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate email format
    if (!emailPattern.test(email)) {
        return { valid: true, message: { status: 400, message: 'Invalid email format.' } };
    }

    return { valid: false };
}

// Function to validate password
exports.validatePassword = function (password) {

    // Check if password contains at least one uppercase letter, one lowercase letter, and one number
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    // Check if the password is empty
    if (!password) {
        return { valid: true, message: { status: 400, message: 'Password cannot be empty.' } };
    }
    else if (password.length < 8) { // Check password length (at least 8 characters)
        return { valid: true, message: { status: 400, message: 'Password must be at least 8 characters long.' } };
    }
    else if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        return { valid: true, message: { status: 400, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.' } };
    }

    return { valid: false };
}

// Function to validate string
exports.validateString = function (input) {
    // Check if the string is empty
    if (!input) {
        return { valid: true, message: { status: 400, message: 'String cannot be empty.' } };
    }

    // Check string length (at least 1 character)
    if (input.length < 1) {
        return { valid: true, message: { status: 400, message: 'String must be at least 1 character long.' } };
    }

    return { valid: false };
}

// Function to validate phone number
exports.validatePhone = function (phone) {
    // Check if the phone number is empty
    if (!phone) {
        return { valid: true, message: { status: 400, message: 'Phone number cannot be empty.' } };
    }

    // Regular expression to check phone number format (10 digits)
    const phonePattern = /^\d{11}$/; // Adjusted to 10 digits

    // Validate phone number format
    if (!phonePattern.test(phone)) {
        return { valid: true, message: { status: 400, message: 'Phone number must be 11 digits long.' } };
    }

    return { valid: false };
}
