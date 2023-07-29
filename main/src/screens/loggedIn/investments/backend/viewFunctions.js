import clearingHouseABI from '../ABIs/ClearingHouse';
import clearingHouseViewerABI from '../ABIs/clearingHouseViewer';
import createProvider from '../../../../particle-auth';
import createConnectProvider from '../../../../particle-connect';

const clearingHouseViewerAddress = '0x131C3227239794B23cd07fb36c2f31b9Ba574CdE';
const clearingHouseAddress = '0x602969FFAddA7d74f5da69B817688E984Ba4EBbD';

export async function displayPositions(amms) {
  // let list: {
  //   position,
  //   leverage,
  //   asset,
  //   side,
  //   unrealizedPnl,
  //   marginRatio,
  //   withdrawableMargin,
  //   entryPrice,
  // }[] = [];
  let list;
  let userAccount;

  if (global.withAuth) {
    userAccount = global.loginAccount.publicAddress;
    console.log('Global Account:', global.loginAccount);
    web3 = this.createProvider();
    //  console.log(web3.eth.getAccounts());
  } else {
    userAccount = global.connectAccount.publicAddress;
    console.log('Global Account:', global.connectAccount);
    console.log('Global Wallet Type:', global.walletType);
    web3 = this.createConnectProvider();
    // this.signAndSendTransactionConnect(
    //   '0xb02ccaf699f4708b348d2915e40a1fa31a2b4279',
    //   '1000000000000000',
    // );
  }

  const clearingHouse = new web3.eth.Contract(
    clearingHouseABI.abi,
    clearingHouseAddress,
  );
  const clearingHouseViewer = new web3.eth.Contract(
    clearingHouseViewerABI.abi,
    clearingHouseViewerAddress,
  );

  for (let i = 0; i < amms.length; i++) {
    // Look up position details from contract. Returns a `position` object
    try {
      let position = await clearingHouseViewer
        .getPersonalPositionWithFundingPayment(amms[i], userAccount)
        .then(async position => {
          let leverage = Number(position.openNotional).divUnsafe(
            position.margin,
          );
          let asset = position.amm;
          let side = position.size > 0 ? 'LONG' : 'SHORT';
          let unrealizedPnl = clearingHouseViewer.getUnrealizedPnl(
            amms[i],
            userAccount,
            'SPOT_PRICE',
          );
          let marginRatio = clearingHouseViewer.getMarginRatio(
            amms[i],
            userAccount,
          );
          let withdrawableMargin = clearingHouseViewer.getFreeCollateral(
            amms[i],
            userAccount,
          );
          const entryPrice = Number(position.openNotional).divUnsafe(
            position.size,
          );
          [unrealizedPnl, marginRatio, withdrawableMargin] = await Promise.all([
            unrealizedPnl,
            marginRatio,
            withdrawableMargin,
          ]);

          if (position.size != 0) {
            list.push({
              position: position,
              leverage: leverage,
              asset: asset,
              side: side,
              unrealizedPnl: unrealizedPnl,
              marginRatio: marginRatio,
              withdrawableMargin: withdrawableMargin,
              entryPrice: entryPrice,
            });
          }
        });
    } catch {}
    return list;
  }
}

export default async function getSpotPrice(amm) {
  try {
    const clearingHouse = new web3.eth.Contract(
      clearingHouseABI.abi,
      clearingHouseAddress,
    );
    let spotPrice = await clearingHouse.getSpotPrice(amm);
    return spotPrice;
  } catch (error) {
    return 0;
  }
}

export async function getPositionDetails(amm) {
  const clearingHouseViewer = new web3.eth.Contract(
    clearingHouseViewerABI.abi,
    clearingHouseViewerAddress,
  );
  let position =
    await clearingHouseViewer.getPersonalPositionWithFundingPayment(
      amm,
      userAccount,
    );
  return position;
}
