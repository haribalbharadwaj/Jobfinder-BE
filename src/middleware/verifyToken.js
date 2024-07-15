const jwt = require('jsonwebtoken');
const {JWT_Private_Key} = process.env;


const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({
                message: 'Authorization header missing'
            });
        }
        console.log('Auth Header:', authHeader); // Log the auth header

        const token = authHeader?.split(' ')[1];

        console.log('Token:', token); // Log the token

        if (!token) {
            console.log('Token not found');
            return res.status(401).json({
                message: 'Token not found or valid'
            });
        }

        const decoded = jwt.verify(token, JWT_Private_Key);

        console.log('Decoded Token:', decoded); // Log the decoded token

        req.userID = decoded.userID; // Correctly set the userID
        next();
    } catch (error) {
        console.log('Token verification error:', error.message); // Log any error
        return res.status(401).json({
            message: 'Token not found or valid'
        });
    }
};

module.exports = verifyToken;
