import jwt from 'jsonwebtoken'

export const generateToken = (userId , res) => {

const { TOKEN_SECRET } = process.env
if(!TOKEN_SECRET) {
    throw new Error("TOKEN_SECRET is not defined in environment variables");
}



    // create a token for user
    const token = jwt.sign({userId},TOKEN_SECRET , {
        expiresIn:"7d"
    })

    res.cookie("jwt" , token, {
        maxAge:7*24*60*60*1000 , //7days
        httpOnly:true, // prevents XSS attacks Cross-site scripting
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production", // only https in production
        path: "/",
    })

return token;
}

//http://localhost    localhost  
//https://dsmask.com    some domail in  production 
