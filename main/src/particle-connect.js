import * as particleConnect from 'react-native-particle-connect';
import {PNAccount} from './Models/PNAccount';
import * as Helper from './helper';
import {
  Env,
  LoginType,
  SupportAuthType,
  WalletType,
} from 'react-native-particle-connect';
import {ChainInfo} from 'react-native-particle-connect';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Web3 from 'web3';
import {ParticleConnectProvider} from 'react-native-particle-connect';
import {PROJECT_ID, CLIENT_KEY} from '@env';

var DeviceInfo = require('react-native-device-info');

const projectId = PROJECT_ID;
const clientKey = CLIENT_KEY;

createConnectProvider = () => {
  let walletType = global.walletType;
  const provider = new ParticleConnectProvider({
    projectId,
    clientKey,
    walletType,
  });
  const web3 = new Web3(provider);
  return web3;
};

setChainInfo = async () => {
  const chainInfo = ChainInfo.PolygonMainnet;
  const result = await particleConnect.setChainInfo(chainInfo);
  console.log(result);
};

connect = async ({walleType}) => {
  console.log('Connect:', walleType);
  const result = await particleConnect.connect(walleType);
  // console.log(result);
  if (result.status) {
    console.log('connect success');
    const account = result.data;
    const email = `${walleType}@${account.publicAddress.toLowerCase()}`;
    const uuid = DeviceInfo.getUniqueIdSync();
    console.log(email, uuid);
    const name = account.name ? account.name : 'Not Set';
    global.connectAccount = new PNAccount(
      email,
      name,
      account.publicAddress,
      account.publicAddress,
      uuid,
    );
    console.log(global.connectAccount);
    await AsyncStorage.setItem('address', account.publicAddress);
    await AsyncStorage.setItem('isConnected', 'true');
    global.withAuth = false;
    const userInfo = result.data;
    console.log('User Info:', global.connectAccount);
  } else {
    const error = result.data;
    console.log('Error:', error);
  }
};

signAndSendTransactionConnect = async (receiver, amount) => {
  console.log(receiver, amount);
  const sender = global.connectAccount.publicAddress;
  const chainInfo = await particleConnect.getChainInfo();
  let transaction = '';
  if (chainInfo.chain_name.toLowerCase() == 'solana') {
    transaction = await Helper.getSolanaTransaction(sender);
  } else {
    transaction = await Helper.getEvmTokenTransaction(sender, receiver, amount);
  }
  console.log(transaction);
  const result = await particleConnect.signAndSendTransaction(
    global.walletType,
    global.connectAccount.publicAddress,
    transaction,
  );

  if (result.status) {
    const signature = result.data;
    console.log(signature);
    return true;
  } else {
    const error = result.data;
    console.log(error);
    return false;
  }
};

onClickConnect = async ({navigation, walletype}) => {
  global.mainnet = true;
  const metadata = {
    name: 'Xade Finance',
    icon: 'https://res.cloudinary.com/xade-finance/image/upload/v1686484249/VbwDFynB_400x400_lnbuv9.jpg',
    url: 'https://xade.finance',
  };
  const rpcUrl = {
    evm_url: 'https://rpc.ankr.com/polygon_mumbai',
    solana_url: null,
  };
  particleConnect.init(
    ChainInfo.PolygonMainnet,
    Env.Production,
    metadata,
    rpcUrl,
  );
  global.walletType = walletype;
  navigation.navigate('Loading');
  console.log('onClick:', walletype);

  await this.connect({walleType: walletype});

  var result = await particleConnect.isConnected(
    walletype,
    global.connectAccount.publicAddress,
  );

  console.log('Account Info:', global.connectAccount);

  console.log('Result:', result);
  if (result) {
    const address = global.connectAccount.publicAddress;
    const email = global.connectAccount.phoneEmail;
    const uuid = global.connectAccount.uiud;

    await fetch(
      `https://user.api.xade.finance/polygon?address=${address.toLowerCase()}`,
      {
        method: 'GET',
      },
    )
      .then(response => {
        console.log(response);
        if (response.status == 200) {
          return response.text();
        } else {
          navigation.push('EnterName');
        }
      })
      .then(data => {
        if (
          data == '' ||
          data.length == 0 ||
          data.toLowerCase() == email.toLowerCase() ||
          data == 'Not Set'
        ) {
          navigation.push('EnterName');
        } else {
          global.connectAccount.name = data;
          navigation.push('Payments');
        }
      });
  } else {
    navigation.navigate('Error');
  }
};

disconnect = async () => {
  const publicAddress = connectAccount.publicAddress;
  const result = await particleConnect.disconnect(
    global.walletType,
    publicAddress,
  );
  if (result.status) {
    console.log(result.data);
    console.log('Disconnected successfully');
  } else {
    const error = result.data;
    console.log(error);
  }
};

export default {
  onClickConnect,
  disconnect,
  signAndSendTransactionConnect,
  createConnectProvider,
};
