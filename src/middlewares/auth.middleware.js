import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"

const verifyToken = asyncHandler(async (req , res) =>{
    try {
        const token  = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer "  , "");

    if(!token) throw new ApiError(401 , "Unauthorized Request");

    const decodedToken  = await jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);

    if(!decodedToken) throw new ApiError(401 , "Unauthorized request")

    const user= await User.findById(decodedToken._id).select("-password -refreshToken");

    if(!user) throw new ApiError(401 , "Invalid access token");

    req.user  = user;

    next();
    } catch (error) {
        throw new ApiError(401 , 'UNAUTHORIZED ACCESS');
    }
})

export {verifyToken};