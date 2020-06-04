'use strict';

const ProductController = require('../app/controllers/product-controller');
const router = require('express').Router();
const {validateInputData} = require('../app/middlewares/product-middlewares');

router.post('/create', validateInputData, ProductController.createProduct);

module.exports = router;
