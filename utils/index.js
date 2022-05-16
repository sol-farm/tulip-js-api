const axios = require('axios');
const moment = require('moment');

const getCoinsUsdValue = async (_tokenId) => {

  try {

    if (_tokenId == undefined || _tokenId == null)
      throw ("Missing Parameters");

    let BASE_URL = 'https://api.coingecko.com/api/v3';
    let URL_PARAMS = `/simple/price?ids=${_tokenId}&vs_currencies=usd`

    const config = {
      method: 'GET',
      url: `${BASE_URL}${URL_PARAMS}`
    };

    let result = await axios(config);
    return result.data[_tokenId].usd;

  } catch (error) {
    console.log(error.message);
    throw (error);
  }

};

module.exports = {
  getCoinsUsdValue
};