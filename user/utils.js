const solanaWeb3 = require("@solana/web3.js");
const axios = require("axios");
const BN = require("bignumber.js");
const _ = require("lodash");
const lendingReserves = require("../database/lendingReserves.model");
const leveragedModel = require("../database/leverage.model");
const raydiumModel = require("../database/raydium.model");
const orcaModel = require("../database/orca.model");
const saberModel = require("../database/saber.model");

// const {
//   LENDING_RESERVES
// } = require('./reserves');

// const {
//   RAY_VAULTS,
//   ORCA_VAULTS,
// } = require('./vaults');

// const {
//   RAY_FARMS,
//   ORCA_FARMS,
// } = require('./farms');

const { RPC_URL } = require("./config");

const findReserveTokenByMint = async (_mint) => {
  try {
    if ((_mint == undefined) || (_mint == null))
      throw "Missing 'mint' parameter";

    const reserve = await lendingReserves.findOne({ mintAddress: _mint });

    return reserve;
  } catch (error) {
    throw error;
  }
};

const findReserveTokenByAccount = async (_account) => {
  try {
    if ((_account == undefined) || (_account == null))
      throw "Missing 'acount' parameter";

    const reserve = await lendingReserves.findOne({ account: _account });

    return reserve;
  } catch (error) {
    throw error;
  }
};

const getPoolAccounts = async (_pool, _pairName) => {
  try {
    const _FARM = _pool == 0 ? raydiumModel : orcaModel;

    let baseMint;
    let quoteMint;
    let _account;

    if (_pool == 0) {
      const { vaults } = await raydiumModel.findOne({
        "vaults.name": _pairName,
      });

      _account = vaults.account;
      baseMint = vaults.serumBaseMint;
      quoteMint = vaults.serumQuoteMint;
    } else {
      const { vaults } = await orcaModel.findOne({ "vaults.name": _pairName });

      _account = vaults.account;
      baseMint = vaults.swap_token_a_mint;
      quoteMint = vaults.swap_token_b_mint;
    }
    const { farms } = await _FARM.findOne({ "farms.name": _pairName });

    return {
      account: _account,
      ammId: farms.ammId,
      ammOpenOrders: farms.ammOpenOrders,
      lpMintAddress: farms.lpMintAddress,
      poolCoinTokenaccount: farms.poolCoinTokenaccount,
      poolPcTokenaccount: farms.poolPcTokenaccount,
      farmIndex: farms.index,
      baseMint,
      quoteMint,
    };
  } catch (error) {
    console.log(error);
    throw {
      error: `${_pairName} pair not found, try other like: RAY-USDT`,
    };
  }
};

/**
 * Gets USD value of given token from Coingecko
 * @returns used value
 */
const getCoinsUsdValue = async (_tokenId) => {
  try {
    if (_tokenId == undefined || _tokenId == null) {
      throw "Missing Parameters";
    }

    let BASE_URL = "https://api.coingecko.com/api/v3";
    let URL_PARAMS = `/simple/price?ids=${_tokenId}&vs_currencies=usd`;

    const config = {
      method: "GET",
      url: `${BASE_URL}${URL_PARAMS}`,
    };

    let result = await axios(config);
    return result.data[_tokenId].usd;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

const getCoinsUsdValueTulip = async (_tokenId) => {
  try {
    if (_tokenId == undefined || _tokenId == null) {
      throw "Missing Parameters";
    }

    let BASE_URL = "https://api.tulip.garden/price";

    const data = JSON.stringify({
      "asset_identifiers": [
        _tokenId
      ]
    });

    const config = {
      method: "post",
      url: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    let result = await axios(config);
    return result.data.assets[0].price;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

/**
 *
 * @param {big number to format to} _bn
 * @returns formatted bignumber for USD fiat rep.
 */
const bnToFiatUsd = (_bn) => {
  try {
    if (!BN.isBigNumber(_bn)) throw "Not big Number";

    return _bn.dp(3).toNumber();
  } catch (error) {
    console.log(error);
    throw "Error formatting BN to USD";
  }
};

/**
 *
 * @param {Account address to get info from} _address returns information of the account address using Solana RPC
 * @returns
 */
const getAccountInfo = async (_address) => {
  try {
    const data = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getAccountInfo",
      params: [
        `${_address}`,
        {
          encoding: "jsonParsed",
        },
      ],
    });

    const config = {
      method: "post",
      url: RPC_URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    let result = await axios(config);
    return result.data.result;
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * @param {Address to convert to PubKey} _address Base58
 * @returns PubKey
 */
const b58AddressToPubKey = (_address) => {
  try {
    let pubKey = new solanaWeb3.PublicKey(_address);
    return pubKey;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCoinsUsdValue,
  getAccountInfo,
  b58AddressToPubKey,
  bnToFiatUsd,
  findReserveTokenByMint,
  findReserveTokenByAccount,
  getPoolAccounts,
  getCoinsUsdValueTulip
};
