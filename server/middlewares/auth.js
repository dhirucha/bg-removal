import jwt from 'jsonwebtoken'

// Middleware function to decode JWT tokens to get clerkId
const authUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer token format

        if (!token) {
            return res.json({ success: false, message: 'Not authorized, login again' });
        }

        const token_decode = jwt.decode(token);
        
        if (!token_decode) {
            return res.json({ success: false, message: 'Invalid token' });
        }

        req.body.clerkId = token_decode.clerkId; 

        next();
        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export default authUser;
