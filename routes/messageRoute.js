const route = require('express').Router();
const {newMessage, getMessage} = require('../controllers/messageCtr');
const { tokenValidate } = require("../utils/token");
const upload = require("../multer");

// route.post('/send/:receiverId', tokenValidate, upload, newMessage);
route.post('/send/:receiverId', tokenValidate, newMessage);
route.get('/:receiver', tokenValidate, getMessage); 

module.exports = route;