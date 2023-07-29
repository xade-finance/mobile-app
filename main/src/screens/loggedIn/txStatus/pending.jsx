import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {Text} from 'react-native-elements';
import Video from 'react-native-video';

import {signAndSendTransactionConnect} from '../../../particle-connect';
import * as particleAuth from 'react-native-particle-auth';
import * as particleConnect from 'react-native-particle-connect';

import getOnlyProvider from '../../../particle-auth';
import createConnectProvider from '../../../particle-connect';

import {
  transferUSDC,
  transferUSDCV2,
  transferXUSD,
  transferXUSDV2,
} from '../../loggedIn/payments/remmitexv1';

const Web3 = require('web3');

import AsyncStorage from '@react-native-async-storage/async-storage';
import {REMMITEX_TESTNET_CONTRACT} from '@env';

let web3;
let provider;
const successVideo = require('./pending.mov');

const Component = ({route, navigation}) => {
  // Params
  let [status, setStatus] = useState('Processing Transaction...');

  const {walletAddress, emailAddress, mobileNumber, type, amount} =
    route.params;

  console.log('Params:', route.params);

  const weiVal = Web3.utils.toWei(amount.toString(), 'ether');

  useEffect(() => {
    if (global.withAuth) {
      authAddress = global.loginAccount.publicAddress;
      console.log('Global Account:', global.loginAccount);
      web3 = this.createProvider();
    } else {
      authAddress = global.connectAccount.publicAddress;
      console.log('Global Account:', global.connectAccount);
      console.log('Global Wallet Type:', global.walletType);
      web3 = this.createConnectProvider();
    }

    const provider = this.getOnlyProvider();

    const transaction = async () => {
      const mainnetJSON = await AsyncStorage.getItem('mainnet');
      const mainnet = JSON.parse(mainnetJSON);
      let status;
      console.log('Is Auth:', global.withAuth);
      if (type !== 'v2') {
        if (mainnet) {
          try {
            const {status, fees} = await transferUSDC(
              global.smartAccount,
              amount,
              walletAddress,
              navigation,
              setStatus,
              global.withAuth,
            );
            console.log(fees);
            if (status)
              navigation.push('Successful', {
                status,
                type,
                emailAddress,
                walletAddress,
                amount,
                fees,
              });
            else navigation.push('Unsuccessful', {error: fees});
          } catch (err) {
            console.log(err);
          }
        } else {
          status = await transferXUSD(
            global.smartAccount,
            provider,
            amount,
            walletAddress,
          );
          console.log('TX1:', status);

          if (status == true)
            navigation.push('Successful', {
              status,
              type,
              emailAddress,
              walletAddress,
              amount,
              fees: 0,
            });
          else navigation.push('Unsuccessful');
        }
      } else {
        console.log('V2 being nicely executed');

        if (mainnet == false) {
          console.log('this part fine also');
          if (global.withAuth) {
            authAddress = global.loginAccount.publicAddress;
            console.log('Global Account:', global.loginAccount);
            status = await transferXUSDV2(
              global.smartAccount,
              provider,
              amount,
              REMMITEX_TESTNET_CONTRACT,
            );
            console.log('TX1:', status);
          } else {
            console.log('connecting');
            authAddress = global.connectAccount.publicAddress;
            console.log('Global Account:', global.connectAccount);
            status = await this.signAndSendTransactionConnect(
              REMMITEX_TESTNET_CONTRACT,
              weiVal,
            );
          }
          if (status !== false) {
            navigation.push('Successful', {
              status,
              type,
              emailAddress,
              walletAddress,
              amount,
              fees: 0,
            });
          }
        } else {
          try {
            console.log(
              'Reaching to state of calling function',
              global.smartAccount,
            );
            const {status, fees} = await transferUSDCV2(
              global.smartAccount,
              provider,
              amount,
              walletAddress,
              setStatus,
            );
            console.log(fees);
            if (status)
              navigation.push('Successful', {
                status,
                type,
                emailAddress,
                walletAddress,
                amount,
                fees,
              });
            else navigation.push('Unsuccessful', {error: fees});
          } catch (e) {
            console.log(e);
          }
        }
      }
    };

    transaction();
  }, []);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0C0C0C',
        flex: 1,
      }}
      contentContainerStyle={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: '#fff',
          fontSize: 30,
          marginTop: '20%',
          textAlign: 'center',
          fontFamily: `EuclidCircularA-Bold`,
        }}>
        Transaction Pending...
      </Text>
      <View style={{width: '100%', marginTop: '5%'}}>
        <Video
          source={successVideo}
          style={{
            width: Platform.OS == 'ios' ? '100%' : '100%',
            height: Platform.OS == 'ios' ? 300 : 300,
          }}
          resizeMode={'cover'}
          controls={false}
          muted={true}
          repeat={true}
          ref={ref => {
            this.player = ref;
          }}
        />
      </View>
      <View
        style={{
          marginTop: '7%',
          marginLeft: '10%',
        }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: `EuclidCircularA-Regular`,
            color: '#898989',
          }}>
          Amount:{' '}
          <Text
            style={{
              fontSize: 20,
              fontFamily: `EuclidCircularA-Regular`,
              color: 'white',
            }}>
            {'\n' + route.params.amount + ' '}USDC
          </Text>
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: `EuclidCircularA-Regular`,
            color: '#898989',
            marginTop: '5%',
          }}>
          Wallet address:{' '}
          <Text
            style={{
              fontSize: 20,
              fontFamily: `EuclidCircularA-Regular`,
              color: 'white',
            }}>
            {'\n' + route.params.walletAddress.slice(0, 20)}...
          </Text>
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontFamily: `EuclidCircularA-Regular`,
            color: '#898989',
            marginTop: '5%',
          }}>
          Transaction Type:{' '}
          <Text
            style={{
              fontSize: 20,
              fontFamily: `EuclidCircularA-Regular`,
              color: 'white',
            }}>
            {'\n'}
            {route.params.type == 'v2' ? 'RemmiteX V2' : 'RemmiteX V1'}
          </Text>
        </Text>
      </View>
      <View style={{marginTop: '20%'}}>
        <ActivityIndicator size={30} color="#fff" />
        <Text
          style={{
            fontSize: 20,
            fontFamily: `EuclidCircularA-Medium`,
            color: '#fff',
            textAlign: 'center',
            marginTop: '2%',
          }}>
          {status}
        </Text>
      </View>
    </View>
  );
};

export default Component;
