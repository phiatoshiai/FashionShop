'use strict';
const { isEmpty, map, get } = require('lodash');
const WarehouseModel = require('../models/warehouse-model');
const ProductModel = require('../models/product-model');
const BestTopConfig = require('../models/best-top-config-model');
const CategoryModel = require('../models/category-model');
const ImportExportModel = require('../models/import-export-model');
const constants = require('../../util/constants');
const { slugifyString } = require('../../util/slugifyString');
const { getAudit, processTimeAndAudit } = require('../../util/audit');
const processingTime = require('../../util/processing-time');

//list by query
async function bestSoldProduct(req, res) {
  try {
    const params = req.query;
    const timezone = req.headers.timezone || constants.TIMEZONE_DEFAULT;
    const perPage = parseInt(params.perPage) || constants.LIMIT_DEFAULT;
    const page = parseInt(params.page) || 1;
    const { reportDuration, action } = params;

    const query = createQueryBestSold(reportDuration, timezone);
    const limit = await getLimitBestSold(params);
    const warehousesDB = await WarehouseModel.find(query)
      .populate({
        path: 'product',
        match: { deleted: false, activated: true },
        select: '_id name',
        populate: {
          path: 'category',
          match: { deleted: false, activated: true },
          select: '_id name',
        },
      })
      .skip(perPage * page - perPage)
      .limit(action === 'showTop' ? limit : perPage)
      .sort({ selled: -1 });

    const products = convertWarehouseProduct(warehousesDB);

    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

async function getLimitBestSold(params) {
  try {
    const { category, config, action } = params;
    let limit = constants.LIMIT_TOP_DEFAULT;
    if (action === 'showTop') {
      if (config === 'category' && !isEmpty(category)) {
        const configPolicy = await BestTopConfig.findOne({
          activated: true,
          deleted: false,
          type: constants.TYPE.BEST_TOP_CONFIG.CATEGORY,
          category: category,
        });
        limit = (!isEmpty(configPolicy) && get(configPolicy, 'limit')) || limit;
      } else if (config === 'all') {
        const configAll = await BestTopConfig.findOne({
          activated: true,
          deleted: false,
          type: constants.TYPE.BEST_TOP_CONFIG.ALL,
        });
        limit = (!isEmpty(configPolicy) && get(configAll, 'limit')) || limit;
      }
    }
    return limit;
  } catch (err) {
    return Promise.reject(err);
  }
} //get limit on page best sold

function convertWarehouseProduct(warehousesDB) {
  const productArr = [];
  map(warehousesDB, (warehouse) => {
    let product = {};
    product._id = get(warehouse, 'product._id');
    product.name = get(warehouse, 'product.name');
    product.category = get(warehouse, 'category.name');
    product.price = get(warehouse, 'price');
    product.qty = get(warehouse, 'qty');
    product.price = get(warehouse, 'price');
    product.selled = get(warehouse, 'selled');
    product.rest = get(warehouse, 'rest');
    product.discount = get(warehouse, 'discount');
    product.warehouse = get(warehouse, 'name');
    productArr.push(product);
  });
  return productArr;
} //convert warehouse to product to response

/**
 * QUERY
 */
function createQueryBestSold(reportDuration, timezone) {
  const query = {
    $and: [
      { deleted: false, activated: true },
      {
        ...processingTime.reportDuration(
          reportDuration || constants.TIME.TODAY,
          timezone,
          'updatedAt'
        ),
      },
    ],
  };
  return query;
} // query best sold

module.exports = {
  bestSoldProduct: bestSoldProduct,
  // bestWiewsProduct: bestWiewsProduct,
  // revenueByTime: revenueByTime,
  // bestSeller: bestSeller,
};
