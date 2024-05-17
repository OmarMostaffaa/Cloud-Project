// routes/imageRouter.js
const express = require('express');
const router = express.Router();
const imageController = require('../controller/imageController');


router.post('/imageUpload', imageController.uploadImage);

module.exports = router;
