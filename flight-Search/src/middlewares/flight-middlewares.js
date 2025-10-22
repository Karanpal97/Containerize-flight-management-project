const {StatusCodes}=require('http-status-codes');
const axios = require('axios');
const {ErrorResponse}=require('../utils/common');
const AppError =require('../utils/errors/app-error');


async function verifyAdmin(req, res, next) {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Missing JWT token' });
    }

    const response = await axios.post(
      'http://localhost:3006/api/v1/user/verify', // Auth service verify API
      {},
      { headers: { 'x-access-token': token } }
    );

    // response.data should contain { statusCode:200, user: <userId> }
    if (response.data.statusCode !== 200) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    // attach userId to req for later use
    req.user = response.data.user;

    next(); // continue to flight creation
  } catch (error) {
    console.log(error.response?.data || error.message);
    return res
      .status(error.response?.status || StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized' });
  }
}


function validCreateRequest(req,res,next){
   if(!req.body. flightNumber){
      ErrorResponse.message='something went wrong  while creating flight'
      ErrorResponse.error=new AppError(['flightNumber not found in the oncomming request in the current form'])
      return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
   }
   

   if(!req.body.airplaneId){
      ErrorResponse.message='something went wrong  while creating flight'
      ErrorResponse.error=new AppError(['airplaneId not found in the oncomming request in the current form'])
      return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
   }
   

   if(!req.body. departureAirportId){
      ErrorResponse.message='something went wrong  while creating flight'
      ErrorResponse.error=new AppError([' departureAirportId not found in the oncomming request in the current form'])
      return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
   }
   

   if(!req.body.arrivalAirportId){
      ErrorResponse.message='something went wrong  while creating flight'
      ErrorResponse.error=new AppError([' arrivalAirportId not found in the oncomming request in the current form'])
      return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
   }
   

   if(!req.body.arrivalTime){
      ErrorResponse.message='something went wrong  while creating flight'
      ErrorResponse.error=new AppError(['arrivalTime not found in the oncomming request in the current form'])
      return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
   }
   

   if(!req.body.departureTime){
      ErrorResponse.message='something went wrong  while creating flght'
      ErrorResponse.error=new AppError(['departureTime not found in the oncomming request in the current form'])
      return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
   }
   

   if(!req.body.price){
      ErrorResponse.message='something went wrong  while creating flight'
      ErrorResponse.error=new AppError(['price not found in the oncomming request in the current form'])
      return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
   }
   

   if(!req.body. totalSeats){
      ErrorResponse.message='something went wrong  while creating flight'
      ErrorResponse.error=new AppError[('totalSeats not found in the oncomming request in the current form')]
      return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
   }
   next();
}

function validateUpdateRequest(req,res,next){
   
   if(!req.body.seats){
      ErrorResponse.message='something went wrong  while updating the flight'
      ErrorResponse.error=new AppError[('seats not found in the incomming request in the current form')]
      return res
                .status(StatusCodes.BAD_REQUEST)
                .json(ErrorResponse)
   } next();

}

module.exports={validCreateRequest,
   validateUpdateRequest,verifyAdmin
};