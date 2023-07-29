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
import {POLYGON_API_KEY, SABEX_LP} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
// import { PROJECT_ID, CLIENT_KEY } from 'react-native-dotenv'

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
                fontFamily: 'Benzin-Medium',
              }}>
              $
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: 45,
                fontFamily: 'Benzin-Medium',
              }}>
              {balance.split('.')[0]}
            </Text>
            <Text
              style={{
                color: '#6D797D',
                fontSize: 30,
                fontFamily: 'Benzin-Medium',
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
              fontFamily: 'VelaSans-Bold',
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
              navigation.navigate('ComingSoon');
            }}>
            <LinearGradient
              colors={['#1D2426', '#383838']}
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
              <Text style={{color: '#86969A', fontFamily: 'VelaSans-Bold'}}>
                Deposit
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.depWith}
            onPress={() => {
              navigation.navigate('ComingSoon');
            }}>
            <LinearGradient
              colors={['#1D2426', '#383838']}
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
              <Text style={{color: '#86969A', fontFamily: 'VelaSans-Bold'}}>
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
              fontFamily: 'VelaSans-Bold',
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
                        style={{color: 'white', fontFamily: 'VelaSans-Bold'}}>
                        {json.truth ? json.from : json.to}
                      </Text>
                    </TouchableHighlight>

                    <Text style={{color: 'grey', fontFamily: 'VelaSans-Bold'}}>
                      {json.date}
                    </Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={{
                      color: json.truth ? '#4EE58B' : 'red',
                      fontSize: 20,
                      fontFamily: 'VelaSans-Bold',
                    }}>
                    {json.truth ? '+' : '-'}
                    {json.value}
                  </Text>
                </View>
              </View>
            );
          }) */
}
