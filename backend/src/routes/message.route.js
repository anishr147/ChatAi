import express from "express";
import { getAllContacts ,
    getMessagesbyuserId,
    sendMessage,
    getChatsPartner
 } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/verify.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router()

router.use(arcjetProtection,protectRoute ,) // Apply the protectRoute middleware to all routes in this router


router.get('/contacts', getAllContacts)
router.get('/chats', getChatsPartner)
router.get('/:id', getMessagesbyuserId)
router.post('/send/:id', sendMessage)





export default router