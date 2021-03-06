'use strict';

const ProductController = require('../app/controllers/product-controller');
const router = require('express').Router();
const { validateInputData } = require('../app/middlewares/product-middlewares');

router.post('/create', validateInputData, ProductController.createProduct);
router.put('/update', validateInputData, ProductController.updateProduct);
router.get('/getById/:id', ProductController.getProductById);
router.get('/getAll', ProductController.getAllProduct);

module.exports = router;
