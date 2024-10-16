const passport = require('passport');

const authenticate = (req, res, next) => {
    passport.authenticate('bearer', { session: false }, async (err, user, info) => {
        if (err) {
            return res.status(500).json({
                status: 500,
                message: 'Error authenticating'
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

