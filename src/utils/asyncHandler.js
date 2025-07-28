import { ApiError } from "./ApiError.js"

const asyncHandler =(fn ,message)=> async(req,res,next) =>{
   


    Promise.resolve(fn(req,res,next)).catch((error)=> next(
        new ApiError(error.statusCode || 500 , `error in ${message} : ${error.message}`)
    ))

}
export { asyncHandler}