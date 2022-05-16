const mongoose = require('mongoose');

const schemaConfig = {
  toJSON: {
    virtuals: true,
    getters: true
  },
  collection: 'raydiumData',
  timestamps: { createdAt: false, updatedAt: true }
};

const raydiumData = mongoose.Schema({
  farms: {
    name: String,
    index: Number,
    lpMintAddress: String,
    rewardAMintAddress: String,
    rewardBMintAddress: String,
    programId: String,
    poolId: String,
    poolAuthority: String,
    poolLpTokenAccount: String,
    poolRewardATokenAccount: String,
    poolRewardBTokenAccount: String,
    fusion: Boolean,
    ammId: String,
    ammOpenOrders: String,
    ammQuantitiesOrTargetOrders: String,
    poolCoinTokenaccount: String,
    poolPcTokenaccount: String,
    swapOrLiquidityProgramId: String,
    ammAuthority: String,
    serumProgramId: String,
    dualReward: Boolean,
  },
  vaults: {
    name: String,
    account: String,
    pdaAccount: String,
    pdaAccountNonce: Number,
    infoAccount: String,
    oldInfoAccount: String,
    infoAccountNonce: Number,
    rewardAccountA: String,
    rewardAccountNonceA: Number,
    rewardAccountB: String,
    rewardAccountNonceB: Number,
    lpTokenAccount: String,
    pdaTokenAccount: String,
    vaultAccountSecretKey: String,
    metaDataAccount: String,
    metaDataSecretKey: String,
    initialized: Boolean,
    pdaFunded: Boolean,
    metaDataCreated: Boolean,
    swapAccount: String,
    swapAccountNonce: Number,
    serumMarketKey: String,
    serumBaseMint: String,
    serumQuoteMint: String,
    serumVaultSigner: String,
    slippage: String,
    rayPoolVersion: String,
    serumOpenOrdersAccount: String,
    controllerFee: String,
    platformFee: String,
    vaultFee: String,
    entranceFee: String,
    withdrawalFee: String,
    feeRecipient: String,
    dualFeeRecipient: String,
    feeAuthority: String,
    compoundAuthority: String,
    authority: String,
    precisionFactor: String,
    tulipRewardPerSlot: Number,
    tulipRewardEndSlot: Number,
    tulipMint: String,
    vaultTulipTokenAccount: String,
    oldUserInfoAccount: String,
    swapRandomMarket: String,
    associatedLedgerAccount: String
  }
}, schemaConfig);

// raydiumData.index({ "farms.name": 1 }, { unique: true });
// raydiumData.index({ "vaults.name": 1 }, { unique: true });

module.exports = mongoose.model('raydiumData', raydiumData);
