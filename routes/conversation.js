const express = require('express');
const router = express.Router();


const { startChat, getConversation, findConversation } = require('../controllers/conversation');
const authentication = require('../middleware/authentication');

router.route('/startchat').post(authentication, startChat);
router.route('/conversation/:userId').get(authentication, getConversation);
router.route('/findconversation/:userId/:receiverId').get(authentication, findConversation);
module.exports = router;