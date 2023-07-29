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

const buttons = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['-', '0', '⌫'],
];

const width = Dimensions.get('window').width;

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

const SendMobileComponent = ({navigation}) => {
  const [submitText, setSubmitText] = useState('Continue');
  const [country, setCountry] = useState('1');
  const [text, setText] = useState('');

  function handleButtonPress(button) {
    if (button !== '' && button !== '⌫' && button !== '-') {
      if (text != '0') setText(text + button);
      else setText(button);
    } else if (button === '⌫') {
      setText(text.slice(0, -1));
    } else if (button === '-') {
      if (!text.includes('-')) setText(text + '-');
    }
  }

  const validateNumber = text => {
    text = text.replace('-', '');
    var mobileRegex = /^\d+$/;
    return mobileRegex.test(text);
  };

  const handleSubmit = () => {
    setSubmitText('Pending...');

    const validation = validateNumber(text);
    if (!validation) {
      setSubmitText('Invalid Mobile Number');
      return;
    } else {
      setText(text.replace('-', ''));
    }

    fetch(
      `https://mobile.api.xade.finance/polygon?phone=${text.replace('-', '')}`,
      {
        method: 'GET',
      },
    )
      .then(response => {
        console.log(response);
        if (response.status == 200) {
          return response.text();
        } else return 0;
      })
      .then(data => {
        console.log(data);
        try {
          if (data != 0) {
            navigation.push('EnterAmount', {
              type: 'email',
              walletAddress: data,
              emailAddress: text.replace('-', ''),
            });
            setSubmitText('Continue');
          } else {
            // navigation.push('EnterAmount', {
            //   type: 'v2',
            //   walletAddress: REMMITEX_CONTRACT,
            //   emailAddress: text.replace('-', ''),
            // });
            setSubmitText('Mobile Number Not Found');
          }
        } catch (err) {
          console.log(err);
        }
      });
  };
  return (
    <ScrollView>
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
            Enter Mobile No
          </Text>
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
                    fontFamily: `EuclidCircularA-Regular`,
                    textAlign: 'center',
                  }}>
                  +{'  '}
                </Text>
                <Text
                  style={{
                    fontSize: 30,
                    color: 'white',
                    fontFamily: `EuclidCircularA-Regular`,
                    textAlign: 'center',
                  }}>
                  {text}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.extradeets}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: `EuclidCircularA-Regular`,
                color: 'white',
              }}>
              Format:{' '}
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: `EuclidCircularA-Regular`,
                  color: '#898989',
                }}>
                +91-9XXXXXXX90
              </Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
            <Text
              style={{
                color: '#000',
                fontFamily: `EuclidCircularA-Regular`,
                fontSize: 18,
              }}>
              {submitText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sendMobile}
            onPress={() => navigation.push('SendEmail')}>
            <Text
              style={{
                color: 'white',
                fontFamily: `EuclidCircularA-Regular`,
                fontSize: 15,
              }}>
              Send to an email address
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
            onPress={() => navigation.push('SendWallet')}>
            <Text
              style={{
                color: 'white',
                fontFamily: `EuclidCircularA-Regular`,
                fontSize: 15,
              }}>
              Send to a digital wallet
            </Text>
            <Icon
              name={'wallet'}
              size={20}
              color={'#fff'}
              type="antdesign"
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '12.5%',
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
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
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
    marginBottom: 30,
    alignItems: 'center',
    marginTop: '15%',
    height: 55,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },

  sendMobile: {
    width: '100%',
    marginBottom: 15,
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

  amount: {
    alignItems: 'center',
  },
  amountInfo: {
    width: '100%',
    marginTop: '7%',
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
    fontFamily: `EuclidCircularA-Medium`,
  },

  extradeets: {
    marginTop: '7%',
  },
});

export default SendMobileComponent;
