import jwt from 'jsonwebtoken';
//generating token and saving in cookie
const createTokenandSaveCookie= (userId, res) => {
    const token =jwt.sign({userId},process.env.JWT_TOKEN,{expiresIn:'7d'});

    
    res.cookie("jwt",token,{
        httpOnly:true,//xss protection
        secure: process.env.NODE_ENV === 'production',//https only in prod
        sameSite:"lax",//allow cross-site frontend
    });
};


export { createTokenandSaveCookie };