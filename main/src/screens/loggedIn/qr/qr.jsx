import React, {Component, useState, useEffect} from 'react';
import {Text} from '@rneui/themed';
import {Icon} from 'react-native-elements';
import Clipboard from '@react-native-clipboard/clipboard';

import {
  View,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {CameraScreen} from 'react-native-camera-kit';

import * as particleAuth from 'react-native-particle-auth';
import * as particleConnect from 'react-native-particle-connect';

import QR from '../../../qr-generator';
import {logout} from '../../../particle-auth';

import styles from './qr-styles';
let address;
let info;
const bg = require('../../../../assets/qr.jpg');

function QRCode() {
  if (global.withAuth) {
    address = global.loginAccount.scw;
    info = global.loginAccount.name;
  } else {
    address = global.connectAccount.publicAddress;
    info = global.connectAccount.name;
  }

  const qrUrl = String(address);
  console.log('Address: ', address);
  console.log('User Info: ', info);
  return (
    <View>
      <View>
        <Text style={styles.header}>QR Code</Text>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{String(info)}</Text>
          <TouchableHighlight
            onPress={() => {
              Clipboard.setString(String(address).toLowerCase());
              Alert.alert('Copied Address To Clipboard');
            }}>
            <Text style={styles.address}>
              {String(address).toLowerCase().substring(0, 35)}...
            </Text>
          </TouchableHighlight>
        </View>
        <View style={{width: '100%', alignItems: 'center'}}>
          <View style={styles.qr}>
            <QR value={qrUrl} />
          </View>
        </View>
      </View>
    </View>
  );
}

const QRScanner = ({navigation}) => {
  const [qrvalue, setQrvalue] = useState('');
  const [openScanner, setOpenScanner] = useState(true);

  const onOpenlink = () => {
    Linking.openURL(qrvalue);
  };

  const onBarcodeScan = qrvalue => {
    setQrvalue(qrvalue);
    setOpenScanner(false);
    navigation.navigate('EnterAmount', {
      type: 'wallet',
      walletAddress: qrvalue,
    });
  };

  const onOpenScanner = () => {
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs permission for camera access',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setQrvalue('');
            setOpenScanner(true);
          } else {
            alert('CAMERA permission denied');
          }
        } catch (err) {
          alert('Camera permission err', err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      setQrvalue('');
      setOpenScanner(true);
    }
  };

  return (
    <View>
      <Text style={styles.header}>QR Scanner</Text>
      {openScanner ? (
        <View style={styles.QRcontainer}>
          <CameraScreen
            style={{width: 300, height: 400}}
            showFrame={true}
            scanBarcode={true}
            laserColor={'transparent'}
            frameColor={'transparent'}
            colorForScannerFrame={'transparent'}
            onReadCode={event => {
              onBarcodeScan(event.nativeEvent.codeStringValue, navigation);
              /*
              setQrvalue(event.nativeEvent.codeStringValue);
              setOpenScanner(false);
              navigation.navigate('EnterAmount', {
                type: 'wallet',
                walletAddress: event.nativeEvent.codeStringValue,
              });
          */
            }}
          />
        </View>
      ) : (
        <View style={styles.QRcontainer}>
          <Text style={styles.scannedStyle}>
            {qrvalue ? 'Scanned Result: ' + qrvalue : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

class QRPage extends Component {
  constructor() {
    super();

    this.state = {
      status: true,
    };
  }

  ShowQRScanner = () => {
    if (this.state.status == true) {
      this.setState({status: false});
    } else {
      this.setState({status: true});
    }
  };

  render(navigation) {
    return (
      <ImageBackground source={bg} style={styles.bg}>
        <SafeAreaView>
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.topbar}>
                <Icon
                  style={styles.buttonIcon}
                  name="arrow-left"
                  size={30}
                  color="white"
                  type="feather"
                  onPress={() => this.props.navigation.navigate('Payments')}
                />
                <View style={styles.nav}>
                  <TouchableOpacity
                    style={styles.navLeft}
                    onPress={() => this.ShowQRScanner()}>
                    <Text style={styles.leftText}>Code</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.navRight}
                    onPress={() => {
                      this.ShowQRScanner();
                    }}>
                    <Text style={styles.rightText}>Scan</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.mainContent}>
                {this.state.status ? (
                  <QRCode />
                ) : (
                  <QRScanner navigation={this.props.navigation} />
                )}
                <TouchableHighlight
                  style={styles.bottomButton}
                  onPress={() => this.props.navigation.navigate('SendEmail')}>
                  <Text style={styles.bottomText}>
                    Send To Email Address Or Mobile Instead
                  </Text>
                </TouchableHighlight>
                <Text
                  onPress={() => {
                    global.withAuth
                      ? particleAuth.fastLogout()
                      : particleConnect.disconnect();
                    this.props.navigation.navigate('LoggedOutHome');
                    console.log('Logged Out/Disconnected Successfully');
                  }}
                  style={styles.logout}>
                  Logout
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

export default QRPage;
