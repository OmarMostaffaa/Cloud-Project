//carRouter.js
const express = require('express');
const carController = require('../controllers/carController');

const router = express.Router();

router.post('/addCar', carController.addCar);
router.put('/updateCar', carController.updateCar);
module.exports = router;