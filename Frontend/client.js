let socket;
let userId;
let receiverId;

// Ensure socket event handlers are setup at the top level
if (socket) {
    socket.on('newMessage', message => {
        const messageContainer = document.getElementById('messages-container');
        const messageDiv = document.createElement('div');
        if (message.senderId === 'chatbot') { // Adjust according to how chatbot messages are identified
            messageDiv.classList.add('chatbot-message');
        }
        messageDiv.textContent = message.message;
        messageContainer.appendChild(messageDiv);
    });
    
    socket.on('conversationHistory', ({ messages }) => {
        const messagesContainer = document.getElementById('messages-container');
        messagesContainer.innerHTML = ''; // Clear previous messages
        messages.forEach(msg => {
            const msgElement = document.createElement('div');
            msgElement.textContent = `From ${msg.senderId === userId ? 'You' : 'Sender'}: ${msg.message}`;
            messagesContainer.appendChild(msgElement);
        });
    });
}

function signup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    fetch('http://localhost:3000/api/v1/user/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, email, password, confirmPassword: password })
    }).then(response => response.json())
      .then(data => alert('Signup Successful! Please login.'))
      .catch(error => console.error('Error:', error));
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/api/v1/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.id) {
            throw new Error('Login failed, no user id returned');
        }
        const token = data.token;
        userId = data.id;
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('chatSection').style.display = 'block';
        initSocket();
        populateUserList(token);
    })
    .catch(error => console.error('Error:', error));
}

function initSocket() {
    socket = io('http://localhost:3000');

    socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit('joinRoom', { userId });
    });

    socket.on('newMessage', message => {
        console.log('New message received:', message);
        addMessageToChat(message);
    });

    socket.on('conversationHistory', ({ messages }) => {
        updateMessagesOnUI(messages);
    });
}


function addMessageToChat(message) {
    const messagesContainer = document.getElementById('messages-container');
    const messageElement = document.createElement('div');
    if (message.senderId === userId || message.senderId === receiverId) { // Check if message is from sender or receiver
        messageElement.textContent = `${message.senderId === userId ? 'You' : 'Sender'}: ${message.message}`;
        messagesContainer.appendChild(messageElement);
        messageElement.scrollIntoView();
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if (socket && socket.connected && receiverId) {
        socket.emit('sendMessage', { senderId: userId, receiverId, message }); // Include receiverId
        messageInput.value = '';
    } else {
        console.log('Socket is not connected or receiver ID is not set.');
    }
} 

function getConversation(receiverId) {
    this.receiverId = receiverId; // Store receiverId
    socket.emit('getConversation', { senderId: userId, receiverId });
}

// function getConversation(receiverId) {
//     socket.emit('getConversation', { senderId: userId, receiverId });
// }

function fetchUsers() {
    fetch('/api/v1/user/', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(users => {
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        users.forEach(user => {
            const userElement = document.createElement('li');
            userElement.textContent = `${user.name} (${user.status})`;
            userList.appendChild(userElement);
        });
    })
    .catch(error => console.error('Error fetching users:', error));
}


function updateStatus() {
    const status = document.getElementById('userStatus').value;
    fetch('http://127.0.0.1:3000/api/v1/user/status', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status }),
        credentials: 'include' // Important for cookies or auth headers with credentials
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Status updated:', data);
    })
    .catch(error => {
        console.error('Error updating status:', error);
    });
}

function populateUserList(token) {
    fetch('http://localhost:3000/api/v1/user/list', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        data.users.forEach(user => {
            const userElement = document.createElement('li');
            userElement.textContent = user.name;
            userElement.style.cursor = 'pointer';
            userElement.onclick = () => {
                receiverId = user._id;
                console.log(`Chatting with ${user.name}, ID: ${receiverId}`);
                getConversation(receiverId);
            };
            userList.appendChild(userElement);
        });
    })
    .catch(error => console.error('Error fetching users:', error));
}
