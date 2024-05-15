const { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, ScanCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

const { credentials } = require('../index');


// Configure the DynamoDB client with the correct region
const client = new DynamoDBClient({
    region: 'us-east-1',
    credentials: credentials
});

const carController = {
    addCar: async (req, res) => {
        const { id, brand, model, color, price } = req.body;
        const params = {
            TableName: 'cars',
            Item: {
                id: { S: id },
                brand: { S: brand },
                model: { S: model },
                color: { S: color },
                price: { N: price.toString() }
            }
        };
        try {
            const command = new PutItemCommand(params);
            await client.send(command);
            res.json({ message: 'Car added successfully' });
        } catch (err) {
            console.error('Unable to add car:', err);
            res.status(500).json({ error: 'Could not add car' });
        }
    },
    updateCar: async (req, res) => {
        const { id } = req.params; // Get the id from the URL path
        const { brand, model, color, price } = req.body;

        // Check if request body is empty
        if (!Object.keys(req.body).length) {
            return res.status(400).json({ error: 'No fields to update provided' });
        }

        // Initialize the update expression and attribute values
        const updateExpression = [];
        const expressionAttributeValues = {};

        // Build update expression and attribute values based on provided fields
        if (brand !== undefined) {
            updateExpression.push('brand = :brand');
            expressionAttributeValues[':brand'] = { S: brand };
        }
        if (model !== undefined) {
            updateExpression.push('model = :model');
            expressionAttributeValues[':model'] = { S: model };
        }
        if (color !== undefined) {
            updateExpression.push('color = :color');
            expressionAttributeValues[':color'] = { S: color };
        }
        if (price !== undefined) {
            updateExpression.push('price = :price');
            expressionAttributeValues[':price'] = { N: price.toString() };
        }

        // Construct the UpdateExpression string
        const updateExpressionStr = 'SET ' + updateExpression.join(', ');

        // Construct the params object for the DynamoDB update call
        const params = {
            TableName: 'cars',
            Key: { 'id': { S: id } }, // Primary key
            UpdateExpression: updateExpressionStr,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };

        try {
            // Update the item in the DynamoDB table
            const result = await client.send(new UpdateItemCommand(params));
            res.json({ message: 'Car updated successfully', updatedItem: result.Attributes });
        } catch (error) {
            console.error('Error updating item:', error);
            res.status(500).json({ error: 'Could not update car' });
        }
    },

    // updateCar: async (req, res) => {
    //     const { id } = req.params; // Get the id from the URL path
    //     const { brand, model, color, price } = req.body;
    //     const params = {
    //         TableName: 'cars',
    //         Key: { 'id': { S: id } }, // Primary key
    //         UpdateExpression: 'SET brand = :brand, model = :model, color = :color, price = :price', 
    //         ExpressionAttributeValues: {
    //             ':brand': { S: brand },
    //             ':model': { S: model },
    //             ':color': { S: color },
    //             ':price': { N: price.toString() }
    //         },
    //         ReturnValues: 'ALL_NEW' 
    //     };

    //     try {
    //         // Update the item in the DynamoDB table
    //         const result = await client.send(new UpdateItemCommand(params));
    //         res.json({ message: 'Car updated successfully', updatedItem: result.Attributes });
    //     } catch (error) {
    //         console.error('Error updating item:', error);
    //         res.status(500).json({ error: 'Could not update car' });
    //     }
    // },
    deleteCar: async (req, res) => {
        const { id } = req.params;
        const params = {
            TableName: 'cars',
            Key: {
                'id': { S: id } // Use 'S' type for string
            }
        };
        try {
            await client.send(new DeleteItemCommand(params));
            res.json({ message: 'Car deleted successfully' });
        } catch (error) {
            console.error('Error deleting item:', error);
            res.status(500).json({ error: 'Could not delete car' });
        }
    },
    getCars: async (req, res) => {
        const params = {
            TableName: 'cars'
        };

        try {
            const data = await client.send(new ScanCommand(params));
            const cars = data.Items.map(item => {
                return {
                    id: item.id.S,
                    brand: item.brand.S,
                    model: item.model.S,
                    color: item.color.S,
                    price: parseFloat(item.price.N)
                };
            });
            res.json(cars);
        } catch (error) {
            console.error('Error fetching cars:', error);
            res.status(500).json({ error: 'Could not fetch cars' });
        }
    }
};

module.exports = carController;