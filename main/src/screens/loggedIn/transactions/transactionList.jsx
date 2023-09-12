import { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Linking, TouchableHighlight, TouchableOpacity, View, Clipboard } from "react-native";
import { Icon, Text } from "react-native-elements";
import FastImage from "react-native-fast-image";

import {paymentsLoad, addXUSD, txHistoryLoad} from '../payments/utils';
import TransactionReceipt from "./transactionReceipt";
import Snackbar from "react-native-snackbar";

const width = Dimensions.get('window').width;

const TransactionList = ({navigation, route}) => {

    const [state, setState] =  useState([
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

    const [dates, setDates] =  useState([]);
  const [address, setAddress] = useState('0x');
  const [balance, setBalance] = useState('0');
  const [transactionVisible, setTransactionVisible] = useState(false);
  const [mainnet, setMainnet] = useState(false);

  const [showTxnReceiptModal, setShowTxnReceiptModal] = useState(false);
  const [transactionData, setTransactionData] = useState();

  const DEVICE_WIDTH = Dimensions.get('window').width;


  const handleCloseTransactionReceiptModal = () => {
    setShowTxnReceiptModal(false);
  }

  async function call() {
    console.log("----------------------------------------------------------------");
    const address = global.withAuth
      ? global.loginAccount.publicAddress
      : global.connectAccount.publicAddress;
    const web3 = global.withAuth
      ? this.createProvider()
      : this.createConnectProvider();

    const {tokenBalance, mainnet} = await paymentsLoad(web3, address); 
    if (Number(tokenBalance) > 1000) {
      setBalance(Number(tokenBalance / 1000).toFixed(3) + ' K');
    } else {
      setBalance(tokenBalance);
    }

    setMainnet(mainnet);

    const {txDates, txs} = await txHistoryLoad(address);

    setDates(txDates);

    setState(txs);
    console.log('Request being sent for registration');
    await registerFcmToken(global.withAuth ? global.loginAccount.scw : address);

    console.log('Smart Account Needs To Be Loaded:', !global.smartAccount);

    if (global.withAuth) {
      if (!global.smartAccount) {
        let options = {
          activeNetworkId: mainnet
            ? ChainId.POLYGON_MAINNET
            : ChainId.POLYGON_MUMBAI,
          supportedNetworksIds: [
            ChainId.POLYGON_MAINNET,
            ChainId.POLYGON_MUMBAI,
          ],

          networkConfig: [
            {
              chainId: ChainId.POLYGON_MAINNET,
              dappAPIKey: BICONOMY_API_KEY,
            },
            {
              chainId: ChainId.POLYGON_MUMBAI,
              dappAPIKey: BICONOMY_API_KEY_MUMBAI,
            },
          ],
        };

        const particleProvider = this.getOnlyProvider();
        const provider = new ethers.providers.Web3Provider(
          particleProvider,
          'any',
        );

        let smartAccount = new SmartAccount(provider, options);
        smartAccount = await smartAccount.init();
        global.smartAccount = smartAccount;
      }
    }
  }

  useEffect(() => {
    console.log('Is Auth:', global.withAuth);

    call();
  }, []);
  
  const t = true;


    return ( 
        <SafeAreaView
            style={{
                width: '100%',
                height: '100%',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}>
            
            {showTxnReceiptModal && (
                <TransactionReceipt
                    transactionData={transactionData}
                    onClose={handleCloseTransactionReceiptModal}
                />
            )}

            <View
                style={{
                    // position: 'absolute',
                    top: '5%',
                    width: width * 0.9,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }} >
                    <Icon
                        name={'keyboard-backspace'}
                        size={30}
                        color={'#f0f0f0'}
                        type="materialicons"
                        onPress={() => navigation.goBack()}
                    /> 

                    <Text style={styles.heading}>
                        Transaction History
                    </Text>

            </View>

            <View style={styles.transactionListContainer}>
                {state.length > 0 ? (
                    <Text
                        style={{
                        fontFamily: 'Sarala-Regular',
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
                    state.slice(0, 20).map(json => {
                        return (
                            <TouchableOpacity
                                keyboardShouldPersistTaps={true}
                                // onPress={() => {
                                //   navigation.push('ViewTransaction', {json: json});
                                // }}
                                onPress={() => {
                                    setTransactionData(json);
                                    setShowTxnReceiptModal(true);
 

                                    // Linking.openURL(
                                    //     `https://${mainnet ? '' : 'mumbai.'}polygonscan.com/tx/${
                                    //     json.hash
                                    //     }`,
                                    // );
                                }}
                                style={styles.transactions}
                                key={state.indexOf(json)}>
                                <View style={styles.transactionLeft}>
                                <View style={{
                                  borderRadius: 50,
                                  backgroundColor: '#A38CFF',
                                  width: 40, height: 40,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                  {/* <FastImage
                                    style={{width: 30, height: 30}}
                                    source={
                                      json.truth == 2
                                        ? require('./icon/pending.png')
                                        : json.truth == 1
                                        ? require('./icon/positive.png')
                                        : require('./icon/negative.png')
                                    }
                                  /> */}
                                  <FastImage
                                      style={{width: 20, height: 20, borderRadius: 5}}
                                      source={
                                      json.truth == 2
                                          ? require('../payments/icon/pending.png')
                                          : json.truth == 1
                                          ? require('../payments/icon/positive.png')
                                          : require('../payments/icon/negative.png')
                                      }
                                  />
                                </View>
                                <View style={styles.ttext}>
                                    <TouchableHighlight
                                    key={json.hash}
                                    onPress={() => {
                                        Clipboard.setString(json.truth ? json.from : json.to);
                                        Snackbar.show({text: "Copied address to clipboard"})
                                        // Alert.alert('Copied Address To Clipboard');
                                    }}>
                                        <Text
                                            style={{
                                            color: '#e9e9e9',
                                            fontFamily: `Sarala-Regular`,
                                            fontSize: 16,
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
                                            fontFamily: `Sarala-Regular`,
                                        }}
                                    >
                                        {json.date}, {json.time}
                                    </Text>
                                </View>
                                </View>

                                <View style={styles.transactionRight}>
                                <Text
                                    style={{
                                    color: json.truth ? '#A38CFF' : '#fff',
                                    fontSize: 17,
                                    fontFamily: `Sarala-Regular`,
                                    }}>
                                    {json.truth != 0 && json.truth != 2 ? '+' : '-'}$
                                    {json.value.toFixed(3)}
                                </Text>
                                {/* <Icon
                                    // style={styles.tup}
                                    name={'chevron-small-right'}
                                    size={30}
                                    color={'#7f7f7f'}
                                    type="entypo"
                                /> */}
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
        </SafeAreaView>
    );

}


const styles = StyleSheet.create({
    heading : { 
        fontSize: 20,
        color: '#ffffff',
        fontFamily: `Sarala-Regular`,
        fontWeight: 500,
        marginLeft: 30
    },
    transactionListContainer: {
        margin: '3%',
        // backgroundColor: 'blue',
        top: '5%'
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
    // backgroundColor: 'red',
    backgroundColor: '#151515',
  },
  transactionLeft: {
    flexDirection: 'row',
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    justifyContent: 'flex-end',
  },
  noTransaction: {
    color: '#d9d9d9',
    marginTop: '7%',
    textAlign: 'center',
    fontFamily: `Sarala-Regular`,
    fontSize: 17,
  },
  ttext: {
    marginLeft: 15,
    marginTop: 5,
  },
});

export default TransactionList;