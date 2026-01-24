import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const secureRoute = async (req, res, next) => {
    try {
        const token=req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const verified = jwt.verify(token, process.env.JWT_TOKEN);
        if (!verified) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const user = await User.findById(verified.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Error in secureRoute middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export default secureRoute;