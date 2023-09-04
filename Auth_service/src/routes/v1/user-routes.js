const express = require('express');
const { UserController } = require('../../controllers');
const { AuthRequestMiddlewares } = require('../../middlewares');
const router = express.Router();

router.get('/',
      
        UserController.getAllUser);

router.post('/signup',AuthRequestMiddlewares.validateAuthRequest, UserController.signup);
router.post('/signin',AuthRequestMiddlewares.validateAuthRequest, UserController.signin);
router.post('/role', AuthRequestMiddlewares.checkAuth,AuthRequestMiddlewares.isAdmin, UserController.addRole);

module.exports = router;