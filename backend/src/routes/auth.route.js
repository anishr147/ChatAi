import express from 'express'
const router = express.Router()
import { protectRoute } from '../middleware/verify.middleware.js'
import {arcjetProtection} from '../middleware/arcjet.middleware.js'


import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js'


router.use(arcjetProtection) // Apply Arcjet protection to all routes in this router


router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

router.put('/update-profile', protectRoute, updateProfile)
router.get('/check', protectRoute, (req, res) => {
    res.status(200).json(
        {
            message: "Authenticated successfully",
            user: req.user
        });
});

export default router