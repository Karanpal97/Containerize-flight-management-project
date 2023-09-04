const { Ticket_service}=require("../services")
const {ErrorResponse,SuccessResponse}=require("../utils/common")
const {StatusCodes}=require("http-status-codes")

async function create(req,res){
   try{
            const response=await Ticket_service.createTicket({
               subject:req.body.subject,
               content:req.body.content,
               receipentEmail:req.body.receipentEmail
              
           },
      
          );
         SuccessResponse.data=response;
         return res
             .status(StatusCodes.OK)
             .json(SuccessResponse)
    
      }
      catch(error){
       
         console.log(error)
         ErrorResponse.error=error;
         return res
                 .status(StatusCodes.INTERNAL_SERVER_ERROR )
                 .json(ErrorResponse)
      }
    }



module.exports={
    create
}