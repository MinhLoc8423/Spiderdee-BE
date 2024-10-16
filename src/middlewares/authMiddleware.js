const passport = require('passport');

const authenticate = (req, res, next) => {
    passport.authenticate('bearer', { session: false }, async (err, user, info) => {
        if (err) {
            console.log(err.message);
            if (err.message =="jwt expired") {
                return res.status(401).json({
                    status: 401,
                    message: 'Token expired. Please log in again.'
                });
            }
            if (err.message == "invalid signature") {
                return res.status(401).json({
                    status: 401,
                    message: 'Invalid token. Please log in again.'
                });
            }
            return res.status(500).json({
                status: 500,
                message: 'Failed to authenticate token.'
            });
        }
        if (!user) {
            return res.status(401).json({
                status: 401,
                message: 'Unauthorized'
            });
        }
        req.user = user; 
        next(); 
    })(req, res, next);
};

module.exports = authenticate;

