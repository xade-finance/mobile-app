import React, {useState, Component} from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  Clipboard,
  Alert,
  Modal,
  Linking,
  Dimensions,
  RefreshControl,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import styles from './payments-styles';
import {Icon} from 'react-native-elements';
import {useEffect} from 'react';
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
import {
  BICONOMY_API_KEY,
  BICONOMY_API_KEY_MUMBAI,
  SECRET_KEY_REMMITEX,
} from '@env';
import {paymentsLoad, addXUSD, txHistoryLoad} from './utils';
const Web3 = require('web3');

import {IPaymaster, ChainId} from '@biconomy/core-types';
import SmartAccount from '@biconomy/smart-account';

import 'react-native-get-random-values';

import '@ethersproject/shims';

import {ethers} from 'ethers';

import {transferUSDC} from './remmitexv1';

import images from './img/images';

let web3;
const REMMITEX_CONTRACT = '0xf1Ff5c85df29f573003328c783b8c6f8cC326EB7';
const windowHeight = Dimensions.get('window').height;
import {POLYGON_API_KEY} from '@env';
import {registerFcmToken} from '../../../utils/push';
const contractAddress = '0xA3C957f5119eF3304c69dBB61d878798B3F239D9';
const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

// import {transferUSDC} from './remmitexv1';

