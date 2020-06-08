const constants = require('./constants');
const { isEmpty, get } = require('lodash');
const moment = require('moment');
const { slugifyString } = require('./slugifyString');
require('moment-timezone');

function getAudit(req) {
  const now = moment().tz(constants.TIMEZONE_DEFAULT).utc().toDate();
  const createdBy = get(req.dataUser, 'payload.holderId') || 'Không tồn tại';
  const updatedBy = get(req.dataUser, 'payload.holderId') || 'Không tồn tại';
  return {
    now: now,
    createdBy: createdBy,
    updatedBy: updatedBy,
  };
}

function processTimeAndAudit(req, body, status) {
  const { now, createdBy, updatedBy } = getAudit(req);
  if (status === 'create') {
    body.createdBy = createdBy;
    body.updatedBy = updatedBy;
  }

  if (status === 'update') {
    req.body.updatedAt = now;
    req.body.updatedBy = updatedBy;
  }

  if (!isEmpty(body.name)) {
    body.slug = slugifyString(name);
    body.name = body.name.trim();
  }

  return body;
}

module.exports = {
  getAudit: getAudit,
  processTimeAndAudit: processTimeAndAudit,
};
