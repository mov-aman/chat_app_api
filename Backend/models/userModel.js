import mongoose from "mongoose";

//Users Schema for user interaction
const userModel = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'BUSY'],
        default: 'AVAILABLE'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

export const User = mongoose.model('User', userModel);
