const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require('aws-sdk');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure AWS SDK with your AWS credentials and specify the region
AWS.config.update({
    accessKeyId: '<AKIA6ODU7WGBM7GBLAFZ>',
    secretAccessKey: '<LwcO8+J52UboTjhS1TQegk7RN0bUG1cpuYnwcQYD>',
    region: 'us-east-1' // Specify the correct region here
});

// Create DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// Define routes for CRUD operations

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//jjj
