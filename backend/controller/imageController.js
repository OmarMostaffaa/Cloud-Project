const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Initialize the S3 Client with the region
const s3Client = new S3Client({ region: 'us-east-1' });

exports.uploadImage = upload.single('imageFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({
                "response_code": 400,
                "response_message": "No file uploaded"
            });
        }

        const fileContent = req.file.buffer;
        const fileName = req.file.originalname;

        const params = {
            Bucket: 'giucars',
            Key: fileName,
            Body: fileContent,
            ContentType: 'image/jpeg'
        };

        // Create a command to put the object in the bucket
        const command = new PutObjectCommand(params);

        // Send the command to S3
        const data = await s3Client.send(command);

        res.send({
            "response_code": 200,
            "response_message": "Success",
            "response_data": {
                ...data,
                imageUrl: `https://${params.Bucket}.s3.amazonaws.com/${fileName}`
            }
        });
    } catch (err) {
        console.error("Error in upload:", err);
        res.status(500).send({
            "response_code": 500,
            "response_message": "Error",
            "response_data": err.message
        });
    }
};
