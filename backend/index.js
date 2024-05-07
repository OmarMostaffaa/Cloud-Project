const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AWS = require('aws-sdk');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure AWS SDK to use IAM role
AWS.config.update({ region: '<your-region>' });

// Create DynamoDB DocumentClient
const docClient = new AWS.DynamoDB.DocumentClient();

// Define routes for CRUD operations

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
