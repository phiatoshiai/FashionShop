'use strict';

const ProductController = require('../app/controllers/product-controller');
const router = require('express').Router();
const {validateInputData} = require('../app/middlewares/product-middlewares');

router.post('/create', validateInputData, ProductController.createProduct);
router.post('/update', validateInputData, ProductController.updateProduct);
router.get('/getById/:id', ProductController.getProductById);
router.get('/getAllProduct', ProductController.getAllProduct);

module.exports = router;
