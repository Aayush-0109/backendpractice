import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { ApiError } from './ApiError.js';


const uploadOnCloudinary = async (localFilePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        if (!localFilePath) return null
        // upload
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",

        })
        // file uploaded successfully
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        // remove the locally saved temporary filed as the upload operation got failed 
        fs.unlinkSync(localFilePath)
        throw new ApiError(500, `error in cloudinary : ${error}`)

    }
}
export { uploadOnCloudinary }