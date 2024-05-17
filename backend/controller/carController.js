const { DynamoDBClient, PutItemCommand, UpdateItemCommand, DeleteItemCommand, GetItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectVersionsCommand } = require('@aws-sdk/client-s3');
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
        const checkParams = {
            TableName: 'cars2',
            Key: {
                'id': { S: id }
            }
        };
    
        // const checkData = await client.send(new GetItemCommand(checkParams));
        // if (checkData.Item) {
        //     return res.status(400).json({ error: 'Car with this ID already exists' });
        // }

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
        const { id, brand, model, color, base64Image } = req.body;
    
        if (!id) {
            return res.status(400).json({ error: 'id is required' });
        }
    
        const updateExpression = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};
    
        if (brand) {
            updateExpression.push('#brand = :brand');
            expressionAttributeValues[':brand'] = { S: brand };
            expressionAttributeNames['#brand'] = 'brand';
        }
    
        if (model) {
            updateExpression.push('#model = :model');
            expressionAttributeValues[':model'] = { S: model };
            expressionAttributeNames['#model'] = 'model';
        }
    
        if (color) {
            updateExpression.push('#color = :color');
            expressionAttributeValues[':color'] = { S: color };
            expressionAttributeNames['#color'] = 'color';
        }
    
        const dbParams = {
            TableName: 'cars2',
            Key: {
                id: { S: id },
            },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames,
            ReturnValues: 'ALL_NEW'
        };
    
        try {
            if (base64Image) {
                const imageBuffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    
                const s3Params = {
                    Bucket: bucketName,
                    Key: id,
                    Body: imageBuffer,
                    ContentType: 'image/jpeg'
                };
    
                const uploadCommand = new PutObjectCommand(s3Params);
                await s3Client.send(uploadCommand);
            }
    
            const dbCommand = new UpdateItemCommand(dbParams);
            const result = await client.send(dbCommand);
    
            return res.json({ message: 'Car updated successfully', updatedAttributes: result.Attributes });
        } catch (err) {
            console.error('Unable to update car:', err);
            return res.status(500).json({ error: 'Could not update car' });
        }
    },

    deleteCar: async (req, res) => {
        const { id } = req.params;
    
        try {
            // Define S3 parameters for both buckets
            const s3Buckets = ['giucars', 'resizedgiucars'];
            let allVersionsDeleted = true;
    
            for (const bucket of s3Buckets) {
                const listParams = {
                    Bucket: bucket,
                    Prefix: id
                };
    
                // List object versions
                const versionsResponse = await s3Client.send(new ListObjectVersionsCommand(listParams));
                const versions = versionsResponse.Versions || [];
    
                if (versions.length > 0) {
                    // Get the latest version
                    const latestVersion = versions[0];
                    const deleteParams = {
                        Bucket: bucket,
                        Key: id,
                        VersionId: latestVersion.VersionId
                    };
    
                    // Delete the latest version
                    await s3Client.send(new DeleteObjectCommand(deleteParams));
    
                    // Check if there are more versions left
                    const remainingVersionsResponse = await s3Client.send(new ListObjectVersionsCommand(listParams));
                    const remainingVersions = remainingVersionsResponse.Versions || [];
    
                    if (remainingVersions.length >= 0) {
                        allVersionsDeleted = false;
                    }
                }
            }
    
            // Delete the car record from DynamoDB only if all versions were deleted
            if (allVersionsDeleted) {
                const params = {
                    TableName: 'cars2',
                    Key: { 'id': { S: id } }
                };
    
                // Delete the car record from DynamoDB
                await client.send(new DeleteItemCommand(params));
            }
    
            res.json({ message: 'Car processed successfully' });
        } catch (error) {
            console.error('Error deleting item:', error);
            res.status(500).json({ error: 'Could not process car' });
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