import * as particleAuth from 'react-native-particle-auth';
import * as particleConnect from 'react-native-particle-connect';
import createProvider from '../../../particle-auth';
import getOnlyProvider from '../../../particle-auth';
import createConnectProvider from '../../../particle-connect';
import {EventsCarousel} from './eventsCarousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import XUSD_ABI from './XUSD';
import USDC_ABI from './USDC';
import {SABEX_LP} from '@env';
import {BICONOMY_API_KEY, BICONOMY_API_KEY_MUMBAI, POLYGON_API_KEY} from '@env';
import transferXUSD from './remmitexv1';
const Web3 = require('web3');
import {Alert} from 'react-native';

import {IPaymaster, ChainId} from '@biconomy/core-types';
import SmartAccount from '@biconomy/smart-account';

import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethers} from 'ethers';

const REMMITEX_CONTRACT = '0xf1Ff5c85df29f573003328c783b8c6f8cC326EB7';

const contractAddress = '0xA3C957f5119eF3304c69dBB61d878798B3F239D9';
const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

var weekday = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
var monthname = new Array(
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
);
var monthnameFull = new Array(
  'Jan',
  'Feb',
  'Mar',
  'April',
  'May',
  'June',
  'July',
  'August',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
);

async function getTokenBalance(contract, mainnet, eoa) {
  try {
    let result = await contract.methods
      .balanceOf(
        global.withAuth
          ? global.loginAccount.scw
          : global.connectAccount.publicAddress,
      )
      .call();
    const decimals = mainnet ? 6 : 18;
    const formattedResult = parseInt(result) / 10 ** decimals;
    console.log('Balance:', formattedResult);
    global.balance = formattedResult.toFixed(3).toString();
    return formattedResult.toFixed(3).toString();
  } catch (err) {
    console.log(err);
  }
}

export async function paymentsLoad(web3, eoa) {
  try {
    const mainnetJSON = await AsyncStorage.getItem('mainnet');
    const _mainnet = await JSON.parse(mainnetJSON);

    console.log('Mainnet:', _mainnet);

    if (global.withAuth) {
      if (_mainnet) {
        await particleAuth.setChainInfoAsync(
          particleAuth.ChainInfo.PolygonMainnet,
        );
      } else {
        await particleAuth.setChainInfoAsync(
          particleAuth.ChainInfo.PolygonMumbai,
        );
      }
    }

    const contract = new web3.eth.Contract(USDC_ABI, usdcAddress);
    const XUSDcontract = new web3.eth.Contract(XUSD_ABI, contractAddress);
    const balance = await getTokenBalance(
      _mainnet ? contract : XUSDcontract,
      _mainnet,
      eoa,
    );

    return {
      tokenBalance: balance,
      mainnet: _mainnet,
    };
  } catch (error) {
    console.error(error);
  }
}

export async function txHistoryLoad(eoa) {
  try {
    const mainnetJSON = await AsyncStorage.getItem('mainnet');
    const _mainnet = await JSON.parse(mainnetJSON);

    let arr = [];
    let date = [];

    await fetch(
      `https://api${
        _mainnet ? '' : '-testnet'
      }.polygonscan.com/api?module=account&action=tokentx&contractaddress=${
        _mainnet ? usdcAddress : contractAddress
      }&address=${
        global.withAuth
          ? global.loginAccount.scw
          : global.connectAccount.publicAddress
      }&sort=desc&apikey=${POLYGON_API_KEY}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json', // I added this line
        },
      },
    )
      .then(response => response.json())
      .then(data => {
        if (data.message != 'NOTOK') {
          const result = data.result;
          let len = result.length;
          for (let i = 0; i < len; i++) {
            let res = result[i];
            let val = res.value;
            const decimals = _mainnet ? 6 : 18;
            const etherValue = parseInt(val) / 10 ** decimals;
            var pubDate = new Date(res.timeStamp * 1000);

            var formattedTime =
              '0' +
              (pubDate.getHours() / 12 > 1
                ? pubDate.getHours() % 12
                : pubDate.getHours()) +
              ':' +
              pubDate.getMinutes() +
              (pubDate.getHours() / 12 > 1 ? ' pm' : ' am');

            var formattedDate =
              monthname[pubDate.getMonth()] + ' ' + pubDate.getDate();

            var month = monthnameFull[pubDate.getMonth()];

            const truth =
              res.from == (global.withAuth ? global.loginAccount.scw : eoa)
                ? false
                : true;
            const json = {
              truth: truth,
              to: res.to == SABEX_LP.toLowerCase() ? 'SabeX Deposit' : res.to,
              from:
                res.from == SABEX_LP.toLowerCase()
                  ? 'SabeX Withdrawal'
                  : res.from,
              value: etherValue,
              date: formattedDate,
              time: formattedTime,
              hash: res.hash,
              month: month,
            };
            date.push(formattedDate);
            arr.push(json);
          }
        }
      });

    const dates = [...new Set(date)];
    const state = arr;

    return {
      txDates: dates,
      txs: state,
    };
  } catch (err) {
    console.error('TxHistory Load:', err);
  }
}

export const addXUSD = async (navigation, walletAddress) => {
  try {
    const response = await fetch('https://refer.xade.finance/faucet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({address: walletAddress.toLowerCase()}),
    });

    // const data = await response.json();
    if (response.status === 200) Alert.alert('Test Money Sent');
    else Alert.alert('Unsuccessful');
    navigation.push('Payments');
    return 0;
  } catch (err) {
    console.error(err);
  }
};
