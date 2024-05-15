//carController.js 
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
        const { id, brand, model, color, price } = req.body;
        const params = {
            TableName: 'cars',
            Key: { 'id': { S: id } }, // Primary key
            UpdateExpression: 'SET brand = :brand, model = :model, color = :color, price = :price',
            ExpressionAttributeValues: {
                ':brand': { S: brand },
                ':model': { S: model },
                ':color': { S: color },
                ':price': { N: price.toString() }
            },
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
    deleteCar: async (req, res) => {
        const { id } = req.params;
        const params = {
            TableName: 'cars',
            Key: {
                'id': { S: id }
            }
        }
        try {
            await client.send(new DeleteItemCommand(params));
            res.json({ message: 'Car deleted successfully' });
        } catch (error) {
            console.error('Error deleting item:', error);
            res.status(500).json({ error: 'Could not delete car' });
        }
    },

};

module.exports = carController;