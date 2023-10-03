import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Icon} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import { BankAccountType, BankAccountSubType, PaymentNetwork } from '@spritz-finance/api-client'
import '@ethersproject/shims';
import {ethers} from 'ethers';
import {SPRITZ_API_KEY, SPRITZ_INTEGRATION_KEY_PROD, SPRITZ_INTEGRATION_KEY_TEST} from '@env';
import {
    SpritzApiClient,
    Environment,
} from '../../../../../node_modules/@spritz-finance/api-client/dist/spritz-api-client.mjs';
import Snackbar from 'react-native-snackbar';
import LinearGradient from 'react-native-linear-gradient';
import { initSmartWallet, paymentsLoad } from '../../payments/utils';
import usdAbi from '../../../../abi/USDC.json';
import xusdAbi from '../../../../abi/XUSD.json';
import { PaymasterMode } from '@biconomy/paymaster';
// import { ethers } from 'ethers';
// import Web3 from 'web3';

// const PolygonRPCUrl = 'YOUR_POLYGON_RPC_URL'; // Replace with your Polygon RPC URL
// const provider = new ethers.providers.JsonRpcProvider(PolygonRPCUrl);

// const EthereumNodeUrl = 'https://eth.getblock.io/92db9ddf-3bc5-4397-ab19-15940100cafe/goerli/'; // Replace with your Ethereum node URL
// const web3 = new Web3(new Web3.providers.HttpProvider(EthereumNodeUrl));


const AddFund = ({navigation}) => {

    const client = SpritzApiClient.initialize({
        environment: Environment.Staging, 
        integrationKey: SPRITZ_INTEGRATION_KEY_TEST,
    });

    // particleAuth.init(
    //     PolygonMumbai,
    //     particleAuth.Env.Staging,
    // );

    // const client = SpritzApiClient.initialize({
    //     environment: Environment.Production,
    //     // apiKey: SPRITZ_API_KEY,
    //     integrationKey: SPRITZ_INTEGRATION_KEY_PROD,
    // });
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
            
            // // Retrieve the transaction data required to issue a blockchain transaction
            const transactionData = await client.paymentRequest.getWeb3PaymentParams({
                paymentRequest,
                // paymentTokenAddress: '0xA3C957f5119eF3304c69dBB61d878798B3F239D9', //xUSDC
                // paymentTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' 
                paymentTokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on mainnet
            })

            console.log(transactionData);

            
            /**
             * Issue blockchain transaction with the transaction data
             * and wait for confirmation
            **/

            await sendTransaction(transactionData, parseInt(selectedAmount));
            
            // Retrieve the payment issued for the payment request to check the payment status and confirmation
            const payment = await client.payment.getForPaymentRequest(paymentRequest.id)

            console.log(payment);

            

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

    const sendTransaction = async (data, amount) => {
        try {

            const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';
            // const usdcAddress = '0xA3C957f5119eF3304c69dBB61d878798B3F239D9';

            const address = global.withAuth
                ? global.loginAccount.publicAddress
                : global.connectAccount.publicAddress;
            const web3 = global.withAuth
                ? this.createProvider()
                : this.createConnectProvider();

            const {tokenBalance, mainnet} = await paymentsLoad(web3, address); 
            setBalance(tokenBalance);

            console.log(tokenBalance);
            console.log(mainnet);

            console.log(data.contractAddress);

            console.log('Calculating Gas In USDC...');

            amount = amount*1000000

            const contractGas = Number('90000');
            const approvalGas = Number('60000');
            const gasPrice = await web3.eth.getGasPrice();
            const gas = (contractGas + approvalGas) * gasPrice;
            const gasUSDC = Number(String(gas).substring(0, 5) * 1.15).toFixed(0);
            const totalAmount = Number(amount) + Number(gasUSDC);
        
            console.log('Total Gas:', web3.utils.fromWei(String(gas), 'ether'));
            console.log(
                'Total Gas In USDC:',
                web3.utils.fromWei(String(gasUSDC), 'mwei'),
            );
            console.log('Total Amount:', totalAmount);
            console.log('Total Balance:', tokenBalance);

            if (totalAmount >= tokenBalance*1000000){
                Snackbar.show({text: 'Insufficient balance'})
            }else{

                let txs = [];
    
                console.log('Creating Transactions...');

                const usdcAbi = new ethers.utils.Interface(usdAbi);
                const xusdcAbi = new ethers.utils.Interface(xusdAbi);
    
                const approveData = usdcAbi.encodeFunctionData('approve', [
                    data.contractAddress,
                    totalAmount,
                ]);
        
                // const approveData = xusdcAbi.encodeFunctionData('approve', [
                //     data.contractAddress,
                //     totalAmount,
                // ]);

                const approveTX = {
                    to: usdcAddress,
                    data: approveData,
                };
        
                txs.push(approveTX);

                const spritzData = {
                    to: data.contractAddress,
                    data: data.calldata,
                };

                txs.push(spritzData);
                
                console.log(txs);

                try {
                    const userOp = await global.smartAccount.buildUserOp(txs)

                    const biconomyPaymaster = await global.smartAccount.paymaster;
            
                    console.log(biconomyPaymaster);
            
                    let paymasterServiceData = {
                        mode: PaymasterMode.SPONSORED,
                        // smartAccountInfo: {
                        //   name: 'BICONOMY',
                        //   version: '2.0.0'
                        // },
                    };
            
                    console.log(paymasterServiceData);
            
                    const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(
                        userOp,
                        paymasterServiceData
                    );
            
                    console.log(paymasterAndDataResponse);
                        
                    userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
            
                    // userOp.paymasterAndData = "0x"
            
                    console.log(userOp);
                  
                    const userOpResponse = await global.smartAccount.sendUserOp(userOp);
            
                    console.log(userOpResponse);
                  
                    const transactionDetail = await userOpResponse.wait()
                  
                    console.log("transaction detail below")
                    console.log(transactionDetail)

                    // const txResponse = await  global.smartAccount.sendTransactionBatch({
                    //     transactions: txs,
                    // });
                    // const txHash = await txResponse.wait();
                    // console.log(txHash);
                    // console.log('Response:', txResponse);

                    Snackbar.show({
                        text: 'Payment request generated successfully',
                        duration: Snackbar.LENGTH_SHORT,
                    });

                    return true;
                } catch (err) {
                    console.log(err);
                    Snackbar.show({
                        text: 'Error generating payment request',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                    return false;
                }


            }
        } catch (error) {
            console.log(error); 
            Snackbar.show({
                text: 'Error generating payment request',
                duration: Snackbar.LENGTH_SHORT,
            });
            return false;
        }
    };

    useEffect(() => {

        async function init() {
            try{
              await initSmartWallet();
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
