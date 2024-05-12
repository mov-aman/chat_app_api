import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decoding the token
        req.user = decoded;  // Setting the decoded information to req.user
        next();
    } catch (error) {
        console.error('Error in isAuth middleware:', error);
        res.status(401).json({ msg: 'Token is not valid, authorization denied' });
    }
};

export default isAuth;
