import React, {Component, useEffect, useState} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Button,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import {Text} from '@rneui/themed';

import {PNAccount} from '../../Models/PNAccount';
import { Polygon } from '@particle-network/chains';
import * as particleAuth from 'react-native-particle-auth';
import * as particleConnect from 'react-native-particle-connect';

import {WalletType, ChainInfo, Env} from 'react-native-particle-connect';

import AsyncStorage from '@react-native-async-storage/async-storage';

import TouchID from 'react-native-touch-id';

import 'react-native-get-random-values';
import '@ethersproject/shims';
import {ethers} from 'ethers';
import {err} from 'react-native-svg/lib/typescript/xml';

var DeviceInfo = require('react-native-device-info');
// const TextEncodingPolyfill = require('text-encoding');
// const BigInt = require('big-integer');

// Object.assign(global, {
//   TextEncoder: TextEncodingPolyfill.TextEncoder,
//   TextDecoder: TextEncodingPolyfill.TextDecoder,
//   BigInt: BigInt,
// });

global.TextEncoder = require('text-encoding').TextEncoder;


const optionalConfigObject = {
  title: 'Authentication Required To Login',
  sensorErrorDescription: 'Failed', // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: true, //
};

const LoginCheck = async ({navigation, setLoadingText}) => {
  try {
    const mainnetJSON = await AsyncStorage.getItem('mainnet');
    const faceIDJSON = await AsyncStorage.getItem('faceID');
    const connectedJSON = await AsyncStorage.getItem('isConnected');

    if (!mainnetJSON)
      await AsyncStorage.setItem('mainnet', JSON.stringify(true));
    if (!faceIDJSON)
      await AsyncStorage.setItem('faceID', JSON.stringify(false));
    if (!connectedJSON)
      await AsyncStorage.setItem('isConnected', JSON.stringify(false));

    const mainnet = JSON.parse(mainnetJSON);
    const faceID = JSON.parse(faceIDJSON);
    const connected = JSON.parse(connectedJSON);

    global.faceID = faceID;

    console.log('FaceID Enabled:', faceID);

    global.mainnet = mainnet;

    console.log(Polygon);

    particleAuth.init(
      Polygon,
      // particleAuth.ChainInfo.PolygonMainnet,
      particleAuth.Env.Production,
    );

    console.log("--------------------------------");

    console.log('Device ID:', DeviceInfo.getUniqueIdSync());

    console.log('Checking if user is logged in');
    const result = await particleAuth.isLogin();
    console.log(result ? 'Logged In' : 'Not Logged In');
    if (result) {
      if (faceID) {
        setLoadingText('Waiting For FaceID Authentication...');

        TouchID.isSupported(optionalConfigObject)
          .then(biometryType => {
            if (biometryType === 'FaceID') {
              console.log('FaceID is supported.');
            } else {
              console.log('TouchID is supported.');
            }
            TouchID.authenticate('Login', optionalConfigObject)
              .then(async success => {
                console.log(success);
                var name;
                var scwAddress;
                var account = await particleAuth.getUserInfo();
                account = JSON.parse(account);

                let email = account.email
                  ? account.email.toLowerCase()
                  : account.phone
                  ? account.phone
                  : account.googleEmail.toLowerCase();

                console.log('Phone/Email:', email);

                console.log(account);
                console.log("----------");

                const uuid = account.wallets[0].uuid;

                const address = await particleAuth.getAddress();

                console.log(address);

                await AsyncStorage.setItem('address', address);

                setLoadingText('Fetching User Info...');

                if (email.includes('@')) {
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
                    .then(data => {
                      console.log('SCW:', data);
                      if (data == 0) {
                        navigation.push('LoggedOutHome');
                      }
                      scwAddress = data;
                    });
                } else {
                  email = email.slice(1);
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
                    .then(data => {
                      console.log('SCW:', data);
                      if (data == 0) {
                        navigation.push('LoggedOutHome');
                      }
                      scwAddress = data;
                    });
                }
                await fetch(
                  `https://user.api.xade.finance/polygon?address=${scwAddress.toLowerCase()}`,
                  {
                    method: 'GET',
                  },
                )
                  .then(response => {
                    if (response.status == 200) {
                      return response.text();
                    } else return '';
                  })
                  .then(data => {
                    name = data;
                  });

                global.loginAccount = new PNAccount(
                  email,
                  name,
                  address,
                  scwAddress,
                  uuid,
                );
                global.withAuth = true;

                try{
                  await fetch(
                    `https://mongo.api.xade.finance/spritz?address=${scwAddress.toLowerCase()}`,
                    {
                      method: 'GET',
                    },
                  )
                  .then(response => {
                    if (response.status == 200) {
                      return response.text();
                    } else return '';
                  })
                  .then(async data => {
                    name = data;
                    try{
                      if (data !== ''){
                        await AsyncStorage.setItem('spritzAPI', data);
                      }
                    }catch(e) {
                      console.log(e);
                    }
                  });
                }catch(e){
                  console.log(e);
                }
        

                console.log('Logged In:', global.loginAccount);
                navigation.push('Payments');
                console.log('Navigating To Payments');
              })
              .catch(error => {
                console.log(error);
                navigation.push('Error');
              });
          })
          .catch(error => {
            console.log(error);
            Alert.alert('Auth Not Supported');
          });
      } else {
        var name;
        var scwAddress;
        var account = await particleAuth.getUserInfo();
        account = JSON.parse(account);

        let email = account.email
          ? account.email.toLowerCase()
          : account.phone
          ? account.phone
          : account.googleEmail.toLowerCase();

        console.log('Phone/Email:', email);

        const uuid = account.wallets[0].uuid;

        const address = await particleAuth.getAddress();

        await AsyncStorage.setItem('address', address);

        setLoadingText('Fetching User Info...');

        if (email.includes('@')) {
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
            .then(data => {
              console.log('SCW:', data);
              if (data == 0) {
                navigation.push('LoggedOutHome');
              }
              scwAddress = data;
            });
        } else {
          email = email.slice(1);
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
            .then(data => {
              console.log('SCW:', data);
              if (data == 0) {
                navigation.push('LoggedOutHome');
              }
              scwAddress = data;
            });
        }
        await fetch(
          `https://user.api.xade.finance/polygon?address=${scwAddress.toLowerCase()}`,
          {
            method: 'GET',
          },
        )
          .then(response => {
            if (response.status == 200) {
              return response.text();
            } else return '';
          })
          .then(data => {
            name = data;
          });

        global.loginAccount = new PNAccount(
          email,
          name,
          address,
          scwAddress,
          uuid,
        );
        global.withAuth = true;

        try{
          await fetch(
            `https://mongo.api.xade.finance/spritz?address=${scwAddress.toLowerCase()}`,
            {
              method: 'GET',
            },
          )
          .then(response => {
            if (response.status == 200) {
              return response.text();
            } else return '';
          })
          .then(async data => {
            name = data;
            try{
              if (data !== ''){
                await AsyncStorage.setItem('spritzAPI', data);
              }
            }catch(e) {
              console.log(e);
            }
          });
        }catch(e){
          console.log(e);
        }

        console.log('Logged In:', global.loginAccount);
        navigation.push('Payments');
        console.log('Navigating To Payments');
      }
    } else {
      if (connected) {
        await fetch(
          `https://user.api.xade.finance/uuid?uuid=${DeviceInfo.getUniqueIdSync().toString()}`,
          {
            method: 'GET',
          },
        )
          .then(response => {
            if (response.status == 200) {
              return response.text();
            } else {
              console.log('First Nav');
              console.log('Not Logged In');
              navigation.push('LoggedOutHome');
              console.log('Navigating To Home');
              return '';
            }
          })
          .then(async data => {
            const address = data;
            await AsyncStorage.setItem('address', address);
            fetch(
              `https://user.api.xade.finance/polygon?address=${address.toLowerCase()}`,
              {
                method: 'GET',
              },
            )
              .then(response => {
                if (response.status == 200) {
                  return response.text();
                } else return '';
              })
              .then(conname => {
                async function checkConnect() {
                  const metadata = {
                    name: 'Xade Finance',
                    icon: 'https://res.cloudinary.com/xade-finance/image/upload/v1686484249/VbwDFynB_400x400_lnbuv9.jpg',
                    url: 'https://xade.finance',
                  };
                  const rpcUrl = {
                    evm_url: 'https://rpc.ankr.com/polygon_mainnet',
                    solana_url: null,
                  };

                  particleConnect.init(
                    Polygon,
                    Env.Production,
                    metadata,
                    rpcUrl,
                  );

                  console.log('Name:', conname);
                  const name = conname;
                  const uuid = DeviceInfo.getUniqueIdSync().toString();
                  const types = [
                    WalletType.MetaMask,
                    WalletType.Alpha,
                    WalletType.Trust,
                    WalletType.Rainbow,
                    WalletType.WalletConnect,
                  ];
                  try {
                    let f = false;
                    for (let i = 0; i < types.length; i++) {
                      if (
                        await particleConnect.isConnected(types[i], address)
                      ) {
                        if (faceID) {
                          setLoadingText(
                            'Waiting for FaceID Authentication...',
                          );

                          TouchID.isSupported(optionalConfigObject)
                            .then(biometryType => {
                              if (biometryType === 'FaceID') {
                                console.log('FaceID is supported.');
                              } else {
                                console.log('TouchID is supported.');
                              }
                              TouchID.authenticate(
                                'Login',
                                optionalConfigObject,
                              )
                                .then(async success => {
                                  f = true;
                                  console.log(success);
                                  global.connectAccount = new PNAccount(
                                    types[i],
                                    name,
                                    address,
                                    address,
                                    uuid,
                                  );
                                  await particleConnect.reconnectIfNeeded(
                                    types[i],
                                    address,
                                  );
                                  global.withAuth = false;
                                  global.walletType = types[i];
                                  console.log(
                                    'Logged In:',
                                    global.connectAccount,
                                  );

                                  try{
                                    await fetch(
                                      `https://mongo.api.xade.finance/spritz?address=${address.toLowerCase()}`,
                                      {
                                        method: 'GET',
                                      },
                                    )
                                    .then(response => {
                                      if (response.status == 200) {
                                        return response.text();
                                      } else return '';
                                    })
                                    .then(async data => {
                                      name = data;
                                      try{
                                        await AsyncStorage.setItem('spritzAPI', data);
                                      }catch(e) {
                                        console.log(e);
                                      }
                                    });
                                  }catch(e){
                                    console.log(e);
                                  }
                                  navigation.push('Payments');
                                  console.log('Navigating To Payments');
                                })
                                .catch(error => {
                                  console.log(error);
                                  navigation.push('Error');
                                });
                            })
                            .catch(error => {
                              console.log(error);
                              Alert.alert('Auth Not Supported');
                            });
                        } else {
                          f = true;
                          global.connectAccount = new PNAccount(
                            types[i],
                            name,
                            address,
                            uuid,
                          );
                          await particleConnect.reconnectIfNeeded(
                            types[i],
                            address,
                          );
                          global.withAuth = false;
                          global.walletType = types[i];
                          console.log('Logged In:', global.connectAccount);

                          try{
                            await fetch(
                              `https://mongo.api.xade.finance/spritz?address=${address.toLowerCase()}`,
                              {
                                method: 'GET',
                              },
                            )
                            .then(response => {
                              if (response.status == 200) {
                                return response.text();
                              } else return '';
                            })
                            .then(async data => {
                              name = data;
                              try{
                                if (data !== ''){
                                  await AsyncStorage.setItem('spritzAPI', data);
                                }
                              }catch(e) {
                                console.log(e);
                              }
                            });
                          }catch(e){
                            console.log(e);
                          }
                  
                          navigation.push('Payments');
                          console.log('Navigating To Payments');
                        }
                      }
                      if (!f && i > types.length - 1) {
                        console.log('Second Nav');
                        console.log('Not Connected Either');
                        navigation.push('LoggedOutHome');
                        console.log('Navigating To Home');
                      }
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }
                checkConnect();
              });
          });
      } else {
        console.log('Third Nav');
        console.log('Not Connected Either');
        navigation.push('LoggedOutHome');
        console.log('Navigating To Home');
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const PreLoad = ({navigation}) => {
  const [loadingText, setLoadingText] = useState(
    'Prepare to enter a new era of finance...',
  );

  useEffect(() => {
    async function preLoadLog() {
      await LoginCheck({navigation, setLoadingText});
    }

    preLoadLog();
  }, []);
  return (
    <View style={styles.black}>
      <Text style={styles.logo}>XADE</Text>
      <View
        style={{
          marginTop: '90%',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size={30} style={styles.loader} color="#fff" />
        <Text style={styles.logging}>
          {'  '}
          {loadingText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  black: {
    width: '100%',
    backgroundColor: '#0C0C0C',
    height: '100%',
  },

  logo: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: '63%',
    fontSize: 50,
    fontFamily: 'LemonMilk-Regular',
  },

  logging: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    marginTop: '5%',
    fontFamily: `EuclidCircularA-Medium`,
  },
});
export default PreLoad;
