import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

    
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY , 
        api_secret:  process.env.CLOUDINARY_API_SECRET
    });
    const uploadOnCloudinary = async(localFilePath)=>{
        try {
            if(!localFilePath) return null
            // upload
           const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type: "auto"
            })
            // file uploaded successfully
            console.log("file is uploaded ",response.url)
            return response

        } catch (error) {
            // remove the locally saved temporary filed as the upload operation got failed 
           fs.unlinkSync(localFilePath) 
           
        }
    }
 export {uploadOnCloudinary}