import React, {useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
// import Video from 'react-native-video';
import {signAndSendTransactionConnect} from '../../../particle-connect';
import * as particleAuth from 'react-native-particle-auth';
import * as particleConnect from 'react-native-particle-connect';
import ethProvider from './../integration/ethProvider';
import {PROJECT_ID, CLIENT_KEY} from 'react-native-dotenv';
import createProvider from '../../../../particle-auth';
import createConnectProvider from '../../../../particle-connect';

const Web3 = require('web3');
import Video from 'react-native-video';

const successVideo = require('./pending.mov');

export default function Component({route, navigation}) {
  const {withdraw, amount, web3} = route.params;

  console.log('Web3 not being carried to pending:', web3);
  // const provider = Web3(ALCHEMY_URL)

  useEffect(async () => {
    let status;
    console.log('Is Auth:', global.withAuth);
    if (global.withAuth) {
      // web3 = this.createProvider(PROJECT_ID, CLIENT_KEY);
      const {withdrawAmount, provideLiquidityToContract, getUserPoolBalance} =
        ethProvider({web3});
      const address = global.loginAccount.publicAddress;
      console.log('Global Account:', global.loginAccount);
      console.log('IsWithdraw: ' + withdraw);
      if (withdraw) {
        const balance = await getUserPoolBalance();
        console.log(balance, amount);
        if (parseInt(balance) < parseInt(amount)) {
          navigation.navigate('Unsuccessful');
          return;
        }
        const status = await withdrawAmount(amount);
        if (status) {
          navigation.navigate('SavingsSuccessful', {
            withdraw: true,
            amount: amount,
          });
        } else {
          navigation.navigate('Unsuccessful');
        }
      } else {
        const status = await provideLiquidityToContract(amount);
        if (status) {
          navigation.navigate('SavingsSuccessful', {
            withdraw: false,
            amount: amount,
          });
        } else {
          navigation.navigate('Unsuccessful');
        }
      }
    } else {
      // web3 = this.createConnectProvider(PROJECT_ID, CLIENT_KEY);
      const {withdrawAmount, provideLiquidityToContract, getUserPoolBalance} =
        ethProvider({web3});
      const address = global.connectAccount.publicAddress;
      console.log(provideLiquidityToContract);
      console.log('Global Account:', global.connectAccount);
      console.log('IsWithdraw: ' + withdraw);
      console.log('Amount: ' + amount);
      if (withdraw) {
        const balance = await getUserPoolBalance();
        console.log(balance, amount);
        if (parseInt(balance) < parseInt(amount)) {
          navigation.navigate('Unsuccessful');
          return;
        }
        const status = await withdrawAmount(amount);
        if (status) {
          navigation.navigate('SavingsSuccessful', {
            withdraw: true,
            amount: amount,
          });
        } else {
          navigation.navigate('Unsuccessful');
        }
      } else {
        console.log('Works Up Until Here');
        const status = await provideLiquidityToContract(amount);
        console.log('Status:', status);
        if (status) {
          navigation.navigate('SavingsSuccessful', {
            withdraw: false,
            amount: amount,
          });
        } else {
          navigation.navigate('Unsuccessful');
        }
      }
    }
  }, []);

  return (
    <View style={{width: '100%', height: '100%', backgroundColor: '#0C0C0C'}}>
      <Text
        style={{
          color: '#fff',
          fontSize: 30,
          marginTop: '20%',
          textAlign: 'center',
          fontFamily: 'NeueMachina-UltraBold',
        }}>
        Transaction Pending
      </Text>
      {/* <View style={{width: '80%', marginTop: '30%', marginLeft: '11%'}}></View> */}
      {/* <TouchableOpacity onPress={() => navigation.navigate('Payments')}>
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            marginTop: '20%',
            textAlign: 'center',
            fontFamily: 'VelaSans-Bold',
          }}>
          Return Home
        </Text>
      </TouchableOpacity> */}
      <View style={{width: '80%', marginTop: '30%', marginLeft: '12%'}}>
        <Video
          source={successVideo}
          style={{width: 300, height: 300}}
          controls={false}
          repeat={true}
          ref={ref => {
            this.player = ref;
          }}
        />
      </View>
    </View>
  );
}

/*

      const sender = await particleAuth.getAddress();
      const receiver = '0x1a2eaf515a6ca05bfab9bf3d9850ea29e5c7882e';
      const amount = '1';
      const chainInfo = await particleAuth.getChainInfo();
      console.log(chainInfo);
      let transaction = '';
      if (chainInfo.chain_name.toLowerCase() == 'solana') {
        transaction = await Helper.getSolanaTransaction(sender);
      } else {
        transaction = await getEvmTokenTransaction({sender, receiver, amount});
      }
      console.log(transaction);
      const result = await particleAuth.signAndSendTransaction(transaction);
      if (result.status) {
        const signature = result.data;
        console.log(signature);
      } else {
        const error = result.data;
        console.log(error);
      }
            */
