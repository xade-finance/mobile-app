import {
  ChainInfo,
  LoginType,
  SupportAuthType,
  Env,
} from 'react-native-particle-auth';
import {Polygon} from '@particle-network/chains';
import * as particleAuth from 'react-native-particle-auth';
import {PNAccount} from './Models/PNAccount';
import * as Helper from './helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Web3 from 'web3';
import {ParticleProvider} from 'react-native-particle-auth';
import {PROJECT_ID, CLIENT_KEY} from '@env';
import {BICONOMY_API_KEY} from '@env';

import {IPaymaster, ChainId} from '@biconomy/core-types';
import SmartAccount from '@biconomy/smart-account';

import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethers} from 'ethers';
import Login from './screens/loggingIn/login';

const projectId = PROJECT_ID;
const clientKey = CLIENT_KEY;

createProvider = () => {
  const provider = new ParticleProvider({projectId, clientKey});
  const web3 = new Web3(provider);
  return web3;
};

getOnlyProvider = () => {
  const provider = new ParticleProvider({projectId, clientKey});
  return provider;
};

async function createSCW() {
  let options = {
    activeNetworkId: ChainId.POLYGON_MAINNET,
    supportedNetworksIds: [ChainId.POLYGON_MAINNET],

    networkConfig: [
      {
        chainId: ChainId.POLYGON_MAINNET,
        dappAPIKey: BICONOMY_API_KEY,
      },
    ],
  };
  const particleProvider = this.getOnlyProvider();
  const provider = new ethers.providers.Web3Provider(particleProvider, 'any');
  let smartAccount = new SmartAccount(provider, options);
  smartAccount = await smartAccount.init();
  global.smartAccount = smartAccount;
  return global.smartAccount.address;
}

web3_getAccounts = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('web3.eth.getAccounts', accounts);
};

init = async () => {
  const chainInfo = Polygon;
  const env = Env.Production;
  particleAuth.init(chainInfo, env);
};

setChainInfo = async () => {
  const chainInfo = Polygon;
  const result = await particleAuth.setChainInfo(chainInfo);
  console.log(result);
};

login = async () => {
  let scwAddress;
  let mobileLogin;
  const type = LoginType.Email;
  const supportAuthType = [LoginType.Phone];
  const result = await particleAuth.login(type, '', supportAuthType, false);
  const account = result.data;

  if (result.status) {
    let email = account.email
      ? account.email.toLowerCase()
      : account.googleEmail
      ? account.googleEmail
      : account.phone;

    if (email[0] == '+') {
      mobileLogin = true;
    }

    const name = account.name ? account.name : 'Not Set';
    const userInfo = result.data;
    const address = (await particleAuth.getAddress()).toLowerCase();
    await AsyncStorage.setItem('address', address);
    const uuid = userInfo.wallets[0].uuid
      ? userInfo.wallets[0].uuid
      : userInfo.uuid;

    console.log('User Info:', userInfo);

    if (mobileLogin) {
      email = email.slice(1);
      try {
        await fetch(
          `https://mobile.api.xade.finance/polygon?phone=${email.toLowerCase()}`,
          {
            method: 'GET',
          },
        )
          .then(response => {
            if (response.status == 200) {
              return response.text();
            } else return 0;
          })
          .then(async data => {
            if (data == 0) {
              scwAddress = await createSCW();
            } else scwAddress = data;
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await fetch(
          `https://emailfind.api.xade.finance/polygon?email=${email.toLowerCase()}`,
          {
            method: 'GET',
          },
        )
          .then(response => {
            if (response.status == 200) {
              return response.text();
            } else return 0;
          })
          .then(async data => {
            if (data == 0) {
              scwAddress = await createSCW();
            } else scwAddress = data;
          });
      } catch (err) {
        console.log(err);
      }
    }
    global.loginAccount = new PNAccount(
      email.toLowerCase(),
      name,
      address,
      scwAddress,
      uuid,
    );
    console.log(global.loginAccount);
    global.withAuth = true;
  } else {
    const error = result.data;
    console.log('Error:', error);
  }
};

logout = async navigation => {
  const result = await particleAuth.logout();
  console.log('Logged out successfully');
};

getUserInfo = async () => {
  var userInfo = await particleAuth.getUserInfo();
  userInfo = JSON.parse(userInfo);
  console.log(userInfo);
};

signAndSendTransaction = async (receiver, amount) => {
  console.log(receiver, amount);
  const sender = await particleAuth.getAddress();
  const chainInfo = await particleAuth.getChainInfo();
  let transaction = '';
  if (chainInfo.chain_name.toLowerCase() == 'solana') {
    transaction = await Helper.getSolanaTransaction(sender);
  } else {
    transaction = await Helper.getEvmTokenTransaction(sender, receiver, amount);
  }
  console.log(transaction);
  const result = await particleAuth.signAndSendTransaction(transaction);
  if (result.status) {
    const signature = result.data;
    console.log('TX Hash:', signature);
    return signature;
  } else {
    const error = result.data;
    console.log(error);
    return false;
  }
};

openAccountAndSecurity = async () => {
  particleAuth.openAccountAndSecurity();
};

openWebWallet = async () => {
  particleAuth.openWebWallet();
};

onClickLogin = async navigation => {
  global.mainnet = true;
  await this.init();

  navigation.push('Loading');

  await this.setChainInfo();
  await this.login();
  const result = await particleAuth.isLogin();

  console.log('Logged In:', result);
  if (result) {
    const address = global.loginAccount.publicAddress;
    const email = global.loginAccount.phoneEmail;
    const uuid = global.loginAccount.uiud;
    const scwAddress = global.loginAccount.scw;

    await fetch(
      `https://user.api.xade.finance/polygon?address=${scwAddress.toLowerCase()}`,
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
          global.loginAccount.name = data;
          navigation.push('Payments');
        }
      });
  } else {
    navigation.navigate('Error');
  }
};

export default {
  init,
  createProvider,
  getOnlyProvider,
  onClickLogin,
  openWebWallet,
  signAndSendTransaction,
  getUserInfo,
  logout,
  createSCW,
};
