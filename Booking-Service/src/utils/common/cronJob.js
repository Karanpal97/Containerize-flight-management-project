const cron=require("node-cron");

function scheduleCrons(){
   cron.schedule('*/5 * * * * *',()=>{
      console.log("running the tsk every 5 seconds")
   })
}

module.exports=scheduleCrons