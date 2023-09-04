const {TicketRepository}=require('../repositories')
 
const {MAILER}=require('../config')
const Ticketrepo=  new TicketRepository();

 async function sendEmail(mailFrom,mailTo,subject,text){
   try{
      const response=await MAILER.sendMail({
         from:mailFrom,
         to:mailTo,
         subject:subject,
         text:text,
         
      }
      );
      return response
   }
   catch(error){
      console.log(error);
      throw error;
 }}

 async function createTicket(data){
try{  
   const response=await Ticketrepo.create(data);
   return response;


}
catch(error){
   console.log(error)
   throw error;


}

 }
 async function getPendingEmails(){
   try{
    const response=await Ticketrepo.getPendingTickets()
    return response
      
   }

   catch(error){
           console.log(error);
           throw error


   }
 }
 module.exports={
   sendEmail,createTicket,getPendingEmails
 }