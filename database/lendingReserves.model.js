const mongoose = require("mongoose");

const schemaConfig = {
  toJSON: {
    virtuals: true,
    getters: true,
  },
  collection: "lendingReserves",
  timestamps: { createdAt: false, updatedAt: true },
};

const lendingReserves = mongoose.Schema(
  {
    name: String,
    token_id: String,
    account: String,
    mintAddress: String,
    liquiditySupplyTokenAccount: String,
    liquidityFeeReceiver: String,
    collateralTokenMint: String,
    collateralTokenSupply: String,
    destinationCollateralTokenAccount: String,
    quoteTokenMint: String,
    decimals: Number,
    visible: Boolean,
    optimalUtilizationRate: Number,
    minBorrowRate: Number,
    optimalBorrowRate: Number,
    maxBorrowRate: Number,
    degenBorrowRate: Number,
    degenUtilizationRate: Number,
  },
  schemaConfig
);

lendingReserves.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("lendingReserves", lendingReserves);
