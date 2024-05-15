const express = require('express');
const carController = require('../controller/carController');

const router = express.Router();

router.post('/addCar', carController.addCar);
router.put('/updateCar/:id', carController.updateCar);
router.delete('/deleteCar/:id', carController.deleteCar);
router.get('/getCars', carController.getCars);
module.exports = router;