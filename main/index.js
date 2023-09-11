/**
 * @format
 */
import 'react-native-get-random-values';
import {AppRegistry} from 'react-native';
import './src/global';
import './global'
import App from './src/App';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';
//import AsyncStorage from '@react-native-async-storage/async-storage';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
