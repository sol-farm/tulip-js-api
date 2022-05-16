require("dotenv").config();
const mongoose = require("mongoose");
const leveragedModel = require("../database/leverage.model");
const lendingReserves = require("../database/lendingReserves.model");
const raydiumData = require("../database/raydium.model");
const orcaData = require("../database/orca.model");
const saberData = require("../database/saber.model");
const strategyData = require("../database/strategyVaults.model");

const { DB_NAMESPACE, DB_PASSWORD, DB_USERNAME, CERT_PATH } = process.env;

const CONNECTION_STRING = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_NAMESPACE}/tulipapi?authSource=admin&tlsInsecure=true&ssl=true`;

const {
  leveraged_farms,
  lending_reserves,
  ray_farms,
  ray_vaults,
  orca_farms,
  orca_vaults,
  saber_vaults,
  tulip_vaults
} = require("../gist");

const leverageMigration = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.info(`[+] Connected to: ${DB_NAMESPACE}`);

    leveraged_farms.forEach(async (lFarm) => {
      let newDoc = new leveragedModel();

      newDoc.name = lFarm.name;
      newDoc.account = lFarm.account;
      newDoc.account_nonce = lFarm.account_nonce;
      newDoc.serum_market = lFarm.serum_market;
      newDoc.solfarm_vault_program = lFarm.solfarm_vault_program;
      newDoc.serum_request_queue = lFarm.serum_request_queue;
      newDoc.serum_event_queue = lFarm.serum_event_queue;
      newDoc.serum_market_bids = lFarm.serum_market_bids;
      newDoc.serum_market_asks = lFarm.serum_market_asks;
      newDoc.serum_coin_vault_account = lFarm.serum_coin_vault_account;
      newDoc.serum_pc_vault_account = lFarm.serum_pc_vault_account;
      newDoc.serum_fee_recipient = lFarm.serum_fee_recipient;
      newDoc.serum_dex_program = lFarm.serum_dex_program;
      newDoc.raydium_lp_mint_address = lFarm.raydium_lp_mint_address;
      newDoc.raydium_amm_id = lFarm.raydium_amm_id;
      newDoc.raydium_amm_authority = lFarm.raydium_amm_authority;
      newDoc.raydium_amm_open_orders = lFarm.raydium_amm_open_orders;
      newDoc.raydium_amm_quantities_or_target_orders =
        lFarm.raydium_amm_quantities_or_target_ordersnewDoc;
      newDoc.raydium_liquidity_program = lFarm.raydium_liquidity_program;
      newDoc.raydium_coin_token_account = lFarm.raydium_coin_token_account;
      newDoc.raydium_pc_token_account = lFarm.raydium_pc_token_account;
      newDoc.raydium_pool_temp_token_account =
        lFarm.raydium_pool_temp_token_account;
      newDoc.raydium_pool_withdraw_queue = lFarm.raydium_pool_withdraw_queue;
      newDoc.lending_market = lFarm.lending_market;
      newDoc.lending_program = lFarm.lending_program;
      newDoc.base_token_mint = lFarm.base_token_mint;
      newDoc.quote_token_mint = lFarm.quote_token_mint;
      newDoc.farm_key = lFarm.farm_key;
      newDoc.vault_account = lFarm.vault_account;
      newDoc.vault_info_account = lFarm.vault_info_account;
      newDoc.old_vault_info_account = lFarm.old_vault_info_account;
      newDoc.coin_reserve_liquidity_fee_receiver =
        lFarm.coin_reserve_liquidity_fee_receiver;
      newDoc.pc_reserve_liquidity_fee_receiver =
        lFarm.pc_reserve_liquidity_fee_receiver;
      newDoc.farm_open_orders = lFarm.farm_open_orders;
      newDoc.farm_base_token_account = lFarm.farm_base_token_account;
      newDoc.farm_quote_token_account = lFarm.farm_quote_token_account;
      newDoc.only_pc_borrow = lFarm.only_pc_borrow;

      let res = await newDoc.save();
      console.log(res);
    });
  } catch (error) {
    console.error("[+] MongoDB" + error);
    process.exit(1);
  }
};

const lendingReservesMigration = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.info(`[+] Connected to: ${DB_NAMESPACE}`);

    lending_reserves.forEach(async (lReserves) => {
      let newDoc = new lendingReserves();

      newDoc.name = lReserves.name;
      newDoc.token_id = lReserves.token_id;
      newDoc.account = lReserves.account;
      newDoc.mintAddress = lReserves.mintAddress;
      newDoc.liquiditySupplyTokenAccount =
        lReserves.liquiditySupplyTokenAccount;
      newDoc.liquidityFeeReceiver = lReserves.liquidityFeeReceiver;
      newDoc.collateralTokenMint = lReserves.collateralTokenMint;
      newDoc.collateralTokenSupply = lReserves.collateralTokenSupply;
      newDoc.destinationCollateralTokenAccount =
        lReserves.destinationCollateralTokenAccount;
      newDoc.quoteTokenMint = lReserves.quoteTokenMint;
      newDoc.decimals = lReserves.decimals;
      newDoc.visible = lReserves.visible;

      if (lReserves.config !== undefined) {
        newDoc.optimalUtilizationRate = lReserves.config.optimal_utilization_rate;
        newDoc.minBorrowRate = lReserves.config.min_borrow_rate;
        newDoc.optimalBorrowRate = lReserves.config.optimal_borrow_rate;
        newDoc.maxBorrowRate = lReserves.config.max_borrow_rate;
        newDoc.degenBorrowRate = lReserves.config.degen_borrow_rate;
        newDoc.degenUtilizationRate = lReserves.config.degen_utilization_rate;
      }
      let res = await newDoc.save();
      console.log(res);
    });
  } catch (error) {
    console.error("[+] MongoDB" + error);
    process.exit(1);
  }
};

const rayFarmsMigration = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.info(`[+] Connected to: ${DB_NAMESPACE}`);

    ray_farms.forEach(async (rayFarm) => {
      let newDoc = new raydiumData();

      newDoc.farms.name = rayFarm.name;
      newDoc.farms.lpMintAddress = rayFarm.lpMintAddress;
      newDoc.farms.rewardAMintAddress = rayFarm.rewardAMintAddress;
      newDoc.farms.rewardBMintAddress = rayFarm.rewardBMintAddress;
      newDoc.farms.programId = rayFarm.programId;
      newDoc.farms.poolId = rayFarm.poolId;
      newDoc.farms.poolAuthority = rayFarm.poolAuthority;
      newDoc.farms.poolLpTokenAccount = rayFarm.poolLpTokenAccount;
      newDoc.farms.poolRewardATokenAccount = rayFarm.poolRewardATokenAccount;
      newDoc.farms.poolRewardBTokenAccount = rayFarm.poolRewardBTokenAccount;
      newDoc.farms.fusion = rayFarm.fusion;
      newDoc.farms.ammId = rayFarm.ammId;
      newDoc.farms.ammOpenOrders = rayFarm.ammOpenOrders;
      newDoc.farms.ammQuantitiesOrTargetOrders =
        rayFarm.ammQuantitiesOrTargetOrders;
      newDoc.farms.poolCoinTokenaccount = rayFarm.poolCoinTokenaccount;
      newDoc.farms.poolPcTokenaccount = rayFarm.poolPcTokenaccount;
      newDoc.farms.swapOrLiquidityProgramId = rayFarm.swapOrLiquidityProgramId;
      newDoc.farms.ammAuthority = rayFarm.ammAuthority;
      newDoc.farms.serumProgramId = rayFarm.serumProgramId;
      newDoc.farms.dualReward = rayFarm.dualReward;
      if (rayFarm.index) {
        newDoc.farms.index = rayFarm.index;
      }
      let res = await newDoc.save();
      console.log(res);
    });
  } catch (error) {
    console.error("[+] MongoDB" + error);
    process.exit(1);
  }
};

const rayVaultsMigration = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.info(`[+] Connected to: ${DB_NAMESPACE}`);

    ray_vaults.forEach(async (rayVault) => {
      let newDoc = new raydiumData();

      newDoc.vaults.name = rayVault.name;
      newDoc.vaults.account = rayVault.account;
      newDoc.vaults.pdaAccount = rayVault.pdaAccount;
      newDoc.vaults.pdaAccountNonce = rayVault.pdaAccountNonce;
      newDoc.vaults.infoAccount = rayVault.infoAccount;
      newDoc.vaults.oldInfoAccount = rayVault.oldInfoAccount;
      newDoc.vaults.infoAccountNonce = rayVault.infoAccountNonce;
      newDoc.vaults.rewardAccountA = rayVault.rewardAccountA;
      newDoc.vaults.rewardAccountNonceA = rayVault.rewardAccountNonceA;
      newDoc.vaults.rewardAccountB = rayVault.rewardAccountB;
      newDoc.vaults.rewardAccountNonceB = rayVault.rewardAccountNonceB;
      newDoc.vaults.lpTokenAccount = rayVault.lpTokenAccount;
      newDoc.vaults.pdaTokenAccount = rayVault.pdaTokenAccount;
      newDoc.vaults.vaultAccountSecretKey = rayVault.vaultAccountSecretKey;
      newDoc.vaults.metaDataAccount = rayVault.metaDataAccount;
      newDoc.vaults.metaDataSecretKey = rayVault.metaDataSecretKey;
      newDoc.vaults.initialized = rayVault.initialized;
      newDoc.vaults.pdaFunded = rayVault.pdaFunded;
      newDoc.vaults.metaDataCreated = rayVault.metaDataCreated;
      newDoc.vaults.swapAccount = rayVault.swapAccount;
      newDoc.vaults.swapAccountNonce = rayVault.swapAccountNonce;
      newDoc.vaults.serumMarketKey = rayVault.serumMarketKey;
      newDoc.vaults.serumBaseMint = rayVault.serumBaseMint;
      newDoc.vaults.serumQuoteMint = rayVault.serumQuoteMint;
      newDoc.vaults.serumVaultSigner = rayVault.serumVaultSigner;
      newDoc.vaults.slippage = rayVault.slippage;
      newDoc.vaults.rayPoolVersion = rayVault.rayPoolVersion;
      newDoc.vaults.serumOpenOrdersAccount = rayVault.serumOpenOrdersAccount;
      newDoc.vaults.controllerFee = rayVault.controllerFee;
      newDoc.vaults.platformFee = rayVault.platformFee;
      newDoc.vaults.vaultFee = rayVault.vaultFee;
      newDoc.vaults.entranceFee = rayVault.entranceFee;
      newDoc.vaults.withdrawalFee = rayVault.withdrawalFee;
      newDoc.vaults.feeRecipient = rayVault.feeRecipient;
      newDoc.vaults.dualFeeRecipient = rayVault.dualFeeRecipient;
      newDoc.vaults.feeAuthority = rayVault.feeAuthority;
      newDoc.vaults.compoundAuthority = rayVault.compoundAuthority;
      newDoc.vaults.authority = rayVault.authority;
      newDoc.vaults.precisionFactor = rayVault.precisionFactor;
      newDoc.vaults.tulipRewardPerSlot = rayVault.tulipRewardPerSlot;
      newDoc.vaults.tulipRewardEndSlot = rayVault.tulipRewardEndSlot;
      newDoc.vaults.tulipMint = rayVault.tulipMint;
      newDoc.vaults.vaultTulipTokenAccount = rayVault.vaultTulipTokenAccount;
      newDoc.vaults.oldUserInfoAccount = rayVault.oldUserInfoAccount;
      newDoc.vaults.swapRandomMarket = rayVault.swapRandomMarket;
      newDoc.vaults.associatedLedgerAccount = rayVault.associatedLedgerAccount;

      let res = await newDoc.save();
      console.log(res);
    });
  } catch (error) {
    console.error("[+] MongoDB" + error);
    process.exit(1);
  }
};

const orcaFarmsMigration = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.info(`[+] Connected to: ${DB_NAMESPACE}`);

    orca_farms.forEach(async (orcaFarm) => {
      let newDoc = new orcaData();

      newDoc.farms.name = orcaFarm.name;
      newDoc.farms.lpMintAddress = orcaFarm.lpMintAddress;
      newDoc.farms.ammId = orcaFarm.ammId;
      newDoc.farms.ammOpenOrders = orcaFarm.ammOpenOrders;
      newDoc.farms.ammQuantitiesOrTargetOrders =
        orcaFarm.ammQuantitiesOrTargetOrders;
      newDoc.farms.poolCoinTokenaccount = orcaFarm.poolCoinTokenaccount;
      newDoc.farms.poolPcTokenaccount = orcaFarm.poolPcTokenaccount;
      newDoc.farms.swapOrLiquidityProgramId = orcaFarm.swapOrLiquidityProgramId;
      newDoc.farms.ammAuthority = orcaFarm.ammAuthority;
      newDoc.farms.serumProgramId = orcaFarm.serumProgramId;
      newDoc.farms.doubleDip = orcaFarm.doubleDip;
      if (orcaFarm.index) {
        newDoc.farms.index = orcaFarm.index;
      }

      let res = await newDoc.save();
      console.log(res);
    });
  } catch (error) {
    console.error("[+] MongoDB" + error);
    process.exit(1);
  }
};

const orcaVaultsMigration = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.info(`[+] Connected to: ${DB_NAMESPACE}`);

    orca_vaults.forEach(async (orcaVault) => {
      let newDoc = new orcaData();

      newDoc.vaults.name = orcaVault.name;
      newDoc.vaults.account = orcaVault.account;
      newDoc.vaults.account_nonce = orcaVault.account_nonce;
      newDoc.vaults.user_farm_address = orcaVault.user_farm_address;
      newDoc.vaults.user_farm_nonce = orcaVault.user_farm_nonce;
      newDoc.vaults.farm_token_mint = orcaVault.farm_token_mint;
      newDoc.vaults.farm_token_account = orcaVault.farm_token_account;
      newDoc.vaults.reward_token_mint = orcaVault.reward_token_mint;
      newDoc.vaults.reward_token_account = orcaVault.reward_token_account;
      newDoc.vaults.swap_pool_token_mint = orcaVault.swap_pool_token_mint;
      newDoc.vaults.swap_pool_token_account = orcaVault.swap_pool_token_account;
      newDoc.vaults.swap_token_a_mint = orcaVault.swap_token_a_mint;
      newDoc.vaults.swap_token_a_account = orcaVault.swap_token_a_account;
      newDoc.vaults.swap_token_b_mint = orcaVault.swap_token_b_mint;
      newDoc.vaults.swap_token_b_account = orcaVault.swap_token_b_account;
      newDoc.vaults.usdc_token_account = orcaVault.usdc_token_account;
      newDoc.vaults.compound_authority = orcaVault.compound_authority;
      newDoc.vaults.pdaAccount = orcaVault.pdaAccount;
      newDoc.vaults.pda_nonce = orcaVault.pda_nonce;
      newDoc.vaults.controller_fee = orcaVault.controller_fee;
      newDoc.vaults.platform_fee = orcaVault.platform_fee;
      newDoc.vaults.farm_key = orcaVault.farm_key;
      newDoc.vaults.fee_recipient = orcaVault.fee_recipient;
      newDoc.vaults.host_fee_recipient = orcaVault.host_fee_recipient;
      newDoc.vaults.global_base_token_vault = orcaVault.global_base_token_vault;
      newDoc.vaults.global_farm = orcaVault.global_farm;
      newDoc.vaults.orca_fee_account = orcaVault.orca_fee_account;
      newDoc.vaults.global_reward_token_vault =
        orcaVault.global_reward_token_vault;
      newDoc.vaults.convert_authority = orcaVault.convert_authority;
      newDoc.vaults.serumVaultSigner = orcaVault.serumVaultSigner;

      let res = await newDoc.save();
      console.log(res);
    });
  } catch (error) {
    console.error("[+] MongoDB" + error);
    process.exit(1);
  }
};

const saberVaultsMigration = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.info(`[+] Connected to: ${DB_NAMESPACE}`);

    saber_vaults.forEach(async (saberVault) => {
      let newDoc = new saberData();

      newDoc.vaults.name = saberVault.name;
      newDoc.vaults.account = saberVault.account;
      newDoc.vaults.account_nonce = saberVault.account_nonce;
      newDoc.vaults.compound_authority = saberVault.compound_authority;
      newDoc.vaults.saber_farm_program = saberVault.saber_farm_program;
      newDoc.vaults.saber_farm_landlord = saberVault.saber_farm_landlord;
      newDoc.vaults.saber_farm_plot = saberVault.saber_farm_plot;
      newDoc.vaults.saber_farm_lp_token_mint =
        saberVault.saber_farm_lp_token_mint;
      newDoc.vaults.saber_rewards_token_mint =
        saberVault.saber_rewards_token_mint;
      newDoc.vaults.saber_coin_token_account =
        saberVault.saber_coin_token_account;
      newDoc.vaults.saber_pc_token_account = saberVault.saber_pc_token_account;
      newDoc.vaults.associated_vault_farmer_account =
        saberVault.associated_vault_farmer_account;
      newDoc.vaults.associated_vault_farmer_account_nonce =
        saberVault.associated_vault_farmer_account_nonce;
      newDoc.vaults.vault_farm_lp_token_account =
        saberVault.vault_farm_lp_token_account;
      newDoc.vaults.vault_pda_signer = saberVault.vault_pda_signer;
      newDoc.vaults.vault_pda_signer_nonce = saberVault.vault_pda_signer_nonce;
      newDoc.vaults.vault_temp_lp_token_account =
        saberVault.vault_temp_lp_token_account;
      newDoc.vaults.vault_temp_lp_token_account_nonce =
        saberVault.vault_temp_lp_token_account_nonce;
      newDoc.vaults.vault_saber_rewards_token_account =
        saberVault.vault_saber_rewards_token_account;
      newDoc.vaults.vault_saber_rewards_token_account_nonce =
        saberVault.vault_saber_rewards_token_account_nonce;
      newDoc.vaults.vault_coin_token_account =
        saberVault.vault_coin_token_account;
      newDoc.vaults.vault_coin_token_account_nonce =
        saberVault.vault_coin_token_account_nonce;
      newDoc.vaults.vault_pc_token_account = saberVault.vault_pc_token_account;
      newDoc.vaults.vault_pc_token_account_nonce =
        saberVault.vault_pc_token_account_nonce;
      newDoc.vaults.coin_token_mint = saberVault.coin_token_mint;
      newDoc.vaults.pc_token_mint = saberVault.pc_token_mint;
      newDoc.vaults.fee_recipient = saberVault.fee_recipient;
      newDoc.vaults.open_orders_account = saberVault.open_orders_account;
      newDoc.vaults.controller_fee = saberVault.controller_fee;
      newDoc.vaults.platform_fee = saberVault.platform_fee;
      newDoc.vaults.vault_fee = saberVault.vault_fee;
      newDoc.vaults.entrance_fee = saberVault.entrance_fee;
      newDoc.vaults.withdrawal_fee = saberVault.withdrawal_fee;
      newDoc.vaults.farm_key = saberVault.farm_key;
      newDoc.vaults.slippage = saberVault.slippage;
      newDoc.vaults.wrapped_usdc_associated_token_account =
        saberVault.wrapped_usdc_associated_token_account;
      newDoc.vaults.intermediary_open_orders_account =
        saberVault.intermediary_open_orders_account;
      newDoc.vaults.intermediary_swap_token_account =
        saberVault.intermediary_swap_token_account;
      newDoc.vaults.sunny_vault_account = saberVault.sunny_vault_account;
      newDoc.vaults.sunny_vault_account_nonce =
        saberVault.sunny_vault_account_nonce;
      newDoc.vaults.sunny_vault_farmer_account =
        saberVault.sunny_vault_farmer_account;
      newDoc.vaults.sunny_vault_farmer_account_nonce =
        saberVault.sunny_vault_farmer_account_nonce;
      newDoc.vaults.sunny_vault_farm_token_account =
        saberVault.sunny_vault_farm_token_account;
      newDoc.vaults.sunny_vault_lp_token_account =
        saberVault.sunny_vault_lp_token_account;
      newDoc.vaults.sunny_vault_saber_token_account =
        saberVault.sunny_vault_saber_token_account;
      newDoc.vaults.sunny_vault_farmer_lp_token_account =
        saberVault.sunny_vault_farmer_lp_token_account;
      newDoc.vaults.sunny_vault_farmer_sunny_farm_token_account =
        saberVault.sunny_vault_farmer_sunny_farm_token_account;
      newDoc.vaults.sunny_vault_miner_account =
        saberVault.sunny_vault_miner_account;
      newDoc.vaults.sunny_vault_miner_farm_token_account =
        saberVault.sunny_vault_miner_farm_token_account;
      newDoc.vaults.vault_sunny_token_account =
        saberVault.vault_sunny_token_account;
      newDoc.vaults.sunny_usdc_open_orders_account =
        saberVault.sunny_usdc_open_orders_account;
      newDoc.vaults.sunny_farm_program = saberVault.sunny_farm_program;
      newDoc.vaults.sunny_pool = saberVault.sunny_pool;
      newDoc.vaults.sunny_mine_program = saberVault.sunny_mine_program;
      newDoc.vaults.sunny_farm_mint = saberVault.sunny_farm_mint;
      newDoc.vaults.sunny_rewarder = saberVault.sunny_rewarder;
      newDoc.vaults.sunny_quarry = saberVault.sunny_quarry;
      newDoc.vaults.quarry_miner = saberVault.quarry_miner;
      newDoc.vaults.quarry_miner_vault = saberVault.quarry_miner_vault;
      newDoc.vaults.quarry = saberVault.quarry;
      newDoc.vaults.quarry_rewarder = saberVault.quarry_rewarder;

      let res = await newDoc.save();
      console.log(res);
    });
  } catch (error) {
    console.error("[+] MongoDB" + error);
    process.exit(1);
  }
};

const setRayFarmIndex = async () => {
  try {
    const RAY_FARMS = [
      {
        name: "ATLAS-USDC",
        index: 19,
        lpMintAddress: "9shGU9f1EsxAbiR567MYZ78WUiS6ZNCYbHe53WUULQ7n",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "93wRz2LeQ3TJoair827VTng62MjCzYDgJjG9Q5GmQ3Pd",
        poolAuthority: "4yrRmmckKKGsPbCSFFupGqZrJhAFxQ4hN2DMC9Bh2pHo",
        poolLpTokenAccount: "HmE21hdD32ZjDnR5DvuNz7uS5q4bWbqf8jV2shx8kXmA",
        poolRewardATokenAccount: "9iQsupP7JagNLkp1bvdWWGVkzsLFfHUwDbh9KZPoXbw5",
        poolRewardBTokenAccount: "5oQU1hU6qggyT4CU2AMPcWTcZdSRZeQBy7How5WuEp7A",
        fusion: true,
        ammId: "2bnZ1edbvK3CK3LTNZ5jH9anvXYCmzPR4W2HQ6Ngsv5K",
        ammOpenOrders: "EzYB1U93e8E1KGJdUzmnwgNBFMP9E1XAuyosmiPGLAvD",
        ammQuantitiesOrTargetOrders:
          "DVxJDo3E9zfGgvSkC2DYS5fsv5AyXA7gXpcs1fHFrP3y",
        poolCoinTokenaccount: "FpFV46UVvRtcrRvYtKYgJpJtP1tZkvssjhrLUfoj8Cvo",
        poolPcTokenaccount: "GzwX68f1ZF4dKnAJ58RdET8sPvvnYktbDEHmjoGw7Umk",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "POLIS-USDC",
        index: 21,
        lpMintAddress: "8MbKSBpyXs8fVneKgt71jfHrn5SWtX8n4wMLpiVfF9So",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "7qcihXTsRW5wS5BgK7iuD84W43ECByoJP45R3hu2r6mF",
        poolAuthority: "3MAzzKcBPJ2ykDHX1CBHzUJafy41FaTaLymg8z6SgX2Q",
        poolLpTokenAccount: "FwLD6rHMwm5H6edDPuGjxdBMk3u38frsnytTkPmVZVP3",
        poolRewardATokenAccount: "AWQr1eX2RZiMadfeEpgPEQJBJq88f7dPLK3nqriKCPJp",
        poolRewardBTokenAccount: "DfofnRgWFPHVaxaLGSdXvFGhr4TRwjdwQQvgkjNNkJfZ",
        fusion: true,
        ammId: "9xyCzsHi1wUWva7t5Z8eAvZDRmUCVhRrbaFfm3VbU4Mf",
        ammOpenOrders: "12A4SGay36i2cSwA4JSdvg7rWSmCz8JzhsoDqMM8Yns7",
        ammQuantitiesOrTargetOrders:
          "6bszsB6zxw2YowrEm26XYhh57HKQEVMRx5YMvPSSVQNh",
        poolCoinTokenaccount: "7HgvC7GdmUt7kMivdLMovLStW25avFsW9GDXgNr525Uy",
        poolPcTokenaccount: "9FknRLGpWBqYg7fXQaBDyWWdu1v2RwUM6zRV6CiPjWBD",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "ATLAS-RAY",
        index: 20,
        lpMintAddress: "418MFhkaYQtbn529wmjLLqL6uKxDz7j4eZBaV1cobkyd",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "BHHhNLdJn69K1XPJcpcw4MBY3TPetpLxhj8s4K4ydsDV",
        poolAuthority: "DjYd34HtSwwAGfTfK13onUyq975akjzfW2abaK5YTRaS",
        poolLpTokenAccount: "5RPJHt2V4baK7gY1E99xCRBtEzScuNEVPr9vA9PapLhs",
        poolRewardATokenAccount: "AQwjpEoLwnHYnsdSnzwRpSkTSeLDNYZ6tv6odVGzXJvZ",
        poolRewardBTokenAccount: "DBXQnchh5zQuiEfaE8JBPTre8G1mksVTsHXoSqRPfA3r",
        fusion: true,
        ammId: "F73euqPynBwrgcZn3fNSEneSnYasDQohPM5aZazW9hp2",
        ammOpenOrders: "2CbuxnkjsBvaQoAubc5MAmbeZSMn36z8sZnfMvZWH1vb",
        ammQuantitiesOrTargetOrders:
          "6GZrucFa9hAQW7yHiPt3oZj9GkL6oBipngyY1Hw3zMx",
        poolCoinTokenaccount: "33UaaUmmySzxK7q3yhmQiXMrW1tQrwqojyD6ZEFgM6FZ",
        poolPcTokenaccount: "9SYRTwYE5UV2cxEuRz8iiJcV8gMbMnJUYFC8zgDAsUwB",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: true,
      },
      {
        name: "POLIS-RAY",
        index: 22,
        lpMintAddress: "9ysGKUH6WqzjQEUT4dxqYCUaFNVK9QFEa24pGzjFq8xg",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "HHm8Pgnzc56fTUYkicPv4DqGYp5fcPZFV1V1uhixSrMk",
        poolAuthority: "GHPg6z7HYx1bsdK4W9WpdmV8BcjpPBBsRGMmj9dAD3yq",
        poolLpTokenAccount: "4wGbaNEGeGjqqgW5S9AAWvQL3LwWZioH1JWMZFBdPFge",
        poolRewardATokenAccount: "4xrr44aG4kkgqQPZhBre93vg5fFY2htkkEEmTQjx5hiG",
        poolRewardBTokenAccount: "EanBQNubTJs2fNgeosUcESCfBnvk6bci391U5SH4Kzoo",
        fusion: true,
        ammId: "5tho4By9RsqTF1rbm9Akiepik3kZBT7ffUzGg8bL1mD",
        ammOpenOrders: "UBa61sKev8gr19nqVyN3BZbW2jG7eAGjbjeZvpU4wu8",
        ammQuantitiesOrTargetOrders:
          "FgMtC8pDrSQJUovmnrDiRWgLGVrVSq9kui98re6uRz5i",
        poolCoinTokenaccount: "Ah9T12tzwnTXWrWVWzLmCrwCEmVHS7HMdWKG4qLUDzJP",
        poolPcTokenaccount: "J7kjQkrpafcLjL7cCpmMamxLAFnCkGApLTC2QrbHe2NQ",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: true,
      },
      {
        name: "RAY-USDT",
        index: 2,
        lpMintAddress: "C3sT1R3nsw4AVdepvLTLKr5Gvszr7jufyBWUCvy4TUvT",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        programId: "EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q",
        poolId: "AvbVWpBi2e4C9HPmZgShGdPoNydG4Yw8GJvG9HUcLgce",
        poolAuthority: "8JYVFy3pYsPSpPRsqf43KSJFnJzn83nnRLQgG88XKB8q",
        poolLpTokenAccount: "4u4AnMBHXehdpP5tbD6qzB5Q4iZmvKKR5aUr2gavG7aw",
        poolRewardATokenAccount: "HCHNuGzkqSnw9TbwpPv1gTnoqnqYepcojHw9DAToBrUj",
        poolRewardBTokenAccount: "HCHNuGzkqSnw9TbwpPv1gTnoqnqYepcojHw9DAToBrUj",
        fusion: false,
        ammId: "DVa7Qmb5ct9RCpaU7UTpSaf3GVMYz17vNVU67XpdCRut",
        ammOpenOrders: "7UF3m8hDGZ6bNnHzaT2YHrhp7A7n9qFfBj6QEpHPv5S8",
        ammQuantitiesOrTargetOrders:
          "3K2uLkKwVVPvZuMhcQAPLF8hw95somMeNwJS7vgWYrsJ",
        poolCoinTokenaccount: "3wqhzSB9avepM9xMteiZnbJw75zmTBDVmPFLTQAGcSMN",
        poolPcTokenaccount: "5GtSbKJEPaoumrDzNj4kGkgZtfDyUceKaHrPziazALC1",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "COPE-USDC",
        index: 6,
        lpMintAddress: "Cz1kUvHw98imKkrqqu95GQB9h1frY8RikxPojMwWKGXf",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "AxVvbT9fDFEkmdLwKUJRY5HsG2RXAZbe1dRAgJ2bDDwg",
        poolAuthority: "3n1Vdmqu1MBUpBYMpYbpJAVFv4MeNMEa82waruLy7BDu",
        poolLpTokenAccount: "BHLzrd5MgQy4NgmUsn542yXRZWkz1iV5bfWg8s8D4tVL",
        poolRewardATokenAccount: "7nGY6xHCUR2MxJnHT1qvArRUEnpo2DsGGf6Pdu3tt9gv",
        poolRewardBTokenAccount: "6ezx1EivkxsJcZLYhSJFLc3nUs25iyubf8PPyRNEX3pL",
        fusion: true,
        ammId: "DiWxV1SPXPNJRCt5Ao1mJRAxjw97hJVyj8qGzZwFbAFb",
        ammOpenOrders: "jg8ayFZLH2cEUJULUirWy7wNggN1eyRnTMt6EjbJUun",
        ammQuantitiesOrTargetOrders:
          "8pE4fzFzRT6aje7B3hYHXrZakeEqNF2kFmJtxkrxUK9b",
        poolCoinTokenaccount: "FhjBg8vpVgsiW9oCUxujqoWWSPSRvnWNXucEF1G1F39Z",
        poolPcTokenaccount: "Dv95skm7AUr33x1p2Bu5EgvE3usB1TxgZoxjBe2rpfm6",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "RAY-USDC",
        index: 0,
        lpMintAddress: "FbC6K13MzHvN42bXrtGaWsvZY9fxrackRSZcBGfjPc7m",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        programId: "EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q",
        poolId: "CHYrUBX2RKX8iBg7gYTkccoGNBzP44LdaazMHCLcdEgS",
        poolAuthority: "5KQFnDd33J5NaMC9hQ64P5XzaaSz8Pt7NBCkZFYn1po",
        poolLpTokenAccount: "BNnXLFGva3K8ACruAc1gaP49NCbLkyE6xWhGV4G2HLrs",
        poolRewardATokenAccount: "DpRueBHHhrQNvrjZX7CwGitJDJ8eZc3AHcyFMG4LqCQR",
        poolRewardBTokenAccount: "DpRueBHHhrQNvrjZX7CwGitJDJ8eZc3AHcyFMG4LqCQR",
        fusion: false,
        ammId: "6UmmUiYoBjSrhakAobJw8BvkmJtDVxaeBtbt7rxWo1mg",
        ammOpenOrders: "J8u8nTHYtvudyqwLrXZboziN95LpaHFHpd97Jm5vtbkW",
        ammQuantitiesOrTargetOrders:
          "3cji8XW5uhtsA757vELVFAeJpskyHwbnTSceMFY5GjVT",
        poolCoinTokenaccount: "FdmKUE4UMiJYFK5ogCngHzShuVKrFXBamPWcewDr31th",
        poolPcTokenaccount: "Eqrhxd7bDUCH3MepKmdVkgwazXRzY6iHhEoBpY7yAohk",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "RAY-SRM",
        index: 3,
        lpMintAddress: "7P5Thr9Egi2rvMmEuQkLn8x8e8Qro7u2U7yLD2tU2Hbe",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        programId: "EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q",
        poolId: "5DFbcYNLLy5SJiBpCCDzNSs7cWCsUbYnCkLXzcPQiKnR",
        poolAuthority: "DdFXxCbn5vpxPRaGmurmefCTTSUa5XZ9Kh6Noc4bvrU9",
        poolLpTokenAccount: "792c58UHPPuLJcYZ6nawcD5F5NQXGbBos9ZGczTrLSdb",
        poolRewardATokenAccount: "5ihtMmeTAx3kdf459Yt3bqos5zDe4WBBcSZSB6ooNxLt",
        poolRewardBTokenAccount: "5ihtMmeTAx3kdf459Yt3bqos5zDe4WBBcSZSB6ooNxLt",
        fusion: false,
        ammId: "GaqgfieVmnmY4ZsZHHA6L5RSVzCGL3sKx4UgHBaYNy8m",
        ammOpenOrders: "7XWbMpdyGM5Aesaedh6V653wPYpEswA864sBvodGgWDp",
        ammQuantitiesOrTargetOrders:
          "9u8bbHv7DnEbVRXmptz3LxrJsryY1xHqGvXLpgm9s5Ng",
        poolCoinTokenaccount: "3FqQ8p72N85USJStyttaohu1EBsTsEZQ9tVqwcPWcuSz",
        poolPcTokenaccount: "384kWWf2Km56EReGvmtCKVo1BBmmt2SwiEizjhwpCmrN",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "RAY-SOL",
        index: 1,
        lpMintAddress: "89ZKE4aoyfLBe2RuV6jM3JGNhaV18Nxh8eNtjRcndBip",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        programId: "EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q",
        poolId: "HUDr9BDaAGqi37xbQHzxCyXvfMCKPTPNF8g9c9bPu1Fu",
        poolAuthority: "9VbmvaaPeNAke2MAL3h2Fw82VubH1tBCzwBzaWybGKiG",
        poolLpTokenAccount: "A4xQv2BQPB1WxsjiCC7tcMH7zUq255uCBkevFj8qSCyJ",
        poolRewardATokenAccount: "6zA5RAQYgazm4dniS8AigjGFtRi4xneqjL7ehrSqCmhr",
        poolRewardBTokenAccount: "6zA5RAQYgazm4dniS8AigjGFtRi4xneqjL7ehrSqCmhr",
        fusion: false,
        ammId: "AVs9TA4nWDzfPJE9gGVNJMVhcQy3V9PGazuz33BfG2RA",
        ammOpenOrders: "6Su6Ea97dBxecd5W92KcVvv6SzCurE2BXGgFe9LNGMpE",
        ammQuantitiesOrTargetOrders:
          "5hATcCfvhVwAjNExvrg8rRkXmYyksHhVajWLa46iRsmE",
        poolCoinTokenaccount: "Em6rHi68trYgBFyJ5261A2nhwuQWfLcirgzZZYoRcrkX",
        poolPcTokenaccount: "3mEFzHsJyu2Cpjrz6zPmTzP7uoLFj9SbbecGVzzkL1mJ",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "RAY-ETH",
        index: 7,
        lpMintAddress: "mjQH33MqZv5aKAbKHi8dG3g3qXeRQqq1GFcXceZkNSr",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        programId: "EhhTKczWMGQt46ynNeRX1WfeagwwJd7ufHvCDjRxjo5Q",
        poolId: "B6fbnZZ7sbKHR18ffEDD5Nncgp54iKN1GbCgjTRdqhS1",
        poolAuthority: "6amoZ7YBbsz3uUUbkeEH4vDTNwjvgjxTiu6nGi9z1JGe",
        poolLpTokenAccount: "BjAfXpHTHz2kipraNddS6WwQvGGtbvyobn7MxLEEYfrH",
        poolRewardATokenAccount: "7YfTgYQFGEJ4kb8jCF8cBrrUwEFskLin3EbvE1crqiQh",
        poolRewardBTokenAccount: "7YfTgYQFGEJ4kb8jCF8cBrrUwEFskLin3EbvE1crqiQh",
        fusion: false,
        ammId: "8iQFhWyceGREsWnLM8NkG9GC8DvZunGZyMzuyUScgkMK",
        ammOpenOrders: "7iztHknuo7FAXVrrpAjsHBEEjRTaNH4b3hecVApQnSwN",
        ammQuantitiesOrTargetOrders:
          "JChSqhn6yyEWqD95t8UR5DaZZtEZ1RGGjdwgMc8S6UUt",
        poolCoinTokenaccount: "G3Szi8fUqxfZjZoNx17kQbxeMTyXt2ieRvju4f3eJt9j",
        poolPcTokenaccount: "7MgaPPNa7ySdu5XV7ik29Xoav4qcDk4wznXZ2Muq9MnT",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "ALEPH-USDC",
        index: 10,
        lpMintAddress: "iUDasAP2nXm5wvTukAHEKSdSXn8vQkRtaiShs9ceGB7",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "CsZ5LZkDS7h9TDKjrbL7VAwQZ9nsRu8vJLhRYfmGaN8K",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "JAP8SFagJBm6vt2LoFGNeSJ1hKDZ2p3yXb3CvBx11How",
        poolAuthority: "DVtR63sAnJPM9wdt1hYBqA5GTyFzjfcfdLTfsSzV85Ss",
        poolLpTokenAccount: "feCzxSvVX4EboJV4cubjqoPTK41noaHUanz8ZNJmiBp",
        poolRewardATokenAccount: "4mAhgUY8XGMY4743wuzVbLw7d5bqqTaxME8jmbC2YfH4",
        poolRewardBTokenAccount: "3sGDa8ir8GrkKbnBH6HP63JaYSs7nskmmVHpF2vuzaZr",
        fusion: true,
        ammId: "GDHXjn9wF2zxW35DBkCegWQdoTfFBC9LXt7D5ovJxQ5B",
        ammOpenOrders: "AtUeUK7MZayoDktjrRSJAFsyPiPwPsbAeTsunM5pSnnK",
        ammQuantitiesOrTargetOrders:
          "FMYSGYEL1CPYz8cpgAor5jV2HqeEQRDLMEggoz6wAiFV",
        poolCoinTokenaccount: "BT3QMKHrha4fhqpisnYKaPDsv42XeHU2Aovhdu5Bazru",
        poolPcTokenaccount: "9L4tXPyuwuLhmtmX4yaRTK6TB7tYFNHupeENoCdPceq",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "TULIP-USDC",
        index: 11,
        lpMintAddress: "2doeZGLJyACtaG9DCUyqMLtswesfje1hjNA11hMdj6YU",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "7U8Z6TWQMtsMcHV2htALnF9VQonnD1MrVm17YtmGEGEw",
        poolAuthority: "9ZVNLEiBZ2u23P7rEJf5sXY7TZK723cmVs46pBRSbRnU",
        poolLpTokenAccount: "B6xn6doS3Qfy1LJLbdcJa5MpJ4po2bgut1rKFvmmq6Ut",
        poolRewardATokenAccount: "GtPTgCr6nXiogRCWqGvLa8P6dJgZpHfAX3KxGMpxnGMJ",
        poolRewardBTokenAccount: "8qgijAifBGx2EAJ7zKAzk6z7dVpcDV9eHvTBwofmdTP5",
        fusion: true,
        ammId: "96hPvuJ3SRT82m7BAc7G1AUVPVcoj8DABAa5gT7wjgzX",
        ammOpenOrders: "6GtSWZfdUFtT47RPk2oSxoB6RbNkp9aM6yP77jB4XmZB",
        ammQuantitiesOrTargetOrders:
          "9mB928abAihkhqM6AKLMW4cZkHBXFn2TmcxEKhTqs6Yr",
        poolCoinTokenaccount: "s9Xp7GV1jGvixdSfY6wPgivsTd3c4TzjW1eJGyojwV4",
        poolPcTokenaccount: "wcyW58QFNfppgm4Wi7cKhSftdVNfpLdn67YvvCNMWrt",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "LIKE-USDC",
        index: 16,
        lpMintAddress: "cjZmbt8sJgaoyWYUttomAu5LJYU44ZrcKTbzTSEPDVw",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "3bRTivrVsitbmCTGtqwp7hxXPsybkjn4XLNtPsHqa3zR",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "BRM5bdX2mjmFGg2RAent1Whd61o9asQD16BXsC6QvEni",
        poolAuthority: "9rThpjxEgNR5xi2z2QgXenS2RwRrrN1GqrudegT32Ygy",
        poolLpTokenAccount: "FzVu8n4UCf3o1KH4X8khM9KgKA96dJQdQMPtLvmbHyNi",
        poolRewardATokenAccount: "3G1cbktUU79CT3zskP16VYmEhwVQq2RYxVWV7fcjmkTX",
        poolRewardBTokenAccount: "2Ks41qfN2GZffbd1cqrNGuXJYJbShHhz6aHQvq8SaYYr",
        fusion: true,
        ammId: "GmaDNMWsTYWjaXVBjJTHNmCWAKU6cn5hhtWWYEZt4odo",
        ammOpenOrders: "Crn5beRFeyj4Xw13E2wdJ9YkkLLEZzKYmtTV4LFDx3MN",
        ammQuantitiesOrTargetOrders:
          "7XjS6MrvBRi9JeFWBMAYPaKhKgR3b7xnVdYDBkFb4CXR",
        poolCoinTokenaccount: "8LoHX6f6bMdQVs4mThoH2KwX2dQDSkqVFADi4ZjDQv9T",
        poolPcTokenaccount: "2Fwm8M8vuPXEXxvKz98VdawDxsK9W8uRuJyJhvtRdhid",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "SLRS-USDC",
        index: 14,
        lpMintAddress: "2Xxbm1hdv5wPeen5ponDSMT3VqhGMTQ7mH9stNXm9shU",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "SLRSSpSLUTP7okbCUBYStWCo1vUgyt775faPqz8HUMr",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "5PVVwSqwzkCvuiKEZwWkM35ApBnoWqF8XopsVZjPwA8z",
        poolAuthority: "7jNUxDiLLyke8ECShavvPPQz4D1abj4aCZwQfZ3TCTAX",
        poolLpTokenAccount: "HTr2pYDBQZP13YTzLdsPzmh6e4hsNeqoGy3B777ejqTT",
        poolRewardATokenAccount: "Ef1tQ2E2Fe92xPVpQGzZFHmT7g7dh2hzVfWYVJJQPdbu",
        poolRewardBTokenAccount: "Ffmv9Ximzk8D9oKwHkkgdq9cVxv5P5Y9LxEJdu1N1jSJ",
        fusion: true,
        ammId: "7XXKU8oGDbeGrkPyK5yHKzdsrMJtB7J2TMugjbrXEhB5",
        ammOpenOrders: "3wNRVMaot3R2piZkzmKsAqewcZ5ABktqrJZrc4Vz3uWs",
        ammQuantitiesOrTargetOrders:
          "BwSmQF7nxRqzzVdfaynxM98dNbXFi94cemDDtxMfV3SB",
        poolCoinTokenaccount: "6vjnbp6vhw4RxNqN3e2tfE3VnkbCx8RCLt8RBmHZvuoC",
        poolPcTokenaccount: "2anKifuiizorX69zWQddupMqawGfk3TMPGZs4t7ZZk43",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "SAMO-RAY",
        index: 36,
        lpMintAddress: "HwzkXyX8B45LsaHXwY8su92NoRBS5GQC32HzjQRDqPnr",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "Bw932pURVJRYjEJwRZGWjfUNpeyz18kjMNdb833eMxoj",
        poolAuthority: "FzTbGLdzgWCRkq8hbS8tLf5HjfU7JzUbtRmTkjGQB9Vz",
        poolLpTokenAccount: "GUVKfYMiGEyp41CUw2j2NsoQJ5zDQ3Q6uSdApM8W46Ba",
        poolRewardATokenAccount: "J99YW5wnfgBJcG17BgSbp1S8RNJ39JAb7kg9RGHyb3Hq",
        poolRewardBTokenAccount: "GhctEMRSwvdZF7aFeCLdK9X1sAAeGVPjr12iVLjQNvhy",
        fusion: true,
        ammId: "EyDgEU9BdG7m6ZK4bYERxbN4NCJ129WzPtv23dBkfsLg",
        ammOpenOrders: "45TD9SmkGoq4hBxBnsQQD2V7pyWK53HkEXz7uNNHpezG",
        ammQuantitiesOrTargetOrders:
          "Ave8ozwW9iBGL4SpK1tM1RfrQi8CsLUFj4UGdFkWRPRp",
        poolCoinTokenaccount: "9RFqA8EbTTqH3ct1fTGiGgqFAg2hziUdtyGgg1w69LJP",
        poolPcTokenaccount: "ArAyYYib2X8BTcURYNXKhfoUww2DWkzk67PRPGVpFAuJ",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: true,
      },

      {
        name: "whETH-SOL",
        index: 40,
        lpMintAddress: "3hbozt2Por7bcrGod8N7kEeJNMocFFjCJrQR16TQGBrE",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "Gi3Z6TXeH1ZhCCbwg6oJL8SE4LcmxmGRNhhfA6NZhwTK",
        poolAuthority: "HoUqzaqKTueo1DMcVcTUgnc79uoiF5nRoD2iNGrVhkei",
        poolLpTokenAccount: "9cTdfPLSkauS8Ys848Wz4pjfFvQjsmJpVTUnYXffkubb",
        poolRewardATokenAccount: "2MMFGZGEjQRovNeNtj1xN9redsVLYTMVcXzFTLQCw6ue",
        poolRewardBTokenAccount: "6DhjnWKLbxnDSFZApaVJXCY2wbzgt2mYhvW3yBreaYsY",
        fusion: true,
        ammId: "4yrHms7ekgTBgJg77zJ33TsWrraqHsCXDtuSZqUsuGHb",
        ammOpenOrders: "FBU5FSjYeEZTbbLAjPCfkcDKJpAKtHVQUwL6zDgnNGRF",
        ammQuantitiesOrTargetOrders:
          "2KjKkci5zpGa6orKCu3ov4eFSB2aLR2ZdAYvVnaJxJjd",
        poolCoinTokenaccount: "5ushog8nHpHmYVJVfEs3NXqPJpne21sVZNuK3vqm8Gdg",
        poolPcTokenaccount: "CWGyCCMC7xmWJZgAynhfAG7vSdYoJcmh27FMwVPsGuq5",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: true,
      },
      {
        name: "whETH-USDC",
        index: 39,
        lpMintAddress: "3529SBnMCDW3S3xQ52aABbRHo7PcHvpQA4no8J12L5eK",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "8JJSdD1ca5SDtGCEm3yBbQKek2FvJ1EbNt9q2ET3E9Jt",
        poolAuthority: "DBoKA7VTfnQDj7knPTrZcg6KKs5WhsKsVRFVjBsjyobs",
        poolLpTokenAccount: "2ucKrVxYYCfWC6yRk3R7fRbQ5Mjz81ciEgS451TGq2hg",
        poolRewardATokenAccount: "3nhoDqudHBBedE9CuUqnydrWWiMFLKcZf3Ydc9zbAFet",
        poolRewardBTokenAccount: "B4LA1grBYY9CE3W8sG9asR7Pi2a6eSt2A8RHcXXKJ1UM",
        fusion: true,
        ammId: "EoNrn8iUhwgJySD1pHu8Qxm5gSQqLK3za4m8xzD2RuEb",
        ammOpenOrders: "6iwDsRGaQucEcfXX8TgDW1eyTfxLAGrypxdMJ5uqoYcp",
        ammQuantitiesOrTargetOrders:
          "EGZL5PtEnSHrNmeoQF64wXG6b5oqiTArDvAQuSRyomX5",
        poolCoinTokenaccount: "DVWRhoXKCoRbvC5QUeTECRNyUSU1gwUM48dBMDSZ88U",
        poolPcTokenaccount: "HftKFJJcUTu6xYcS75cDkm3y8HEkGgutcbGsdREDWdMr",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "weUNI-USDC",
        index: 42,
        lpMintAddress: "EEC4QnT41py39QaYnzQnoYQEtDUDNa6Se8SBDgfPSN2a",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "6X495xkPWkw9SQFYf7yL1K8QooZyaeEQ6u7yMWNNZxNV",
        poolAuthority: "7fzrABKta6exUaLZPgvmCrMYc81qgAdzVBtQyVa5ia7Y",
        poolLpTokenAccount: "4wnWp8ywmCD9D1A4BuLLaJKZQx7FMvs2S97gJnyqsU8w",
        poolRewardATokenAccount: "EDDGwRv5aBFQu9fxK75USg2FD38N5QQPQTMGQLRnf1jA",
        poolRewardBTokenAccount: "4PvsqG7KkkeqiZYZx6UijATDU7B8FbXxyMNnKmgcQHqH",
        fusion: true,
        ammId: "8J5fa8WBGaDSv8AUpgtqdh9HM5AZuSf2ijvSkKoaCXCi",
        ammOpenOrders: "4s8QacM13Z9Vf9en2DyM3EhKbekwnmYQTvd2RDjWAsee",
        ammQuantitiesOrTargetOrders:
          "FDNvqhZiUkWwo95Q21gNimdqFQDJb5nqqttPT5uCUmBe",
        poolCoinTokenaccount: "B5S6r6DBFgB8nxa8P7FnTwps7NAiTsFbiM6Xo7KrGtxP",
        poolPcTokenaccount: "DBd8RZyBi3rdrpbXxXdcmWuTTrfkA5vfPh9HDLo1cHS",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "weSUSHI-USDC",
        index: 41,
        lpMintAddress: "3wVrtQZsiDNp5yTPyfEzQHPU6iuJoMmpnWg6CTt4V8sR",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "AuyqPBiY6sNUpH6jx415NGcdvNdYbkbYsyVabUqEVdkj",
        poolAuthority: "AmgTDN5yBjjbCG5o1CtpxB7hxpaQtHCj1GYMFtQud7TJ",
        poolLpTokenAccount: "DoK13McBSoFb9Q37DqVkx5LiJTpYqhM2NUv4go1DJ5RF",
        poolRewardATokenAccount: "FBbe6XRrXeaQ3XcXWk2tUi711HBrmmi2eLdX2L6DJ8SZ",
        poolRewardBTokenAccount: "2YsF3Nvw4ZaTUNqbvaGr8UzrvnoWFB343s1tFRjvM1pE",
        fusion: true,
        ammId: "9SWy6nbSVZ44XuixEvHpona663pZPpVgzXQ3N7muG4ou",
        ammOpenOrders: "4dDzSb5sVQuQU7JpiELNLukEUVYoTNyhwrfTd59L3HTK",
        ammQuantitiesOrTargetOrders:
          "4soQgpB1MhYjnD2cbo3aRinZh9muAAgBhTk6gLYSG4hM",
        poolCoinTokenaccount: "CTTAtNw3TPxMhZVcrxHPjbyqEfYS7ShAf6KafC4xeJj",
        poolPcTokenaccount: "EPav47MmuNRnHdiRSNpRZq9fPAvpvGb81mWfQ4TMc4VQ",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "SRM-USDC",
        index: 38,
        lpMintAddress: "9XnZd82j34KxNLgQfz29jGbYdxsYznTWRpvZE3SRE7JG",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "27bysJaX5eu5Urb5kftR66otiVc6DKK7TnifKwnpNzYu",
        poolAuthority: "HAWwtFc4MFNSXFyQbUZd2GefSwZLntCiumt1D6XM8jfk",
        poolLpTokenAccount: "HVEm5BG4jMHtwgrUtuiC9K17bjp9CjFpgqmzVABmzLxr",
        poolRewardATokenAccount: "9gs6XnKs3RMMSSQAZm3VCbRpoNmPMrGaQQGMmRKjPeSU",
        poolRewardBTokenAccount: "BsuQ3XCCapopam8byEzHzazyxcRn5dCT3UX9kUzozhw",
        fusion: true,
        ammId: "8tzS7SkUZyHPQY7gLqsMCXZ5EDCgjESUHcB17tiR1h3Z",
        ammOpenOrders: "GJwrRrNeeQKY2eGzuXGc3KBrBftYbidCYhmA6AZj2Zur",
        ammQuantitiesOrTargetOrders:
          "26LLpo8rscCpMxyAnJsqhqESPnzjMGiFdmXA4eF2Jrk5",
        poolCoinTokenaccount: "zuLDJ5SEe76L3bpFp2Sm9qTTe5vpJL3gdQFT5At5xXG",
        poolPcTokenaccount: "4usvfgPDwXBX2ySX11ubTvJ3pvJHbGEW2ytpDGCSv5cw",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "mSOL-USDC",
        index: 31,
        lpMintAddress: "4xTpJ4p76bAeggXoYywpCCNKfJspbuRzZ79R7pRhbqSf",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "DjtZxyFBgifzpaZEzfsWXogNX5zUCnTRXJqarGe9CiSv",
        poolAuthority: "AcTRjdD3x4ZHzKGaApVo2RdJ7Rm7f2kaheCiDEjSr1xe",
        poolLpTokenAccount: "HUM5nLWT94iRQRQ7GSsjJ1DDWqWKhKfdGQCJCf7SypeD",
        poolRewardATokenAccount: "A5W9spnyknywKui1vudnxUomdnebrZVUnjKW6BHgUdyz",
        poolRewardBTokenAccount: "JE9PvgvXMnVfBkCdwJU4id1w2BaxTuxheKKFdBfRiJZi",
        fusion: true,
        ammId: "ZfvDXXUhZDzDVsapffUyXHj9ByCoPjP4thL6YXcZ9ix",
        ammOpenOrders: "4zoatXFjMSirW2niUNhekxqeEZujjC1oioKCEJQMLeWF",
        ammQuantitiesOrTargetOrders:
          "Kq9Vgb8ntBzZy5doEER2p4Zpt8SqW2GqJgY5BgWRjDn",
        poolCoinTokenaccount: "8JUjWjAyXTMB4ZXcV7nk3p6Gg1fWAAoSck7xekuyADKL",
        poolPcTokenaccount: "DaXyxj42ZDrp3mjrL9pYjPNyBp5P8A2f37am4Kd4EyrK",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "mSOL-RAY",
        index: 35,
        lpMintAddress: "De2EHBAdkgfc72DpShqDGG42cV3iDWh8wvvZdPsiEcqP",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "7wNhbTS6XQczXs52wcVmfiodRMPfycB3YaG52dWWY6SD",
        poolAuthority: "2MbHFiv8H2jjJboqWCaEY1iQh7WFQEwbqNQMYqXUre1p",
        poolLpTokenAccount: "4vyJYQyWusNxCCyFDvWwzjVZFJByAVudWvuTzgHYzwTY",
        poolRewardATokenAccount: "Erz6ai92ieTAqWKHP1tkpGgBKrUJsKe7dhCUyhqtjKRv",
        poolRewardBTokenAccount: "Ejed9odWtRtNrSndDnrWvu9LaiqCANbkeKHTS3g3H1Xj",
        fusion: true,
        ammId: "6gpZ9JkLoYvpA5cwdyPZFsDw6tkbPyyXM5FqRqHxMCny",
        ammOpenOrders: "HDsF9Mp9w3Pc8ZqQJw3NBvtC795NuWENPmTed1YVz5a3",
        ammQuantitiesOrTargetOrders:
          "68g1uhKVVLFG1Aua1BKtCx3uiwPixue1qqbKDJAc32Uo",
        poolCoinTokenaccount: "BusJVbHEkJeYRpHkqCrt85d1LALS1EVcKRjqRFZtBSty",
        poolPcTokenaccount: "GM1CjxKixFkKpakxx5Lg9u3zYjXAK2Gr2pzoy1G88Td5",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: true,
      },
      {
        name: "mSOL-USDT",
        index: 32,
        lpMintAddress: "69NCmEW9mGpiWLjAcAWHq51k4ionJZmzgRfRT3wQaCCf",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "HxhxYASqdLcR6yehT9hB9HUpgcF1R2t9HtkHdngGZ2Dh",
        poolAuthority: "FGJKdv7Wm1j75cBsj7FsZU256fhDSYVTwYkzFQ3sVQqg",
        poolLpTokenAccount: "CxY6pDZxPr8VAArC427NQficTpKEm3VxTVZEZQdQFexZ",
        poolRewardATokenAccount: "94zGzNAzv2xU8YW3uHYkiysjG9Qw2gCv7wx9tye1uYbE",
        poolRewardBTokenAccount: "8mJzCGURgpUDLnB3qaSQt3xyM7MEKpPcvzXxWTGCQbTb",
        fusion: true,
        ammId: "BhuMVCzwFVZMSuc1kBbdcAnXwFg9p4HJp7A9ddwYjsaF",
        ammOpenOrders: "67xxC7oyzGFMVX8AaAHqcT3UWpPt4fMsHuoHrHvauhog",
        ammQuantitiesOrTargetOrders:
          "HrNUwbZF4NPRSdZ9hwD7EWV1cwQoJ9Yhu9Jf7ybXALpe",
        poolCoinTokenaccount: "FaoMKkKzMDQaURce1VLewT6K38F6FQS5UQXD1mTXJ2Cb",
        poolPcTokenaccount: "GE8m3rHHejrNf4jE96n5gzMmLbxTfPPcmv9Ppaw24FZa",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "ETH-mSOL",
        index: 33,
        lpMintAddress: "HYv3grQfi8QbV7nG7EFgNK1aJSrsJ7HynXJKJVPLL2Uh",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "54vUWjEmg9wfCsZF7wwq2HJu5BU3cfDFAQQQgXPECcwE",
        poolAuthority: "E4VNit9T28vRtiLv8e5o7HgVNs7frULkViYBpUjj6pTS",
        poolLpTokenAccount: "3vgFo13L14woTPNC249BFgwHMAAajfhjUbvDLSKDnBtP",
        poolRewardATokenAccount: "YVQYnEoLYv7d7JEGPLSSkmxpwVCdWjzA4kdeoag78kd",
        poolRewardBTokenAccount: "6pMVuiTtFSmzEPWzoUdQiQxcdEED5Z1jTakvQBHiGCcU",
        fusion: true,
        ammId: "Ghj3v2qYbSp6XqmH4NV4KRu4Rrgqoh2Ra7L9jEdsbNzF",
        ammOpenOrders: "ABPcKmxjrGqSCQCvTBtjpRwLD7DJNmfhXsr6ADhjiLDZ",
        ammQuantitiesOrTargetOrders:
          "7ATMf6E5StLSAtPYMoLTgZoAzmmXmii5CC6f5HYCjdKn",
        poolCoinTokenaccount: "8jRAjkPkVLeBwA4BgTvS43irS8HPmBKXmqU6WonpdkxT",
        poolPcTokenaccount: "EiuYikutCLtq1WDsinnZfXREM1vchgH5ruRJTNDYHA7b",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "BTC-mSOL",
        index: 34,
        lpMintAddress: "92bcERNtUmuaJ6mwLSxYHZYSph37jdKxRdoYNxpcYNPp",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "914jyHBQFiroKFVCpKkzjGSaZyr4gMwgxE7snbNfGjnL",
        poolAuthority: "Gb17eJ4TK95SXPduUuh5YFJH4iz73qNFHmrqFBn1Tv9R",
        poolLpTokenAccount: "GYNDinXxGR5zsNn6bDWAidWFKT1JMQbyneuzPGosUDR7",
        poolRewardATokenAccount: "HVAxutFAei62E2Wn1eueYCrCPCCMrkho3xq6NyzW9hQA",
        poolRewardBTokenAccount: "7GbsEKskWjK9S4B3CayAGj2uL8v48u5RXZN7eSGWHABZ",
        fusion: true,
        ammId: "ynV2H2b7FcRBho2TvE25Zc4gDeuu2N45rUw9DuJYjJ9",
        ammOpenOrders: "FD7fCGepsCf3bBWF4EmPHuKCNuE9UmqqTHVsAsQSKv6b",
        ammQuantitiesOrTargetOrders:
          "HBpTcRToBmQKWTwCHgziFhoRkzzEdXEyAAqHoTLpyMXg",
        poolCoinTokenaccount: "CXmwnKYkXebSbiFdNa2AVF34iRQPaf6jecyLWkEra6Dd",
        poolPcTokenaccount: "GtdKqFoUtHC8vH1rMZvW2eVqqFa3vRphqkNCviog4LAK",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "STARS-USDC",
        index: 43,
        lpMintAddress: "FJ68q7NChhETcGVdinMbM2FF1Cy79dpmUi6HC83K55Hv",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "HCgybxq5Upy8Mccihrp7EsmwwFqYZtrHrsmsKwtGXLgW",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "AwUDfg4NYbLQRAcFipoJwyZTpqNvw5v6C7EypryL12Y6",
        poolAuthority: "BBsHoRKkRGyyjsQEDqMMjg4vNNbZhWhsjBE9vQc15obQ",
        poolLpTokenAccount: "H5VXBm5Es85jhLN5VyePC95KCx4FyUDC9apq7ksvzBgK",
        poolRewardATokenAccount: "5DsNCnLyZm3B8iVACCWPvXs2WXfmfuA4uiRinJJuEZgz",
        poolRewardBTokenAccount: "2LQWPUn6rxYrzW1oPM48ddXmWLJQTQ8P6UrJnE9ZCSy2",
        fusion: true,
        ammId: "CWQVga1qUbpZXjrWQRj6U6tmL3HhrFiAT11VYnB8d3CF",
        ammOpenOrders: "D3bJNYcUhza55mdGFTAUi4CLE12f54qzMcPmawoBCNLc",
        ammQuantitiesOrTargetOrders:
          "FNjcSQ7VB7ULoSU7BDTotiRDmqiQj7CvVxHALnYC5JGP",
        poolCoinTokenaccount: "5NtsnqVNXGmxs6zEU73W2RaFh4e58gqdWrxMvzcqNxGk",
        poolPcTokenaccount: "MZihwPviJgm5WjHDmh6c5pq1tTipuZnHFN3KBg63Mtj",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "weDYDX-USDC",
        index: 44,
        lpMintAddress: "BjkkMZnnzmgLqzGErzDbkk15ozv48iVKQuunpeM2Hqnk",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "C8BjS9DGDvC2zS3n6fTvm1rjPbA33uZ7CAvEUZ3tg7aM",
        poolAuthority: "8sW8go8eeyn9tCJEndchQ4RKfTkZGMDwKdNw9QVCpgys",
        poolLpTokenAccount: "vZUipizkaYcEa6fUBjtQU7A1dG8XmBgt6dCDFe16HyU",
        poolRewardATokenAccount: "ATLtTWi5ongWbMqbHFrAiMD11dRPgDWyJLzc7tZTcnjK",
        poolRewardBTokenAccount: "CmW8akq2vGQeDUD1yeZTRbje21p5D61PW2mXK4kMBwo6",
        fusion: true,
        ammId: "CbGQojcizFEHn3woL7NPu3P9BLL1SWz5a8zkL9gks24q",
        ammOpenOrders: "75hTsLMn57111C8JwG9uqrkw6iZsFtyU8CYQYSzM2CY8",
        ammQuantitiesOrTargetOrders:
          "3pbY7NyETK3UBG1yvaFjqeYPLXMd2wHgcZVJi9LZVdx1",
        poolCoinTokenaccount: "45pPLPHYUJ7ainr9eqPzdKcWJSbGuoUwcMcMamAXgcCX",
        poolPcTokenaccount: "7aE4zihDvU58Uua8W82Q2u915rKqzpmpWPxZSDdeXrwu",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "CAVE-USDC",
        index: 48,
        lpMintAddress: "5Gba1k3fU7Vh7UtAiBmie9vhQNNq1JfEwgn1DPGZ7NKQ",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "4SZjjNABoqhbd4hnapbvoEPEqT8mnNkfbEoAwALf1V8t",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "FDnxy4NkJVG3GNMMrtUZmUmoYeYE34YRDwCYTi1yBTM",
        poolAuthority: "DadRztERbxMwvTzwnwst5VjVZCMJ3zL5J7ngvKWpvJoF",
        poolLpTokenAccount: "6cxqxAYhLXzgYMBZC38xjY3b2sFux9TvLZejR5Vx7khc",
        poolRewardATokenAccount: "8yCUztutwnW9FHfJTfsAZdJZ8j77G1CoCkTVdsRDtt7f",
        poolRewardBTokenAccount: "49Y2DDJqjYFQHSgN1Zf2SUr7ktBrhyZooLPrdDe8xFwM",
        fusion: true,
        ammId: "2PfKnjEfoUoVDbDS1YwvZ8HuPGBCpN831mnTuqTAJZjH",
        ammOpenOrders: "ECG1LTHELj27wyKVz4DPCKdFB8mthqEwbnPeuUzkgz2H",
        ammQuantitiesOrTargetOrders:
          "H4vuXiWxuKLec3TLrZk3QgJMsLH4Y2L6E9LosnefFMyR",
        poolCoinTokenaccount: "B1SCcyk4AqQcn6RY7Qjqj8rE53DDZ7N2eiqtMNcmfZxa",
        poolPcTokenaccount: "2HUjTaYw3mmU6kRA3ZfC4MGSzUhr2H6ZUQCWWdrfwUB6",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "GENE-USDC",
        index: 45,
        lpMintAddress: "7GKvfHEXenNiWYbJBKae89mdaMPr5gGMYwZmyC8gBNVG",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "GENEtH5amGSi8kHAtQoezp1XEXwZJ8vcuePYnXdKrMYz",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "DDRNVVJBEXEemcprVVUcrTbYnR88JyN6jjT2ypgAQHC8",
        poolAuthority: "9sdefPmehyrWqBPfn34PFcuKPYoxZ8Uy6g3436qr6jXk",
        poolLpTokenAccount: "DAfAJVWGbZpLn7Tahwc9LuVukMKB5JSVQjdHRwXk44GV",
        poolRewardATokenAccount: "tMh3bpXh2GaFLK2Buzav7niYAS81m7RigkhRn7p4wga",
        poolRewardBTokenAccount: "JBi2SsBHGN969aGLpQxCLaRYaBa6U7LPShPYe23Je7oQ",
        fusion: true,
        ammId: "Enq8vJucRbkzKA1i1PahJNhMyUTzoVL5Cs8n5rC3NLGn",
        ammOpenOrders: "7dcfFNqaGnHrUB1bg1mEbvJsvsvfn7oamkpjDdt7ykUm",
        ammQuantitiesOrTargetOrders:
          "FrJ5aM3Vi1DyxNfSbqq4vPYX3S9kH9foWMjqHjHGQq3E",
        poolCoinTokenaccount: "6yxszHV62pCjHtGijwgroqRXGVLuoiHUFhcEoHQepB91",
        poolPcTokenaccount: "6AovHvG7UovcavaJW6rEef728JtFV5adZ9MaNRBcX2nH",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "GENE-RAY",
        index: 46,
        lpMintAddress: "3HzXnc1qZ8mGqun18Ck3KA616XnZNqF1RWbgYE2nGRMA",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "GENEtH5amGSi8kHAtQoezp1XEXwZJ8vcuePYnXdKrMYz",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "GVfLbXA3dpEHPvc4do9HvMZ8TACxm3x54BVrHPMEixcr",
        poolAuthority: "FpAPnuT9FDpvzN33kF1cAK3vWMr6BqmnJoCTvqaSeGop",
        poolLpTokenAccount: "9zu4NVcnWBxu4gXqVYE6bPoHD24TGDQo5VF1DmaXfAwx",
        poolRewardATokenAccount: "B3ACepDzCv4dicf1GnbVs8fxn1GsoLQ8fD4jSZ1y5CK1",
        poolRewardBTokenAccount: "8o8JzfSvGGdFLocyVYWJQ32hDLZhXMq3z7NBuusUxfSH",
        fusion: true,
        ammId: "8FrCybrh7UFznP1hVHg8kXZ8bhii37c7BGzmjkdcsGJp",
        ammOpenOrders: "3qTqthYwuZKNQKruWJRGnubfXHU4MyGnvmoJcCbhELmn",
        ammQuantitiesOrTargetOrders:
          "HwwQ3v5x3AdLopGFdQYZmwK7D5YURpFoDJcrbuZDsMHm",
        poolCoinTokenaccount: "FMxYRoHA3Xn4Su62GCwofmdALGdn4s16S5ZA4C91ULbX",
        poolPcTokenaccount: "3h7PhXbCAGvtQHqwTS2V3Mhc3fK8E5Hs8EbgCVHkQFwd",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: true,
      },
      {
        name: "DFL-USDC",
        index: 47,
        lpMintAddress: "Fffijd6UVJdQeLVXhenS8YcsnMUdWJqpbBeH42LFkXgS",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "DFL1zNkaGPWm1BqAVqRjCZvHmwTFrEaJtbzJWgseoNJh",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "AWbmotuJS7NLBmra9ctbfVR1BnoHmiG1HGW6hm49TuRZ",
        poolAuthority: "HphbMv737TNN9P5Q7fnfJSLKt88YBjKwF4ocv69cVvFE",
        poolLpTokenAccount: "91LAgDBRbit1LP8aP9NKDN1PRKbThtcvid3zYTBzHR8f",
        poolRewardATokenAccount: "5gJE2xtx9B23rReu35EZEHuxL1ZRHKAExL6u9VNLZhJ1",
        poolRewardBTokenAccount: "ujQqfpP9JzqiMGrg7QeMnwfpcKGRqvJZxJAfxp74oWF",
        fusion: true,
        ammId: "8GJdzPuEBPP3BHJpcspBcfpRZV4moZMFwhTAuXebaPL8",
        ammOpenOrders: "zZgp9gm6MCFSvub491ncJQ78zRF4WymJErhy2cR7nnU",
        ammQuantitiesOrTargetOrders:
          "GKo4P3uofE47wug87QE6QGSRHa8wBLDEiW4nXEWeDUb4",
        poolCoinTokenaccount: "GteHVo2oJUJC2tFYe1QHS7MyasCVooPJdHfxwdF6hPZ2",
        poolPcTokenaccount: "FHqPtKCB2w9C94oupinMgykxuzjF6pQRVaBVNzqemXc7",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "wbWBNB-USDC",
        index: 49,
        lpMintAddress: "FEsEfEJJSfiMQcshUgZ5UigfytfGRQ3z5puyF6DXDp9C",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "6AxxjJhAz6APspTQM4vVCHgfzEyZgBTCogJLdai7bXYE",
        poolAuthority: "6KTAUxr9iHbSRLu4FuAtZ97JujUqaezeL12cTvwjR6a8",
        poolLpTokenAccount: "GNS68JMuV4bLiAX1s6hBvVupk1XqnGNgAGLpNPTwbSCN",
        poolRewardATokenAccount: "9czTqXfWQ4bdyrrQczSaH77zWD1TFifCTbp6Xesa7p2J",
        poolRewardBTokenAccount: "6mTuc1dfyD4uAckzmS3LVbf7cm8YAQxvJRxHmJRPwgQ6",
        fusion: true,
        ammId: "Fb1WR1kYvG1tHu4pwAxXQpdKT8Grh9i7ES9rZusLg7D6",
        ammOpenOrders: "3AoL7SCi9ZKBAGoCdRvHwH3DMKD3WAv2Dpev4BkX3dYj",
        ammQuantitiesOrTargetOrders:
          "Hh1zHYam85KshQPkMf3YSDy7bD6fDuEa5WWjp7P35dqu",
        poolCoinTokenaccount: "2WtQHGAMAhMsj3mR2wSPcUR7yZhYhuNwRZBxVPKcrCyb",
        poolPcTokenaccount: "4vrVEysPFSoS5YcZQwRUam8CbVgZehQdBVQ8yYbmkQSw",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "SOL-USDC-RAY",
        index: 50,
        lpMintAddress: "8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "GUzaohfNuFbBqQTnPgPSNciv3aUvriXYjQduRE3ZkqFw",
        poolAuthority: "DgbCWnbXg43nmeiAveMCkUUPEpAr3rZo3iop3TyP6S63",
        poolLpTokenAccount: "J6ECnRDZEXcxuruvErXDWsPZn9czowKynUr9eDSQ4QeN",
        poolRewardATokenAccount: "38YS2N7VUb856QDsXHS1h8zv5556YgEy9zKbbL2mefjf",
        poolRewardBTokenAccount: "ANDJUfDryy3jY6DngwGRXVyxCJBT5JfojLDXwZYSpnEL",
        fusion: true,
        ammId: "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
        ammOpenOrders: "HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc",
        ammQuantitiesOrTargetOrders:
          "CZza3Ej4Mc58MnxWA385itCC9jCo3L1D7zc3LKy1bZMR",
        poolCoinTokenaccount: "DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz",
        poolPcTokenaccount: "HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "SOL-USDT-RAY",
        index: 51,
        lpMintAddress: "Epm4KfTj4DMrvqn6Bwg2Tr2N8vhQuNbuK8bESFp4k33K",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "5r878BSWPtoXgnqaeFJi7BCycKZ5CodBB2vS9SeiV8q",
        poolAuthority: "DimG1WK9N7NdbhddweGTDDBRaBdCmcbPtoWZJ4Fi4rn4",
        poolLpTokenAccount: "jfhZy3B6sqeu95z71GukkxpkDtfHXJiFAMULM6STWxb",
        poolRewardATokenAccount: "Bgj3meVYds8ficJc9xntbjmMBPVUuyn6CvDUm1AD39yq",
        poolRewardBTokenAccount: "DJifNDjNt7iHbkNHs9V6Wm5pdiuddtF9w3o4WEiraKrP",
        fusion: true,
        ammId: "7XawhbbxtsRcQA8KTkHT9f9nc6d69UwqCDh6U5EEbEmX",
        ammOpenOrders: "4NJVwEAoudfSvU5kdxKm5DsQe4AAqG6XxpZcNdQVinS4",
        ammQuantitiesOrTargetOrders:
          "9x4knb3nuNAzxsV7YFuGLgnYqKArGemY54r2vFExM1dp",
        poolCoinTokenaccount: "876Z9waBygfzUrwwKFfnRcc7cfY4EQf6Kz1w7GRgbVYW",
        poolPcTokenaccount: "CB86HtaqpXbNWbq67L18y5x2RhqoJ6smb7xHUcyWdQAQ",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
      {
        name: "REAL-USDC",
        index: 52,
        lpMintAddress: "EN43tp8xdkcM8RYSJ4msFHMPTJRXKhUteVYBDJLwTvr3",
        rewardAMintAddress: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
        rewardBMintAddress: "AD27ov5fVU2XzwsbvnFvb1JpCBaCB5dRXrczV9CqSVGb",
        programId: "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        poolId: "7RQDGZ1cvHcREu211R35WSKHFjTxM5dmJHeFAWag29BA",
        poolAuthority: "96sdu18tQG6mNa2R59wtiM7jJ4uufi1DUwhRxbxrxD2R",
        poolLpTokenAccount: "DrMvUqiHEqnBTZe5eeWWfGVcZeuWW5kVRmkGfJ8WK3eZ",
        poolRewardATokenAccount: "3MYDn6i8WpCd7FpLuD8c8HeJXfmrhDeHifSF97cS2iUg",
        poolRewardBTokenAccount: "Ag5tg5mbAhKdECEKfSTuyw4C47CHQfVxp4CmpKj6U9zW",
        fusion: true,
        ammId: "A7ZxDrK9LSkVXhfRTu2pRCinwYfdxW2kK6DaJk12jRWw",
        ammOpenOrders: "E1sVmUNF4iHXLLz4yQqYufzrmzvm9aCF6NPR5C328Dzo",
        ammQuantitiesOrTargetOrders:
          "9zHNsBf6kySxnPuX75muu6gm8STUWkyGjZ4od5HPmJBd",
        poolCoinTokenaccount: "ByU8cczVRmBw3TxdKD8WUHNZgpwDPZ9ZgHTdreeTV5oX",
        poolPcTokenaccount: "7GYr4FqaDsC6vUoL4nN8EfRUe1aoxbdv22jr4diurJ8C",
        swapOrLiquidityProgramId:
          "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        ammAuthority: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1",
        serumProgramId: "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        dualReward: false,
      },
    ];
    await mongoose.connect(CONNECTION_STRING);
    console.info(`[+] Connected to: ${DB_NAMESPACE}`);

    RAY_FARMS.forEach(async (f) => {
      let result = await raydiumData.findOneAndUpdate(
        { "farms.name": f.name },
        { "farms.index": f.index },
        { new: true }
      );
      console.log(result);
    });
  } catch (error) {
    console.error("[+] MongoDB" + error);
    process.exit(1);
  }
};

const setOrcaFarmIndex = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING);
    console.info(`[+] Connected to: ${DB_NAMESPACE}`);

    const ORCA_FARMS = [
      {
        name: "SAMO-USDC",
        index: 37,
        lpMintAddress: "6VK1ksrmYGMBWUUZfygGF8tHRGpNxQEWv8pfvzQHdyyc",
        ammId: "Epvp7qMYAF21VVjacdB3VfKn6nnXQSF4rGYu8sD6Bkow",
        ammOpenOrders: "11111111111111111111111111111111",
        ammQuantitiesOrTargetOrders: "11111111111111111111111111111111",
        poolCoinTokenaccount: "7jwHW4Lw3nVaSJXskN5pUoKU6YB9RBVfZtGBp3VbR43U",
        poolPcTokenaccount: "G7Gqjxk9EaJMeFfoFTSy9WfH8uurgQkbNQCREWAc56DZ",
        swapOrLiquidityProgramId:
          "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        ammAuthority: "AB4rTE2JiKFhnfynUQCovbW75CUxT9LxcJX2SDTbY9gy",
        serumProgramId: "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        doubleDip: true,
      },
      {
        name: "ATLAS-USDC-ORCA",
        index: 27,
        lpMintAddress: "FZ8x1LCRSPDeHBDoAc3Gc6Y7ETCynuHEr5q5YWV7uRCJ",
        ammId: "3V5sjXj1mrWjjB1Xt6Xwp554QwHE5fppGSxbk4GzAtEW",
        ammOpenOrders: "11111111111111111111111111111111",
        ammQuantitiesOrTargetOrders: "11111111111111111111111111111111",
        poolCoinTokenaccount: "xotXsNCx4tBhnwhrajGTaVgKq1sfuMkeYHc77ZegCqE",
        poolPcTokenaccount: "8YswVYsTi66umBF2Bnkh4LB2VWMKPssDpe54VAgiuJZQ",
        swapOrLiquidityProgramId:
          "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        ammAuthority: "8UYN675AJn5htWydDs724xqintBZ4XzsCWqMozUSDU8m",
        serumProgramId: "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        doubleDip: true,
      },
      {
        name: "POLIS-USDC-ORCA",
        index: 28,
        lpMintAddress: "GteBdo9sqE7T41G8AJsaG9WHW48uXBwsLLznmu2TBdgy",
        ammId: "CdKPtCb5fBRaGFS4bJgytfReeHuFyhpe9YUyWHPnEWZG",
        ammOpenOrders: "11111111111111111111111111111111",
        ammQuantitiesOrTargetOrders: "11111111111111111111111111111111",
        poolCoinTokenaccount: "EbXNEUiKxSU1vwwhrbVNVk3qX4o1yU3p75SQUUMfc1zH",
        poolPcTokenaccount: "CLCj9b1vdPutrkvZS8ACTM5q42SXB2Q7khnMLVxDMGEK",
        swapOrLiquidityProgramId:
          "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        ammAuthority: "8XB9V3VuHtPBzHqvxzcmpkpaoXNXjZMD8VBHC79SxcEL",
        serumProgramId: "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        doubleDip: true,
      },
      {
        name: "ORCA-USDC",
        index: 17,
        lpMintAddress: "n8Mpu28RjeYD7oUX3LG1tPxzhRZh3YYLRSHcHRdS3Zx",
        ammId: "2p7nYbtPBgtmY69NsE8DAW6szpRJn7tQvDnqvoEWQvjY",
        ammOpenOrders: "11111111111111111111111111111111",
        ammQuantitiesOrTargetOrders: "11111111111111111111111111111111",
        poolCoinTokenaccount: "9vYWHBPz817wJdQpE8u3h8UoY3sZ16ZXdCcvLB7jY4Dj",
        poolPcTokenaccount: "6UczejMUv1tzdvUzKpULKHxrK9sqLm8edR1v9jinVWm9",
        swapOrLiquidityProgramId:
          "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        ammAuthority: "3fr1AhdiAmWLeNrS24CMoAu9pPgbzVhwLtJ6QUPmw2ob",
        serumProgramId: "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
      },
      {
        name: "ORCA-SOL",
        index: 18,
        lpMintAddress: "2uVjAuRXavpM6h1scGQaxqb6HVaNRn6T2X7HHXTabz25",
        ammId: "2ZnVuidTHpi5WWKUwFXauYGhvdT9jRKYv5MDahtbwtYr",
        ammOpenOrders: "11111111111111111111111111111111",
        ammQuantitiesOrTargetOrders: "11111111111111111111111111111111",
        poolCoinTokenaccount: "AioST8HKQJRqjE1mknk4Rydc8wVADhdQwRJmAAYX1T6Z",
        poolPcTokenaccount: "73zdy95DynZP4exdpuXTDsexcrWbDJX9TFi2E6CDzXh4",
        swapOrLiquidityProgramId:
          "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        ammAuthority: "2PH1quJj9MHQXATCmNZ6qQ2gZqM8R236DpKaz99ggVpm",
        serumProgramId: "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
      },
      {
        name: "SOL-USDC",
        index: 24,
        lpMintAddress: "APDFRM3HMr8CAGXwKHiu2f5ePSpaiEJhaURwhsRrUUt9",
        ammId: "EGZ7tiLeH62TPV1gL8WwbXGzEPa9zmcpVnnkPKKnrE2U",
        ammOpenOrders: "11111111111111111111111111111111",
        ammQuantitiesOrTargetOrders: "11111111111111111111111111111111",
        poolCoinTokenaccount: "ANP74VNsHwSrq9uUSjiSNyNWvf6ZPrKTmE4gHoNd13Lg",
        poolPcTokenaccount: "75HgnSvXbWKZBpZHveX68ZzAhDqMzNDS29X6BGLtxMo1",
        swapOrLiquidityProgramId:
          "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        ammAuthority: "JU8kmKzDHF9sXWsnoznaFDFezLsE5uomX2JkRMbmsQP",
        serumProgramId: "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
      },
      {
        name: "ETH-USDC",
        index: 23,
        lpMintAddress: "3e1W6Aqcbuk2DfHUwRiRcyzpyYRRjg6yhZZcyEARydUX",
        ammId: "FgZut2qVQEyPBibaTJbbX2PxaMZvT1vjDebiVaDp5BWP",
        ammOpenOrders: "11111111111111111111111111111111",
        ammQuantitiesOrTargetOrders: "11111111111111111111111111111111",
        poolCoinTokenaccount: "H9h5yTBfCHcb4eRP87fXczzXgNaMzKihr7bf1sjw7iuZ",
        poolPcTokenaccount: "JA98RXv2VdxQD8pRQq4dzJ1Bp4nH8nokCGmxvPWKJ3hx",
        swapOrLiquidityProgramId:
          "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        ammAuthority: "4dfCZR32xXhoTgMRhnViNaTFwiKP9A34TDjHCR3xM5rg",
        serumProgramId: "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
      },
      {
        name: "ETH-SOL",
        index: 26,
        lpMintAddress: "71FymgN2ZUf7VvVTLE8jYEnjP3jSK1Frp2XT1nHs8Hob",
        ammId: "EuK3xDa4rWuHeMQCBsHf1ETZNiEQb5C476oE9u9kp8Ji",
        ammOpenOrders: "11111111111111111111111111111111",
        ammQuantitiesOrTargetOrders: "11111111111111111111111111111111",
        poolCoinTokenaccount: "7F2cLdio3i6CCJaypj9VfNDPW2DwT3vkDmZJDEfmxu6A",
        poolPcTokenaccount: "5pUTGvN2AA2BEzBDU4CNDh3LHER15WS6J8oJf5XeZFD8",
        swapOrLiquidityProgramId:
          "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        ammAuthority: "DffrDbzPiswDJaiicBBo9CjqztKgFLrqXGwNJH4XQefZ",
        serumProgramId: "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
      },
      {
        name: "SOL-USDT",
        index: 25,
        lpMintAddress: "FZthQCuYHhcfiDma7QrX7buDHwrZEd7vL8SjS6LQa3Tx",
        ammId: "Dqk7mHQBx2ZWExmyrR2S8X6UG75CrbbpK2FSBZsNYsw6",
        ammOpenOrders: "11111111111111111111111111111111",
        ammQuantitiesOrTargetOrders: "11111111111111111111111111111111",
        poolCoinTokenaccount: "DTb8NKsfhEJGY1TrA7RXN6MBiTrjnkdMAfjPEjtmTT3M",
        poolPcTokenaccount: "E8erPjPEorykpPjFV9yUYMYigEWKQUxuGfL2rJKLJ3KU",
        swapOrLiquidityProgramId:
          "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        ammAuthority: "2sxKY7hxVFrY5oNE2DgaPAJFamMzsmFLM2DgVcjK5yTy",
        serumProgramId: "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
      },
      {
        name: "WHETH-USDC",
        index: 29,
        lpMintAddress: "7NPtjjAP7vhp4t5NCLyY4DY5rurvyc8cgZ2a2rYabRia",
        ammId: "4reGGLbesqpAeAZdAJv9hhgA2tgj45oGcyRuEvhATdMm",
        ammOpenOrders: "11111111111111111111111111111111",
        ammQuantitiesOrTargetOrders: "11111111111111111111111111111111",
        poolCoinTokenaccount: "9KpjcpKwhoFPbixvKDfcAhBQcVXk1CSBTGsJdzojDPRv",
        poolPcTokenaccount: "5HaG31FQS4McBVcHxVfwaKaWXE3VCGqvJ1ZDkTxs94cQ",
        swapOrLiquidityProgramId:
          "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        ammAuthority: "8uLtzZ1iTLTCPsm3b4QttRmDXcFjhVHRuMS9VTVEwo7E",
        serumProgramId: "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
      },
      {
        name: "WHETH-SOL",
        index: 30,
        lpMintAddress: "7aYnrdmdCRodDy2Czn6keUquUhjF1jPEmfwZPh488z8U",
        ammId: "FcEro2uFpHcb7Z785CBs6q12KMJqUJKa8VTXPi4TTBMf",
        ammOpenOrders: "11111111111111111111111111111111",
        ammQuantitiesOrTargetOrders: "11111111111111111111111111111111",
        poolCoinTokenaccount: "3uQytDKNd5H6XK8FhTei4wCUmj2eTbLTbiLAtWk2SmbA",
        poolPcTokenaccount: "GR3g8Wej3jmv92hYM1t22kaXog2xjkGjQ7V1XzLd1efT",
        swapOrLiquidityProgramId:
          "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
        ammAuthority: "HMxZz8fv2uR9suzAPRbJGNB3wZL1eT3eKL3cpYWUbM8K",
        serumProgramId: "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP",
      },
    ];

    ORCA_FARMS.forEach(async (f) => {
      let result = await orcaData.findOneAndUpdate(
        { "farms.name": f.name },
        { "farms.index": f.index },
        { new: true }
      );
      console.log(result);
    });
  } catch (error) {
    console.error("[+] MongoDB" + error);
    process.exit(1);
  }
};

const strategyVaultMigration = async () => {
  try {
    console.log('conn str ', CONNECTION_STRING);
    await mongoose.connect(CONNECTION_STRING);
    console.info(`[+] Connected to: ${DB_NAMESPACE}`);

    tulip_vaults.forEach(async(tulip_vault) => {
      let newDoc = new strategyData();
      newDoc.name = tulip_vault.name;
      newDoc.underlyingMint = tulip_vault.mintAddress;
      newDoc.sharesMint = tulip_vault.sharesMint;
      newDoc.id = tulip_vault.tag;
      let res = await newDoc.save();
      console.log(res);
    });
  } catch (error) {
    console.error("[+] MongoDB " + error);
    process.exit(1);
  }
};

// strategyVaultMigration();
// lendingReservesMigration();
leverageMigration();
rayFarmsMigration();
rayVaultsMigration();
orcaFarmsMigration();
orcaVaultsMigration();
