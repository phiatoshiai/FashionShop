'use strict';

const AdminReportController = require('../app/controllers/admin-report-controller');
const router = require('express').Router();

router.get('/bestSoldProduct', AdminReportController.bestSoldProduct);
// router.get('/bestWiewsProduct', AdminReportController.bestWiewsProduct);
// router.get('/revenueByTime', AdminReportController.revenueByTime);
// router.get('/bestSeller', AdminReportController.bestSeller);
module.exports = router;
