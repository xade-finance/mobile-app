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

import onClickLogin from '../../particle-auth';

const bg = require('../../../assets/particle.jpg');
const windowHeight = Dimensions.get('window').height;

const Login = ({navigation}) => {
  return (
    <ImageBackground source={bg} style={styles.bg}>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.topbar}>
              <Text style={styles.logo}>XADE</Text>
            </View>
            <View style={styles.mainContent}>
              <Text style={styles.mainText}>
                Enter a{'\n'}
                new era of{'\n'}
                banking
              </Text>
              <Text style={styles.subText}>
                The future of finance{'\n'} is now here...
              </Text>
              <TouchableOpacity
                style={styles.buttonTop}
                onPress={() => navigation.navigate('ChooseConnect')}>
                <Icon
                  style={styles.buttonIcon}
                  name="arrow-right"
                  size={30}
                  color="black"
                  type="feather"
                />
                <Text style={styles.buttonText}>Connect</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onClickLogin(navigation)}>
                <Icon
                  style={styles.buttonIcon}
                  name="arrow-right"
                  size={30}
                  color="white"
                  type="feather"
                />
                <Text style={styles.buttonTextbottom}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  bg: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },

  container: {
    width: '100%',
    height: '80%',
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
    marginTop: '2%',
  },

  mainContent: {
    width: '100%',
    backgroundColor: 'transparent',
    marginTop: '-5%',
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
    fontSize: 24,
    width: '100%',
    marginLeft: '10%',
    marginTop: '8%',
  },

  buttonTop: {
    width: '90%',
    color: '#000',
    borderRadius: 50,
    marginLeft: '5%',
    marginTop: '20%',
    padding: '5%',
    backgroundColor: '#fff',
    marginBottom: '5%',
  },

  button: {
    width: '90%',
    color: '#000',
    borderRadius: 50,
    marginLeft: '5%',
    marginTop: '3%',
    padding: '5%',
    backgroundColor: '#000',
    marginBottom: '5%',
    borderWidth: 2.5,
    borderColor: '#fff',
  },

  buttonText: {
    color: '#000',
    fontFamily: 'VelaSans-Bold',
    fontSize: 20,
    marginTop: '-10%',
    marginLeft: '10%',
  },

  buttonTextbottom: {
    color: '#fff',
    fontFamily: 'VelaSans-Bold',
    fontSize: 20,
    marginTop: '-10%',
    marginLeft: '10%',
  },

  buttonIcon: {
    marginLeft: '80%',
  },
});

export default Login;
