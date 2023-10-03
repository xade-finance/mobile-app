import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
  View,
  Linking,
  ScrollView,
  Image,
} from 'react-native';
import {Text} from '@rneui/themed';
import CountDown from 'react-native-countdown-component';
import LinearGradient from 'react-native-linear-gradient';
import styles from './savings-styles';
import {Icon} from 'react-native-elements';
import ethProvider from './integration/ethProvider';
import createProvider from '../../../particle-auth';
import createConnectProvider from '../../../particle-connect';
import {POLYGON_API_KEY, SABEX_LP, BICONOMY_API_KEY, BICONOMY_API_KEY_MUMBAI, AAVE_V3_LENDING_POOL_ADDRESS} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
// import { PROJECT_ID, CLIENT_KEY } from 'react-native-dotenv'
import '@ethersproject/shims';

import abi from './aave-v3-pool';
import usdAbi from './USDC';
import remmitexAbi from '../../../abi/remmitex.json'
import SmartAccount from '@biconomy/smart-account';
// import XUSDAbi from './XUSD';
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { Wallet, providers, ethers } from 'ethers';
import { ChainId } from '@biconomy/core-types';
import { Bundler } from '@biconomy/bundler'
import { BiconomyPaymaster, PaymasterMode } from '@biconomy/paymaster';
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { initSmartWallet } from '../payments/utils';

let web3;
const contractAddress = '0xA3C957f5119eF3304c69dBB61d878798B3F239D9';

