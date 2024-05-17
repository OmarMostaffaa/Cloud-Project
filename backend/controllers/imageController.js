const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const credentials = require('../app').credentials; 
// Initialize the S3 Client with the region
const s3Client = new S3Client({ region: 'us-east-1', credentials: credentials });
const imageController={
     uploadImage: async (fileBuffer, fileName, bucketName)=> {
        const params = {
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer
        };
    
        try {
            const data = await s3Client.send(new PutObjectCommand(params));
            // Return the URL of the uploaded file
            return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
        } catch (err) {
            console.error("Error in upload:", err);
            throw err;  // Rethrow the error to handle it in the calling function
        }
    }

};


module.exports = imageController;