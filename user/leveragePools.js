const solanaWeb3 = require("@solana/web3.js");
const BN = require("bignumber.js");
const { OpenOrders } = require("@project-serum/serum");

const {
  VAULT_LAYOUT,
  ORCA_VAULT_LAYOUT,
  MINT_LAYOUT,
  LENDING_OBLIGATION_LAYOUT,
  AMM_INFO_LAYOUT_V4,
  ETH_UNIT,
  SOLFARM_PROGRAM_ID,
  RPC_URL, LENDING_RESERVE_LAYOUT,
} = require("./config");

const {
  getAccountInfo,
  b58AddressToPubKey,
  bnToFiatUsd,
  getCoinsUsdValue,
  getCoinsUsdValueTulip,
  findReserveTokenByMint,
  findReserveTokenByAccount,
  getPoolAccounts,
} = require("./utils");
const {TokenAmount} = require("../utils/safe-math");

const connection = new solanaWeb3.Connection(RPC_URL);

/**
 * As per protocol, FARM_USER_ADDRESS_INDEX is always 0;
 */
const FARM_USER_ADDRESS_INDEX = new BN(0);

/**
 *
 * @param {Authority address} authority base58
 * @param {Solfarm leveraged address } programId base58
 * @param {0 as of now} index number
 * @param {farm IDs as show on FARM object} farm number
 * @returns
 */
