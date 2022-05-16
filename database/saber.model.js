const mongoose = require('mongoose');

const schemaConfig = {
  toJSON: {
    virtuals: true,
    getters: true
  },
  collection: 'saberData',
  timestamps: { createdAt: false, updatedAt: true }
};

const saberData = mongoose.Schema({
  vaults: {
    name: String,
    account: String,
    account_nonce: Number,
    compound_authority: String,
    saber_farm_program: String,
    saber_farm_landlord: String,
    saber_farm_plot: String,
    saber_farm_lp_token_mint: String,
    saber_rewards_token_mint: String,
    saber_coin_token_account: String,
    saber_pc_token_account: String,
    associated_vault_farmer_account: String,
    associated_vault_farmer_account_nonce: Number,
    vault_farm_lp_token_account: String,
    vault_pda_signer: String,
    vault_pda_signer_nonce: Number,
    vault_temp_lp_token_account: String,
    vault_temp_lp_token_account_nonce: Number,
    vault_saber_rewards_token_account: String,
    vault_saber_rewards_token_account_nonce: Number,
    vault_coin_token_account: String,
    vault_coin_token_account_nonce: Number,
    vault_pc_token_account: String,
    vault_pc_token_account_nonce: Number,
    coin_token_mint: String,
    pc_token_mint: String,
    fee_recipient: String,
    open_orders_account: String,
    controller_fee: Number,
    platform_fee: Number,
    vault_fee: Number,
    entrance_fee: Number,
    withdrawal_fee: Number,
    farm_key: Number,
    slippage: Number,
    wrapped_usdc_associated_token_account: String,
    intermediary_open_orders_account: String,
    intermediary_swap_token_account: String,
    sunny_vault_account: String,
    sunny_vault_account_nonce: Number,
    sunny_vault_farmer_account: String,
    sunny_vault_farmer_account_nonce: Number,
    sunny_vault_farm_token_account: String,
    sunny_vault_lp_token_account: String,
    sunny_vault_saber_token_account: String,
    sunny_vault_farmer_lp_token_account: String,
    sunny_vault_farmer_sunny_farm_token_account: String,
    sunny_vault_miner_account: String,
    sunny_vault_miner_farm_token_account: String,
    vault_sunny_token_account: String,
    sunny_usdc_open_orders_account: String,
    sunny_farm_program: String,
    sunny_pool: String,
    sunny_mine_program: String,
    sunny_farm_mint: String,
    sunny_rewarder: String,
    sunny_quarry: String,
    quarry_miner: String,
    quarry_miner_vault: String,
    quarry: String,
    quarry_rewarder: String,
  }
}, schemaConfig);

// saberData.index({ "vaults.name": 1 }, { unique: true });

module.exports = mongoose.model('saberData', saberData);
