const bcrypt = require('bcryptjs');

// Convert password to cryptographically secure
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Compare passwords
const matchPassword = async (enteredPassword, savedPassword) => {
    return await bcrypt.compare(enteredPassword, savedPassword);
};

module.exports = {
    hashPassword,
    matchPassword,
};
