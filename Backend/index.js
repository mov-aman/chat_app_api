import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDb from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import { User } from './models/userModel.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://127.0.0.1:5500", // Adjust according to your needs
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Secret key for JWT
const jwt_sec = process.env.JWT_SECRET;

// Middleware to validate JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, jwt_sec, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Endpoint to get user list
// Example Express route to get all users
app.get('/api/v1/user/list', async (req, res) => {
    try {
        const users = await User.find().select('_id name');
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error });
    }
});


app.use("/api/v1/user", userRoute);
app.use("/api/v1/messages", messageRoute);

httpServer.listen(port, () => {
    connectDb();
    console.log(`Server is running on port ${port}`);
});

export { io }; // Export io to use it in other parts of the application
