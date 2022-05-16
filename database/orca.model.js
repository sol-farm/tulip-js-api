const mongoose = require('mongoose');

const schemaConfig = {
  toJSON: {
    virtuals: true,
    getters: true
  },
  collection: 'orcaData',
  timestamps: { createdAt: false, updatedAt: true }
};

const orcaData = mongoose.Schema({
  farms: {
    name: String,
    index: Number,
    lpMintAddress: String,
    ammId: String,
    ammOpenOrders: String,
    ammQuantitiesOrTargetOrders: String,
    poolCoinTokenaccount: String,
    poolPcTokenaccount: String,
    swapOrLiquidityProgramId: String,
    ammAuthority: String,
    serumProgramId: String,
    doubleDip: Boolean,
  },
  vaults: {
    name: String,
    account: String,
    account_nonce: Number,
    user_farm_address: String,
    user_farm_nonce: Number,
    farm_token_mint: String,
    farm_token_account: String,
    reward_token_mint: String,
    reward_token_account: String,
    swap_pool_token_mint: String,
    swap_pool_token_account: String,
    swap_token_a_mint: String,
    swap_token_a_account: String,
    swap_token_b_mint: String,
    swap_token_b_account: String,
    usdc_token_account: String,
    compound_authority: String,
    pdaAccount: String,
    pda_nonce: Number,
    controller_fee: Number,
    platform_fee: Number,
    farm_key: Number,
    fee_recipient: String,
    host_fee_recipient: String,
    global_base_token_vault: String,
    global_farm: String,
    orca_fee_account: String,
    global_reward_token_vault: String,
    convert_authority: String,
    serumVaultSigner: String,
  }
}, schemaConfig);

// orcaData.index({ "farms.name": 1 }, { unique: true });
// orcaData.index({ "vaults.name": 1 }, { unique: true });

module.exports = mongoose.model('orcaData', orcaData);
