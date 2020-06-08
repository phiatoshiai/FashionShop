'use strict';

const CategoryController = require('../app/controllers/category-controller');
const router = require('express').Router();
const {
  validateInputData,
} = require('../app/middlewares/category-middlewares');

router.post('/create', validateInputData, CategoryController.createCategory);
router.put('/update', validateInputData, CategoryController.updateCategory);
router.get('/getById/:id', CategoryController.getCategoryById);
router.get('/getAll', CategoryController.getAllCategory);

module.exports = router;
