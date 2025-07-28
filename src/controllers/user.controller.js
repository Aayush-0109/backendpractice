import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken"

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    //validation - empty
    // check if user already exist
    // check for images annnd for avatar
    // upload them to cloudinary , avatar
    //    create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullName, email, username, password } = req.body
    if (!fullName) throw new ApiError(400, "fullname is required")
    if (
        [fullName, email, username, password].some((field) => {
            return field?.trim() === ""
        })
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    const avatarLocalPath = req.files.avatar[0].path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    if (!avatarLocalPath) throw new ApiError(400, "avatar is required")

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : ""

    if (!avatar) throw new ApiError(400, "avatar is required on cloudinary")



    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
}, "register")

const TokenGenerator = async (user) => {
    try {
        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessToken();
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Token generation failed");

    }
}
const loginUser = asyncHandler(async (req, res) => {
    if (!req.body) throw new ApiError(400, "No data recieved");

    // collect data from req
    const { email, username, password } = req.body;

    // check data
    if (!username && !email) throw new ApiError(400, "Username or email required");
    if (!password) throw new ApiError(400, "Password is required");

    // find user
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) throw new ApiError(404, "User Not found");


    // authenticate user
    const ispasswordCorrect = user.ispasswordCorrect(password);
    if (!ispasswordCorrect) throw new ApiError(401, "Incorrect Password");

    // generate tokens
    const { accessToken, refreshToken } = await TokenGenerator(user);


    // store in db 
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false });

    // cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    // generate res
    const saveduser = await User.findById(user._id).select("-password -refreshToken")
    const response = {
        user: saveduser,
        accessToken,
        refreshToken
    }

    // return res
    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, response, "Logged in successfully")
        )

}, "Login")

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: ""
            }
        },
        {
            new: true
        }
    )
    // cookies
    const options = {
        httpOnly: true,
        secure: true
    }
    // response
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "Logged out successfully")
        )

}, "Logout")

const refrestAccessToken =asyncHandler(async(req,res)=>{
    // extracting Token
const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
if(!incomingRefreshToken) throw new ApiError(401,"unauthorized request");

// verifying token
const payload = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
if(!payload) throw new ApiError(401,"Invalid Token");

//finding user
const user = await User.findById(payload._id);
if(!user) throw new ApiError(404,"Invalid Token :- User not found");

//comparing token
if(incomingRefreshToken !== user.refreshToken){
     throw new ApiError(401, " refresh Token is expired or used")

}
const options= {
    httpOnly : true,
    secure : true
}
const {accessToken , refreshToken} = await TokenGenerator(user);
user.refreshToken = refreshToken;
await user.save({ validateBeforeSave: false })
// response
const responseData = {
    accessToken,
    refreshToken
}
return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new ApiResponse(200,responseData,"Access Token refreshed Successfully")
)

} ,"Refreshing Access Token")
export { registerUser, loginUser, logoutUser, refrestAccessToken }