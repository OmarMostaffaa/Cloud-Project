const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require('aws-sdk');
const carRoutes = require('./routers/carRoutes');
const imageRouter = require('./routers/imageRouter');
const app = express();
app.use(cors());
app.use(bodyParser.json());
require('dotenv').config(); 

// Configure AWS SDK with your AWS credentials and specify the region
const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY};

AWS.config.update({
     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1" // Specify the correct region here
});
console.log(process.env.AWS_ACCESS_KEY_ID);
console.log(process.env.AWS_SECRET_ACCESS_KEY);

// Create DynamoDB DocumentClient
// const docClient = new AWS.DynamoDB.DocumentClient();
// global.s3 = new AWS.S3();

app.use('/api/cars', carRoutes);
app.use('/api/images', imageRouter);

// Define routes for CRUD operationsx
// const newCar = new AWS

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


exports.credentials = credentials;
