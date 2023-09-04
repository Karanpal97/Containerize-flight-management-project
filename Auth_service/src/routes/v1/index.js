const express = require('express');

const { InfoController } = require('../../controllers');
const { AuthRequestMiddlewares } = require('../../middlewares');
const router = express.Router();
const userRouter = require('./user-routes');

router.get('/info',InfoController.info);
router.use('/user', userRouter)

module.exports = router;