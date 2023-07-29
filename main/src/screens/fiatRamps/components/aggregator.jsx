import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import BuyCryptoPage from './widget';
import FastImage from 'react-native-fast-image';
const onrampLogo = require('./onramp.png');
const transakLogo = require('./transak.webp');
const onramperLogo = require('./onramper.png');
const wyre = require('./wyre.png');

const width = Dimensions.get('window').width;
import {Icon} from 'react-native-elements';

const windowHeight = Dimensions.get('window').height;

const FiatRamps = ({navigation}) => {
  const [widget, setWidget] = useState('transak');
  const [address, setAddress] = useState('0x');
  const [name, setName] = useState('0x');
  const [selected, setSelected] = useState('onramp');
  // if (global.withAuth) {
  //   setName(global.loginAccount.name);
  //   setAddress(global.loginAccount.publicAddress);
  // }
  // else {
  //   setName(global.connectAccount.name);
  //   setAddress(global.connectAccount.publicAddress);
  // }
  useEffect(() => {
    async function getAddress() {
      setAddress(await AsyncStorage.getItem('address'));
    }
    getAddress();
  });
  const handleOpenBuyCryptoModal = wid => {
    if (wid == 'wallet') {
      navigation.push('QRScreen');
      return;
    }
    setWidget(wid);
    setShowBuyCryptoModal(true);
  };

  const handleCloseBuyCryptoModal = () => {
    setShowBuyCryptoModal(false);
  };

  const [showBuyCryptoModal, setShowBuyCryptoModal] = useState(false);
  return (
    <SafeAreaView style={styles.black}>
      <View
        style={{
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
      <View
        style={{
          width: '80%',
          marginTop: '7%',
        }}>
        <Text
          style={{
            fontSize: 32,
            fontFamily: `EuclidCircularA-Regular`,
            color: 'white',
            letterSpacing: 0.5,
          }}>
          Deposit funds
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: `EuclidCircularA-Regular`,
            color: '#707070',
            marginTop: '5%',
          }}>
          Deposit funds from your wallet{'\n'} or convert your fiat to USDC
        </Text>
      </View>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setSelected('wallet');
          }}
          style={[
            styles.optionContainer,
            {marginTop: '10%'},
            selected == 'wallet' ? styles.selected : '',
          ]}>
          <View style={styles.insideText}>
            <View style={{flexDirection: 'row'}}>
              <Ionicons name="wallet-outline" size={24} color="#fff" />
              <Text style={styles.optionText}>From wallet</Text>
            </View>
            <View>
              <Text style={[styles.optionText, {color: '#2FBE6A'}]}>
                Available
              </Text>
            </View>
          </View>
          <View style={styles.hr} />
          <View style={styles.insideText}>
            <View style={{flexDirection: 'row'}}>
              {/* <Ionicons name="wallet-outline" size={24} color="#1abc9c" /> */}
              <Text style={styles.optionTextBelow}>
                Instant deposit & the highest buy limit
              </Text>
            </View>
            {/* <View><Text style={[styles.optionText, {color: '#2FBE6A'}]}>Available</Text></View> */}
          </View>
          {/* <View style={styles.hr} /> */}
        </TouchableOpacity>
        {showBuyCryptoModal && (
          <BuyCryptoPage
            name={name}
            address={address}
            widget={widget}
            uri={`https://onramp.money/main/buy/?appId=251363`}
            onClose={handleCloseBuyCryptoModal}
          />
        )}
        <TouchableOpacity
          onPress={() => setSelected('onramp')}
          style={[
            styles.optionContainer,
            selected == 'onramp' ? styles.selected : '',
            {marginTop: '4%'},
          ]}>
          <View style={styles.insideText}>
            <View style={{flexDirection: 'row'}}>
              <FastImage
                source={require('./onramp.png')}
                style={{
                  borderWidth: 0,
                  width: 24,
                  height: 24,
                }}
              />
              <Text style={styles.optionText}>Onramp</Text>
            </View>
            <View>
              <Text style={[styles.optionText, {color: '#2FBE6A'}]}>
                Available
              </Text>
            </View>
          </View>
          <View style={styles.hr} />
          <View style={styles.insideText}>
            <View style={{flexDirection: 'row'}}>
              {/* <Ionicons name="wallet-outline" size={24} color="#1abc9c" /> */}
              <Text style={styles.optionTextBelow}>
                Instant deposit & the highest buy limit
              </Text>
            </View>
            {/* <View><Text style={[styles.optionText, {color: '#2FBE6A'}]}>Available</Text></View> */}
          </View>
          {/* <View style={styles.hr} /> */}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionContainer, {marginTop: '4%'}]}>
          <View style={styles.insideText}>
            <View style={{flexDirection: 'row'}}>
              <FastImage
                source={require('./transak-logo.png')}
                style={{
                  borderWidth: 0,
                  width: 25,
                  height: 24,
                }}
              />
              <Text style={styles.optionText}>Transak</Text>
            </View>
            <View>
              <Text style={[styles.optionText, {color: '#E14C4C'}]}>
                Unavailable
              </Text>
            </View>
          </View>
          <View style={styles.hr} />
          <View style={styles.insideText}>
            <View style={{flexDirection: 'row'}}>
              {/* <Ionicons name="wallet-outline" size={24} color="#1abc9c" /> */}
              <Text style={styles.optionTextBelow}>
                Instant deposit & the highest buy limit
              </Text>
            </View>
            {/* <View><Text style={[styles.optionText, {color: '#2FBE6A'}]}>Available</Text></View> */}
          </View>
          {/* <View style={styles.hr} /> */}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionContainer, {marginTop: '4%'}]}>
          <View style={styles.insideText}>
            <View style={{flexDirection: 'row'}}>
              <FastImage
                source={require('./xade.jpg')}
                style={{
                  borderWidth: 0,
                  width: 35,
                  height: 24,
                }}
              />
              <Text style={styles.optionText}>Xade P2P</Text>
            </View>
            <View>
              <Text style={[styles.optionText, {color: '#E14C4C'}]}>
                Unavailable
              </Text>
            </View>
          </View>
          <View style={styles.hr} />
          <View style={styles.insideText}>
            <View style={{flexDirection: 'row'}}>
              {/* <Ionicons name="wallet-outline" size={24} color="#1abc9c" /> */}
              <Text style={styles.optionTextBelow}>
                Instant deposit & the highest buy limit
              </Text>
            </View>
            {/* <View><Text style={[styles.optionText, {color: '#2FBE6A'}]}>Available</Text></View> */}
          </View>
          {/* <View style={styles.hr} /> */}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.optionContainer, {marginTop: '4%'}]}>
          <View style={styles.insideText}>
            <View style={{flexDirection: 'row'}}>
              <FastImage
                source={require('./wyre.png')}
                style={{
                  borderWidth: 0,
                  width: 24,
                  height: 24,
                }}
              />
              <Text style={styles.optionText}>Wyre</Text>
            </View>
            <View>
              <Text style={[styles.optionText, {color: '#E14C4C'}]}>
                Unavailable
              </Text>
            </View>
          </View>
          <View style={styles.hr} />
          <View style={styles.insideText}>
            <View style={{flexDirection: 'row'}}>
              {/* <Ionicons name="wallet-outline" size={24} color="#1abc9c" /> */}
              <Text style={styles.optionTextBelow}>
                Instant deposit & the highest buy limit
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.optionContainer,
            {marginTop: '4%', marginBottom: '20%'},
          ]}>
          <View style={styles.insideText}>
            <View style={{flexDirection: 'row'}}>
              <FastImage
                source={require('./onramper.png')}
                style={{
                  borderWidth: 0,
                  width: 24,
                  height: 24,
                }}
              />
              <Text style={styles.optionText}>Onramper</Text>
            </View>
            <View>
              <Text style={[styles.optionText, {color: '#E14C4C'}]}>
                Unavailable
              </Text>
            </View>
          </View>
          <View style={styles.hr} />
          <View style={styles.insideText}>
            <View style={{flexDirection: 'row'}}>
              {/* <Ionicons name="wallet-outline" size={24} color="#1abc9c" /> */}
              <Text style={styles.optionTextBelow}>
                Instant deposit & the highest buy limit
              </Text>
            </View>
            {/* <View><Text style={[styles.optionText, {color: '#2FBE6A'}]}>Available</Text></View> */}
          </View>
          {/* <View style={styles.hr} /> */}
        </TouchableOpacity>
      </ScrollView>
      <View
        style={{
          backgroundColor: '#0C0C0C',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => handleOpenBuyCryptoModal(selected)}
          style={styles.confirmButton}>
          <Text
            style={{
              color: '#0c0c0c',
              fontFamily: `EuclidCircularA-Regular`,
              fontSize: 18,
            }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
  },

  black: {
    backgroundColor: '#0C0C0C',
    height: windowHeight,
    alignItems: 'center',
  },

  confirmButton: {
    width: '80%',
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 100,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  depositText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // white text color
    marginBottom: 100,
  },
  optionContainer: {
    // aspectRatio: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#292929', // dark option background color
    borderWidth: 1,
    padding: 16,
    paddingLeft: 12,
    paddingRight: 12,
    // height: 50,
    // textAlign: 'center',
    borderRadius: 5,
    // paddingTop:
    justifyContent: 'space-between',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: `EuclidCircularA-Regular`,
    color: '#fff', // white text color
  },
  hr: {
    borderBottomColor: '#292929',
    borderBottomWidth: 1,
    marginBottom: 8,
  },

  image: {
    width: 120,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  hr: {
    // backgroundColor: 'white',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.3,
    marginVertical: 15,
    width: '100%',
  },

  insideText: {
    color: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '99%',
  },

  optionTextBelow: {
    color: '#848484',
    fontSize: 15,
    fontFamily: `EuclidCircularA-Regular`,
  },
  selected: {
    borderColor: '#fff',
  },
});

export default FiatRamps;
