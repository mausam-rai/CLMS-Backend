import jwt from 'jsonwebtoken';
import { User } from '../Models/User.Models.js';


const isAuthenticated= async(req, res, next)=>{
    try {
        const token= req.cookies.token;
        if(!token){
            return res.status(401).json({message:"No token found, please login"});
        }
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Invalid token, please login"});
        }
        // console.log("This is decoded id ",decoded)
        req.user= await User.findById(decoded.id).select("-password");
        next();
        
    } catch (error) {
        console.log("error in auth middleware", error);
        return res.status(500).json({message:"Authentication failed"});
    }
}

export default isAuthenticated;