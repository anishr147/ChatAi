import { User } from "../model/user.model.js"
import bcrypt from 'bcrypt'
import { generateToken } from "../lib/token.js"
import sendWelcomeEmail from "../lib/email.js"
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req, res) => {
   // getting user detail 
   const { fullName, email, password } = req.body
   //check user validity
   try {
      if (!fullName || !email || !password) {
         return res.status(400)
            .json(
               {
                  message: "All Fields are required"
               }
            )
      }

      if (password.length < 6) {
         return res.status(400)
            .json(
               {
                  message: "Password  must be atleast 6 character"
               }
            )
      }
      //check if email is valid regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         return res.status(400).json({ message: "Invalid email format" });
      }
      // check user is existed 
      const user = await User.findOne({ email })
      if (user) return res.status(400).json({
         message:
            "Email already exist"
      })

      // password checking and hashing 12345 x -> @123Anish

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // creating new user if user does not exist
      const newUser = new User({
         fullName,
         email,
         password: hashedPassword
      })
      //  here  we generate token 
      if (newUser) {
         generateToken(newUser._id, res)
         await newUser.save()
      } else {
         res.status(400).json({ message: "Invalid user data" })
      }
      // send welcome email to user
      const emailSent = await sendWelcomeEmail(email, fullName);
      if (!emailSent) {
         console.log('Failed to send welcome email to:', email);
      }

      // return user details except password and send token in cookie
      res.status(200).json({
         _id: newUser._id,
         fullName: newUser.fullName,
         email: newUser.email,
         profilePic: newUser.profilePic
      })

   } catch (error) {
      console.log("Error in signup controller:", error);
      res.status(500).json({ message: "Internal server error" })
   }


}

export const login = async (req, res) => {
   const { email, password } = req.body
   if (!email || !password) {
      return res.status(400).json({ message: "All Fields are required" })
   }
   try {
      const user = await User.findOne({ email })
      if (!user) {
         return res.status(400)
            .json({ message: "Invalid Credentials" })
         //never tell user which one is wrong email or password
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password)
      if (!isPasswordMatch) {
         return res.status(400)
            .json({ message: "Invalid Credentials" })
      }
      generateToken(user._id, res)

      res.status(200).json({
         _id: user._id,
         fullName: user.fullName,
         email: user.email,
         profilePic: user.profilePic
      })
   } catch (error) {
      console.error("Error in login controller:", error);
      res.status(500)
         .json({
            message: "Internal server error"
         });

   }
}

export const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const userId = req.user._id;

    // Upload to Cloudinary (async/await only)
    const uploadResult = await cloudinary.uploader.upload(profilePic);

    // Update user in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResult.secure_url },
      { returnDocument: "after" }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in update profile controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
