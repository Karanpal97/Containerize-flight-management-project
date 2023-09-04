const { StatusCodes } = require('http-status-codes');

const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');


/**
 * POST : /signup 
 * req-body {email: 'a@b.com', password: '1234'}
 */
async function signup(req, res) {
    try {
        const user = await UserService.create({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function signin(req, res) {
    try {
        const user = await UserService.signIn({
            email: req.body.email,
            password: req.body.password
        });
        SuccessResponse.data = user;
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function addRole(req, res) {
    try {
        const user = await UserService.addRoleToUser({
            id: req.body.id,
            role: req.body.role
        });
        SuccessResponse.data = user;
        console.log(SuccessResponse.data)
        return res
                .status(StatusCodes.CREATED)
                .json(SuccessResponse);
    } catch(error) {
        console.log(error);
        ErrorResponse.error = error;
        return res
                .status(error.statusCode)
                .json(ErrorResponse);
    }
}

async function getAllUser(req,res){
  

    try{
    
           const user=await UserService.findUser(req.query);
           SuccessResponse.data=user;
         
           return res
               .status(StatusCodes.CREATED)
               .json(SuccessResponse)
    }
   
    catch(error){
       
       ErrorResponse.error=error;
       
       return res
               .status(error.statusCode )
               .json(ErrorResponse)
   
    }}






module.exports = {
    signup, signin,addRole,getAllUser
  
}