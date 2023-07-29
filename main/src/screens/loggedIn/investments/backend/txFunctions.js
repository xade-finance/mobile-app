import contracts from './constants';
import ClearingHouseABI from '../ABIs/ClearingHouse';
import UsdcABI from '../ABIs/USDC';
import {displayPositions, getPositionDetails} from './viewFunctions';
import {
  createProvider,
  signAndSendTransaction,
} from '../../../../particle-auth';
import {
  createConnectProvider,
  signAndSendTransactionConnect,
} from '../../../../particle-connect';
import axios from 'axios';
import * as particleAuth from 'react-native-particle-auth';
import * as particleConnect from 'react-native-particle-connect';
import {PARTICLE_USERNAME, PARTICLE_PASSWORD} from '@env';

import {EvmService} from '../../../../NetService/EvmService';

const clearingHouseAddress = '0x602969FFAddA7d74f5da69B817688E984Ba4EBbD';
const usdcAddress = '0xA3C957f5119eF3304c69dBB61d878798B3F239D9'; //USDC on Mumbai testnet

const Web3 = require('web3');
let web3;
const transactions = () => {
  const username = PARTICLE_USERNAME;
  const password = PARTICLE_PASSWORD;
  if (global.withAuth) {
    authAddress = global.loginAccount.publicAddress;
    console.log('Global Account:', global.loginAccount);
    web3 = this.createProvider();
    //  console.log(web3.eth.getAccounts());
  } else {
    authAddress = global.connectAccount.publicAddress;
    console.log('Global Account:', global.connectAccount);
    console.log('Global Wallet Type:', global.walletType);
    web3 = this.createConnectProvider();
    // this.signAndSendTransactionConnect(
    //   '0xb02ccaf699f4708b348d2915e40a1fa31a2b4279',
    //   '1000000000000000',
    // );
  }

  const clearingHouse = new web3.eth.Contract(
    ClearingHouseABI.abi,
    clearingHouseAddress,
  );

  const usdc = new web3.eth.Contract(UsdcABI, usdcAddress);

  const openPosition = async (
    amm, // BTC
    sidei, // Long/Short
    quoteAssetAmounti, // Quote Asset
    leveragei, // Leverage
    baseAssetAmountLimiti,
    navigation, // BTC Price
  ) => {
    const Amm = getAmmAddress(amm).toLowerCase();

    const quoteAssetAmount = [
      web3.utils
        .toBN(web3.utils.toWei('10'.replace(',', ''), 'ether'))
        .toString(),
    ];

    const leverage = [
      web3.utils
        .toBN(web3.utils.toWei(leveragei.toString(), 'ether'))
        .toString(),
    ];

    const side = Number(sidei);

    const baseAssetAmountLimit = [
      web3.utils
        .toBN(web3.utils.toWei(baseAssetAmountLimiti.replace(',', ''), 'ether'))
        .toString(),
    ];
    // 8000000
    console.log('AMM Address:', Amm.toString());
    console.log('Quoted Amount:', quoteAssetAmount.toString());
    console.log('BTC Price:', baseAssetAmountLimit.toString());
    console.log('Leverage:', leverage.toString());
    console.log('Side:', side.toString());

    try {
      const txString = await clearingHouse.methods
        .openPosition(
          Amm,
          side,
          quoteAssetAmount,
          leverage,
          baseAssetAmountLimit,
        )
        .call({
          from: authAddress,
        });

      // const data = await usdc.methods
      //   .approve(
      //     clearingHouseAddress,
      //     web3.utils
      //       .toBN(web3.utils.toWei('10'.replace(',', ''), 'ether'))
      //       .toString(),
      //   )
      //   .send({from: authAddress});

      console.log(
        await usdc.methods.allowance(authAddress, clearingHouseAddress).call(),
      );

      // const txString = await clearingHouse.methods.getSpotPrice(Amm).call();

      // console.log('String:', data);

      // console.log('Transaction:', txString);

      // navigation.navigate('Successful', txString);
    } catch (error) {
      console.log('Could not process transaction!');
      console.log('error', error);
      // navigation.navigate('Unsuccessful');
    }

    // try {
    // const txString = await clearingHouse.methods.openPosition(
    //   Amm,
    //   side,
    //   quoteAssetAmount,
    //   leverage,
    //   baseAssetAmountLimit,
    // );
    // console.log('String:', txString);

    // const txHash = txString.send({
    //   from: authAddress,
    //   gas: 80000,
    //   maxPriorityFeePerGas: '5000000000', // Max priority fee per gas
    //   maxFeePerGas: '6000000000000',
    // });

    // console.log('String:', txString);
    // navigation.navigate('Successful', txString);
    // const txResult = global.withAuth
    //   ? await particleAuth.signAndSendTransaction(txString)
    //   : await particleConnect.signAndSendTransaction(txString);

    // console.log(txResult);
    // } catch (error) {
    // console.log('Could not process transaction!');
    // console.log('error', error);
    //   navigation.navigate('Unsuccessful');
    // }

    // .then(async () => {
    // const response = await axios.post(
    //   'https://rpc.particle.network/evm-chain',
    //   {
    //     chainId: 80001,
    //     jsonrpc: '2.0',
    //     id: 1,
    //     method: 'particle_abi_encodeFunctionCall',
    //     params: [
    //       clearingHouseAddress,
    //       'custom_openPosition',
    //       [Amm, side, quoteAssetAmount, leverage, baseAssetAmountLimit],
    //     ],
    //   },
    //   {
    //     auth: {
    //       username: PARTICLE_USERNAME,
    //       password: PARTICLE_PASSWORD,
    //     },
    //   },
    // );
    // const txString = response.data;
    // console.log(txString);

    // try {
    //   console.log(txString);
    //   const txResult = global.withAuth
    //     ? await particleAuth.signAndSendTransaction(txString)
    //     : await particleConnect.signAndSendTransaction(txString);
    //   console.log(txResult);
    //   return txResult;
    // } catch (error) {
    //   console.log(error);
    //   return 0;
    // }

    // Retrieve position details for display
    displayPositions(Amm);
  };

  /**
   * @param amm  asset symbol in caps
   * @param slippage  max variance from expected amount, Default: 0.5%
   */
  const closePosition = async (amm, slippage = 0.5) => {
    getPositionDetails(amm).then(async position => {
      const Amm = getAmmAddress(amm);
      const margin = web3.utils.toBN(position.margin);
      const _slippage = margin.mulUnsafe(
        web3.utils.toBN(slippage).divUnsafe(100),
      );
      const quoteAssetAmountLimit = margin.subUnsafe(_slippage);

      const response = await axios.post(
        'https://rpc.particle.network/evm-chain',
        {
          chainId: 80001,
          jsonrpc: '2.0',
          id: 1,
          method: 'particle_abi_encodeFunctionCall',
          params: [
            clearingHouseAddress,
            'custom_closePosition',
            [Amm, quoteAssetAmountLimit],
          ],
        },
        {
          auth: {
            username: username,
            password: password,
          },
        },
      );
      const txString = response.data.result;
      try {
        const txResult = global.withAuth
          ? await particleAuth.signAndSendTransaction(txString)
          : await particleConnect.signAndSendTransaction(txString);
        console.log(txResult);
        return txResult;
      } catch (error) {
        console.log(error);
        return 0;
      }
    });
    const Amm = getAmmAddress(amm);
    displayPositions(Amm);
  };

  /*
    //Add or remove margin from an open position 
    // NB: would not affect position size. Instead, leverage is adjusted accordingly
    PARAMETERS:
    * amm => String(asset symbol IN CAPS)
    * amount => Number(amount of margin to remove)
    * dir => Number(0 or 1. Implement as a switch, 0 for remove, 1 for add)
    */
  const adjustMargin = async (amm, amount, dir) => {
    getPositionDetails(amm).then(async position => {
      const margin = web3.utils.toBN(position.margin).addUnsafe(amount);
      const leverage = web3.utils.toBN(position.size).divUnsafe(margin);
      const _amount = web3.utils.toBN(amount);
      const Amm = getAmmAddress(amm);
      let method;
      if (dir) {
        method = 'addMargin';
      } else {
        method = 'removeMargin';
      }

      const response = await axios.post(
        'https://rpc.particle.network/evm-chain',
        {
          chainId: 80001,
          jsonrpc: '2.0',
          id: 1,
          method: 'particle_abi_encodeFunctionCall',
          params: [clearingHouseAddress, `custom_${method}`, [Amm, amount]],
        },
        {
          auth: {
            username: username,
            password: password,
          },
        },
      );
      const txString = response.data.result;
      try {
        const txResult = global.withAuth
          ? await particleAuth.signAndSendTransaction(txString)
          : await particleConnect.signAndSendTransaction(txString);
        console.log(txResult);
        return txResult;
      } catch (error) {
        console.log(error);
        return 0;
      }
    });
    const Amm = getAmmAddress(amm);
    displayPositions(Amm);
  };

  //Get users position history
  const getPositionHistory = async () => {
    await clearingHouse
      .queryFilter(positionClosed, 0, 'latest')
      .then(events => {
        for (let i = 0; i < events.length; i++) {
          getPosition(events[i]);
        }
      });
  };

  const getPosition = object => {
    const amm = contracts[0].symbol;
    const margin = object.args.margin;
    const PositionNotional = object.args.positionNotional;
    const PositionSize = object.args.exchangedPositionSize;
    const Fee = object.args.fee;
    const PositionSizeAfterTransaction = object.args.positionSizeAfter;
    const RealizedPnL = object.args.realizedPnl;
    const LiquidationPenalty = object.args.liquidationPenalty;
    const SpotPrice = object.args.spotPrice;
    const FundingPayment = object.args.fundingPayment;

    return {
      amm,
      margin,
      PositionNotional,
      PositionSize,
      Fee,
      PositionSizeAfterTransaction,
      RealizedPnL,
      LiquidationPenalty,
      SpotPrice,
      FundingPayment,
    };
  };

  /**
   * Get AMM address by asset symbol
   * @param amm Asset symbol in caps
   * @returns string- AMM address
   */
  const getAmmAddress = amm => {
    for (let i = 0; i < contracts.length; i++) {
      if (contracts[i].symbol == amm) {
        return contracts[i].address;
      }
    }
  };

  const positionClosed = () => {
    clearingHouse.filters.PositionChanged(
      userAccount,
      null,
      null,
      null,
      null,
      null,
      BigNumber.From(0),
    );
  };

  return {openPosition, closePosition, adjustMargin, getPositionHistory};
};

export default transactions;
