const mongoose = require("mongoose");

const schemaConfig = {
  toJSON: {
    virtuals: true,
    getters: true,
  },
  collection: "leverageFarms",
  timestamps: { createdAt: false, updatedAt: true },
};

const leverageFarms = mongoose.Schema(
  {
    name: String,
    account: String,
    account_nonce: Number,
    serum_market: String,
    solfarm_vault_program: String,
    serum_request_queue: String,
    serum_event_queue: String,
    serum_market_bids: String,
    serum_market_asks: String,
    serum_coin_vault_account: String,
    serum_pc_vault_account: String,
    serum_fee_recipient: String,
    serum_dex_program: String,
    raydium_lp_mint_address: String,
    raydium_amm_id: String,
    raydium_amm_authority: String,
    raydium_amm_open_orders: String,
    raydium_amm_quantities_or_target_orders: String,
    raydium_liquidity_program: String,
    raydium_coin_token_account: String,
    raydium_pc_token_account: String,
    raydium_pool_temp_token_account: String,
    raydium_pool_withdraw_queue: String,
    lending_market: String,
    lending_program: String,
    base_token_mint: String,
    quote_token_mint: String,
    farm_key: Number,
    vault_account: String,
    vault_info_account: String,
    old_vault_info_account: String,
    coin_reserve_liquidity_fee_receiver: String,
    pc_reserve_liquidity_fee_receiver: String,
    farm_open_orders: String,
    farm_base_token_account: String,
    farm_quote_token_account: String,
    only_pc_borrow: Boolean,
  },
  schemaConfig
);

leverageFarms.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("leverageFarms", leverageFarms);
