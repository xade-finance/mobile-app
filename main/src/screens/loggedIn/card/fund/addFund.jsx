import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Icon} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import { BankAccountType, BankAccountSubType, PaymentNetwork } from '@spritz-finance/api-client'
import '@ethersproject/shims';
import {ethers} from 'ethers';
import {SPRITZ_API_KEY, SPRITZ_INTEGRATION_KEY} from '@env';
import {
    SpritzApiClient,
    Environment,
} from '../../../../../node_modules/@spritz-finance/api-client/dist/spritz-api-client.mjs';
import Snackbar from 'react-native-snackbar';
import LinearGradient from 'react-native-linear-gradient';
import { paymentsLoad } from '../../payments/utils';
import SpritzAbi from './Spritz';
// import { ethers } from 'ethers';
// import Web3 from 'web3';

// const PolygonRPCUrl = 'YOUR_POLYGON_RPC_URL'; // Replace with your Polygon RPC URL
// const provider = new ethers.providers.JsonRpcProvider(PolygonRPCUrl);

// const EthereumNodeUrl = 'https://eth.getblock.io/92db9ddf-3bc5-4397-ab19-15940100cafe/goerli/'; // Replace with your Ethereum node URL
// const web3 = new Web3(new Web3.providers.HttpProvider(EthereumNodeUrl));


