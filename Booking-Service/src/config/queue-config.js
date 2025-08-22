const amqplib=require('amqplib');
const { ServerConfig} = require('../config')

let connection,channel;

async function connectQueue(){
   try{
        const rabbitMQURL = process.env.RABBIT_MQ_SERVICE;
        console.log("Connecting to RabbitMQ:", rabbitMQURL);
        connection = await amqplib.connect(rabbitMQURL);
        channel=await connection.createChannel()
       await channel.assertQueue("noti-queue")}
      catch(error){
         console.log(error);
         throw error;

      }
   }

   async function sendData(data){
      try{
         await channel.sendToQueue("noti-queue", Buffer.from(JSON.stringify(data)));
      }
      catch(error){
         console.log(error);
         throw error;
      }
   }



   module.exports={connectQueue,sendData}