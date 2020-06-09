const moment = require('moment');
const constants = require('./constants');
const Devebot = require('devebot');
const lodash = Devebot.require('lodash');
require('moment-timezone');

function reportDuration(time, time_zone, inputField) {
  const filter = {};
  if (!lodash.isNil(time)) {
    const filterField = inputField || constants.FILTER_FIELD_DEFAULT;
    const timezone = time_zone || constants.TIMEZONE_DEFAULT;
    const now = moment.tz(timezone);
    const nowUTC = now.clone().utc();
    switch (time) {
      case constants.TIME.TODAY:
        const startOfToday = now.clone().startOf('day').utc();
        filter[filterField] = { $gte: startOfToday, $lte: nowUTC };
        break;
      case constants.TIME.YESTERDAY:
        const startOfYesterday = now
          .clone()
          .subtract(1, 'day')
          .startOf('day')
          .utc();
        const endOfYesterday = now
          .clone()
          .subtract(1, 'day')
          .endOf('day')
          .utc();
        filter[filterField] = {
          $gte: startOfYesterday,
          $lte: endOfYesterday,
        };
        break;
      case constants.TIME.SEVEN_DAYS_AGO:
        const startOf7days_ago = now
          .clone()
          .subtract(7, 'day')
          .startOf('day')
          .utc();
        filter[filterField] = {
          $gte: startOf7days_ago,
          $lte: nowUTC,
        };
        break;
      case constants.TIME.FOURTEEN_DAYS_AGO:
        const startOf14days_ago = now
          .clone()
          .subtract(14, 'day')
          .startOf('day')
          .utc();
        filter[filterField] = {
          $gte: startOf14days_ago,
          $lte: nowUTC,
        };
        break;
      case constants.TIME.THIRTY_DAYS_AGO:
        const startOf30days_ago = now
          .clone()
          .subtract(30, 'day')
          .startOf('day')
          .utc();
        filter[filterField] = {
          $gte: startOf30days_ago,
          $lte: nowUTC,
        };
        break;
      case constants.TIME.THIS_MONTH:
        const startOfThis_month = now.clone().startOf('month').utc();
        filter[filterField] = {
          $gte: startOfThis_month,
          $lte: nowUTC,
        };
        break;
      case constants.TIME.LAST_MONTH:
        const startOfLast_month = now
          .clone()
          .subtract(1, 'month')
          .startOf('month')
          .utc();
        const endOfLast_month = now
          .clone()
          .subtract(1, 'month')
          .endOf('month')
          .utc();
        filter[filterField] = {
          $gte: startOfLast_month,
          $lte: endOfLast_month,
        };
        break;
      case constants.TIME.THIS_WEEK:
        const startOfThis_week = now.clone().startOf('week').utc();
        filter[filterField] = {
          $gte: startOfThis_week,
          $lte: nowUTC,
        };
        break;
      case constants.TIME.TREE_MONTHS_AGO:
        const startOf3months_ago = now
          .clone()
          .subtract(3, 'month')
          .startOf('month')
          .utc();
        const endOf3months_ago = now
          .clone()
          .subtract(1, 'month')
          .endOf('month')
          .utc();
        filter[filterField] = {
          $gte: startOf3months_ago,
          $lte: endOf3months_ago,
        };
        break;
      case constants.TIME.THIS_QUARTER:
        const startOfThis_quarter = now
          .clone()
          .month(Math.floor(now.month() / 3) * 3)
          .startOf('month')
          .utc();
        filter[filterField] = {
          $gte: startOfThis_quarter,
          $lte: nowUTC,
        };
        break;
      default:
        filter[filterField] = {
          $gte: now.clone().startOf('month').utc(),
          $lte: nowUTC,
        };
        break;
    }
    filter[filterField]['$gte'] = filter[filterField]['$gte'].toDate();
    filter[filterField]['$lte'] = filter[filterField]['$lte'].toDate();
  }
  return filter;
}

function fromDateToDate(fromDate, toDate, time_zone, inputField) {
  const filter = {};
  const filterField = inputField || constants.FILTER_FIELD_DEFAULT;
  filter[filterField] = {};
  const timezone = time_zone || constants.TIMEZONE_DEFAULT;
  if (!lodash.isNil(fromDate)) {
    filter[filterField]['$gte'] = moment(fromDate).tz(timezone).utc().toDate();
  }
  if (!lodash.isNil(toDate)) {
    filter[filterField]['$lte'] = moment(toDate)
      .tz(timezone)
      .endOf('day')
      .utc()
      .toDate();
  }
  return filter;
}

function getDaysBefore(days, time_zone, field='createdAt') {
  const timezone = time_zone || constants.TIMEZONE_DEFAULT;
  const now = moment.tz(timezone);
  const rejectDays = now
            .clone()
            .subtract(days, 'day')
            .startOf('day')
            .utc();
  return {[field]: {$lt: rejectDays.toDate()}};
}

module.exports = {
  reportDuration: reportDuration,
  fromDateToDate: fromDateToDate,
  getDaysBefore
};
