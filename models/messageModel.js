const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    // chatId: { 
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Chat',
    //     required: true
    // },
    sender: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }, 
//     message: {
//         text:{type: String},
//         image:{
//             url:{type: String},
//             public_id:{type: String}
//         }
// },  
},{
    timestamps: true
});

messageSchema.methods.toJSON = function() {
    const message = this;
    const messageObject = message.toObject();
    delete messageObject.__v;
    return messageObject;
}
module.exports = mongoose.model('Message', messageSchema);