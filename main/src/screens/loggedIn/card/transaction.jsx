import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight, 
  Dimensions,
  Linking,
  SafeAreaView,
  Platform,
} from 'react-native';

import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';

const CardTransactions = () => {

    const [state, setState] = React.useState([
        {
          truth: true,
          to: 'Loading',
          from: 'Loading',
          value: 0,
          hash: '',
          date: 'Loading',
          time: 'Loading...',
          month: 'Loading...',
        },
    ]);

    return (
        <View style={styles.transactionContainer}>
            <View style={styles.txHeading}>
                <Text
                    style={{
                    color: 'white',
                    fontSize: 22,
                    fontFamily: 'EuclidCircularA-SemiBold',
                    paddingLeft: '4%',
                    }}>
                    Recent Transactions
                </Text>
                <TouchableOpacity
                    onPress={() => {
                    Linking.openURL(
                        `https://${mainnet ? '' : 'mumbai.'}polygonscan.com/address/${
                        global.withAuth
                            ? global.loginAccount.scw
                            : global.connectAccount.publicAddress
                        }`,
                    );
                    }}>
                    <Text
                    style={{
                        color: '#0B84FE',
                        fontFamily: 'EuclidCircularA-Medium',
                        fontSize: 17,
                        marginRight: '5%',
                        paddingTop: 3,
                    }}>
                    See all
                    </Text>
                </TouchableOpacity>
            </View>
            {state.length > 0 ? (
                <Text
                    style={{
                    fontFamily: 'EuclidCircularA-Medium',
                    color: '#6f6f6f',
                    fontSize: 17,
                    marginLeft: '5%',
                    marginTop: '2%',
                    }}>
                    {String(state[0].month)}
                </Text>
            ) : (
                ''
            )}
            {state.length > 0 ? (
                state.slice(0, 10).map(json => {
                    return (
                        <TouchableOpacity
                            keyboardShouldPersistTaps={true}
                            // onPress={() => {
                            //   navigation.push('ViewTransaction', {json: json});
                            // }}
                            onPress={() => {
                            Linking.openURL(
                                `https://${mainnet ? '' : 'mumbai.'}polygonscan.com/tx/${
                                json.hash
                                }`,
                            );
                            }}
                            style={styles.transactions}
                            key={state.indexOf(json)}>
                            <View style={styles.transactionLeft}>
                                <FastImage
                                    style={{width: 50, height: 50, borderRadius: 5}}
                                    source={
                                    json.truth == 2
                                        ? require('./icon/pending.png')
                                        : json.truth == 1
                                        ? require('./icon/positive.png')
                                        : require('./icon/negative.png')
                                    }
                                />
                                <View style={styles.ttext}>
                                    <TouchableHighlight
                                        key={json.hash}
                                        onPress={() => {
                                            Clipboard.setString(json.truth ? json.from : json.to);
                                            Alert.alert('Copied Address To Clipboard');
                                        }}>
                                        <Text
                                            style={{
                                            color: 'white',
                                            fontFamily: `EuclidCircularA-Medium`,
                                            fontSize: 17,
                                            }}>
                                            {(json.truth
                                            ? json.from ==
                                                '0xc9DD6D26430e84CDF57eb10C3971e421B17a4B65'.toLowerCase()
                                                ? 'RemmiteX V1'
                                                : json.from.slice(0, 12) + '...'
                                            : json.to ==
                                                '0xc9DD6D26430e84CDF57eb10C3971e421B17a4B65'.toLowerCase()
                                            ? 'RemmiteX V1'
                                            : json.to
                                            ).slice(0, 12) + '...'}
                                        </Text>
                                    </TouchableHighlight>

                                    <Text
                                        style={{
                                            color: '#7f7f7f',
                                            fontSize: 15,
                                            fontFamily: `EuclidCircularA-Medium`,
                                        }}>
                                        {json.date}, {json.time}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.transactionRight}>
                                <Text
                                    style={{
                                    color: json.truth ? '#7DFF68' : '#fff',
                                    fontSize: 18,
                                    fontFamily: `EuclidCircularA-Medium`,
                                    }}>
                                    {json.truth != 0 && json.truth != 2 ? '+' : '-'}$
                                    {json.value.toFixed(3)}
                                </Text>
                                <Icon
                                    // style={styles.tup}
                                    name={'chevron-small-right'}
                                    size={30}
                                    color={'#7f7f7f'}
                                    type="entypo"
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })
            ) : (
                <View>
                    <Text style={styles.noTransaction}>
                    Your Transactions Appear Here
                    </Text>
                </View>
            )}
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      // flex: 1,
      backgroundColor: '#0c0c0c',
      alignItems: 'center',
      justifyContent: 'center', 
    },
    image: {
      width: 400,
      height: 300,
    },
    textContainer: {
      alignItems: 'center',
    },
    title: {
      fontSize: 30,
      fontFamily: `EuclidCircularA-Medium`,
      color: '#fff',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      color: '#a0a0a0',
      textAlign: 'center',
      marginTop: 20,
      marginHorizontal: 30,
      fontFamily: `EuclidCircularA-Medium`,
    },
    button: {
      backgroundColor: '#222',
      borderRadius: 5,
      marginTop: '20%',
      paddingVertical: 15,
      paddingHorizontal: 40,
      marginBottom: '30%',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
      fontFamily: `EuclidCircularA-Medium`,
    },
    transactionContainer: {
        marginTop: '10%',
        width: '100%',
        flexDirection: 'column',
        paddingBottom: 200,
        borderRadius: 20,
    },
    
    txHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    transactions: {
        width: '92%',
        marginHorizontal: '4%',
        marginVertical: '2%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 17,
        borderRadius: 6,
        backgroundColor: '#151515',
    },
    
    transactionLeft: {
        flexDirection: 'row',
    },
    
    transactionRight: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '24%',
        justifyContent: 'space-between',
    },
    noTransaction: {
        color: '#d9d9d9',
        marginTop: '7%',
        textAlign: 'center',
        fontFamily: `EuclidCircularA-Medium`,
        fontSize: 17,
    },
    
});

export default CardTransactions;
