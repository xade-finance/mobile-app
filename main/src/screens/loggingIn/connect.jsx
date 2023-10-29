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
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.topbar}>
            <TouchableOpacity
              style={{marginTop: '1%'}}
              onPress={() => setNetworksVisible(!networksVisible)}>
              <Icon
                name={'keyboard-backspace'}
                size={30}
                color={'#f0f0f0'}
                type="materialicons"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.mainContent}>
            <Text style={styles.mainText}>Connect</Text>
            <Text style={styles.subText}>Connect your existing wallet to the Xade mobile app.</Text>
            <View style={styles.buttonContent}>

              <TouchableOpacity
                  onPress={() =>
                    this.onClickConnect({navigation, walletype: metamask})
                  }
                  style={[
                    styles.optionContainer,
                    // global.mainnet ? modalStyles.selected : '',
                    {marginTop: '4%'},
                  ]}>
                    <View style={styles.insideText}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.optionText}>Metamask</Text>
                        {/* <Text style={styles.optionText}>Available</Text> */}
                      </View>
                      <View><Text style={[styles.optionText2]}>Available</Text></View>
                    </View>                    
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionContainer}
                onPress={() =>
                  this.onClickConnect({navigation, walletype: alpha})
                }>
                <View style={styles.insideText}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.optionText}>Alpha Wallet</Text>
                    {/* <Text style={styles.optionText}>Available</Text> */}
                  </View>
                  <View><Text style={[styles.optionText2]}>Available</Text></View>
                </View>  
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionContainer}
                onPress={() =>
                  this.onClickConnect({navigation, walletype: trust})
                }>
                <View style={styles.insideText}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.optionText}>Trust Wallet</Text>
                    {/* <Text style={styles.optionText}>Available</Text> */}
                  </View>
                  <View><Text style={[styles.optionText2]}>Available</Text></View>
                </View>  
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionContainer}
                onPress={() =>
                  this.onClickConnect({navigation, walletype: rainbow})
                }>
                <View style={styles.insideText}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.optionText}>Rainbow Wallet</Text>
                    {/* <Text style={styles.optionText}>Available</Text> */}
                  </View>
                  <View><Text style={[styles.optionText2]}>Available</Text></View>
                </View>  
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionContainer}
                onPress={() =>
                  this.onClickConnect({navigation, walletype: walletconnect})
                }>
                <View style={styles.insideText}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.optionText}>Other Wallets</Text>
                    {/* <Text style={styles.optionText}>Available</Text> */}
                  </View>
                  <View><Text style={[styles.optionText2]}>Available</Text></View>
                </View>  
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: '#0D0D0D',
  },

  topbar: {
    width: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    flexDirection:'row',
    marginHorizontal: 20,
    marginVertical: 10
  },

  subText: {
    fontSize: 18,
    fontFamily: 'Sarala-Regular',
    color: '#707070',
    width: '80%'
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
    flexDirection : 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginHorizontal: 20
  },

  mainText: {
    color: '#fff',
    fontFamily: 'Sarala-Bold',
    fontSize: 32,
    width: '100%',
    // textAlign: 'left',
  },

  buttonContent: {
    width: '90%',
    backgroundColor: 'transparent',
    marginTop: '10%',
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

  optionContainer: {
    width: '99%',
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
    fontSize: 20,
    fontFamily: `Sarala-Regular`,
    color: '#fff', // white text color
  },

  optionText2 :{
    marginLeft: 10,
    fontSize: 16,
    fontFamily: `Sarala-Regular`,
    color: '#81C849', // white text color
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },

  insideText: {
    color: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '99%',
  },

});

export default ChooseConnect;
