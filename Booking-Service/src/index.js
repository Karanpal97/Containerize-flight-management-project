const express = require('express');
const amqplib=require("amqplib");


const { ServerConfig,queue } = require('./config');
const apiRoutes = require('./routes');
const {Crons}=require('./utils/common')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
 
app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async() => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
   // Crons()
  await queue.connectQueue()
  console.log("queue connected")
});


