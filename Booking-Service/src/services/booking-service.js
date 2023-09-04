const axios = require('axios');
const {StatusCodes} = require('http-status-codes');
const { BookingRepository } = require('../repositories');
const { ServerConfig,queue} = require('../config')
const db = require('../models');
const AppError = require('../utils/errors/app-error');
const {Enum} = require('../utils/common/index');
const {  BOOKED ,CANCELLED} = Enum.BOOKING_STATUS;


const bookingRepository = new BookingRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
        console.log(flight)
        const flightData = flight.data.data;
        if(data.noOfSeats > flightData.totalSeats) {
            throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
        }
        const totalBillingAmount = data.noOfSeats * flightData.price;
        const bookingPayload = {...data, totalCost: totalBillingAmount};
        const booking = await bookingRepository.create(bookingPayload, transaction);

        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
            seats: data.noOfSeats
        });

        await transaction.commit();
        return booking;
    } catch(error) {
        await transaction.rollback();
        throw error;
    }
    
}



async function makePayment(data){
    const transaction= await db.sequelize.transaction()
try{
     
    const BookingDetails=await bookingRepository.get(data.bookingId,transaction)
    if(BookingDetails.totalCost!=data.totalCost ){
        throw new AppError('Not paid required amount', StatusCodes.BAD_REQUEST);
    }
    if(BookingDetails.status==CANCELLED){
        throw new AppError(' your booking is expired', StatusCodes.BAD_REQUEST);
    }
    
    const bookingTime= new Date(BookingDetails.createdAt);
    const currentTime=new Date();
    if(currentTime-bookingTime>300000){
      
       await cancelBooking(data.bookingId)
        throw new AppError('booking time is out!!', StatusCodes.BAD_REQUEST);
        return response;
    }
    if(BookingDetails.userId!=data.userId){
        throw new AppError('Not correct id', StatusCodes.BAD_REQUEST);
    }
     await bookingRepository.update(data.bookingId, {status:BOOKED},transaction)

     console.log("before");     
     const user = await axios.get(`${ServerConfig.USER_SERVICE}/api/v1/user`);
     const kk=user.data.data
     const effectiveEmail=kk[data.userId-1].email;
     console.log(effectiveEmail)

    console.log("after");
    
     queue.sendData({
        receipentEmail:effectiveEmail,
        subject:"Flight booked",
        text:`congratulations!! your booking is done successfully for the BookingId ${data.bookingId}`,
       })

    await transaction.commit(); 
   
    
   
}
catch(error){
   
    await transaction.rollback();
   
    throw error;
}

}


 async function cancelBooking(bookingId){
    const transaction= await db.sequelize.transaction()
try{
    const BookingDetails=await bookingRepository.get(bookingId,transaction)
    if(BookingDetails.status==CANCELLED){
       await transaction.commit();
        return true;
        }
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${BookingDetails.flightId}/seats`, {
            seats: BookingDetails.noOfSeats,
            dec:false

        })
           const response= await bookingRepository.update(bookingId, {status:CANCELLED},transaction)
           await transaction.commit();
 


}
catch(error){
    await transaction.rollback();
    throw error;

}
 }

 


module.exports={createBooking, makePayment,cancelBooking}