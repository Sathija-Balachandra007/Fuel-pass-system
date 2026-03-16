const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
    const token = req.headers['authorization'];
    if(!token) return res.status(401).json({error:'No token provided'});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user_id = decoded.user_id;
        next();
    } catch (e) {
        return res.status(401).json({error:'Invalid token'});
    }
};

module.exports = verifyToken;
