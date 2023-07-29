import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
  View,
  Linking,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import {useState, useMemo, useEffect} from 'react';
import {Text} from '@rneui/themed';
const REMMITEX_CONTRACT = '0x5c34A74caB1Edfc1d73B8Ae725AdDE50bA067d5B';

import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {FloatingLabelInput} from 'react-native-floating-label-input';

const width = Dimensions.get('window').width;

const SendWalletComponent = ({navigation}) => {
  const [submitText, setSubmitText] = useState('Continue');
  const [country, setCountry] = useState('1');
  const [text, setText] = useState('');

  const validateEmail = text => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(text);
  };
  const validateAddress = text => {
    const emailRegex = /^0x[a-fA-F0-9]{40}$/;
    return emailRegex.test(text);
  };
  const handleSubmit = () => {
    setSubmitText('Pending...');

    const validation = validateAddress(text.toLowerCase());
    if (!validation) {
      setSubmitText('Not found');
      return;
    }

    navigation.push('EnterAmount', {
      type: 'wallet',
      walletAddress: text,
    });
    setSubmitText('Continue');
  };
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
            fontFamily: `EuclidCircularA-Regular`,
            color: 'white',
            letterSpacing: 0.5,
          }}>
          Enter Wallet Address
        </Text>
        <View style={styles.enter}>
          <FloatingLabelInput
            label="Recipient Wallet"
            value={text}
            showCaret
            onChangeText={newText => setText(newText.toLowerCase())}
            containerStyles={{
              borderWidth: 1,
              borderColor: '#3E3E3E',
              borderRadius: 5,
              paddingLeft: '3%',
              paddingRight: '1%',
              paddingTop: '5%',
              paddingBottom: '1%',
            }}
            customLabelStyles={{
              colorBlurred: '#fff',
              colorFocused: '#A4A4A4',
              fontSizeBlurred: 20,
              fontSizeFocused: 12,
              width: '100%',
            }}
            labelStyles={{
              fontFamily: `EuclidCircularA-Regular`,
              color: '#fff',
              fontSize: 20,
              width: '100%',
              paddingBottom: 2,
            }}
            inputStyles={{
              fontFamily: `EuclidCircularA-Regular`,
              width: '100%',
              color: 'white',
              fontSize: 20,
              paddingTop: 10,
            }}
          />
        </View>
        {/* <TouchableOpacity
          onPress={() => navigation.push('SendMobile')}
          style={styles.subText}>
          <Text style={{color: '#4F4CF6'}}>Send to mobile number instead</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
          <Text
            style={{
              color: '#000',
              fontFamily: `EuclidCircularA-Medium`,
              fontSize: 18,
            }}>
            {submitText}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendMobile}
          onPress={() => navigation.push('SendMobile')}>
          <Text
            style={{
              color: 'white',
              fontFamily: `EuclidCircularA-Regular`,
              fontSize: 15,
            }}>
            Send to a mobile number
          </Text>
          <Icon
            name={'phone'}
            size={20}
            color={'#fff'}
            type="feather"
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendWallet}
          onPress={() => navigation.push('SendEmail')}>
          <Text
            style={{
              color: 'white',
              fontFamily: `EuclidCircularA-Regular`,
              fontSize: 15,
            }}>
            Send to a email address
          </Text>
          <Icon
            name={'wallet'}
            size={20}
            color={'#fff'}
            type="antdesign"
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
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
    marginTop: '30%',
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

export default SendWalletComponent;
