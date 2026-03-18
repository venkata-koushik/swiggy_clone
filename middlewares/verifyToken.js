const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotenv=require('dotenv');

dotenv.config();
const secretKey=process.env.JWT_SECRET;
const verifyToken = async(req,res,next)=> {
    const bearerHeader = req.headers.authorization;
    const tokenFromBearer = bearerHeader && bearerHeader.startsWith('Bearer ')
        ? bearerHeader.split(' ')[1]
        : null;
    const token = tokenFromBearer || req.headers.token;

    if(!token){
        return res.status(401).json({error:"token is reqired"});

    }

    try{
        const decoded=jwt.verify(token,secretKey)
        const vendor=await Vendor.findById(decoded.vendorId);
       if(!vendor){
        return res.status(404).json({error:"vendor not found"})
       }

        req.vendorId=vendor._id;
        next()
    }catch(error){
             console.error(error);
             if (error.name === "TokenExpiredError") {
                return res.status(401).json({ error: "token expired, please login again" });
             }
             return res.status(401).json({error:"invalid token"});
    }
}

module.exports = verifyToken;
