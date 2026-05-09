import jwt from 'jsonwebtoken';
//generating token and saving in cookie
const createTokenandSaveCookie= (userId, res) => {
    const token =jwt.sign({userId},process.env.JWT_TOKEN,{expiresIn:'7d'});

    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.cookie("jwt",token,{
        httpOnly:true,//xss protection
        secure: !isDevelopment,//HTTP in dev, HTTPS in prod
        sameSite: isDevelopment ? "lax" : "none",//lax for same-origin dev, none for cross-origin prod
    });
};


export { createTokenandSaveCookie };