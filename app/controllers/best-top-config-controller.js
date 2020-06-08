'use strict';
const { isEmpty, map, differenceWith, isEqual, find } = require('lodash');
const BestTopConfigModel = require('../models/best-top-config-model');
const CategoryModel = require('../models/category-model');
const constants = require('../../util/constants');
const { slugifyString } = require('../../util/slugifyString');
const { getAudit, processTimeAndAudit } = require('../../util/audit');
const Promise = require('bluebird');

//create best top config
async function createBestTopConfig(req, res) {
  try {
    const { category, type } = req.body;
    req.body = processTimeAndAudit(req, req.body, 'create');
    await checkTypeInDB(type, category);
    BestTopConfigModel.create(req.body, (err, data) => {
      if (err) {
        return res
          .status(500)
          .send({ msg: 'Xảy ra lỗi trong quá trình tạo mới bộ cài đặt' });
      }

      return res.status(201).json(data);
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

//getById
async function getBestTopConfigById(req, res) {
  try {
    const id = req.params.id;
    const besTopConfigById = await BestTopConfigModel.findOne({ _id: id });
    if (!isEmpty(besTopConfigById)) {
      return res.status(200).json(besTopConfigById);
    } else {
      return res.status(200).json({ _id: 123 });
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

//update
async function updateBestTopConfig(req, res) {
  try {
    const { _id, type } = req.body;
    req.body = processTimeAndAudit(req, req.body, 'update');
    const configDB = await BestTopConfigModel.findOne({
      _id: _id,
    });
    if (isEmpty(configDB)) {
      throw new Error('Không tồn tại bộ cài đặt trong cơ sở dữ liệu');
    }

    if (configDB.type !== type) {
      throw new Error('Không được thay đổi kiểu bộ cài đặt');
    }

    const countConfigDB = await BestTopConfigModel.count({
      _id: _id,
    });
    if (countConfigDB > 1) {
      throw new Error('Danh mục này đã tồn tại bộ cài đặt');
    }

    await BestTopConfigModel.update(req.body, (err) => {
      if (!isEmpty(err)) {
        return res.status(500).json({ msg: err.message });
      }
    });

    const response = await BestTopConfigModel.findOne({ _id: _id });
    if (!isEmpty(response)) {
      return res.status(200).json(response);
    }
    return res.status(200).json({ _id: 123 });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

//auto create base config for category or application
async function autoCreate(req, res) {
  try {
    const query = {
      $and: [{ deleted: false, activated: true }],
    };

    const allCategory = await CategoryModel.find({}, '_id name');
    const categoryIds = map(allCategory, '_id');
    query['$and'].push({ category: { $in: categoryIds } });
    query['$and'].push({ category: { $exists: true } });
    const listConfig = await BestTopConfigModel.find(query);
    const configCategoryIds = map(listConfig, 'category');
    const diffIds = differenceWith(categoryIds, configCategoryIds, isEqual);
    await createConfigCategory(req, diffIds, allCategory);
    await createConfigApplication(req);

    return res
      .status(200)
      .json({ msg: 'đã hoàn tất quá trình tự động tạo mới' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

//get all
async function getAllBestTopConfig(req, res) {
  try {
    const query = {
      $and: [{ deleted: false, activated: true }],
    };

    const params = req.query;
    const { q } = params;
    const perPage = parseInt(params.perPage) || constants.LIMIT_DEFAULT;
    const page = parseInt(params.page) || 1;
    if (!isEmpty(q)) {
      let subQuerySearch = { $or: [] };
      subQuerySearch['$or'].push({
        slug: { $regex: slugifyString(q), $options: 'i' },
      });
      query['$and'].push(subQuerySearch);
    }

    const listConfig = await BestTopConfigModel.find(query)
      .skip(perPage * page - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const totalConfig = await BestTopConfigModel.count(query);

    return res.status(200).json({ data: listConfig, total: totalConfig });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

/**
 * FUNCTION
 */
//check type with category or application exist in database
async function checkTypeInDB(type, category) {
  try {
    switch (type) {
      case constants.TYPE.BEST_TOP_CONFIG.CATEGORY:
        const configHasCategory = await BestTopConfigModel.find({
          category: category,
          activated: true,
          deleted: false,
        });
        if (!isEmpty(configHasCategory)) {
          throw new Error('Danh mục này đã tồn tại bộ cài đặt');
        }
        break;
      case constants.TYPE.BEST_TOP_CONFIG.ALL:
        const configHasTypeAll = await BestTopConfigModel.find({
          type: type,
          activated: true,
          deleted: false,
        });
        if (!isEmpty(configHasTypeAll)) {
          throw new Error('Ứng dụng này đã tồn tại bộ cài đặt');
        }
        break;
    }
  } catch (err) {
    return Promise.reject(err);
  }
}

//auto create config for category
async function createConfigCategory(req, diffIds, allCategory) {
  try {
    const { now, createdBy, updatedBy } = getAudit(req);
    await Promise.all(
      map(diffIds, async (id) => {
        const categoryFind = find(
          allCategory,
          (ele) => String(ele._id) === String(id)
        );
        const baseObj = {
          name: `'Bộ cài đặt ${categoryFind.name}`,
          type: 'cb7d9544-41b3-4888-803d-ff88894b905a',
          category: id,
          createdAt: now,
          updatedAt: now,
          createdBy: createdBy,
          updatedBy: updatedBy,
        };

        await BestTopConfigModel.create(baseObj, (err) => {
          if (err) {
            throw new Error('Xảy ra lỗi trong quá trình tạo mới bộ cài đặt');
          }
        });
      })
    );
  } catch (err) {
    return Promise.reject(err);
  }
}

//auto create config for application
async function createConfigApplication(req) {
  try {
    const { now, createdBy, updatedBy } = getAudit(req);
    const configByApplicationType = await BestTopConfigModel.findOne({
      type: constants.TYPE.BEST_TOP_CONFIG.ALL,
    });

    if (isEmpty(configByApplicationType)) {
      const objApplication = {
        name: 'Bộ cài đặt hệ thống',
        type: constants.TYPE.BEST_TOP_CONFIG.ALL,
        createdAt: now,
        updatedAt: now,
        createdBy: createdBy,
        updatedBy: updatedBy,
      };

      await BestTopConfigModel.create(objApplication, (err) => {
        if (err) {
          throw new Error('Xảy ra lỗi trong quá trình tạo mới bộ cài đặt');
        }
      });
    }
  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = {
  createBestTopConfig: createBestTopConfig,
  getBestTopConfigById: getBestTopConfigById,
  updateBestTopConfig: updateBestTopConfig,
  getAllBestTopConfig: getAllBestTopConfig,
  autoCreate: autoCreate,
};
