import React from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
} from 'react-native';
import {Text} from '@rneui/themed';
import {Icon} from 'react-native-elements';
import onClickConnect from '../../particle-connect';
import {WalletType} from 'react-native-particle-connect';

const bg = require('../../../assets/choose.png');
const windowHeight = Dimensions.get('window').height;

metamask = WalletType.MetaMask;
alpha = WalletType.Alpha;
trust = WalletType.Trust;
rainbow = WalletType.Rainbow;
walletconnect = WalletType.WalletConnect;

const ChooseConnect = ({navigation}) => {
  return (
    <ImageBackground source={bg}>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.topbar}>
              <Text style={styles.logo}>XADE</Text>
            </View>
            <View style={styles.mainContent}>
              <Text style={styles.mainText}>Choose Wallet Provider:</Text>
              <View style={styles.buttonContent}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    this.onClickConnect({navigation, walletype: metamask})
                  }>
                  <Text style={styles.buttonText}>Connect With MetaMask</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonAlt}
                  onPress={() =>
                    this.onClickConnect({navigation, walletype: alpha})
                  }>
                  <Text style={styles.buttonTextAlt}>Connect With Alpha</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    this.onClickConnect({navigation, walletype: trust})
                  }>
                  <Text style={styles.buttonText}>Connect With Trust</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonAlt}
                  onPress={() =>
                    this.onClickConnect({navigation, walletype: rainbow})
                  }>
                  <Text style={styles.buttonTextAlt}>Connect With Rainbow</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() =>
                    this.onClickConnect({navigation, walletype: walletconnect})
                  }>
                  <Text style={styles.buttonText}>Others</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#0c0c0c',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },

  container: {
    width: '100%',
    height: windowHeight,
  },

  topbar: {
    width: '100%',
    backgroundColor: 'transparent',
  },

  logo: {
    fontFamily: 'LemonMilk-Regular',
    color: '#fff',
    fontSize: 30,
    marginLeft: '8%',
  },

  mainContent: {
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: '10%',
  },

  mainText: {
    color: '#fff',
    fontFamily: 'VelaSans-ExtraBold',
    fontSize: 25,
    width: '100%',
    textAlign: 'center',
  },

  buttonContent: {
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: '20%',
  },

  button: {
    width: '70%',
    color: '#0C0C0C',
    borderRadius: 50,
    marginLeft: '15%',
    marginTop: '7%',
    padding: '4%',
    backgroundColor: 'white',
    borderWidth: 2.5,
  },

  buttonText: {
    color: '#0C0C0C',
    fontFamily: 'VelaSans-Bold',
    fontSize: 15,
    textAlign: 'center',
  },

  buttonAlt: {
    width: '70%',
    color: '#fff',
    borderRadius: 50,
    marginLeft: '15%',
    marginTop: '7%',
    padding: '4%',
    backgroundColor: '#121212',
    borderWidth: 2.5,
  },

  buttonTextAlt: {
    color: '#fff',
    fontFamily: 'VelaSans-Bold',
    fontSize: 15,
    textAlign: 'center',
  },

  buttonIcon: {
    marginLeft: '80%',
  },
});

export default ChooseConnect;
