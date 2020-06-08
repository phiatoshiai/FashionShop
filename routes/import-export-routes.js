'use strict';

const ImportExportController = require('../app/controllers/import-export-controller');
const router = require('express').Router();
const {
  validateInputData,
} = require('../app/middlewares/import-export-middlewares');

router.post('/create', validateInputData, ImportExportController.createImportExport);
router.put('/update', validateInputData, ImportExportController.updateImportExport);
router.get('/getById/:id', ImportExportController.getImportExportById);
router.get('/getAll', ImportExportController.getAllImportExport);

module.exports = router;
