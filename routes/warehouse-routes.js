'use strict';

const WarehouseController = require('../app/controllers/ware-house-controller');
const router = require('express').Router();
const {
  validateInputData,
} = require('../app/middlewares/ware-house-middlewares');

router.post('/create', validateInputData, WarehouseController.createWarehouse);
router.put('/update', validateInputData, WarehouseController.updateWarehouse);
router.get('/getById/:id', WarehouseController.getWarehouseById);
router.get('/getAll', WarehouseController.getAllWarehouse);

module.exports = router;
