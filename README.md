# Project Title

Chat Application with AI Feature.

## Description

The application consists of several key components:

1. User Authentication:
 - Users can register and log in using their email and password, ensuring secure access to the application.
 - JWT (JSON Web Tokens) is used to manage user sessions and authentication securely, providing a mechanism to maintain user state between different service requests.

2. Chat Functionality:
 - The application supports real-time messaging, allowing users to send and receive messages instantly.
 - It utilizes Socket.io, a powerful library for real-time web applications, to enable efficient communication between clients and servers.

3. Message Storage:
 - All chat messages are stored in MongoDB, a NoSQL database, ensuring that messages are saved and retrievable for ongoing conversations.
 - This feature allows users to access their conversation history, enhancing the usability and functionality of the chat system.

4. User Online Status and LLM Integration:
 - Users can set their status as ‘AVAILABLE’ or ‘BUSY’. This feature helps indicate user availability and manage expectations for response times.
 - When a user is set to ‘BUSY’, and cannot respond to messages, the system automatically generates an appropriate response using a language model API such as ChatGPT or other available APIs. This ensures that the communication flow is maintained even when users are not actively participating.
 - The system is designed to handle API responses efficiently, ensuring that if the language model API fails to respond within 10 seconds, a standard message is sent indicating that the user is currently unavailable.

5. Basic Frontend:
 - A simple frontend is provided to demonstrate the backend functionalities.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed the latest version of Node.js and npm.
- You have a basic understanding of JavaScript and Node.js.

## Setup and Run Instructions

Follow these steps to get your development environment running:

1. **Clone the repository**

   ```bash
   git clone https://github.com/mov-aman/chat_app_api
   cd your-project-name
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the environment variables**

   Copy the `.env.example` file to a new file named `.env`, and update it with your specific settings.

   ```bash
   cp .env.example .env
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

   This command will start the server at `http://localhost:3000`. You can access the API endpoints at this base URL.

## API Route Descriptions

Below are the API routes provided by this project, including their expected inputs and outputs.

### `GET /api/resource`

- **Description**: Retrieves a list of resources.
- **Query Parameters**:
  - `limit`: integer (optional) - limits the number of results returned.
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: 
    ```json
    {
    "email": "meow@gmail.com",
    "password": "some1234"
    }
    ```
- **Error Response**:
  - **Code**: 500 INTERNAL SERVER ERROR
  - **Content**: `{ error: "Details of the error" }`

### `POST /api/resource`

- **Description**: Creates a new resource.
- **Body**:
  - `name`: string - the name of the resource.
  - `description`: string - a brief description of the resource.
- **Success Response**:
  - **Code**: 201 CREATED
  - **Content**:
    ```json
    {
    "name": "meow",
    "email": "meow@gmail.com",
    "password": "m1234",
    "confirmPassword": "m1234"
    }
    ```
- **Error Response**:
  - **Code**: 400 BAD REQUEST
  - **Content**: `{ error: "Details of the error" }`

## Necessary Environment Configurations

The `.env` file should include the following environment variables:

- `PORT`: The port number on which the server will listen.
- `MONGO_URI`: The hostname of your database server.
- `JWT_SECRET`: The secret key used to sign JSON Web Tokens.
- `OPEN_AI`: Your OpenAI API key.
- `OPEN_AI_ORG`: Your OpenAI organization ID.

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

This README provides a comprehensive guide to help both new and existing users understand how to setup, run, and interact with your project. Adjust the sections according to the specifics of your project.
