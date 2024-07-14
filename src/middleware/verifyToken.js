const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env; // Ensure JWT_SECRET is set in your environment variables

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({
                message: 'Authorization header missing'
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'Token not found'
            });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error('Token verification error:', err.message);
                return res.status(401).json({
                    message: 'Token not valid'
                });
            }
            req.userID = decoded.userID; // Set userID from decoded token
            next();
        });
    } catch (error) {
        console.error('Error in verifyToken middleware:', error.message);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

module.exports = verifyToken;
