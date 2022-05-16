const BigNumber = require("bignumber.js");
const _ = require("lodash");

  const ONE_MILLION = 1000000,
  ZERO = 0;

class TokenAmount {
  constructor (wei, decimals = 0, isWei = true) {
    this.decimals = decimals;
    this._decimals = new BigNumber(10).exponentiatedBy(decimals);

    if (isWei) {
      this.wei = new BigNumber(wei);
    } else {
      this.wei = new BigNumber(wei).multipliedBy(this._decimals);
    }
  }

  toEther () {
    return this.wei.dividedBy(this._decimals);
  }

  toWei () {
    return this.wei;
  }

  format () {
    return this.wei.dividedBy(this._decimals).toFormat(this.decimals);
  }

  fixed () {
    return this.wei.dividedBy(this._decimals).toFixed(this.decimals);
  }

  isNullOrZero () {
    return this.wei.isNaN() || this.wei.isZero();
  }
}

const getFormattedApproximateDollars = function (num) {
  num = +num;
  const units = [
    { divisor: 1_000_000_000, unit: 'B', precision: 0 },
    { divisor: 1_000_000, unit: 'M', precision: 0 },
    { divisor: 1000, min: 10_000, unit: 'K', precision: 0 },
    { divisor: 1000, min: 1000, unit: 'K', precision: 1 },
    { divisor: 1, unit: '', precision: 0 }
  ];
  const match =
    units.find((u) => Math.abs(num) >= (u.min || u.divisor)) ||
    units[units.length - 1];

  return (num / match.divisor).toFixed(match.precision) + match.unit;
};

const getFormattedNumber = function (
  num,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2
) {
  // `isNil` check for `null` or `undefined`
  // `num !== num` check for `NaN`
  if (isNil(num) || isNaN(num)) {
    return ZERO.toFixed(2);
  }

  if (num instanceof BigNumber) {
    num = num.toNumber();
  }

  if (num < ONE_MILLION) {
    return num.toLocaleString(undefined, {
      minimumFractionDigits,
      maximumFractionDigits
    });
  }

  const units = ['M', 'B', 'T', 'Q'],
    unit = Math.floor((num / 1.0e1).toFixed(0).toString().length),
    r = unit % 3,
    x = Math.abs(Number(num)) / Number('1.0e+' + (unit - r)).toFixed(2);

  return x.toFixed(2) + '' + units[Math.floor(unit / 3) - 2];
};

const getRoundedNumber = function (num, floatingPointDigits = 1) {
  return (
    Math.round(Number(num) * 10 * floatingPointDigits) /
    (10 * floatingPointDigits)
  );
};

/**
 *
 * @param {Object[]} items example: [{ weight: 1, value: 1}, { weight: 2, value: 1}]
 *
 * @returns {Number} Weighted average of the items
 */
const getWeightedAverage = function (items) {
  let totalNumerator = 0;
  let totalDenominator = 0;

  items.forEach((item) => {
    totalNumerator += item.weight * item.value;
    totalDenominator += item.weight;
  });

  return totalNumerator / totalDenominator;
};

module.exports = {
  TokenAmount,
  getFormattedApproximateDollars,
  getFormattedNumber,
  getRoundedNumber,
  getWeightedAverage
};
