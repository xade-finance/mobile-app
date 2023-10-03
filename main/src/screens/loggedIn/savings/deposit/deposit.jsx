import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {AAVE_V3_LENDING_POOL_ADDRESS} from '@env';
import Snackbar from 'react-native-snackbar';
import { initSmartWallet } from '../../payments/utils';
import { ethers } from 'ethers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import abi from '../../../../abi/aave-v3-pool.json';
import usdAbi from '../../../../abi/USDC';
import { PaymasterMode } from '@biconomy/paymaster';

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
export default function Deposit({navigation, route}) {
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
        // if (route.params.type == 'v2') {
        //   const gasNeeded = Number('51975');
        //   const gasFees = 1.1 * 2 * gasNeeded * gasPrice;
        //   setGas(
        //     Number(web3.utils.fromWei(gasFees.toString(), 'ether')).toFixed(3),
        //   );
        // } else {
          const gasNeeded = Number('90000') + Number('60000');
          const gasFees = 1.2 * gasNeeded * gasPrice;
          console.log('Gas:', web3.utils.fromWei(gasFees.toString(), 'ether'));
          setGas(
            Number(web3.utils.fromWei(gasFees.toString(), 'ether')).toFixed(3),
          );
        // }
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

  const depositToLendingPool = async (_amount) => {
    const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
    const lendingPoolAddress = AAVE_V3_LENDING_POOL_ADDRESS;
    const decimals = 6;
    
    const amount = ethers.utils.parseUnits(_amount, decimals);

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

      setGas(gasUSDC);

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

        let paymasterServiceData = {
            mode: PaymasterMode.SPONSORED,
        };

        const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
            userOp,
            paymasterServiceData
        );

        userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;

        const userOpResponse = await global.smartAccount.sendUserOp(userOp);
      
        const transactionDetail = await userOpResponse.wait()

        console.log(transactionDetail)
        console.log(transactionDetail.success)

        if (transactionDetail.success === true) {
          Snackbar.show({text: 'Transaction successful', duration: Snackbar.LENGTH_LONG});
          setTimeout(() => {
            navigation.navigate('savings');
          }, 2000);
        }else{
          Snackbar.show({text: 'Transaction failed', duration: Snackbar.LENGTH_LONG});
        }

      } catch (e) {
        console.error(e);
      }
    }else{
      console.log("------");
      console.log('handle for withConnect');
    }
  }

  useEffect(() => {
    console.log('Is Auth:', global.withAuth);
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
          Save 
        </Text>
        <View style={styles.send}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: `Sarala-Regular`,
              color: 'white',
            }}>
            Deposit to
          </Text>
          <View style={styles.details}>
            <FastImage
              style={{width: 50, height: 50}}
              source={{
                uri: `https://ui-avatars.com/api/?name=${`Savings Account`}&format=png&rounded=true&bold=true&background=ffbd59&color=0C0C0C`,
              }}
            />
            <View style={{width: '80%', marginLeft: '0%'}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: `Sarala-Regular`,
                }}>
                  {
                    `Savings Account`
                  }
              </Text>
              <Text
                style={{
                  color: '#A4A4A4',
                  fontFamily: `Sarala-Regular`,
                  fontSize: 13,
                }}>
                {`Stable savings rate`}
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
            Wallet address:{AAVE_V3_LENDING_POOL_ADDRESS}
            {/* {route.params.walletAddress.slice(0, 20)}... */}
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
                ? depositToLendingPool(amount)
                : Snackbar.show({'text': 'Invalid amount'})
            }
            style={styles.confirmButton}>
            <Text
              style={{
                color: '#000',
                fontFamily: `Sarala-Bold`,
                fontWeight: 300,
                fontSize: 18,
              }}>
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0C0C0C',
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
