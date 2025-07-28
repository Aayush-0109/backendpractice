import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
 export   const verifyJWT = asyncHandler(async (req, _, next) => {
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
    if (!accessToken) throw new ApiError(401, "Unauthorized request")
        try {
             const payload = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
             const user = await User.findById(payload?._id).select("-password -refreshToken")
             if (!user) throw new ApiError(401, "Invalid Access Token")
                req.user = user;
 
        } catch (error) {
            throw new ApiError(500 , "Error in jwt : "+ error.message);
        }
   
    
    next();
},"Token Authentication")