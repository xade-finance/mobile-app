import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as particleAuth from 'react-native-particle-auth';
import {enableScreens} from 'react-native-screens';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import createProvider from '../particle-auth';

const buttons = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', '⌫'],
];

let web3;

const width = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function renderButtons() {
  return buttons.map((row, i) => {
    return (
      <View key={`row-${i}`} style={styles.row}>
        {row.map(button => {
          return (
            <TouchableOpacity key={`button-${button}`} style={styles.button}>
              <Text style={styles.buttonText}>{button}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  });
}
export default function EnterAmountComponent({navigation, route}) {
  let imageUrl;
  let params = route.params;
  let [amount, setAmount] = React.useState('0');
  let [address, setAddress] = React.useState(1);
  let [name, setName] = React.useState('Unregistered User');
  let [gas, setGas] = React.useState('Calculating...');
  const json = {mobileNumber: 0, emailAddress: 0, walletAddress: 0, ...params};

  // console.log('Address: ', address);
  console.log('Params: ', params);

  async function calculateGas() {
    try {
      web3 = this.createProvider();
      const gasPrice = Number(await web3.eth.getGasPrice());
      console.log('Calculating gas');
      if (global.withAuth) {
        console.log(route.params);
        if (route.params.type == 'v2') {
          const gasNeeded = Number('51975');
          const gasFees = 1.1 * 2 * gasNeeded * gasPrice;
          setGas(
            Number(web3.utils.fromWei(gasFees.toString(), 'ether')).toFixed(3),
          );
        } else {
          const gasNeeded = Number('90000') + Number('60000');
          const gasFees = 1.2 * gasNeeded * gasPrice;
          console.log('Gas:', web3.utils.fromWei(gasFees.toString(), 'ether'));
          setGas(
            Number(web3.utils.fromWei(gasFees.toString(), 'ether')).toFixed(3),
          );
        }
      } else {
        setGas('0.2');
      }
    } catch (err) {
      console.err(err);
    }
  }

  function handleButtonPress(button) {
    if (button !== '' && button !== '⌫' && button !== '.') {
      if (amount != '0') setAmount(amount + button);
      else setAmount(button);
    } else if (button === '⌫') {
      setAmount(amount.slice(0, -1));
    } else if (button === '.') {
      if (!amount.includes('.')) setAmount(amount + '.');
    }
  }

  useEffect(() => {
    console.log('Is Auth:', global.withAuth);

    if (route.params.type == 'email') {
      fetch(
        `https://user.api.xade.finance/polygon?address=${route.params.walletAddress.toLowerCase()}`,
        {
          method: 'GET',
        },
      )
        .then(response => {
          console.log(response);
          if (response.status == 200) {
            return response.text();
          } else return '';
        })
        .then(data => {
          setName(data);
        });
    }

    if (route.params.type == 'wallet') {
      route.params.emailAddress = 'Not Set';
    }

    calculateGas();
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
          left:'4%',
          width: width * 0.8,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between', 
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
            fontFamily: `Sarala-Regular`,
            color: 'white',
            letterSpacing: 0.5,
          }}>
          Transfer
        </Text>
        <View style={styles.send}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: `Sarala-Regular`,
              color: 'white',
            }}>
            Send to
          </Text>
          <View style={styles.details}>
            <FastImage
              style={{width: 50, height: 50}}
              source={{
                uri: `https://ui-avatars.com/api/?name=${name}&format=png&rounded=true&bold=true&background=ffbd59&color=0C0C0C`,
              }}
            />
            <View style={{width: '80%', marginLeft: '0%'}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: route.params.type == 'email' ? 25 : 18,
                  fontFamily: `Sarala-Regular`,
                }}>
                {route.params.type == 'email'
                  ? name
                  : route.params.emailAddress}
              </Text>
              <Text
                style={{
                  color: '#A4A4A4',
                  fontFamily: `Sarala-Regular`,
                  fontSize: 13,
                }}>
                {route.params.type == 'email'
                  ? route.params.emailAddress
                  : name}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.enterAmount}>
          <Text
            style={{
              fontSize: 22,
              fontFamily: `Sarala-Regular`,
              color: 'white',
            }}>
            Enter amount
          </Text>
        </View>
        <View style={styles.amountInfo}>
          <View style={styles.amount}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                textAlign: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 35,
                  color: 'white',
                  fontFamily: `Sarala-Regular`,
                  textAlign: 'center',
                }}>
                $
              </Text>
              <Text
                style={{
                  fontSize: 40,
                  color: 'white',
                  fontFamily: `Sarala-Regular`,
                  textAlign: 'center',
                }}>
                {amount}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                marginTop: '2%',
                fontSize: 20,
                fontFamily: `Sarala-Regular`,
                color: 'white',
              }}>
              {global.withAuth ? 'USDC' : 'MATIC'}
            </Text>
          </View>
        </View>
        <View style={styles.extradeets}>
          <Text
            style={{
              fontSize: 15,
              fontFamily: `Sarala-Regular`,
              color: '#898989',
            }}>
            Estimated gas:{' '}
            <Text
              style={{
                fontSize: 15,
                fontFamily: `Sarala-Regular`,
                color: 'white',
              }}>
              {gas + ' '}USDC
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: `Sarala-Regular`,
              color: '#898989',
            }}>
            Wallet address:{' '}
            <Text
              style={{
                fontSize: 15,
                fontFamily: `Sarala-Regular`,
                color: 'white',
              }}>
              {route.params.walletAddress.slice(0, 20)}...
            </Text>
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '10%',
          }}>
          {buttons.map((row, i) => {
            return (
              <View key={`row-${i}`} style={styles.row}>
                {row.map(button => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        handleButtonPress(button);
                      }}
                      key={`button-${button}`}
                      style={styles.button}>
                      <Text style={styles.buttonText}>{button}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
          <TouchableOpacity
            onPress={() =>
              amount != '' && amount != '0'
                ? navigation.push('Pending', {...json, amount})
                : ''
            }
            style={styles.confirmButton}>
            <Text
              style={{
                color: '#000',
                fontFamily: `Sarala-Bold`,
                // fontStyle:300,
                fontSize: 18,
              }}>
              Send money
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#0C0C0C',
    flex: 1,
    width: '85%',
    marginTop: '11%',
    // height: windowHeight,
    overflow:'scroll',
  },
  send: {
    marginTop: '1%',
  },
  details: {
    marginTop: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  enterAmount: {
    marginTop: '2%',
  },
  amount: {
    alignItems: 'center',
  },
  amountInfo: {
    width: '100%',
    marginTop: '1%',
    flexDirection: 'row',
    paddingBottom: 5,
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderBottomColor: '#727272',
  },
  row: {
    flexDirection: 'row',
    borderColor: 'grey',
  },
  button: {
    width: 90,
    height: 65,
    borderRadius: 25,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    fontFamily: `EuclidCircular${Platform.OS === 'ios' ? 'A' : ''}-Medium`,
  },
  confirmButton: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
  },
  extradeets: {
    marginTop: '7%',
  },
});
