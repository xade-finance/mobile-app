import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Alert} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const ReferralPage = ({}) => {
  const [numPoints, setNumPoints] = useState(0);
  const [address, setAddress] = useState('0x');
  // Fetch the number of referrals from the API
  useEffect(() => {
    async function getFunction() {
      const _address = await AsyncStorage.getItem('address');
      setAddress(_address);
      const points = await addPoints(address, '0');
      setNumPoints(points);
    }
    getFunction();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Referral Page</Text>
      <TouchableHighlight
        onPress={() => {
          Clipboard.setString(
            `
                Join the Xade revolution with the DeFi powered non custodial decentralised bank and help us both win Xade points by joining the link

                Download App: https://notifs.api.xade.finance/refer/${address} 
                `,
          );
          Alert.alert('Copied Address To Clipboard');
        }}>
        <Text style={styles.address}>Copy link</Text>
      </TouchableHighlight>
      <Text style={styles.numReferrals}>Number of Referrals: {numPoints}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  referralCode: {
    fontSize: 18,
    marginBottom: 10,
  },
  numReferrals: {
    fontSize: 18,
  },
  address: {
    color: 'white',
    marginTop: '5%',
    fontFamily: 'VelaSans-Bold',
    textAlign: 'center',
    fontSize: 14,
  },
});

const addPoints = async (userId, transactionAmount) => {
  try {
    const response = await fetch('https://notifs.api.xade.finance/points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userId: userId.toLowerCase(), transactionAmount}),
    });

    const data = await response.json();
    console.log(data);
    if (data.points > 0) return data.points;
    else return 0;
  } catch (err) {
    console.error(err);
  }
};

export default ReferralPage;
