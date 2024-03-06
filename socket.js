const express = require('express')
const { Server } = require('socket.io');
const app = express();
const server = require('http').createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"], 
        credentials: true // credentials: true is required for cookies to be sent
    }
});

const getSocketId = (receiverId) => {
    return userSocketIdMap[receiverId];
};

let userSocketIdMap = {};

io.on("connection", (socket) => {
	console.log("a user connected");

    const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketIdMap[userId] = socket.id;
  
    //listen message from client
    socket.on("newMessage", (message) => {
    //     console.log("server get message :", message);
     io.to(message.receiver).emit("newMessage", message);
    //     io.emit("newMessage", message);
    console.log("server get message :", message);    
});

	socket.on("disconnect", () => {
		console.log("user disconnected");
    });
});

module.exports = {app, server, io, getSocketId}; 