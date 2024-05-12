import mongoose from "mongoose";

//message Schema for user chat
const messageModel = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require: true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require: true
    },
    message:{
        type:String,
        require: true
    }
}, {timestamps: true});

export const Message = mongoose.model("Message",messageModel);