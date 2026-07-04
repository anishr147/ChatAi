import  jwt from 'jsonwebtoken'
import {User} from '../model/user.model.js'
import dotenv from 'dotenv'
dotenv.config()


export const socketAuthMiddleware = async (socket, next) => {
    try {
// extract token from http-only cookies

const  token = socket.handshake.headers.cookie 
?.split("; ")
.find((row) => row.startsWith("jwt="))
?.split("=")[1];

if(!token){
    return next(new Error("Unauthorized - No token provided"))
}
// verify the toekn 
const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
if(!decoded){
    return next(new Error("Unauthorized - Invalid token"))
}
// find user from DB

const user = await User.findById(decoded.userId).select("-password")
if(!user){
    return next(new Error("Unauthorized - User not found"))
}
// Attach user input to socket
socket.user = user
socket.userId = user._id.toString()
next()



    } catch (error) {
        console.log("Error in socket Authentication" , error.message);
        next(new Error("unauthorized - Authentication failed"))
        
    }
}