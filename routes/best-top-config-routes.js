'use strict';

const BestTopConfigController = require('../app/controllers/best-top-config-controller');
const router = require('express').Router();
const {
  validateInputData,
} = require('../app/middlewares/best-top-config-middlewares');

router.post('/create', validateInputData, BestTopConfigController.createBestTopConfig);
router.put('/update', validateInputData, BestTopConfigController.updateBestTopConfig);
router.get('/getById/:id', BestTopConfigController.getBestTopConfigById);
router.get('/getAll', BestTopConfigController.getAllBestTopConfig);
router.get('/autoCreate', BestTopConfigController.autoCreate);

module.exports = router;
