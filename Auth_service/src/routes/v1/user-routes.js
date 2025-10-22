const express = require('express');
const { UserController } = require('../../controllers');
const { AuthRequestMiddlewares } = require('../../middlewares');
const router = express.Router();

router.get('/',
      
        UserController.getAllUser);

router.post('/signup',AuthRequestMiddlewares.validateAuthRequest, UserController.signup);
router.post('/signin',AuthRequestMiddlewares.validateAuthRequest, UserController.signin);
router.post('/role', AuthRequestMiddlewares.checkAuth,AuthRequestMiddlewares.isAdmin, UserController.addRole);
router.post(
  "/verify",
  AuthRequestMiddlewares.checkAuth,
  AuthRequestMiddlewares.isAdmin,
  (req, res) => {
    res.status(200).json({
      statusCode: 200,
      user: req.user
    });
  }
);
module.exports = router;