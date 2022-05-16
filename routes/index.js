const express = require("express");
const router = express.Router();
const leveragedModel = require("../database/leverage.model");
const lendingReserves = require("../database/lendingReserves.model");
const raydiumModel = require("../database/raydium.model");
const orcaModel = require("../database/orca.model");
const saberModel = require("../database/saber.model");
const strategyVaults = require("../database/strategyVaults.model");
const { getVaultData } = require("../user/");
const {getReserveInfo} = require("../user/leveragePools");

const filterRegExp = (_value) => {
  return new RegExp(`^${_value}$`, "i");
};

/**
 * Get Leveraged farm info
 */
router.get("/leveraged", async (req, res) => {
  try {
    let filter =
      req.query.pair != undefined ? { name: filterRegExp(req.query.pair) } : {};

    let data = await leveragedModel.find(filter);

    if (data.length == 0) return res.json({ msg: "No data found" });

    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

/**
 * Get Lending Reserves Info
 */
router.get("/reserves", async (req, res) => {
  try {
    let filter =
      req.query.name != undefined ? { name: filterRegExp(req.query.name) } : {};

    let data = await lendingReserves.find(filter);

    if (data.length == 0) return res.json({ msg: "No data found" });

    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

/**
 * Raydium Farms and Vaults endpoint
 */
router.get("/raydium/:store", async (req, res) => {
  try {
    if (req.params.store == "farms") {
      let filter;

      if (req.query.name == undefined || req.query.name == null)
        filter = { "farms.name": { $ne: null } };
      else filter = { "farms.name": filterRegExp(req.query.name) };

      let farms = await raydiumModel.find(filter);

      return res.json(farms);
    } else if (req.params.store == "vaults") {
      let filter;

      if (req.query.name == undefined || req.query.name == null)
        filter = { "vaults.name": { $ne: null } };
      else filter = { "vaults.name": filterRegExp(req.query.name) };

      let vaults = await raydiumModel.find(filter);

      return res.json(vaults);
    } else {
      return res.json({ msg: "farms or vaults param must be provided" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ msg: error });
  }
});

/**
 * Orca Farms and Vaults endpoint
 */
router.get("/orca/:store", async (req, res) => {
  try {
    if (req.params.store == "farms") {
      let filter;

      if (req.query.name == undefined || req.query.name == null)
        filter = { "farms.name": { $ne: null } };
      else filter = { "farms.name": filterRegExp(req.query.name) };

      let farms = await orcaModel.find(filter);

      return res.json(farms);
    } else if (req.params.store == "vaults") {
      let filter;

      if (req.query.name == undefined || req.query.name == null)
        filter = { "vaults.name": { $ne: null } };
      else filter = { "vaults.name": filterRegExp(req.query.name) };

      let vaults = await orcaModel.find(filter);

      return res.json(vaults);
    } else {
      return res.json({ msg: "farms or vaults param must be provided" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ msg: error });
  }
});

/**
 * Sabe vaults endpoint
 */
router.get("/saber/:store", async (req, res) => {
  try {
    if (req.params.store == "vaults") {
      let filter;

      if (req.query.name == undefined || req.query.name == null) filter = {};
      else filter = { "vaults.name": filterRegExp(req.query.name) };

      let vaults = await saberModel.find(filter);

      return res.json(vaults);
    } else {
      return res.json({ msg: "vaults param must be provided" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ msg: error });
  }
});

/**
 * Get leveraged position info based on userpubKey
 */
router.get("/user/leveraged", async (req, res) => {
  try {
    const { pool, pairName, userAddress } = req.query;

    if (pool == undefined || pairName == undefined || userAddress == undefined)
      return res.json({ error: "Missing Parameters" });

    const data = await getVaultData(pool, pairName, userAddress);

    // loop through the borrowAsset array and the borrowed array and create an object
    // with the borrowAsset as the key and the borrowed as the value

    const userLeveragedFarm = {
      userPubKey: userAddress,
      pair: pairName,
      ...data,
    };

    console.log(userLeveragedFarm);

    return res.send(userLeveragedFarm);
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

/**
 * Get Strategy Vaults Info
 */
router.get("/strategy", async (req, res) => {
  try {
    let filter =
        req.query.name != undefined ? { name: filterRegExp(req.query.name) } : {};

    let data = await strategyVaults.find(filter);

    if (data.length == 0) return res.json({ msg: "No data found" });

    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});

router.get("/reserve", async (req, res) => {
  try {
    if (req.query.name === undefined) {
      return res.json({ msg: "No reserve name provided" });
    }

    let filter =  { name: filterRegExp(req.query.name) };

    let data = await lendingReserves.findOne(filter);

    let reserveData = await getReserveInfo(data);

    return res.json(reserveData);
  } catch (error) {
    console.log(error);
    return res.json({
      error: error,
    });
  }
});


module.exports = router;
