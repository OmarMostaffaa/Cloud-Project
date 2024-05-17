const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require('aws-sdk');
const carRoutes = require('../backend/router/carRouter');
const imageRouter = require('../backend/router/imageRouter');
const fileUpload = require('express-fileupload');
const app = express();
require('dotenv').config(); 

app.use(cors());

// Increase payload limit to 50MB (adjust as necessary)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Configure AWS SDK with your AWS credentials and specify the region
const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1" // Specify the correct region here
});
console.log(process.env.AWS_ACCESS_KEY_ID);
console.log(process.env.AWS_SECRET_ACCESS_KEY);

// Middleware to handle file uploads with increased limit
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
}));

app.use('/api', imageRouter);
app.use('/api/cars', carRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

exports.credentials = credentials;