const Savings = ({navigation}) => {
  const [state, setState] = React.useState([
    {truth: true, to: '0', from: '0', value: 0},
  ]);
  const [mainnet, setMainnet] = React.useState(false);

  var monthname = new Array(
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  );

  const date = new Date().getDate();
  const month = monthname[new Date().getMonth() + 1];
  const t = true;

  // const provider = Web3(ALCHEMY_URL)
  // web3 = this.createProvider(PROJECT_ID, CLIENT_KEY);
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

  const {getUserPoolBalance} = ethProvider({web3});
  const [balance, setBalance] = useState('0.00');
  useEffect(() => {
    async function allLogic() {
      const mainnetJSON = await AsyncStorage.getItem('mainnet');
      const _mainnet = JSON.parse(mainnetJSON);
      console.log('Mainnet', _mainnet);
      setMainnet(_mainnet);

      if (_mainnet == false) {
        const balance = await getUserPoolBalance();
        console.log(balance);

        setBalance(balance);

        fetch(
          `https://api-testnet.polygonscan.com/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${authAddress}&apikey=${POLYGON_API_KEY}`,
        )
          .then(response => response.json())
          .then(data => {
            if (data.message != 'NOTOK') {
              // console.log(data.message);
              //         console.log(data);
              const result = data.result;
              // console.log('Arnav:', result);
              let len = result.length;
              let arr = [];
              for (let i = 0; i < len; i++) {
                let res = result[i];
                let val = res.value;
                const etherValue = web3.utils.fromWei(val, 'ether');
                var pubDate = new Date(res.timeStamp * 1000);
                var weekday = new Array(
                  'Sun',
                  'Mon',
                  'Tue',
                  'Wed',
                  'Thu',
                  'Fri',
                  'Sat',
                );

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

                var formattedDate =
                  monthname[pubDate.getMonth()] +
                  ' ' +
                  pubDate.getDate() +
                  ', ' +
                  pubDate.getFullYear();

                if (
                  res.from == SABEX_LP.toLowerCase() ||
                  res.to == SABEX_LP.toLowerCase()
                ) {
                  console.log(res);
                  const json = {
                    truth: authAddress.toString().toLowerCase() != res.to, // true while accepting
                    to: 'Withdraw',
                    from: 'Deposit',
                    value: etherValue,
                    date: formattedDate,
                  };
                  arr.push(json);
                }
              }
              console.log(arr);
              setState(arr.reverse());
            } else {
              console.log('Condition is working');
              setState([]);
              return;
            }
          });
      }
    }
    console.log('this is right');
    allLogic();
  }, []);


  useEffect(() => {

  },[])


  const depositToLendingPool = async (_amount="1") => {
    const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
    const lendingPoolAddress = AAVE_V3_LENDING_POOL_ADDRESS;
    const v1Address = '0xc9DD6D26430e84CDF57eb10C3971e421B17a4B65';

    const decimals = 6;

    console.log(123);
    
    const amount = ethers.utils.parseUnits(_amount, decimals);

    const isAuth = true;

    // if (global.withAuth) {
    //   authAddress = global.loginAccount.publicAddress;
    //   console.log('Global Account:', global.loginAccount);
    //   web3 = this.createProvider();
    // } else {
    //   authAddress = global.connectAccount.publicAddress;
    //   console.log('Global Account:', global.connectAccount);
    //   console.log('Global Wallet Type:', global.walletType);
    //   web3 = this.createConnectProvider();
    // }  

    console.log(authAddress);
    const mainnetJSON = await AsyncStorage.getItem('mainnet');
    const mainnet = JSON.parse(mainnetJSON);

    console.log("Mainnet:", mainnet);

    await initSmartWallet();

    if (global.withAuth) {
      console.log('Calculating Gas In USDC...');
  
      const contractGas = Number('90000');
      const approvalGas = Number('60000');
      const gasPrice = await web3.eth.getGasPrice();
      const gas = (contractGas + approvalGas) * gasPrice;
      const gasUSDC = Number(String(gas).substring(0, 5) * 1.15).toFixed(0);
      const totalAmount = Number(amount) + Number(gasUSDC);
  
      console.log('Total Gas:', web3.utils.fromWei(String(gas), 'ether'));
      console.log(
        'Total Gas In USDC:',
        web3.utils.fromWei(String(gasUSDC), 'mwei'),
      );
      console.log('Total Amount:', totalAmount);
  
      const usdcAbi = new ethers.utils.Interface(usdAbi);
      const contractAbi = new ethers.utils.Interface(abi);

      let txs = [];
  
      console.log('Creating Transactions...');
  
      try {
        const approveData = usdcAbi.encodeFunctionData('approve', [
          lendingPoolAddress,
          totalAmount,
        ]);
  
        const approveTX = {
          to: usdcAddress,
          data: approveData,
        };
  
        txs.push(approveTX);

        const sma = await global.smartAccount.getSmartAccountAddress()
        console.log(sma);

        const sendData = contractAbi.encodeFunctionData('supply', [
          usdcAddress,
          amount,
          sma,
          0
        ]);
  
        const sendTX = {
          to: lendingPoolAddress,
          data: sendData,
        };

        txs.push(sendTX);

        console.log(txs);
  
        console.log('Created Transactions Successfully...');
  
        console.log('Waiting For Approval...');

        const userOp = await global.smartAccount.buildUserOp(txs)

        const biconomyPaymaster = await global.smartAccount.paymaster;

        console.log(biconomyPaymaster);

        let paymasterServiceData = {
            mode: PaymasterMode.SPONSORED,
            // smartAccountInfo: {
            //   name: 'BICONOMY',
            //   version: '2.0.0'
            // },
        };

        console.log(paymasterServiceData);

        const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
            userOp,
            paymasterServiceData
        );

        console.log(paymasterAndDataResponse);
            
        userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

        // userOp.paymasterAndData = "0x"

        console.log(userOp);
      
        const userOpResponse = await global.smartAccount.sendUserOp(userOp);

        console.log(userOpResponse);
      
        const transactionDetail = await userOpResponse.wait()
      
        console.log("transaction detail below")
        console.log(transactionDetail)

        // const userOp1 = await global.smartAccount.buildUserOp(txs)

        // const biconomyPaymaster1 = await global.smartAccount.paymaster;

        // console.log(biconomyPaymaster1);

        // let paymasterServiceData1 = {
        //     mode: PaymasterMode.SPONSORED,
        //     // smartAccountInfo: {
        //     //   name: 'BICONOMY',
        //     //   version: '2.0.0'
        //     // },
        // };

        // console.log(paymasterServiceData1);

        // const paymasterAndDataResponse1 = await biconomyPaymaster.getPaymasterAndData(
        //     userOp1,
        //     paymasterServiceData1
        // );

        // console.log(paymasterAndDataResponse1);
            
        // userOp1.paymasterAndData = paymasterAndDataResponse1.paymasterAndData;

        // // userOp.paymasterAndData = "0x"

        // console.log(userOp1);
      
        // const userOpResponse1 = await global.smartAccount.sendUserOp(userOp1);

        // console.log(userOpResponse1);
      
        // const transactionDetail1 = await userOpResponse1.wait()
      
        // console.log("transaction detail below")
        // console.log(transactionDetail1)        
  
        console.log('Approved!');
  
      } catch (e) {
        console.error(e);

      }
    }else{
      console.log("------");
    }
  }

  const withdrawFromLendingPool = (amount) => {

  }

  return (
    <SafeAreaView style={{width: '100%', height: '100%'}}>
      {/* <View style={styles.topbar}>
        <Text style={styles.logo}>Savings</Text>
      </View> */}
      <View style={styles.container}>
        <View style={styles.fontContainer}>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text
              style={{
                color: '#6D797D',
                fontSize: 45,
                fontFamily: 'Sarala-Regular',
              }}>
              $
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 45,
                fontFamily: 'Sarala-Regular',
              }}>
              {balance.split('.')[0]}
            </Text>
            <Text
              style={{
                color: '#6D797D',
                fontSize: 30,
                fontFamily: 'Sarala-Regular',
                marginBottom: 5,
              }}>
              {'.'}
              {balance.split('.')[1] ? balance.split('.')[1] : '00'}
            </Text>
          </View>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Sarala-Bold',
              fontWeight: 300,
            }}>
            Total amount deposited
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '80%',
            height: 50,
            justifyContent: 'space-around',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={styles.depWith}
            onPress={() => {
              // depositToLendingPool("1");
              // navigation.navigate('Deposit');
              navigation.navigate('ComingSoon')
            }}>
            <LinearGradient
              colors={['#222', '#222']}
              useAngle
              angle={45}
              angleCenter={{x: 0.5, y: 0.5}}
              style={styles.innerDep}>
              <Icon
                // style={styles.tup}
                name={'plus'}
                // size={40}
                color={'#86969A'}
                type="feather"
              />
              <Text style={{color: '#86969A', fontFamily: 'Sarala-Bold', fontWeight:300}}>
                Deposit
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.depWith}
            onPress={() => {
              // navigation.navigate('Withdraw');
              navigation.navigate('ComingSoon');
            }}>
            <LinearGradient
              colors={['#222', '#222']}
              useAngle
              angle={45}
              angleCenter={{x: 0.5, y: 0.5}}
              style={styles.innerDep}>
              <Icon
                // style={styles.tup}
                name={'angle-down'}
                color={'#86969A'}
                // size={40}
                // color={t?'green': 'red'}
                type="font-awesome"
              />
              <Text style={{color: '#86969A', fontFamily: 'Sarala-Bold', fontWeight: 300}}>
                Withdraw
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            height: 232,
            justifyContent: 'space-around',
            marginTop: '10%',
          }}>
          <TouchableOpacity style={styles.depWith}>
            <LinearGradient
              colors={['#1D2426', '#383838']}
              useAngle
              angle={45}
              angleCenter={{x: 0.5, y: 0.5}}
              style={styles.innerDep2}>
              {/* <Image source={require('./img/dollar-dollar-color.png')} /> */}
              <FastImage
                style={{width: '100%', height: 170}}
                source={require('./img/dollar-dollar-color.png')}
              />
              <Text style={styles.amountText}>$0.00</Text>
              <Text style={styles.amountText2}>Interest earned</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.depWith}>
            <LinearGradient
              colors={['#1D2426', '#383838']}
              useAngle
              angle={45}
              angleCenter={{x: 0.5, y: 0.5}}
              style={styles.innerDep2}>
              <FastImage
                style={{width: '100%', height: 170}}
                source={require('./img/chart-dynamics.png')}
              />
              <Text style={styles.amountText}>0%</Text>
              <Text style={styles.amountText2}>
                APY on {month} {date}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.transactionContainer}>
        <View style={styles.heading}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontFamily: 'Sarala-Bold',
              fontWeight: 300
            }}>
            Transactions
          </Text>
          {/* <Text style = {{color: 'grey', fontSize: 20}}>See all</Text> */}
        </View>
        {state.length > 0 ? (
          <View>
            <Text style={styles.noTransaction}>
              Your Transactions Appear Here
            </Text>
          </View>
        ) : (
          <View>
            <Text style={styles.noTransaction}>
              Your Transactions Appear Here
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Savings;

{
  /*
          state.map(json => {
            // console.log(state);
            return (
              <View style={styles.transactions}>
                <View style={styles.transactionLeft}>
                  <Image
                    source={
                      json.truth
                        ? require('./icon/positive.png')
                        : require('./icon/negative.png')
                    }
                    style={{
                      borderWidth: 0,
                      width: 60,
                      height: 60,
                    }}
                  />
                  <View style={styles.ttext}>
                    <TouchableHighlight
                      onPress={() => {
                        Clipboard.setString(json.truth ? json.from : json.to);
                        Alert.alert('Copied Address To Clipboard');
                      }}>
                      <Text
                        style={{color: 'white', fontFamily: 'Sarala-Bold'}}>
                        {json.truth ? json.from : json.to}
                      </Text>
                    </TouchableHighlight>

                    <Text style={{color: 'grey', fontFamily: 'Sarala-Bold'}}>
                      {json.date}
                    </Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={{
                      color: json.truth ? '#4EE58B' : 'red',
                      fontSize: 20,
                      fontFamily: 'Sarala-Bold',
                    }}>
                    {json.truth ? '+' : '-'}
                    {json.value}
                  </Text>
                </View>
              </View>
            );
          }) */
}
