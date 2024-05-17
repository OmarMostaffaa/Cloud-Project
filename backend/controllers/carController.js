const { DynamoDBClient, PutItemCommand, UpdateItemCommand, DeleteItemCommand, GetItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const credentials = require('../app').credentials;

const client = new DynamoDBClient({ region: 'us-east-1', credentials: credentials });
const s3Client = new S3Client({ region: 'us-east-1', credentials: credentials });
const bucketName = 'giucars';

const carController = {
    addCar: async (req, res) => {
        const { id, brand, model, color, base64Image } = req.body;

        if (!base64Image) {
            return res.status(400).json({ error: 'base64Image is required' });
        }
        const checkData = await client.send(new GetItemCommand(checkParams));
        if (checkData.Item) {
            return res.status(400).json({ error: 'Car with this ID already exists' });
        }

        const imageBuffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

        const s3Params = {
            Bucket: bucketName,
            Key: id,
            Body: imageBuffer,
            ContentType: 'image/jpeg'
        };

        const dbParams = {
            TableName: 'cars2',
            Item: {
                id: { S: id },
                brand: { S: brand },
                model: { S: model },
                color: { S: color },
            }
        };

        try {
            const uploadCommand = new PutObjectCommand(s3Params);
            await s3Client.send(uploadCommand);

            const dbCommand = new PutItemCommand(dbParams);
            await client.send(dbCommand);

            return res.json({ message: 'Car added successfully' });
        } catch (err) {
            console.error('Unable to add car:', err);
            return res.status(500).json({ error: 'Could not add car' });
        }
    },

    updateCar: async (req, res) => {
        const { id, brand, model, color } = req.body;
    
        let updateExpression = 'SET brand = :brand, model = :model, color = :color';
        let expressionAttributeValues = {
            ':brand': { S: brand },
            ':model': { S: model },
            ':color': { S: color },
        };
    
        if (req.files && req.files.length > 0) {
            const file = req.files[0]; // Take the first file
            const fileName = `${id}-${file.originalname}`;
            const imageUrl = await uploadImage(file.buffer, fileName, 'giucars');
            updateExpression += ', imageUrl = :imageUrl';
            expressionAttributeValues[':imageUrl'] = { S: imageUrl };
        }
    
        const params = {
            TableName: 'cars2',
            Key: { 'id': { S: id } },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW',
        };
    
        try {
            const result = await client.send(new UpdateItemCommand(params));
            res.json({ message: 'Car updated successfully', updatedItem: result.Attributes });
        } catch (error) {
            console.error('Error updating car:', error);
            res.status(500).json({ error: 'Could not update car' });
        }
    },
    deleteCar: async (req, res) => {
        const { id } = req.body;
        const params = {
            TableName: 'cars2',
            Key: { 'id': { S: id } }
        };

        try {
            await client.send(new DeleteItemCommand(params));
            res.json({ message: 'Car deleted successfully' });
        } catch (error) {
            console.error('Error deleting item:', error);
            res.status(500).json({ error: 'Could not delete car' });
        }
    },
    // getCars: async (req, res) => {
    //     const params = {
    //         TableName: 'cars2'
    //     };
    //     try {
    //         const data = await client.send(new ScanCommand(params));
    //         const cars = data.Items.map(item => {
    //             return {
    //                 id: item.id.S,
    //                 brand: item.brand.S,
    //                 model: item.model.S,
    //                 color: item.color.S
    //             };
    //         });
    //         res.json(cars);
    //     } catch (error) {
    //         console.error('Error fetching cars:', error);
    //         res.status(500).json({ error: 'Could not fetch cars' });
    //     }
    // },
    getCars : async (req, res) => {
        const params = {
            TableName: 'cars2'
        };
        try {
            const data = await client.send(new ScanCommand(params));
            const cars = data.Items.map(item => {
                return {
                    id: item.id.S,
                    brand: item.brand.S,
                    model: item.model.S,
                    color: item.color.S,
                    imageKey: item.id.S // Assuming the image key is the same as the car ID
                };
            });
            res.json(cars);
        } catch (error) {
            console.error('Error fetching cars:', error);
            res.status(500).json({ error: 'Could not fetch cars' });
        }
    },
    getCarById: async(req,res)=>{
    const id = req.params.id; 
    const params = {
        TableName: 'cars2', 
        Key: {
            'id': { S: id } 
        }
    };
    try {
        const data = await client.send(new GetItemCommand(params));
        if (!data.Item) {
            return res.status(404).json({ error: 'Car not found' });
        }

        const car = {
            id: data.Item.id.S,
            brand: data.Item.brand.S,
            model: data.Item.model.S,
            color: data.Item.color.S,
            imageUrl: `http://${bucketName}.s3.amazonaws.com/${data.Item.id.S}`
        };
        console.log(car.id);
        console.log(car.brand);
        console.log(car.imageUrl);

        res.status(200).json(car);
    } catch (error) {
        console.error('Error fetching car from DynamoDB:', error);
        res.status(500).json({ error: 'Could not fetch car from DynamoDB' });
    }
},
  getImageById : async (req, res) => {
        const key = req.params.id; // Ensure the parameter name matches your route definition
        const params = {
            Bucket: bucketName,
            Key: key
        };
    
        try {
            const data = await s3Client.send(new GetObjectCommand(params));
    
            if (!data.Body) {
                return res.status(404).json({ error: 'Image not found' });
            }
    
            // Collect the image data
            let chunks = [];
            data.Body.on('data', chunk => chunks.push(chunk));
            data.Body.on('end', () => {
                const buffer = Buffer.concat(chunks);
                res.set('Content-Type', data.ContentType || 'image/jpeg'); // Default to 'image/jpeg' if ContentType is undefined
                res.send(buffer);
            });
        } catch (error) {
            console.error('Error fetching image from S3:', error);
            res.status(500).json({ error: 'Could not fetch image from S3' });
        }
    },
   
};

module.exports = carController;
