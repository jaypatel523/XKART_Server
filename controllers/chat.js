const Message = require('../models/message');
const Conversation = require('../models/conversation');


const sendMessage = async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.send(newMessage);
    } catch (error) {
        res.send(error);
    }
}

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.conversationId });
        res.send(messages);
    }
    catch (error) {
        res.send(error);
    }
}

module.exports = { sendMessage, getMessages };