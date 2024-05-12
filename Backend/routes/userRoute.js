import express from 'express';
import { signup, login, logout, getAllUsers, updateStatus } from '../controller/userController.js';
import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuth, getAllUsers);
router.route("/status").put(isAuth, updateStatus);

export default router;