import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {POINTS_KEY} from '@env';
import FastImage from 'react-native-fast-image';
import Svg, {Path} from 'react-native-svg';
import ExternalLinkModal from './externalLink/widget';
// import RedeemSvg from './redeem.svg';

// const points = 12040;
const starIcon = require('./coins.png');
// const scanIcon = require('./scan.png');


const addPoints = async () => {
  try {
    const address = global.withAuth
      ? global.loginAccount.scw
      : global.connectAccount.publicAddress;
    // const address = ''
    
    const inputValue = {
      userId: address,
      // userId: address.toLowerCase(),
      transactionAmount: 0,
      key: POINTS_KEY,
    };
    const response = await fetch('https://refer.xade.finance/points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': POINTS_KEY,
      },
      body: JSON.stringify(inputValue),
    });
    const data = await response.json();
    if (data.points > 0) return data.points.toFixed(0).toLocaleString();
    else return 0;
  } catch (err) {
    console.error(err);
  }
};

function TopBar({navigation, headers}) {
  const [infoVisible, setInfoVisible] = useState(false);
  const [points, setPoints] = useState('...');
  useEffect(() => {
    async function logic() {
      const _points = await addPoints();
      global.points = _points;
      setPoints(_points);
    }
    logic();
  });

  
  const [externalLinkHeading, setExternalLinkHeading] = useState('');
  const [externalLinkUri, setExternalLinkUri] = useState('');
  const [showExternalLinkModal, setShowExternalLinkModal] = useState(false);

  const handleCloseExternalLinkModal = () => {
    setShowExternalLinkModal(false);
  }

  return (
    <View style={styles.container}>
      {showExternalLinkModal && (
        <ExternalLinkModal
          uri={externalLinkUri}
          heading={externalLinkHeading}
          onClose={handleCloseExternalLinkModal}
        />
      )}
      <Text style={styles.logo}>{headers}</Text>
      <View style={{flexDirection: 'row'}}>
        {/* {headers == 'Home' ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('QRScreen')}
            activeOpacity={0.8}
            style={{marginRight: 15}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FastImage source={scanIcon} style={styles.scanIcon} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setInfoVisible(!infoVisible)}
            activeOpacity={0.8}
            style={{marginRight: 15}}>
            <View style={[styles.pointsContainer, {marginBottom: 0}]}>
              <FastImage source={starIcon} style={styles.pointsIcon} />
              <Text style={styles.pointsText}>{points}</Text>
            </View>
          </TouchableOpacity>
        )} */}
        {/* <TouchableOpacity
          onPress={() => setInfoVisible(!infoVisible)}
          activeOpacity={0.8}
          style={{marginRight: 15}}>
          <View style={[styles.pointsContainer, {marginBottom: 0}]}>
            <FastImage source={starIcon} style={styles.pointsIcon} />
            <Text style={styles.pointsText}>{points}</Text>
          </View>
        </TouchableOpacity> */}
        {/* <View style={{margin: 5,padding: 10}}> */}
          {/* <RedeemSvg width={25} height={25} /> */}
          <TouchableOpacity
            onPress={() => {
              setExternalLinkHeading('Redeem Points');
              setExternalLinkUri('https://tally.so/r/wA2aze');
              setShowExternalLinkModal(true);
              // Linking.openURL('https://tally.so/r/wA2aze')
              // setInfoVisible(!infoVisible)       
            }}
            activeOpacity={0.8}
            style={{marginRight: 15}}>
            <View style={[styles.pointsContainer, {marginBottom: 0}]}>
              <FastImage source={starIcon} style={styles.pointsIcon} />
              <Text style={styles.pointsText}>{points}</Text>
            </View>
          </TouchableOpacity>

          {/* <Icon
            onPress={() => navigation.navigate('Redeem')}
            name={'settings'}
            size={25}
            color={'#fff'}
            type="material"
          /> */}
        {/* </View> */}
        <View style={{marginTop:5}}>
          <Icon
            onPress={() => navigation.navigate('Settings')}
            name={'settings'}
            size={28}
            color={'#fff'}
            type="material"
          />
        </View>
      </View>

      {infoVisible && (
        <View style={styles.infoContainer}>
          <View style={styles.arrowContainer}>
            <View style={styles.arrowUp} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              Earn Xade points by completing transactions or quests in Xade
              which can be redeemed for the Xade token later
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pointsIcon: {
    width: 26,
    height: 19,
    // marginLeft: 4,
  },
  scanIcon: {
    width: 94,
    height: 33,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    paddingBottom: 10,
  },
  container: { 
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    // paddingVertical: 5,
    border: 'none',
  },
  pointsContainer: {
    // backgroundColor: 'grey',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // fontFamily: 'VelaSans-Bold'
    backgroundColor: 'rgba(90, 90, 90, 0.3)',
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
    paddingLeft: 10,
    borderRadius: 15,
  },
  pointsText: {
    // backgroundColor: 'rgba(90, 90, 90, 0.3)',
    // borderBottomRightRadius:10,
    // borderTopRightRadius: 10,
    color: '#FFE4BB',
    fontFamily: 'Sarala-Bold',
    // fontFamily: `EuclidCircularA-Bold`,
    fontSize: 18,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 10,
    paddingLeft: 5,
  },
  infoContainer: {
    position: 'absolute',
    top: 55,
    left: 20,
    backgroundColor: 'black',
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    color: 'white',
    // zIndex: -1
  },
  arrowContainer: {
    zIndex: 999,
    position: 'absolute',
    top: -10,
    left: 20,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white',
    transform: [{rotate: '180deg'}],
  },
  arrowUp: {
    zIndex: 999,
    width: 20,
    height: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  infoContent: {
    zIndex: 999,
    padding: 8,
  },
  infoText: {
    zIndex: 999,
    fontSize: 14,
    color: 'white',
    fontFamily: 'Sarala-Regular',
    // fontFamily: `EuclidCircularA-Regular`,
  },
  logo: {
    // fontFamily: `EuclidCircularA-Bold`,
    fontFamily: 'Sarala-Bold',
    color: '#fff',
    fontWeight: 700,
    fontSize: 30,
    marginLeft: '2%',
    marginBottom: '2%',
    marginTop: '2%',
  },
});

export default TopBar;
