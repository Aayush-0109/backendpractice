
import connectDb from './db/index.js';
const PORT = process.env.PORT || 3000
import dotenv from 'dotenv'
import { app } from './app.js';
 dotenv.config(
    {
        path : "./.env"
    }
 )

connectDb()
.then(()=>{
    app.on("error",(error)=>{
            console.log("ERR ;",error)
            throw error
          })
    app.listen(PORT,()=>{
        console.log("Server runnung on port : ",PORT)
    })
})
.catch((err)=>{
    console.log(err)
})



    // ; (async () => {
    //     try {
    //       await  mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
    //       app.on("error",(error)=>{
    //         console.log("ERR ;",error)
    //         throw error
    //       })
    //     } catch (error) {
    //         console.log(error)
    //         throw error
    //     } 
    // })()