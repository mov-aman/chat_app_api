import express from 'express';
import { getConversation, sendMessage } from '../controller/messageController.js';
import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.route("/send/:id").post(isAuth, sendMessage); //middleware isAuth is used to check if the user is logged in or not
router.route("/:id").get(isAuth, getConversation);
export default router;