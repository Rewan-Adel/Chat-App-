const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const cloudinary = require('../config/cloudinary');
const {io, getSocketId} = require('../socket');

const newMessage = async (req, res) => {   
    try{
        const senderId     = req.user._id;
        const receiverId = req.params.receiverId;
        const message    = req.body.message;
        
       const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            message: message
        });
        
        // if(message)
        //    newMessage.message.text = message.text;
        
        // if(req.file){
        //     const result = await cloudinary.uploader.upload(req.file.path)
        //     newMessage.message.image.url       = result.secure_url;
        //     newMessage.message.image.public_id = result.public_id;
        // }

        let conversation = await Conversation.findOne({
            participants: {$all : [senderId, receiverId]}
        });

        if(!conversation)
          conversation = await Conversation.create({
            participants: [senderId, receiverId]
        });

        
        conversation.messages.push(newMessage._id);
        
        await newMessage.save();
        await conversation.save();
        
        const receiverSocketId = getSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

       
        res.status(201).json(newMessage);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const getMessage = async (req, res) => {   
    try{
        // const message = await  Message.find({
        //     $or:[{
        //         sender: req.user._id,
        //         receiver: req.params.receiver
        //     },{
        //         sender: req.params.receiver,
        //         receiver: req.user._id
        //     }]
        // });
        const senderId     = req.user._id;
        const receiverId   = req.params.receiver;
        
        let conversation = await Conversation.findOne({
            participants: {$all : [senderId, receiverId]}
        }).populate('messages');

        if(!conversation)   return res.status(200).json([]);
        
        const messages = conversation.messages;
        res.status(200).json(messages);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"});
    }
};

module.exports = {newMessage, getMessage};