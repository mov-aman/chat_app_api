import {User} from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const {name, email, password, confirmPassword} = req.body;
        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({msg: 'Please enter all fields'});
        }
        if(password !== confirmPassword){
            return res.status(400).json({msg: 'Invalid Password'});
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({msg: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });

        return res.status(200).json({ msg: 'Account created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({msg: 'Please enter all fields'});
        };
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg: 'User does not exist', success: false})
        };
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg: 'Invalid credentials', success: false})
        };
        const tokenVal ={
            userId: user.id,
        };
        const token = await jwt.sign(tokenVal, process.env.JWT_SECRET, {expiresIn: '7d'});
        return res.status(200).cookie("token", token, {maxAge:1*24*60*60*1000, httpOnly: true, sameSite:'strict'}).json({
            token,
            id:user.id,
            email: user.email,
            name: user.name
        });
    } catch (error) {
        console.log(error);
    }
};

export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({msg: 'Logged out successfully'});
    } catch (error) {
        console.log(error);
    }
}

export const updateStatus = async (req, res) => {
    const { status } = req.body;
    const { userId } = req.user.userId;

    if (!['AVAILABLE', 'BUSY'].includes(status)) {
        return res.status(400).json({ msg: 'Invalid status' });
    }

    try {
        await User.findByIdAndUpdate(userId, { status });
        res.status(200).json({ msg: 'Status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Failed to update status' });
    }
};



export const getAllUsers = async (req, res) => {
    try {
        const loggedUsers = req.id;
        const allUsers = await User.find({id: {$ne: loggedUsers}}).select("-password"); //$ne = notequal to in mongodb
        return res.status(200).json(allUsers);
    } catch (error) {
        console.log(error);
    }
}