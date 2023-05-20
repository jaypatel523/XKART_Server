const express = require('express');
const router = express.Router();

const { sendMessage, getMessages } = require('../controllers/chat')
const authentication = require('../middleware/authentication');

router.route('/sendmessage').post(authentication, sendMessage);
router.route('/getmessages/:conversationId').get(authentication, getMessages);

module.exports = router;