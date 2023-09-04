const CrudRepository=require("./crud_repository")
const {Ticket}=require("../models")

class TicketRepository extends CrudRepository{
   constructor(){
      super(Ticket)}

   async  getPendingTickets(){
   const response=await Ticket.findAll({
      where:{
         status:'pending'
      }

   }

   );   return response;

   }}
   module.exports= TicketRepository