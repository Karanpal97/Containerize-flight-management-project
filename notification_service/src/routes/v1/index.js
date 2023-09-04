const express = require('express');
const {TicketController}=require("../../controllers")

const { InfoController } = require('../../controllers');

const router = express.Router();

router.get('/info', InfoController.info);
router.post('/ticket',TicketController.create)

module.exports = router;