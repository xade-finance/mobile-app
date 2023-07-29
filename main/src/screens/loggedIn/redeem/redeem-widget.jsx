import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {WebView} from 'react-native-webview';
import TransakWebView from '@transak/react-native-sdk';
import SendIntentAndroid from 'react-native-send-intent';
import {enableScreens} from 'react-native-screens';
import {Icon} from 'react-native-elements';

const windowHeight = Dimensions.get('window').height;
const {width, height} = Dimensions.get('window');

const RedeemForm = ({navigation, route}) => {
  console.log(route.params.name);
  return (
    <View
      style={{
        backgroundColor: '#0C0C0C',
        height: windowHeight,
      }}>
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name={'keyboard-backspace'}
                size={30}
                color={'#f0f0f0'}
                type="materialicons"
                onPress={() => navigation.goBack()}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Enter Form To Redeem Points</Text>
          </View>
          <View style={styles.webViewContainer}>
            <WebView
              // userAgent="undefined"
              // automaticallyAdjustContentInsets={true}
              // javaScriptEnabled={true}
              // originWhitelist={['intent://']}
              source={{
                uri: route.params.name,
                // route.params.name == 'Merch'
                //   ? 'https://forms.gle/4zKSHKt52JthiJgr9'
                //   : 'https://forms.gle/ayPU3BaejNG9h1MV8',
              }}
              style={styles.webView}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0c0c0c',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'EuclidCircularA-Medium',
    color: '#fff',
    marginLeft: '5%',
  },
  webViewContainer: {
    width: width * 0.9,
    height: height * 0.8,
    marginVertical: 20,
    alignSelf: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
  },
  webView: {
    width: '100%',
    height: '80%',
    borderRadius: 20,
  },
});

export default RedeemForm;