const PaymentsComponent = ({navigation}) => {
  const [state, setState] = React.useState([
    {
      truth: true,
      to: 'Loading',
      from: 'Loading',
      value: 0,
      hash: '',
      date: 'Loading',
      time: 'Loading...',
      month: 'Loading...',
    },
  ]);
  const [dates, setDates] = React.useState([]);
  const [address, setAddress] = useState('0x');
  const [balance, setBalance] = useState('0');
  const [transactionVisible, setTransactionVisible] = useState(false);
  const [mainnet, setMainnet] = useState(false);

  async function call() {
    const address = global.withAuth
      ? global.loginAccount.publicAddress
      : global.connectAccount.publicAddress;
    const web3 = global.withAuth
      ? this.createProvider()
      : this.createConnectProvider();

    const {tokenBalance, mainnet} = await paymentsLoad(web3, address);

    if (Number(tokenBalance) > 1000) {
      setBalance(Number(tokenBalance / 1000).toFixed(3) + ' K');
    } else {
      setBalance(tokenBalance);
    }

    setMainnet(mainnet);

    const {txDates, txs} = await txHistoryLoad(address);

    setDates(txDates);
    setState(txs);

    console.log('Request being sent for registration');
    await registerFcmToken(global.withAuth ? global.loginAccount.scw : address);

    console.log('Smart Account Needs To Be Loaded:', !global.smartAccount);

    if (global.withAuth) {
      if (!global.smartAccount) {
        let options = {
          activeNetworkId: mainnet
            ? ChainId.POLYGON_MAINNET
            : ChainId.POLYGON_MUMBAI,
          supportedNetworksIds: [
            ChainId.POLYGON_MAINNET,
            ChainId.POLYGON_MUMBAI,
          ],

          networkConfig: [
            {
              chainId: ChainId.POLYGON_MAINNET,
              dappAPIKey: BICONOMY_API_KEY,
            },
            {
              chainId: ChainId.POLYGON_MUMBAI,
              dappAPIKey: BICONOMY_API_KEY_MUMBAI,
            },
          ],
        };

        const particleProvider = this.getOnlyProvider();
        const provider = new ethers.providers.Web3Provider(
          particleProvider,
          'any',
        );

        let smartAccount = new SmartAccount(provider, options);
        smartAccount = await smartAccount.init();
        global.smartAccount = smartAccount;
      }
    }
  }

  useEffect(() => {
    console.log('Is Auth:', global.withAuth);

    call();
  }, []);
  const t = true;
  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        alignSelf: 'center',
      }}>
      <View style={styles.remmitexContainer}>
        <View style={styles.balanceContainer}>
          <Text
            style={{
              color: 'grey',
              fontFamily: 'EuclidCircularA-Medium',
              fontSize: 18,
            }}>
            Total Balance
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'EuclidCircularA-Medium',
                fontSize: 40,
                marginTop: '1%',
              }}>
              ${balance.split('.')[0]}
              <Text
                style={{
                  color: '#fff',
                  fontFamily: 'EuclidCircularA-Medium',
                  fontSize: 37,
                  marginTop: '1%',
                }}>
                {'.'}
                {balance.split('.')[1] ? balance.split('.')[1] : '00'}
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.sendRequest}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              navigation.push('SendEmail');
            }}>
            <Text
              style={{
                color: '#0B84FE',
                fontFamily: 'EuclidCircularA-Medium',
                fontSize: 17,
              }}>
              Send
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.depositButton}
            onPress={() => {
              {
                {
                  global.mainnet
                    ? navigation.push('FiatRamps')
                    : addXUSD(
                        navigation,
                        global.withAuth
                          ? global.loginAccount.scw
                          : global.connectAccount.publicAddress,
                      );
                }
              }
            }}>
            <Text
              style={{
                color: '#0B84FE',
                fontFamily: 'EuclidCircularA-Medium',
                fontSize: 17,
              }}>
              Deposit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.exploreContainer}>
        <Text
          style={{
            color: 'white',
            fontSize: 22,
            fontFamily: 'EuclidCircularA-SemiBold',
            paddingLeft: '4%',
          }}>
          Suggested For You 🔥
        </Text>
        <EventsCarousel
          images={images}
          navigation={navigation}
          address={
            global.withAuth
              ? global.loginAccount.scw
              : global.connectAccount.publicAddress
          }
          key={images}
        />
      </View>
      <View style={styles.transactionContainer}>
        <View style={styles.txHeading}>
          <Text
            style={{
              color: 'white',
              fontSize: 22,
              fontFamily: 'EuclidCircularA-SemiBold',
              paddingLeft: '4%',
            }}>
            Recent Transactions 💰
          </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(
                `https://${mainnet ? '' : 'mumbai.'}polygonscan.com/address/${
                  global.withAuth
                    ? global.loginAccount.scw
                    : global.connectAccount.publicAddress
                }`,
              );
            }}>
            <Text
              style={{
                color: '#0B84FE',
                fontFamily: 'EuclidCircularA-Medium',
                fontSize: 17,
                marginRight: '5%',
                paddingTop: 3,
              }}>
              See all
            </Text>
          </TouchableOpacity>
        </View>
        {state.length > 0 ? (
          <Text
            style={{
              fontFamily: 'EuclidCircularA-Medium',
              color: '#6f6f6f',
              fontSize: 17,
              marginLeft: '5%',
              marginTop: '2%',
            }}>
            {String(state[0].month)}
          </Text>
        ) : (
          ''
        )}
        {state.length > 0 ? (
          state.slice(0, 10).map(json => {
            return (
              <TouchableOpacity
                keyboardShouldPersistTaps={true}
                // onPress={() => {
                //   navigation.push('ViewTransaction', {json: json});
                // }}
                onPress={() => {
                  Linking.openURL(
                    `https://${mainnet ? '' : 'mumbai.'}polygonscan.com/tx/${
                      json.hash
                    }`,
                  );
                }}
                style={styles.transactions}
                key={state.indexOf(json)}>
                <View style={styles.transactionLeft}>
                  <FastImage
                    style={{width: 50, height: 50, borderRadius: 5}}
                    source={
                      json.truth == 2
                        ? require('./icon/pending.png')
                        : json.truth == 1
                        ? require('./icon/positive.png')
                        : require('./icon/negative.png')
                    }
                  />
                  <View style={styles.ttext}>
                    <TouchableHighlight
                      key={json.hash}
                      onPress={() => {
                        Clipboard.setString(json.truth ? json.from : json.to);
                        Alert.alert('Copied Address To Clipboard');
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontFamily: `EuclidCircularA-Medium`,
                          fontSize: 17,
                        }}>
                        {(json.truth
                          ? json.from ==
                            '0xc9DD6D26430e84CDF57eb10C3971e421B17a4B65'.toLowerCase()
                            ? 'RemmiteX V1'
                            : json.from.slice(0, 12) + '...'
                          : json.to ==
                            '0xc9DD6D26430e84CDF57eb10C3971e421B17a4B65'.toLowerCase()
                          ? 'RemmiteX V1'
                          : json.to
                        ).slice(0, 12) + '...'}
                      </Text>
                    </TouchableHighlight>

                    <Text
                      style={{
                        color: '#7f7f7f',
                        fontSize: 15,
                        fontFamily: `EuclidCircularA-Medium`,
                      }}>
                      {json.date}, {json.time}
                    </Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={{
                      color: json.truth ? '#7DFF68' : '#fff',
                      fontSize: 18,
                      fontFamily: `EuclidCircularA-Medium`,
                    }}>
                    {json.truth != 0 && json.truth != 2 ? '+' : '-'}$
                    {json.value.toFixed(3)}
                  </Text>
                  <Icon
                    // style={styles.tup}
                    name={'chevron-small-right'}
                    size={30}
                    color={'#7f7f7f'}
                    type="entypo"
                  />
                </View>
              </TouchableOpacity>
            );
          })
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

export default PaymentsComponent;
