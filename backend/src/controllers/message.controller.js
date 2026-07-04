import { Message } from '../model/message.model.js'
import { User } from '../model/user.model.js'
import cloudinary from '../lib/cloudinary.js'
import { set } from 'mongoose'
import { io,getReceiverSocketId } from '../lib/socket.js'

export const getAllContacts = async (req, res) => {
    try {
        const userloggedIn = req.user._id
        const filterUser = await User.find(
            {
                _id: {
                    $ne: userloggedIn //$ne means not equal to
                }
            }).select("-password") // Exclude the password field from the results

        res.status(200).json(filterUser)
    }
    catch (err) {
        console.error("Error in getting all contacts", err)
        res.status(500).json({ message: "Error in Server" })
    }
}

export const getMessagesbyuserId = async (req, res) => {
    try {
        const myId = req.user._id
        const { id: userToChatId } = req.params

        // me and you are 
        // i send you message and you send me message
        const messages = await Message.find(
            {
                $or: [
                    { senderId: myId, receiverId: userToChatId },
                    { senderId: userToChatId, receiverId: myId }
                ]
            }
        )

        res.status(200).json(messages)
    }
    catch (error) {
        console.error("Error in getting messages", error)
        res.status(500).json({ message: "Error in Server" })
    }
}

export const sendMessage = async (req, res) => {
    try {

        const { text, image } = req.body

        if(!text && !image)
      {
        return res.status(400).json({message:"Text or Image is required"})
      }
        const { id: receiverId } = req.params
        const senderId = req.user._id

        if(senderId.equals(receiverId)){
            return 
            res.status(400).json({message:"Cannot send messages to yourself"})
        }

        const receiverExist = await User.exists({_id:receiverId})
        if(!receiverExist){
            return 
            res.status(400).json({message:"Receiver not found"})
        }
        


        let imageUrl
        if (image) {

            const uploadResult = await cloudinary.uploader.upload(image)
            imageUrl = uploadResult.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()
const receiverSocketId = getReceiverSocketId(receiverId)
if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage", newMessage)
}





        res.status(201).json(newMessage)
    }
    catch (error) {
        console.error("Error in sending message", error)
        res.status(500).json({ message: "Error in Server" })
    }
}

export const getChatsPartner = async (req, res) => {

    try {
        const loggedInUserID = req.user._id

        // find all the messages where the loggedin user is either sender or receiver
        const messages = await Message.find(
            {
                $or: [
                 {senderId: loggedInUserID},
                 {receiverId:loggedInUserID}
                ]
            }
        )

        const chatPartnersId =[
            ...new Set(messages.map((msg) => msg.senderId.toString() ===
            loggedInUserID.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        ))
    ] 

    const chatPartners = await User.find({_id:
         { $in: chatPartnersId } })
    .select("-password")

    res.status(201).json(chatPartners)
    }
    catch (error) {
console.error("Error in get Chat Partners" , error.message)

res.status(500).json({error:"Internal Server Error"})
    };

}