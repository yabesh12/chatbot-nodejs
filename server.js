// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// app.use(express.static('public')); // Serve static files from 'public' directory

// wss.on('connection', (socket) => {
//     console.log('Client connected');

//     socket.on('message', (message) => {
//         console.log(`Received: ${message}`);
//         // Implement your chatbot logic here
//         // For this example, we'll just echo the message back
//         socket.send(`You: ${message}`);
//     });

//     socket.on('close', () => {
//         console.log('Client disconnected');
//     });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Serve static files from 'public' directory

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('join', (data) => {
        // Emit a message to the sender with the chatbot's initial response
        socket.emit('message', { sender: 'Bot', text: 'Welcome to the chat!' });

        // Notify all clients that a new user has joined
        socket.broadcast.emit('message', { sender: 'Bot', text: `${data.sender} has joined the chat.` });
    });

    socket.on('message', (data) => {
        // Broadcast the message to all clients
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
