import React, {Component, useEffect} from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  Button,
  Platform,
} from 'react-native';
import {Text} from '@rneui/themed';
import {Icon} from 'react-native-elements';
const Web3 = require('web3');
import {PNAccount} from '../../Models/PNAccount';
import FastImage from 'react-native-fast-image';

import {LoginCarousel} from './loginCarousel';
import {onClickLogin} from '../../particle-auth';

import * as particleAuth from 'react-native-particle-auth';

import LinearGradient from 'react-native-linear-gradient';
const DEVICE_WIDTH = Dimensions.get('window').width;
import Clipboard from '@react-native-clipboard/clipboard';

const windowHeight = Dimensions.get('window').height;

const images = [
  {
    name: `Introducing a new${'\n'}era of finance`,
    details: `Spend, save, pay, borrow, invest${'\n'}and trade seamlessly with DeFi`,
    image:
      'https://res.cloudinary.com/dwxq0pkqm/image/upload/v1685547416/home_a9o80v.png',
  },
  {
    name: `Pay globally with${'\n'}close to zero fees`,
    details: `Send payments instantly to any${'\n'}mobile number, email and more`,
    image:
      'https://res.cloudinary.com/dwxq0pkqm/image/upload/v1685547417/payments_oezkpd.png',
  },
  {
    name: `Save with Xade to${'\n'}beat inflation`,
    details: `Finance real world loans with Xade${'\n'}stable savings account`,
    image:
      'https://res.cloudinary.com/dwxq0pkqm/image/upload/v1685547417/savings_six9hw.png',
  },
  {
    name: `Trade anything${'\n'}with 10x leverage`,
    details: `Go long & short with upto 10x${'\n'}leverage on 5000+ markets`,
    image:
      'https://res.cloudinary.com/dwxq0pkqm/image/upload/v1685547417/investments_luss13.png',
  },
  {
    name: `Finance your loans${'\n'}fast and easily`,
    details: `Finance EMIs, Mortages and other${'\n'}loans against ERC-20 tokens`,
    image:
      'https://res.cloudinary.com/dwxq0pkqm/image/upload/v1685547417/loans_uftdol.png',
  },
];

const StaticHomeScreen = ({navigation}) => {
  const [selectedButton, setSelectedButton] = React.useState(
    `Introducing a new${'\n'}era of finance`,
  );

  useEffect(() => {
    i = 0;
    setInterval(() => {
      if (i < 4) {
        i += 1;
      } else {
        i = -1;
      }
      setSelectedButton(images[Math.abs(Math.ceil(i))].name);
    }, 3000);
  }, []);
  return (
    <SafeAreaView style={styles.bg}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.topbar}>
            <View
              style={
                selectedButton == `Introducing a new${'\n'}era of finance`
                  ? styles.selected
                  : styles.carouselIndicator
              }></View>
            <View
              style={
                selectedButton == `Pay globally with${'\n'}close to zero fees`
                  ? styles.selected
                  : styles.carouselIndicator
              }></View>
            <View
              style={
                selectedButton == `Save with Xade to${'\n'}beat inflation`
                  ? styles.selected
                  : styles.carouselIndicator
              }></View>
            <View
              style={
                selectedButton == `Trade anything${'\n'}with 10x leverage`
                  ? styles.selected
                  : styles.carouselIndicator
              }></View>
            <View
              style={
                selectedButton == `Finance your loans${'\n'}fast and easily`
                  ? styles.selected
                  : styles.carouselIndicator
              }></View>
          </View>
          <View style={styles.mainContent}>
            <LoginCarousel
              images={images}
              navigation={navigation}
              address={'0x'}
              key={images}
            />
            <TouchableOpacity
              onPress={() => this.onClickLogin(navigation)}
              style={styles.getStarted}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.push('ChooseConnect')}>
              <Text style={styles.connectText}>
                Have an existing wallet?{' '}
                <Text
                  style={
                    (styles.connectText,
                    {
                      textDecorationLine: 'underline',
                      color: '#fff',
                      fontFamily: `EuclidCircularA-Regular`,
                      fontSize: 15,
                      marginTop: '4%',
                      textAlign: 'center',
                    })
                  }>
                  Connect Wallet
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#161518',
  },

  container: {
    width: '100%',
    height: '80%',
  },

  carouselIndicator: {
    backgroundColor: '#817c89',
    opacity: 0.3,
    width: 58,
    height: 4,
    borderRadius: 15,
    marginHorizontal: 8,
  },

  selected: {
    backgroundColor: '#fff',
    width: 58,
    height: 4,
    borderRadius: 15,
    marginHorizontal: 8,
  },

  topbar: {
    width: '100%',
    marginTop: '5%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  logo: {
    fontFamily: 'LemonMilk-Regular',
    color: '#fff',
    fontSize: 30,
    marginLeft: '8%',
    marginTop: '2%',
  },

  mainContent: {
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: '15%',
  },

  mainText: {
    color: '#fff',
    fontFamily: 'VelaSans-Bold',
    fontSize: 54,
    width: '100%',
    marginTop: windowHeight / 8.0,
    marginLeft: '10%',
  },

  subText: {
    color: '#979797',
    fontFamily: 'VelaSans-Medium',
    fontSize: 20,
    width: '100%',
    marginLeft: '10%',
    marginTop: '8%',
  },

  button: {
    width: '75%',
    color: '#000',
    borderRadius: 15,
    marginLeft: '12%',
    marginTop: '15%',
    padding: '5%',
    backgroundColor: '#E8FF59',
    marginBottom: '5%',
  },

  buttonText: {
    color: '#000',
    fontFamily: `EuclidCircularA-Regular`,
    fontSize: 20,
    marginTop: '-11.7%',
    marginLeft: '2%',
  },

  buttonIcon: {
    marginLeft: '80%',
  },

  getStarted: {
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 23,
    borderRadius: 6,
    marginTop: '2%',
  },

  getStartedText: {
    color: '#0c0c0c',
    fontFamily: `EuclidCircularA-Medium`,
    fontSize: 16,
  },

  connectText: {
    color: '#fff',
    fontFamily: `EuclidCircularA-Regular`,
    fontSize: 15,
    textAlign: 'center',
    marginTop: '4%',
  },
});

export default StaticHomeScreen;
