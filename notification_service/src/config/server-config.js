const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    GMAIL_PASSWORD:process.env.GMAIL_PASSWORD,
    GMAIL_EMAIL:process.env.GMAIL_EMAIL


}