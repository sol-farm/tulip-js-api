const mongoose = require("mongoose");

const schemaConfig = {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    collection: "strategyVaults",
    timestamps: { createdAt: false, updatedAt: true },
};

const strategyVaults = mongoose.Schema(
    {
        name: String,
        underlyingMint: String,
        sharesMint: String,
        id: String,
    },
    schemaConfig
);

strategyVaults.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("strategyVaults", strategyVaults);
