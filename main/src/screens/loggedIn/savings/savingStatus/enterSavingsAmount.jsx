import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import * as particleAuth from 'react-native-particle-auth';

const buttons = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', '⌫'],
];

function renderButtons() {
  return buttons.map((row, i) => {
    return (
      <View key={`row-${i}`} style={styles.row}>
        {row.map(button => {
          return (
            <TouchableOpacity key={`button-${button}`} style={styles.button}>
              <Text style={styles.buttonText}>{button}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  });
}
export default function EnterAmountComponent({navigation, route}) {
  //   let params = route.params;
  let [amount, setAmount] = React.useState(0);
  let {withdraw, web3} = route.params; // True if withdraw, False if deposit
  //   const json = {mobileNumber: 0, emailAddress: 0, walletAddress: 0};
  //   console.log(json);

  console.log('Web3 not being carried to enterSavings:', web3);

  // console.log('Address: ', address);
  // console.log('User Info: ', info);
  console.log('Withdraw:', withdraw);

  function handleButtonPress(button) {
    if (button !== '' && button !== '⌫') {
      let num = parseInt(button);
      setAmount(amount * 10 + num);
    } else if (button === '⌫') setAmount(parseInt(amount / 10));
  }
  return (
    <View style={styles.container}>
      <View style={{marginTop: '15%', alignItems: 'center'}}>
        <View>
          <Text
            style={{
              fontSize: 35,
              fontFamily: 'NeueMachina-UltraBold',
              color: 'white',
            }}>
            Enter Amount
          </Text>
        </View>
        <View
          style={{marginTop: 60, flexDirection: 'row', alignItems: 'flex-end'}}>
          <Text
            style={{
              marginBottom: 4,
              marginRight: 4,
              fontSize: 45,
              color: 'white',
              fontFamily: 'VelaSans-Bold',
            }}>
            $
          </Text>
          <Text
            style={{
              fontSize: 60,
              color: 'white',
              fontFamily: 'VelaSans-Bold',
            }}>
            {amount}
          </Text>
        </View>
      </View>
      <View
        style={{width: '100%', alignItems: 'center', justifyContent: 'center'}}>
        {buttons.map((row, i) => {
          return (
            <View key={`row-${i}`} style={styles.row}>
              {row.map(button => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      handleButtonPress(button);
                    }}
                    key={`button-${button}`}
                    style={styles.button}>
                    <Text style={styles.buttonText}>{button}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SavingsPending', {
              amount: amount.toString(),
              withdraw: withdraw,
              web3: web3,
            })
          }
          style={styles.confirmButton}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'VelaSans-Bold',
              fontSize: 18,
            }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    borderColor: 'grey',
  },
  button: {
    width: 90,
    height: 65,
    borderRadius: 25,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
  confirmButton: {
    width: '80%',
    marginBottom: 20,
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '#67CA83',
  },
  detailsLol: {
    width: '80%',
    marginBottom: 50,
    alignItems: 'flex-start',
    paddingLeft: 20,
    height: 85,
    // borderColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#222',
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    elevation: 24,
  },
});
