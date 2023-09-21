import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Icon} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import { BankAccountType, BankAccountSubType, PaymentNetwork } from '@spritz-finance/api-client'
import {SPRITZ_API_KEY, SPRITZ_INTEGRATION_KEY_PROD} from '@env';
import {
    SpritzApiClient,
    Environment,
} from '../../../../../node_modules/@spritz-finance/api-client/dist/spritz-api-client.mjs';

const BankAccountTransactions = ({navigation}) => {

    const client = SpritzApiClient.initialize({
        environment: Environment.Production,
        // apiKey: SPRITZ_API_KEY,
        integrationKey: SPRITZ_INTEGRATION_KEY_PROD,
    });
    const [loading, setLoading] = useState(false);
    const [bankAccountList, setBankAccountList] = useState([]);
    const [selectedBankAccount, setSelectedBankAccount] = useState(null);
    const [selectedAmount, setSelectedAmount] = useState(null);

    const handleSubmit = async () => {
        try{

            console.log(client);
            console.log(client.paymentRequest);

            // Create a payment request for the selected bank account
            const paymentRequest = await client.paymentRequest.create({
                amount: selectedAmount,
                accountId: selectedBankAccount,
                network: PaymentNetwork.Ethereum,
            })

            console.log(paymentRequest);
            
            // Retrieve the transaction data required to issue a blockchain transaction
            const transactionData = await client.paymentRequest.getWeb3PaymentParams({
                paymentRequest,
                paymentTokenAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC on mainnet
            })

            console.log(transactionData);
            
            /**
             * Issue blockchain transaction with the transaction data
             * and wait for confirmation
            **/
            
            // Retrieve the payment issued for the payment request to check the payment status and confirmation
            const payment = await client.payment.getForPaymentRequest(paymentRequest.id)

            console.log(payment);
        }catch(e){
            console.log(e);
        }
    }

    const fetchBankAccounts = async () => {
        try{
            const bankAccounts = await client.bankAccount.list();
            console.log(bankAccounts);
            setBankAccountList(bankAccounts);
            setLoading(false);
        }catch(e){
            console.log(e);
            setLoading(false);
        }
    }
    
    async function init() {
        try{
          const api_key = await AsyncStorage.getItem('spritzAPI');
          console.log(api_key);
          if (api_key === null) {
            navigation.push('Card');
          }else{
            client.setApiKey(api_key);
            await fetchBankAccounts();
          }
        }catch(err){
          console.log(err);
          navigation.push('Card');
        }
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <View>
                  <Icon
                    name={'chevron-left'}
                    size={30}
                    color={'#2281e9'}
                    type="entypo"
                  />
                </View>
            </TouchableOpacity>
            <Text style={styles.heading}>Account Transactions</Text>
            {
                loading
                ? <ActivityIndicator size={30} style={styles.loader} color="#fff" /> 
                : <View style={styles.formContainer}>
                
                    <Text style={styles.label}>Select Bank Account</Text>
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

                    <TextInput
                        keyboardType='numeric'
                        style={styles.input}
                        placeholder="Amount in USD"
                        placeholderTextColor="#FFFFFF"
                        value={selectedAmount}
                        onChangeText={(text) => setSelectedAmount(text)}
                    />     
    
                    <View style={styles.submitButton}>
                        <Button title="Submit" onPress={handleSubmit} />
                    </View>
                </View>
            }
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
        top: 10,
        left: 10,
        color: 'white',
        borderRadius: 50,
        backgroundColor: '#041421',
        padding:10
    },
    heading: {
        fontSize: 20,
        marginBottom: 20,
        color: '#ffffff',
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
    submitButton: {
        margin: 20,
        borderRadius : 20,
        elevation: 10
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
        marginVertical: 10 
    }
});

export default BankAccountTransactions;
