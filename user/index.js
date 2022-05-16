const { getSolFarmPoolInfo } = require("./leveragePools");

const getVaultData = async (_pool, _pair, _userPubKey) => {
  try {

    const data = await getSolFarmPoolInfo(_pool, _pair, _userPubKey, 0);

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  getVaultData,
};
