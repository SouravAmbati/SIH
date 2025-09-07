import jwt from 'jsonwebtoken';
const Authuser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.json({ success: false, message: "Invalid Token" });
    }
};



export default Authuser;