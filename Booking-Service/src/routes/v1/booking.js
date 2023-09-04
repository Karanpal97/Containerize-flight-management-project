const express=require("express");

const {BookingController}=require("../../controllers");
const router=express.Router();


router.post('/',
         
BookingController.createBookings);
          

router.post('/payments',
         
BookingController.makePayments);



module.exports=router;