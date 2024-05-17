const express = require('express');
const carController = require('../controllers/carController');

const router = express.Router();

router.post('/addCar', carController.addCar);
router.put('/updateCar', carController.updateCar);
router.get('/getCars', carController.getCars);
router.get('/getCarById/:id', carController.getCarById);
router.get('/getImageByid/:id', carController.getImageById);
router.delete('/deleteCar', carController.deleteCar);
module.exports = router;