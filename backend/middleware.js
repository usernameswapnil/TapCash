const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");
const authMiddleware=function(req,res,next){ //next: A function to move to the next middleware or route handler.
    //It checks if the request contains a valid token in the Authorization header. (Chatgpt it for more)
    const authHeader=req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }
    const token = authHeader.split(' ')[1]; 
    //The Authorization header typically looks like:
    //Authorization: Bearer <JWT_TOKEN>
    //.split(' ') -> Splits the string into an array:["Bearer", "<JWT_TOKEN>"]
    //[1] → Extracts the token part (the second element)
    

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({});
    }

}

module.exports = {
    authMiddleware
}