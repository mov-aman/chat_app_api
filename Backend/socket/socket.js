import { io } from './index.js'; // Import io from your server setup
import { User } from './models/userModel.js';
import { Message } from './models/messageModel.js';
import { Conversation } from './models/conversationModel.js';
import { fetchChatbotResponse } from './utils/openAI.js';

io.on('connection', socket => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', async ({ userId }) => {
        const user = await User.findById(userId);
        socket.join(user._id.toString());
        console.log(`User ${userId} joined room: ${user._id}`);
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
        try {
            const receiver = await User.findById(receiverId);
            let messageDetails;

            if (receiver.status === 'BUSY') {
                try {
                    const chatbotResponse = await Promise.race([
                        fetchChatbotResponse(message),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Response timeout')), 10000))
                    ]);

                    messageDetails = {
                        senderId: receiverId,
                        receiverId: senderId,
                        message: chatbotResponse,
                        createdAt: new Date()
                    };
                } catch (error) {
                    messageDetails = {
                        senderId: receiverId,
                        receiverId: senderId,
                        message: 'The user is currently busy and cannot respond.',
                        createdAt: new Date()
                    };
                }
            } else {
                const newMessage = await Message.create({
                    senderId,
                    receiverId,
                    message
                });
                messageDetails = {
                    _id: newMessage._id,
                    senderId: newMessage.senderId,
                    receiverId: newMessage.receiverId,
                    message: newMessage.message,
                    createdAt: newMessage.createdAt
                };
            }

            io.to(senderId.toString()).emit('newMessage', messageDetails);
            io.to(receiverId.toString()).emit('newMessage', messageDetails);
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });


    socket.on('getConversation', async ({ senderId, receiverId }) => {
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        if (conversation) {
            io.to(senderId).emit('conversationHistory', { messages: conversation.messages });
        } else {
            // Handle case where there is no existing conversation
            io.to(senderId).emit('conversationHistory', { messages: [] });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

export default io;