const AddFund = ({navigation}) => {

    const client = SpritzApiClient.initialize({
        environment: Environment.Staging,
        // apiKey: SPRITZ_API_KEY,
        integrationKey: SPRITZ_INTEGRATION_KEY,
    });
    const [loading, setLoading] = useState(false);
    const [bankAccountList, setBankAccountList] = useState([]);
    const [selectedBankAccount, setSelectedBankAccount] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [apiKey, setApiKey] = useState(null);
    const [loadingButton, setLoadingButton] = useState(false);

    const [paymentRequestHistoryLoading, setPaymentRequestHistoryLoading] = useState(false);
    const [paymentRequestHistory, setPaymentRequestHistory] = useState([]);

    const [balance, setBalance] = useState(0);

    const handleSubmit = async () => {
        try{
            client.setApiKey(apiKey);
            console.log(client);
            console.log(client.paymentRequest);
            setLoadingButton(true);

            console.log(selectedAmount);

            const paymentRequestData = {
                amount: parseInt(selectedAmount),
                accountId: selectedBankAccount,
                network: PaymentNetwork.Polygon,
            };

            console.log(paymentRequestData);

            // Create a payment request for the selected bank account
            const paymentRequest = await client.paymentRequest.create(paymentRequestData);

            console.log(paymentRequest);
 

            console.log("--------------");


            
            // // Retrieve the transaction data required to issue a blockchain transaction
            const transactionData = await client.paymentRequest.getWeb3PaymentParams({
                paymentRequest,
                // paymentTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
                paymentTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on mainnet
            })

            console.log(transactionData);

            
            /**
             * Issue blockchain transaction with the transaction data
             * and wait for confirmation
            **/

            await sendTransaction(transactionData);
            
            // Retrieve the payment issued for the payment request to check the payment status and confirmation
            const payment = await client.payment.getForPaymentRequest(paymentRequest.id)

            console.log(payment);

            Snackbar.show({
                text: 'Payment request generated successfully',
                duration: Snackbar.LENGTH_SHORT,
            });

            setSelectedAmount(null);

        }catch(e){
            console.log(e);
            Snackbar.show({
                text: 'Unable to generate payment request',
                duration: Snackbar.LENGTH_SHORT,
            });
        }

        setLoadingButton(false);

    }

    const sendTransaction = async (data) => {
        try {

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

            const approve = {
              to: data.contractAddress,
              data: data.calldata,
            };
            
            try {
              const txResponse = await  global.smartAccount.sendTransaction({
                transaction: approve,
              });
              console.log('Response:', txResponse);
              return true;
            } catch (err) {
              console.log(err);
              return false;
            }

            // setMainnet(mainnet);

        // //   const accounts = await web3.eth.getAccounts();
        // //   const senderAddress = accounts[0];

        //   const senderAddress = '0x3E46a778B837da6e4EF7c14e9c0313390a9ED6D3';
    
        //   const transactionData = {
        //     from: senderAddress,
        //     to: data.contractAddress, // Replace with the receiver's Ethereum address
        //     value: web3.utils.toWei(data.amountDue, 'ether'), // Amount of ether to send
        //   };
    
        //   const transactionHash = await web3.eth.sendTransaction(transactionData);
        //   setTransactionStatus(`Transaction sent: ${transactionHash}`);
        } catch (error) {
            console.log(error);
        //   setTransactionStatus(`Error: ${error.message}`);
        }
    };

    useEffect(() => {

        async function init() {
            try{
              const api_key = await AsyncStorage.getItem('spritzAPI');
              console.log(api_key);
              if (api_key === null) {
                navigation.push('Card');
              }else{
                client.setApiKey(api_key);
                setApiKey(api_key);
                // await fetchBankAccounts();

                const virtualCard = await client.virtualCard.fetch();

                console.log(virtualCard);

                setSelectedBankAccount(virtualCard.id);
              }
            }catch(err){
              console.log(err);
              navigation.push('Card');
            }
        }

        init();
    }, []);

    return (
        <View style={styles.container}>
            
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <View>
                    <Icon
                        name={'keyboard-backspace'}
                        size={30}
                        color={'#f0f0f0'}
                        type="materialicons"
                        onPress={() => navigation.goBack()}
                    /> 
                </View>
            </TouchableOpacity>
            <Text style={styles.heading}>Payment Request</Text>

            {/* <LinearGradient colors={['#1D2426', '#383838']} style={styles.linearGradient}>
                <Text style={styles.sectionHeading}>Select Bank Account</Text>
                <View style={styles.formContainer}>                
                    <View
                        style={styles.pickerContainer}>
                        <Picker
                            label="Bank Account"
                            style={styles.picker}
                            selectedValue = {selectedBankAccount}
                            mode='dialog'
                            onValueChange={(itemValue) => setSelectedBankAccount(itemValue)}>

                            {
                                bankAccountList.map((bankAccount) => 
                                    <Picker.Item key={bankAccount.id} value={bankAccount.id} label={bankAccount.accountNumber + ' - ' + bankAccount.bankAccountSubType} />
                                )
                            }

                        </Picker>
                    </View>
                </View>
            </LinearGradient> */}

            {
                (!loading && selectedBankAccount !== null)
                ? <LinearGradient colors={['#1D2426', '#383838']} style={styles.linearGradient}>
                    <Text style={styles.sectionHeading}>Create Request</Text>
                    <View style={styles.formContainer}>
                    
                        <Text style={styles.label}>Enter amount</Text>

                        <TextInput
                            keyboardType='numeric'
                            style={styles.input}
                            placeholder="Amount in USD"
                            placeholderTextColor="#FFFFFF"
                            value={selectedAmount}
                            onChangeText={(text) => setSelectedAmount(text)}
                        />     
        
                        <View style={styles.submitButtonContainer}>
                            <Pressable onPress={handleSubmit} style={styles.submitButton}>
                                {loadingButton
                                    ? <ActivityIndicator size={18} style={styles.loader} color="#fff"/>
                                    : <Text style={styles.buttonText}>Submit</Text>
                                }
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>
                : <></>
            }


            {/* {
                (!loading && selectedBankAccount !== null) ? <LinearGradient colors={['#1D2426', '#383838']} style={styles.linearGradient}>
                    <Text style={styles.sectionHeading}>Transaction History</Text>
                    <View style={styles.paymentRequestHistoryListContainer}>
                        { paymentRequestHistoryLoading
                            ? <ActivityIndicator size={18} style={styles.loader} color="#fff"/>
                            : paymentRequestHistory.map ((e) => {
                                return <View style={styles.paymentRequestHistoryListItem}>
                                    <View style={styles.itemStatus}>
                                        
                                    </View>
                                    
                                    <View>
                                        <View style={styles.itemDate}>
                                            
                                        </View>
                                        <View style={styles.itemAmount}>

                                        </View>
                                    </View>

                                    <View> 
                                    </View>
                                </View>;
                            })
                        }
                    </View>
                </LinearGradient>
                : <></>
            } */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0c0c0c'
    },
    backButton: {
        position: 'absolute',
        top: 15,
        left: 10,
        color: 'white',
        borderRadius: 50,
        // backgroundColor: '#FE2C5E',
        padding:5
    },
    heading: {
        fontSize: 20,
        marginBottom: 20,
        color: '#ffffff',
        fontFamily: `Sarala-Regular`,
    },
    formContainer: {
        width: '100%',
    },
    input: {
        height: 50,
        borderWidth: 1,
        marginVertical: 10,
        padding: 10,
        borderColor: '#707070',
        color: '#ffffff',
        borderRadius: 10,
    },
    submitButtonContainer: {
        margin: 20,
        borderRadius : 20,
        elevation: 10,
        flexDirection: 'row',
        justifyContent:'center',
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#5038E1',
        padding: 10,
        borderRadius: 10,
        width: '50%',
    },  
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: `Sarala-Regular`,
        fontWeight: 500,
        textAlign: 'center'
    },  
    picker: {
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        width:'100%'
    },
    pickerContainer: {flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#707070'
    },
    label : {
        color: '#ffffff',
        marginTop: 10,
        fontSize: 14,
        fontFamily: `Sarala-Regular`,
    },
    linearGradient: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        marginVertical: 10,
        width: '100%'
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: 500,
        color: '#fff',
        fontFamily: `Sarala-Regular`,
        marginBottom: 10
    },

    paymentRequestHistoryListContainer : {
        minHeight: 100,

    },

    paymentRequestHistoryListItem :{

    },

    itemDate : {

    },

    itemStatus : {

    },

    itemAmount: {

    }
});

export default AddFund;
