const express = require('express');
const amqplib=require('amqplib')

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const mailSender=require('./config/email config');
const { Ticket_service } = require('./services');

async function connectQueue(){
try {
    const connection = await amqplib.connect(process.env.RABBIT_MQ_SERVICE);
    const channel = await connection.createChannel();
    await channel.assertQueue('noti-queue');
    
    channel.consume('noti-queue', async (data) => {
        const object = JSON.parse(`${Buffer.from(data.content)}`);
        
        // Professional flight booking email template
        const emailTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Flight Booking Confirmation</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #f4f4f4;
                }
                
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    box-shadow: 0 0 20px rgba(0,0,0,0.1);
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                
                .header h1 {
                    font-size: 28px;
                    margin-bottom: 10px;
                }
                
                .header p {
                    font-size: 16px;
                    opacity: 0.9;
                }
                
                .content {
                    padding: 40px 30px;
                }
                
                .booking-details {
                    background-color: #f8f9fa;
                    border-radius: 10px;
                    padding: 25px;
                    margin: 20px 0;
                    border-left: 4px solid #667eea;
                }
                
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .detail-row:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                    padding-bottom: 0;
                }
                
                .detail-label {
                    font-weight: 600;
                    color: #495057;
                    flex: 1;
                }
                
                .detail-value {
                    flex: 2;
                    text-align: right;
                    color: #212529;
                }
                
                .flight-route {
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    text-align: center;
                }
                
                .route-cities {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                
                .route-arrow {
                    font-size: 20px;
                    margin: 0 15px;
                }
                
                .important-info {
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }
                
                .important-info h3 {
                    color: #856404;
                    margin-bottom: 10px;
                }
                
                .important-info ul {
                    color: #856404;
                    padding-left: 20px;
                }
                
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 25px;
                    font-weight: 600;
                    margin: 20px 0;
                    text-align: center;
                }
                
                .footer {
                    background-color: #343a40;
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                
                .footer p {
                    margin-bottom: 10px;
                }
                
                .social-links {
                    margin-top: 20px;
                }
                
                .social-links a {
                    color: white;
                    text-decoration: none;
                    margin: 0 10px;
                }
                
                @media (max-width: 600px) {
                    .email-container {
                        margin: 0;
                        box-shadow: none;
                    }
                    
                    .content {
                        padding: 20px 15px;
                    }
                    
                    .detail-row {
                        flex-direction: column;
                    }
                    
                    .detail-value {
                        text-align: left;
                        margin-top: 5px;
                    }
                    
                    .route-cities {
                        font-size: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>✈️ Flight Booked Successfully!</h1>
                    <p>Your journey begins here</p>
                </div>
                
                <div class="content">
                    <h2>Dear Traveler,</h2>
                    <p>Congratulations! Your flight has been successfully booked. Below are your booking details:</p>
                    
                    <div class="flight-route">
                        <div class="route-cities">
                            ${object.departure || 'Departure City'} <span class="route-arrow">✈️</span> ${object.destination || 'Destination City'}
                        </div>
                        <p>Get ready for an amazing journey!</p>
                    </div>
                    
                    <div class="booking-details">
                        <div class="detail-row">
                            <span class="detail-label">Booking Reference:</span>
                            <span class="detail-value">${object.bookingRef || 'BK' + Date.now()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Passenger Name:</span>
                            <span class="detail-value">${object.passengerName || 'Valued Customer'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Flight Number:</span>
                            <span class="detail-value">${object.flightNumber || 'FL001'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Departure Date:</span>
                            <span class="detail-value">${object.departureDate || new Date().toLocaleDateString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Departure Time:</span>
                            <span class="detail-value">${object.departureTime || '10:00 AM'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Seat Number:</span>
                            <span class="detail-value">${object.seatNumber || '12A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Class:</span>
                            <span class="detail-value">${object.class || 'Economy'}</span>
                        </div>
                    </div>
                    
                    <div class="important-info">
                        <h3>📋 Important Reminders:</h3>
                        <ul>
                            <li>Please arrive at the airport at least 2 hours before domestic flights</li>
                            <li>Carry a valid photo ID and your booking confirmation</li>
                            <li>Check baggage restrictions and weight limits</li>
                            <li>Complete web check-in 24 hours before departure</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="#" class="cta-button">View Full Booking Details</a>
                    </div>
                    
                    <p>Thank you for choosing our airline. We wish you a pleasant journey!</p>
                    
                    <p style="margin-top: 30px;">
                        <strong>Need Help?</strong><br>
                        Contact our customer support at <a href="mailto:support@airline.com">support@airline.com</a><br>
                        or call us at +1-800-FLY-HIGH
                    </p>
                </div>
                
                <div class="footer">
                    <p><strong>SkyLine Airlines</strong></p>
                    <p>Making your travel dreams come true</p>
                    <div class="social-links">
                        <a href="#">Facebook</a> |
                        <a href="#">Twitter</a> |
                        <a href="#">Instagram</a>
                    </div>
                    <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                        This is an automated message. Please do not reply to this email.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;
        
        await Ticket_service.sendEmail(
            "airplanenotification18@gmail.com",
            object.receipentEmail,
            object.subject || "Flight Booking Confirmation ✈️",
            emailTemplate
        );
        
        channel.ack(data);
    });
} catch (error) {
    console.log(error);
    throw error;
}
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true})) 


app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async() => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
   await connectQueue()
   console.log("queue connected")
});
