import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform, StyleSheet} from 'react-native';
import {POINTS_KEY} from '@env';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
    const address = global.withAuth
      ? global.loginAccount.scw
      : global.connectAccount.publicAddress;
    registerFcmToken(address);
  }
}

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('token');
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('token', fcmToken);
        fetch();
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }
};

export const generateTopic = async () => {
  messaging()
    .subscribeToTopic('both')
    .catch(error => console.error('Error subscribing to topic:', error));

  const osSpecific = Platform.OS === 'ios' ? 'ios' : 'android';

  messaging()
    .subscribeToTopic(osSpecific)
    .catch(error => console.error('Error subscribing to topic:', error));
};

export const registerFcmToken = async address => {
  const url = 'https://refer.xade.finance/registerDevice';
  const token = await AsyncStorage.getItem('token');

  const notifsdata = {
    walletAddress: address.toLowerCase(),
    deviceToken: token,
    key: POINTS_KEY,
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notifsdata),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // console.log(response.json());
      return response.json();
    })
    .then(data => {})
    .catch(error => {});
};
