import React, {useEffect} from 'react';
import {
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
  View,
  Linking,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {Text} from '@rneui/themed';
import Video from 'react-native-video';
const successVideo = require('./successful.mov');
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SECRET_KEY_REMMITEX, POINTS_KEY} from '@env';
import CryptoJS from 'react-native-crypto-js';
import {Icon} from 'react-native-elements';
const windowWidth = Dimensions.get('window').width;

const addPoints = async (userId, transactionAmount) => {
  try {
    const address = global.withAuth
      ? global.loginAccount.scw
      : global.connectAccount.publicAddress;
    const response = await fetch('https://refer.xade.finance/updatePoints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': POINTS_KEY,
      },
      body: JSON.stringify({
        userId: address.toLowerCase(),
        increase: true,
        pointsChange:
          Math.ceil(transactionAmount) * 20 > 300
            ? 300
            : Math.ceil(transactionAmount) * 20,
      }),
    });

    const data = await response.json();
    if (data.points > 0) {
      return data.points;
    } else return 0;
  } catch (err) {
    return 0;
    console.error(err);
  }
};

export default function Component({navigation, route}) {
  const [isPoints, setIsPoints] = useState(true);
  const [showModal, setShowModal] = useState('what');
  const [address, setAddress] = useState('0x');
  const [mainnet, setMainnet] = useState(false);
  const [points, setPoints] = useState(0);
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const [fees, setFees] = useState('0');

  useEffect(() => {
    async function getAddress() {
      setFees(route.params.fees);
      console.log(fees);
      const _address = await AsyncStorage.getItem('address');
      console.log(_address);
      setAddress(_address);
      if (route.params.type == 'v2') {
        const inputValue = JSON.stringify({
          senderName: global.withAuth
            ? global.loginAccount.name
            : global.connectAccount.name,
          senderAddr: route.params.walletAddress,
          receiver: route.params.emailAddress,
          amount: route.params.amount,
          timestamp: Date.now(),
        });

        const encrypted = CryptoJS.AES.encrypt(
          inputValue,
          SECRET_KEY_REMMITEX,
        ).toString();

        const mainnetJSON = await AsyncStorage.getItem('mainnet');
        const _mainnet = JSON.parse(mainnetJSON);
        setMainnet(_mainnet);
        if (_mainnet) {
          fetch(`https://amtowe.api.xade.finance/mainnet`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: encrypted,
            }),
          })
            .then(res => res.text())
            .then(json => {
              console.log(json);
            });
        } else {
          fetch(`https://amtowe.api.xade.finance/testnet`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: encrypted,
            }),
          })
            .then(res => res.text())
            .then(json => {
              console.log(json);
            });
        }
      }
      const mainnetJSON = await AsyncStorage.getItem('mainnet');
      const _mainnet = JSON.parse(mainnetJSON);
      setMainnet(_mainnet);
      console.log('Mainnet', _mainnet);
      if (_mainnet == true) {
        try {
          const newPoints = Math.ceil(
            Number(
              await addPoints(_address.toLowerCase(), route.params.amount),
            ),
          );
          console.log('Points: ', newPoints);
          setPoints(
            Math.ceil(transactionAmount) * 20 > 300
              ? 300
              : Math.ceil(transactionAmount) * 20,
          );
        } catch (err) {
          console.log(err);
        }
      }
    }
    getAddress();
  }, []);

  const hash = route.params;
  console.log(route.params);
  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.backButton}>
          <Icon
            name="arrow-back"
            type="material"
            color="#fff"
            onPress={() => {
              navigation.push('Payments');
            }}
          />
        </TouchableOpacity>
        <View style={styles.content}>
          <View
            style={{
              width: '80%',
            }}>
            <Video
              source={successVideo}
              style={{
                width: Platform.OS == 'ios' ? 300 : 300,
                height: Platform.OS == 'ios' ? 200 : 200,
              }}
              resizeMode={'cover'}
              controls={false}
              repeat={true}
              muted={true}
              ref={ref => {
                this.player = ref;
              }}
            />
          </View>
          {/* </View> */}
          <Text style={styles.successText}>Success!</Text>
          {mainnet ? (
            <Text style={styles.amountText}>
              You've just earned {points} Xade coins
            </Text>
          ) : (
            <Text style={styles.amountText}>${route.params.amount}</Text>
          )}

          <Text style={styles.earnedCoinsText2}>
            You have successfully sent ${route.params.amount} to{' '}
            <Text
              style={{
                color: 'white',
                fontFamily: `EuclidCircularA-Medium`,
              }}>
              {route.params.walletAddress.slice(0, 10)}...
            </Text>{' '}
            via RemmiteX {route.params.type == 'v2' ? 'V2' : 'V1'} while just
            paying ${route.params.fees} in fees
          </Text>

          {/* <TouchableOpacity onClick={this.}>
          <Text>View Transaction On Block Explorer</Text>
        </TouchableOpacity> */}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#0c0c0c',
    fontFamily: `EuclidCircularA-Medium`,
  },
  content: {
    alignItems: 'center',
    fontFamily: `EuclidCircularA-Medium`,
    marginTop: '30%',
  },
  coinImage: {
    width: 150,
    height: 150,
  },
  successText: {
    fontSize: 24,
    // fontWeight: 'bold',
    color: '#2FBE6A',
    fontFamily: `EuclidCircularA-Medium`,
    marginBottom: 20,
    marginTop: '10%',
  },
  earnedCoinsText: {
    fontSize: 20,
    color: 'grey',
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: `EuclidCircularA-Medium`,
  },
  earnedCoinsText2: {
    fontSize: 20,
    color: 'grey',
    textAlign: 'center',
    // marginHorizontal: 20,
    fontFamily: `EuclidCircularA-Medium`,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  amountText: {
    fontSize: 50,
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: `EuclidCircularA-Medium`,
  },
});
