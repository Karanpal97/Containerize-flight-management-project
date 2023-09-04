const express = require('express');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const rateLimit = require('express-rate-limit')
const { createProxyMiddleware } = require('http-proxy-middleware');


const app = express();
const limiter = rateLimit({
	windowMs: 1* 60 * 1000, 
	

})
app.use(limiter)
app.use('/booking-service', createProxyMiddleware({ target: 'http://booking:4000', changeOrigin: true , pathRewrite: {
	'^/booking-service': '/', 
 },}));


app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, async() => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
	 
})
