const nodemailer=require('nodemailer')


const {GMAIL_PASSWORD,GMAIL_EMAIL}=require('./server-config');

console.log("GMAIL_PASSWORD,GMAIL_EMAIL",{   user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD})
const mailSender= nodemailer.createTransport({
   service:'Gmail',
     secure: true, // port 465 ke liye true

   auth:{
   user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
   }
})


module.exports= mailSender