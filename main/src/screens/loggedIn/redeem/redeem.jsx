import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  SafeAreaView,
  Platform,
} from 'react-native';

import FastImage from 'react-native-fast-image';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const RedeemPoints = ({navigation}) => {
  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        {/*Xade Coins are points given for completing various transactions and tasks on the Xade Platform but are not a real asset and not transferable but can be redeemed later for Xade Tokens.*/}
        <Text
          style={{
            color: 'white',
            fontSize: 25,
            fontFamily: 'EuclidCircularA-SemiBold',
          }}>
          Available for you ⚡️
        </Text>
        <View style={styles.redeemContainer}>
          <View style={styles.storeContainer}>
            <TouchableOpacity
              style={styles.redeemables}
              onPress={() =>
                navigation.push('RedeemForm', {
                  name: 'ReducedFees',
                })
              }
              disabled={global.points >= 4000 ? false : true}>
              <FastImage
                style={{
                  width: windowWidth * 0.43,
                  height: windowWidth * 0.43,
                  borderRadius: 10,
                  opacity: global.points >= 4000 ? 1 : 0.2,
                }}
                source={require('./redeem-images/reduced-fees.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.redeemables2}
              onPress={() =>
                navigation.push('RedeemForm', {
                  name: 'Merch',
                })
              }
              disabled={global.points >= 5000 ? false : true}>
              <FastImage
                style={{
                  width: windowWidth * 0.43,
                  height: windowWidth * 0.43,
                  borderRadius: 10,
                  opacity: global.points >= 5000 ? 1 : 0.2,
                }}
                source={require('./redeem-images/xade-merch.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.storeContainer2}>
            <TouchableOpacity
              style={styles.redeemables}
              onPress={() =>
                navigation.push('RedeemForm', {
                  name: 'USDC',
                })
              }
              disabled={global.points >= 10000 ? false : true}>
              <FastImage
                style={{
                  width: windowWidth * 0.43,
                  height: windowWidth * 0.43,
                  borderRadius: 10,
                  opacity: global.points >= 10000 ? 1 : 0.2,
                }}
                source={require('./redeem-images/usdc.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.redeemables2}
              onPress={() =>
                navigation.push('RedeemForm', {
                  name: 'NFT',
                })
              }
              disabled={global.points >= 12000 ? false : true}>
              <FastImage
                style={{
                  width: windowWidth * 0.43,
                  height: windowWidth * 0.43,
                  borderRadius: 10,
                  opacity: global.points >= 12000 ? 1 : 0.2,
                }}
                source={require('./redeem-images/xade-nft.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={{
            color: '#cfcfcf',
            fontSize: 18,
            fontFamily: 'EuclidCircularA-Medium',
            marginTop: '12%',
          }}>
          Xade Coins are points given for completing various transactions and
          tasks on the Xade Platform but are not a real asset and not
          transferable but can be redeemed later for Xade Tokens.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0c0c0c',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginLeft: '5%',
  },

  mainContent: {
    marginTop: '5%',
    width: '100%',
    flexDirection: 'column',
  },

  redeemContainer: {
    marginTop: '4%',
    width: '100%',
    flexDirection: 'column',
  },

  storeContainer: {
    marginTop: '2%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  storeContainer2: {
    marginTop: '4%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  //   redeemables2: {
  //     marginLeft: '5%',
  //   },
});

export default RedeemPoints;
