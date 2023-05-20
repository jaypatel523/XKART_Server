const Conversation = require('../models/conversation');



const startChat = async (req, res) => {
    try {

        const oldConversation = await Conversation.findOne({ members: [req.body.senderId, req.body.receiverId] });
        if (oldConversation) {
            return res.json({ success: true })
        }

        const newConversation = new Conversation({ members: [req.body.senderId, req.body.receiverId] })
        await newConversation.save();
        res.json({ success: true });
    } catch (error) {
        res.send(error);
    }
}

const getConversation = async (req, res) => {
    try {
        // console.log(req.params);
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation);
    } catch (error) {
        res.send(error);
    }
}


const findConversation = async (req, res) => {
    try {
        // console.log(req.params);
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId, req.params.receiverId] },
        });
        res.status(200).json({ conversation, success: true });
    } catch (error) {
        res.send(error);
    }
}


module.exports = { startChat, getConversation, findConversation };

