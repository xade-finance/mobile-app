import contracts from './constants';
import clearingHouseABI from '../ABIs/ClearingHouse.json';
import AMM_ABI from '../ABIs/AMM.json';
import createProvider from '../../../../particle-auth';
import createConnectProvider from '../../../../particle-connect';

const clearingHouseAddress = '0x32c4a63437969247C95440020EA04a1e1890A1c6';
const btcAmmAddr = '0x1FB18e3d259d72033C32D1A5e00DB143D411585b';
let userAccount;

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
}

const clearingHouse = new web3.eth.Contract(
  clearingHouseABI.abi,
  clearingHouseAddress,
);
const btcAmm = new web3.eth.Contract(AMM_ABI.abi, btcAmmAddr);

console.log(btcAmm);

// //Filters
// const positionClosed = clearingHouse.filters.PositionChanged(
//   userAccount,
//   null,
//   null,
//   null,
//   null,
//   null,
//   BigNumber.From(0),
// );
// const positionLiquidated =
//   clearingHouse.filters.PositionLiquidated(userAccount);
// const marginChanged = clearingHouse.filters.MarginChanged(userAccount);

// //Events
// clearingHouse
//   .on(
//     positionClosed,
//     (
//       trader,
//       amm,
//       margin,
//       positionNotional,
//       exchangedPositionSize,
//       fee,
//       positionSizeAfter,
//       realizedPnl,
//       unrealizedPnl,
//       badDebt,
//       liquidationPenalty,
//       spotPrice,
//       fundingPayment,
//     ) => {
//       console.log(
//         `Position Liquidated =>
//        Pair:${contracts[0].symbol}
//        Margin: ${margin}
//        Position Notional:${positionNotional}
//        Position Size:${exchangedPositionSize}
//        Fee: ${fee}
//        Position Size After Transaction: ${positionSizeAfter}
//        Realized PnL: ${realizedPnl}
//        Unrealized PnL: ${unrealizedPnl}
//        Bad Debt: ${badDebt}
//        Liquidation Penalty: ${liquidationPenalty}
//        Spot Price: ${spotPrice}
//        Funding Payment : ${fundingPayment}`,
//       );
//     },
//   )
//   .on('error', console.error);

// clearingHouse.on(
//   positionLiquidated,
//   (
//     trader,
//     amm,
//     positionNotional,
//     positionSize,
//     liquidationFee,
//     liquidator,
//     badDebt,
//   ) => {
//     console.log(
//       `Position Liquidated =>
//        Pair:${contracts[0].symbol}
//        Position Notional:${positionNotional}
//        Position Size:${positionSize}
//        Liquidation Fee:${liquidationFee}
//        <li>Liquidator: ${liquidator}
//        Bad Debt: ${badDebt}`,
//     );
//     // Clear positions display after this
//   },
// );

// clearingHouse.on(marginChanged, (sender, amm, amount, fundingPayment) => {
//   console.log(
//     `Margin Changed =>
//      Pair:${contracts[0].symbol}
//      Amount:${amount}
//      Funding Payment:${fundingPayment}`,
//   );
// });

// clearingHouse.on(RestrictionModeEntered, (amm, blockNumber) => {
//   console.log(
//     `RestrictionMode Entered =>
//      Pair:${contracts[0].symbol}
//      Block Number:${blockNumber}`,
//   );
// });

// btcAmm.on(FundingRateUpdated, (rate, underlyingPrice) => {
//   console.log(`BTC Funding Rate Updated =>
//      Funding Rate:${rate}
//      Underlying Price:${underlyingPrice}`);
// });

// function test() {
//   let web3;
//   if (global.withAuth) {
//     user = global.loginAccount.publicAddress;
//     web3 = this.createProvider();
//     console.log(web3);
//     console.log('Local Account:', authAddress);
//     console.log('Auth Account:', global.withAuth);
//   } else {
//     authAddress = global.connectAccount.publicAddress;
//     console.log('Global Account:', global.connectAccount);
//     console.log('Global Wallet Type:', global.walletType);
//   }
// }

// export default test;
