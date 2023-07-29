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
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'react-native-elements';
import {useEffect} from 'react';
import * as particleAuth from 'react-native-particle-auth';
import * as particleConnect from 'react-native-particle-connect';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {SABEX_LP} from '@env';
import {
  BICONOMY_API_KEY,
  BICONOMY_API_KEY_MUMBAI,
  SECRET_KEY_REMMITEX,
} from '@env';
const Web3 = require('web3');

import {IPaymaster, ChainId} from '@biconomy/core-types';
import SmartAccount from '@biconomy/smart-account';

import 'react-native-get-random-values';

import '@ethersproject/shims';

import {ethers} from 'ethers';

const width = Dimensions.get('window').width;

const Transaction = ({navigation, route}) => {
  let [sender, setSender] = useState('Unregistered User');

  const address = global.withAuth
    ? global.loginAccount.scw
    : global.connectAccount.publicAddress;
  const name = global.withAuth
    ? global.loginAccount.name
    : global.connectAccount.name;
  let params = route.params;
  let txDetails = params.json;

  console.log(txDetails);

  let from = txDetails.from == address ? `You` : sender;
  let fromAdditional =
    txDetails.from == address
      ? `${address.slice(0, 15)}...`
      : `${txDetails.from.slice(0, 20)}...`;

  let to = txDetails.to == address ? `You` : sender;
  let toAdditional =
    txDetails.to == address
      ? `${address.slice(0, 15)}...`
      : `${txDetails.from.slice(0, 20)}...`;

  useEffect(() => {
    async function getData(address) {
      fetch(
        `https://user.api.xade.finance/polygon?address=${address.toLowerCase()}`,
        {
          method: 'GET',
        },
      )
        .then(response => {
          if (response.status == 200) {
            return response.text();
          } else return 'Unregistered User';
        })
        .then(data => {
          setSender(data);
        });
    }

    getData(txDetails.from == address ? txDetails.to : txDetails.from);
  }, []);
  return (
    <SafeAreaView
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View
        style={{
          position: 'absolute',
          top: '1%',
          width: width * 0.8,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Icon
          name={'keyboard-backspace'}
          size={30}
          color={'#f0f0f0'}
          type="materialicons"
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 30,
            fontFamily: `${
              Platform.OS == 'ios'
                ? 'EuclidCircularA-Regular'
                : 'EuclidCircular-Medium'
            }`,
            color: 'white',
            letterSpacing: 0.5,
          }}>
          Transaction {txDetails.from == address ? 'Sent' : 'Received'}
        </Text>
        <View>
          <Text
            style={{
              color: '#fff',
              fontSize: 50,
              fontFamily: 'EuclidCircularA-Medium',
              textAlign: 'center',
            }}>
            ${txDetails.value.toFixed(4)}
          </Text>
        </View>
        <View style={{flexDirection: 'column', marginTop: '10%'}}>
          <Text
            style={{
              color: '#7f7f7f',
              fontSize: 17,
              fontFamily: 'EuclidCircularA-Regular',
            }}>
            From
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '2%',
            }}>
            <View>
              <FastImage
                style={{width: 50, height: 50}}
                source={{
                  uri: `https://ui-avatars.com/api/?name=${
                    txDetails.from == address ? name : sender
                  }&format=png&rounded=true&bold=true&background=ffbd59&color=0C0C0C`,
                }}
              />
            </View>
            <View style={{marginLeft: '5%'}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 25,
                  fontFamily: 'EuclidCircularA-Regular',
                }}>
                {from}
              </Text>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontFamily: 'EuclidCircularA-Regular',
                }}>
                {fromAdditional}
              </Text>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'column', marginTop: '5%'}}>
          <Text
            style={{
              color: '#7f7f7f',
              fontSize: 17,
              fontFamily: 'EuclidCircularA-Regular',
            }}>
            To
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '2%',
            }}>
            <View>
              <FastImage
                style={{width: 50, height: 50}}
                source={{
                  uri: `https://ui-avatars.com/api/?name=${
                    txDetails.to == address ? name : sender
                  }&format=png&rounded=true&bold=true&background=ffbd59&color=0C0C0C`,
                }}
              />
            </View>
            <View style={{marginLeft: '5%'}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 25,
                  fontFamily: 'EuclidCircularA-Regular',
                }}>
                {to}
              </Text>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontFamily: 'EuclidCircularA-Regular',
                }}>
                {toAdditional}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  enterAmount: {
    flexDirection: 'row',
  },

  dropdown: {
    margin: 10,
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
  },

  imageStyle: {
    width: 30,
    height: 30,
    backgroundColor: '#232E34',
  },

  container: {
    width: '80%',
    marginTop: '15%',
  },

  enterAmount: {
    width: '80%',
    borderRadius: 40,
    height: 50,
    backgroundColor: '#232E34',
    flexDirection: 'row',
  },

  confirmButton: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    marginTop: '8%',
    height: 55,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },

  sendMobile: {
    width: '100%',
    marginTop: '10%',
    marginBottom: 20,
    height: 55,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  sendWallet: {
    width: '100%',
    height: 55,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  enter: {
    marginTop: '5%',
  },

  subText: {
    marginTop: 15,
  },
});

export default Transaction;