const findUserFarmAddress = async (authority, programId, index, farm) => {
  /**
   * Create buffer arrays for index (always 0)
   * and _farm first byte with proper IDs, then fill with 0s
   */
  const _index = Buffer.alloc(8, index.toNumber());
  let _farm = Buffer.alloc(8);
  _farm[0] = farm;

  try {
    let seeds = [authority.toBuffer(), _index, _farm];

    let k = await solanaWeb3.PublicKey.findProgramAddress(seeds, programId);

    return k;
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {Authority address} authority base58
 * @param {Address found with findProgramAddress } userFarmAddr base58
 * @param {Leverage programid } programId
 * @param {index obligation on USER_FARM} obligationIndex
 * @returns
 */
const findUserFarmObligationAddress = async (
    authority,
    userFarmAddr,
    programId,
    obligationIndex
) => {
  try {
    let _obligationIndex = Buffer.alloc(8);
    _obligationIndex[0] = obligationIndex;

    const seeds = [
      authority.toBuffer(),
      userFarmAddr.toBuffer(),
      _obligationIndex,
    ];

    return solanaWeb3.PublicKey.findProgramAddress(seeds, programId);
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches and decodes the VAULT data to return;
 * @param {Address of the Vault to decode} _vaultAddress BASE58
 * @param {VAULT instructions to decode} _INSTRUCTIONS BORSH/struct
 * @returns
 */
const getVaultData = async (_vaultAddress, _INSTRUCTIONS) => {
  try {
    const vaultAddress = b58AddressToPubKey(_vaultAddress);
    const { data } = await connection.getAccountInfo(vaultAddress);
    const vaultData = _INSTRUCTIONS.decode(Buffer.from(data, "base64"));

    return vaultData;
  } catch (error) {
    throw error;
  }
};

/**
 * This returns the LP amount of the user converting VaultShares to LP tokens.
 * @param {Pool 0 (Raydium) | 1 (Orca)} _poolVault Number
 * @param {vaultShares fetched with LENDING_OBLIGATION_LAYOUT.decode} _userVaultShares
 * @param {Pool Account as seen here: https://gist.github.com/therealssj/c6049ac59863df454fb3f4ff19b529ee} _vaultAddress address
 * @returns
 */
const getDepositedLpTokens = async (
    _poolVault,
    _userVaultShares,
    _vaultAddress
) => {
  try {
    let layout = _poolVault == 0 ? VAULT_LAYOUT : ORCA_VAULT_LAYOUT;

    let { total_vault_balance, total_vlp_shares } = await getVaultData(
        _vaultAddress,
        layout
    );

    // console.log('lp data ', _userVaultShares.toString(), total_vault_balance.toString(), total_vlp_shares.toString());
    const lpTokens = _userVaultShares
        .multipliedBy(total_vault_balance)
        .div(total_vlp_shares);

    return lpTokens;
  } catch (error) {
    console.log(`Error getting depositedLpTokens: ${error}`);
    throw error;
  }
};
/**
 *
 * @param {address of LP mint of vault} _lpMintAddress base58 encoded
 * @param {address of reserves0} _poolCoinTokenaccount base58 encoded
 * @param {address of reserves1} _poolPcTokenaccount base58 encoded
 * @returns
 */
const getPoolStatus = async (
    _lpMintAddress,
    _poolCoinTokenaccount,
    _poolPcTokenaccount
) => {
  try {
    let result;
    result = await connection.getAccountInfo(
        b58AddressToPubKey(_lpMintAddress)
    );

    let mintData = MINT_LAYOUT.decode(Buffer.from(result.data, "base64"));

    const totalSupply = new BN(mintData.supply);
    const supplyDecimals = mintData.decimals;

    result = await connection.getTokenAccountBalance(
        b58AddressToPubKey(_poolCoinTokenaccount)
    );

    const coinBalance = new BN(result.value.amount);
    const coinDecimals = new BN(10 ** result.value.decimals);

    result = await connection.getTokenAccountBalance(
        b58AddressToPubKey(_poolPcTokenaccount)
    );
    const pcBalance = new BN(result.value.amount);
    const pcDecimals = new BN(10 ** result.value.decimals);

    return {
      totalSupply,
      supplyDecimals,
      coinBalance,
      coinDecimals,
      pcBalance,
      pcDecimals,
    };
  } catch (error) {
    throw error;
  }
};

/**
 *
 * @param {Farm pool index on FARM object} _farmIndex number
 * @param {Array position on USER_FARM} _obligationIndex number
 * @param {Solfarm Program ID} _farmProgramId address
 * @param {Pool vault Ray:0 | Orca:1 } _poolVault number
 * @param {Pool Vault address} _vaultAddress address
 * @param {Address of user to check balances} _userAddress address
 * @returns
 */
const getSolFarmPoolInfo = async (_poolVault, _pairName, _userAddress, _positionNumber) => {
  let quotes;

  try {
    /**
     * Information:
     *
     * coin = base
     * pc = quote
     *
     * User LpTokens * token USD value = virtual value
     * borrowed = obligationBorrowX.borrowedAmountWads
     * virtual value - borrowed  = value
     *
     */

    const {
      account,
      ammId,
      ammOpenOrders,
      lpMintAddress,
      poolCoinTokenaccount,
      poolPcTokenaccount,
      farmIndex,
      baseMint,
      quoteMint,
    } = await getPoolAccounts(_poolVault, _pairName);

    let {
      pcBalance,
      pcDecimals,
      coinBalance,
      coinDecimals,
      totalSupply,
      supplyDecimals,
    } = await getPoolStatus(
        lpMintAddress,
        poolCoinTokenaccount,
        poolPcTokenaccount
    );

    let r0Bal;
    let r1Bal;

    /**
     * If we calculate Raydium vaults, we also get AMM circulating supply;
     */
    if (_poolVault == 0) {
      /**
       * To get AMM ID and fetch circulating values.
       */
      let { needTakePnlCoin, needTakePnlPc } = await getVaultData(
          ammId,
          AMM_INFO_LAYOUT_V4
      );

      /**
       * Get and decode AMM Open Order values
       */
      let OPEN_ORDER_INSTRUCTIONS = OpenOrders.getLayout(
          b58AddressToPubKey(ammOpenOrders)
      );

      let { baseTokenTotal, quoteTokenTotal } = await getVaultData(
          ammOpenOrders,
          OPEN_ORDER_INSTRUCTIONS
      );

      r0Bal = coinBalance
          .plus(baseTokenTotal)
          .minus(needTakePnlCoin)
          .div(coinDecimals);

      r1Bal = pcBalance
          .plus(quoteTokenTotal)
          .minus(needTakePnlPc)
          .div(pcDecimals);

      // console.log('r0 r1 bal', r0Bal.toString(), r1Bal.toString());
    } else {
      r0Bal = coinBalance.div(coinDecimals);

      r1Bal = pcBalance.div(pcDecimals);
    }

    /**
     * Pool TVL calculations based on reserves and reserves prices.
     */
    const reserve0 = await findReserveTokenByMint(baseMint);
    const reserve0Price = await getCoinsUsdValueTulip(reserve0.name);
    // console.log('reserve0Price ', reserve0PriceTulip);
    // const reserve0Price = await getCoinsUsdValue(reserve0.token_id);

    const reserve1 = await findReserveTokenByMint(quoteMint);
    const reserve1Price = await getCoinsUsdValueTulip(reserve1.name);
    // const reserve1Price = await getCoinsUsdValue(reserve1.token_id);
    // console.log(`Reserves 0 ${baseMint} 1 ${quoteMint}`);
    // console.log(`Reserve0: ${reserve0.name} price: ${reserve0Price} USD`);
    // console.log(`Reserve1: ${reserve1.name} price: ${reserve1Price} USD`);

    const poolTVL = r0Bal
        .multipliedBy(reserve0Price)
        .plus(r1Bal.multipliedBy(reserve1Price));

    const _supplyDecimals = new BN(10 ** supplyDecimals);

    const unitLpValue = poolTVL.div(totalSupply.div(_supplyDecimals));
    const coinInLp = r0Bal.div(totalSupply.div(_supplyDecimals));
    const pcInLp = r1Bal.div(totalSupply.div(_supplyDecimals));

    // iterate over obligations
    let key = await findUserFarmAddress(
        b58AddressToPubKey(_userAddress),
        b58AddressToPubKey(SOLFARM_PROGRAM_ID),
        FARM_USER_ADDRESS_INDEX,
        new BN(farmIndex)
    );

    let obligations = [];

    for (let i = 0; i <= 2; i++) {
      let [userObligationAcct1] = await findUserFarmObligationAddress(
          b58AddressToPubKey(_userAddress),
          key[0],
          b58AddressToPubKey(SOLFARM_PROGRAM_ID),
          new BN(i)
      );

      // console.log('obli'/, FARM_USER_ADDRESS_INDEX.toString(), farmIndex, key[0].toString(), userObligationAcct1.toString());


      const accountInfo = await getAccountInfo(userObligationAcct1.toBase58());

      if (accountInfo.value == null) continue;

      const rawBuffer = accountInfo.value.data[0];

      const dataBuffer = Buffer.from(rawBuffer, "base64");

      const decoded = LENDING_OBLIGATION_LAYOUT.decode(dataBuffer);
      obligations.push(decoded);
    }

    // console.log('oblis ', obligations);
    const parsedObligations = [];
    for (let j = 0; j < obligations.length; j++) {
      let borrow = [];
      let borrowed;
      let borrowValue;
      let borrowedAsset;
      let debtValue;
      let oldBorrowRates;
      let newBorrowRates;

      let decoded = obligations[j];
      const vaultShares = new BN(decoded.vaultShares.toString());

      const userLpTokens = await getDepositedLpTokens(
          _poolVault,
          vaultShares,
          account
      );

      // console.log('user lp tokens ', userLpTokens.toString());
      if (userLpTokens.toNumber() === 0)
        continue;

      let borrow1 = new BN(
          decoded.obligationBorrowOne.borrowedAmountWads.toString()
      );
      let borrow2 = new BN(
          decoded.obligationBorrowTwo.borrowedAmountWads.toString()
      );

      if (decoded.borrowsLen === 2) {
        let _tempData;

        _tempData = await findReserveTokenByAccount(
            decoded.obligationBorrowOne.borrowReserve.toBase58()
        );
        // let r1Price = await getCoinsUsdValue(_tempData.token_id);

        // let borrowed1 = borrow1.div(ETH_UNIT).div(_tempData.decimals);
        // const borrow1Value = borrowed1.multipliedBy(r1Price);
        const reserveOne = await getReserveInfo(_tempData);

        const borrow1Name = _tempData.name;

        _tempData = await findReserveTokenByAccount(
            decoded.obligationBorrowTwo.borrowReserve.toBase58()
        );
        // let r2Price = await getCoinsUsdValue(_tempData.token_id);

        // let borrowed2 = borrow2.div(ETH_UNIT).div(_tempData.decimals);
        // const borrow2Value = borrowed2.multipliedBy(r2Price);

        const borrow2Name = _tempData.name;

        borrowed = [
          borrow1.div(ETH_UNIT).toNumber(),
          borrow2.div(ETH_UNIT).toNumber(),
        ];

        oldBorrowRates = [
          decoded.obligationBorrowOne.cumulativeBorrowRateWads,
          decoded.obligationBorrowTwo.cumulativeBorrowRateWads
        ]

        const reserveTwo = await getReserveInfo(_tempData);

        newBorrowRates = [
          reserveOne.cumulativeBorrowRate,
          reserveTwo.cumulativeBorrowRate,
        ];

        //TODO: check this
        // borrowValue = borrow1Value.plus(borrow2Value).div(10 ** 8);

        borrowedAsset = [borrow1Name, borrow2Name];
      } else if (!borrow1.isZero() && decoded.borrowsLen === 1) {
        const reserveData = await findReserveTokenByAccount(
            decoded.obligationBorrowOne.borrowReserve.toBase58()
        );

        // const borrow1Decimals = new BN(10 ** decimals);
        borrowed = [borrow1.div(ETH_UNIT).toNumber(),];

        // const reservePrice = await getCoinsUsdValue(token_id);
        // borrowValue = borrowed[0].multipliedBy(reservePrice);

        borrowedAsset = [reserveData.name];

        oldBorrowRates = [
          decoded.obligationBorrowOne.cumulativeBorrowRateWads,
        ]

        const reserveOne = await getReserveInfo(reserveData);

        newBorrowRates = [
          reserveOne.cumulativeBorrowRate,
        ];
      }

      // create the quote object
      quotes = {
        [reserve0.name]: {
          price: reserve0Price,
          decimals: reserve0.decimals,
        },
        [reserve1.name]: {
          price: reserve1Price,
          decimals: reserve1.decimals,
        },
      };


      // create the borrow object
      for (let i = 0; i < borrowedAsset?.length; i++) {

        // console.log('borrowedAssets ', borrowedAsset.length);
        let borrowDebtValue = new TokenAmount(borrowed[i]).wei
            .times(new TokenAmount(newBorrowRates[i]).wei)
            .div(new TokenAmount(oldBorrowRates[i]).wei)
            .div(Math.pow(10, quotes[borrowedAsset[i]]?.decimals));

        // console.log('borrowed asset ', borrowedAsset[i]);
        //     new TokenAmount(borrowed[i]).wei.toString(), new TokenAmount(newBorrowRates[i]).wei.toString(), new TokenAmount(oldBorrowRates[i]).wei.toString(), borrowDebtValue);
        borrow[i] = {
          asset: borrowedAsset[i],
          amount: borrowDebtValue.toNumber(),
          price: quotes[borrowedAsset[i]].price,
        };
      }

      // generate the debt value based on the borrow multiplied by the price
      debtValue = borrow.reduce((acc, curr) => {
        return Math.round((acc + curr.amount * curr.price) * 1e2) / 1e2;
      }, 0);


      // console.log('pos info ', decoded.coinDeposits.toString(), decoded.pcDeposits.toString());
      const coinDepositsValue = new TokenAmount(
          decoded.coinDeposits,
          reserve0.decimals
      ).fixed();
      const pcDepositsValue = new TokenAmount(decoded.pcDeposits, reserve1.decimals).fixed();

      const coins = [
        {
          asset: reserve0.name,
          amount: coinInLp.multipliedBy(userLpTokens).div(_supplyDecimals).plus(coinDepositsValue).toNumber(),
        },
        {
          asset: reserve1.name,
          amount: pcInLp.multipliedBy(userLpTokens).div(_supplyDecimals).plus(pcDepositsValue).toNumber(),
        },
      ];

      /**
       * User LpTokens * token USD value = virtual value
       * borrowed = obligationBorrowX.borrowedAmountWads
       * virtual value - borrowed  = value
       */

      const virtualValue = (coins[0].amount * reserve0Price) + (coins[1].amount * reserve1Price);

      // equity value is the virtual value - the debt value
      const equityValue = virtualValue -  debtValue;

      let vaultInfo = {
        virtualValue: virtualValue,
        equityValue: equityValue,
        debtValue: debtValue,
        borrow,
        coins
      };

      parsedObligations.push(vaultInfo);
    }

    return parsedObligations;
  } catch (error) {
    throw error;
  }
};

const getReserveInfo = async(reserve) => {
  let result;
  result = await connection.getAccountInfo(
      b58AddressToPubKey(reserve.account)
  );

  let decodedData = LENDING_RESERVE_LAYOUT.decode(Buffer.from(result.data, "base64"));
  const {
    availableAmount,
    platformAmountWads,
    borrowedAmount: borrowedAmountWads,
    cumulativeBorrowRate: cumulativeBorrowRateWads
  } = decodedData?.liquidity || {};
  const borrowedAmount = new TokenAmount(
      new BN(borrowedAmountWads.toString()).div(ETH_UNIT).toString(),
      reserve.decimals
  );
  const platformAmount = new TokenAmount(
      new BN(platformAmountWads.toString()).div(ETH_UNIT).toString(),
      reserve.decimals
  );
  const availableAmountWei = new TokenAmount(
      availableAmount,
      reserve.decimals
  );

  let totalSupply = availableAmountWei.wei
      .plus(borrowedAmount.wei)
      .minus(platformAmount.wei);
  let totalBorrow = borrowedAmount.wei;

  if (totalBorrow.gt(totalSupply)) {
    totalBorrow = totalSupply;
  }
  const utilization = totalBorrow.div(totalSupply);
  const utilizationRate = utilization.times(100);


  let mintdata;
  mintdata = await connection.getAccountInfo(
      b58AddressToPubKey(reserve.collateralTokenMint)
  );

  const mintData = MINT_LAYOUT.decode(Buffer.from(mintdata.data, "base64"));
  const collateralSupply = new TokenAmount(mintData.supply, mintData.decimals).toEther();
  totalSupply = new TokenAmount(totalSupply.toString(), reserve.decimals ).toEther();
  totalBorrow = new TokenAmount(totalBorrow.toString(), reserve.decimals).toEther();
  const sharePrice = totalSupply / collateralSupply;
  // console.log('share price ', totalSupply, collateralSupply, sharePrice);
  return {
    name: reserve.name,
    utilization: utilizationRate,
    totalSupply: totalSupply,
    totalBorrow: totalBorrow,
    decimal: reserve.decimals,
    cumulativeBorrowRate: cumulativeBorrowRateWads,
    sharePrice
  }
}
module.exports = {
  getSolFarmPoolInfo,
  getReserveInfo
};
