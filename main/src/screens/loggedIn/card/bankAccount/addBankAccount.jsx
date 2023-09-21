import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Icon} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import { BankAccountType, BankAccountSubType } from '@spritz-finance/api-client'
import {SPRITZ_API_KEY, SPRITZ_INTEGRATION_KEY_PROD} from '@env';
import {
    SpritzApiClient,
    Environment,
} from '../../../../../node_modules/@spritz-finance/api-client/dist/spritz-api-client.mjs';
import Snackbar from 'react-native-snackbar';

const AddBankAccount = ({navigation}) => {

    const client = SpritzApiClient.initialize({
        environment: Environment.Production,
        // apiKey: SPRITZ_API_KEY,
        integrationKey: SPRITZ_INTEGRATION_KEY_PROD,
    });

    const [ownedByUser, setOwnedByUser] = useState(true);
    const [loading, setLoading] = useState(false);
    const [apiKey, setApiKey] = useState(null);

    const [selectedBankAccountSubType, setSelectedBankAccountSubType] = useState(BankAccountSubType.Savings);
    const bankAccountSubTypeOptions = [BankAccountSubType.Savings, BankAccountSubType.Business, BankAccountSubType.Checking];
    
    const [formData, setFormData] = useState({
        accountNumber : '',
        holder : '',
        routingNumber : '',
        name: '',
        email: '', 
    });

    const handleFormSubmit = async () => {
        setLoading(true);
        try{
            console.log("@2222222222");
            client.setApiKey(apiKey);
            console.log(client);

            console.log(formData.routingNumber);
            console.log(formData);

            const bankAccounts = await client.bankAccount.create(BankAccountType.USBankAccount, {
                accountNumber: formData.accountNumber,
                routingNumber: formData.routingNumber,
                email: formData.email,
                holder: formData.holder,
                name: formData.name,
                ownedByUser: ownedByUser,
                subType: selectedBankAccountSubType,
            })

            console.log(client);
 
            Snackbar.show({
                text: 'Bank Account added successfully',
                duration: Snackbar.LENGTH_SHORT,
            });
            setLoading(false);
            navigation.goBack();

        }catch(e){
            console.log(e);
            Snackbar.show({
                text: 'Unable to add bank account',
                duration: Snackbar.LENGTH_SHORT,
            });
            setLoading(false);

        }
    };

    useEffect(() => {

        async function init() {
            try{
              const api_key = await AsyncStorage.getItem('spritzAPI');
              console.log(api_key);
              if (api_key === null) {
                console.log("-----------2");
                navigation.push('Card');
              }else{
                console.log("-----------");
                client.setApiKey(api_key);
                setApiKey(api_key);
                console.log(api_key);
                console.log(client);
                const userData = await client.user.getCurrentUser()
                console.log(userData);    
                setFormData({ ...formData, email: userData.email, holder: userData.firstName + " " + userData.lastName });            
                // setFormData({ ...formData, holder: userData.firstName + " " + userData.lastName });


                // const bankAccounts = await client.bankAccount.create(BankAccountType.USBankAccount, {
                //     accountNumber: '123456789',
                //     routingNumber: '00000123',
                //     email: 'ayugupta.jpr+1@gmail.com',
                //     holder: 'Leslie Knope',
                //     name: 'Savings',
                //     ownedByUser: true,
                //     subType: BankAccountSubType.Savings,
                // });

                // console.log(bankAccounts);
              }
            }catch(err){
                console.log(13132);
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
                    name={'chevron-left'}
                    size={24}
                    color={'#fff'}
                    type="entypo"
                  />
                </View>
            </TouchableOpacity>
            <Text style={styles.heading}>Add new bank account</Text>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}> Account Number </Text>
                    <TextInput
                        style={styles.input}
                        placeholder=""
                        placeholderTextColor="#FFFFFF"
                        value={formData.accountNumber}
                        onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}> Email </Text>
                    <TextInput
                        style={styles.input}
                        placeholder=""
                        placeholderTextColor="#FFFFFF"
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}> Account Holder Name </Text>
                    <TextInput
                        style={styles.input}
                        placeholder=""
                        placeholderTextColor="#FFFFFF"
                        value={formData.holder}
                        onChangeText={(text) => setFormData({ ...formData, holder: text })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}> Account Nickname </Text>

                    <TextInput
                        style={styles.input}
                        placeholder=""
                        placeholderTextColor="#FFFFFF"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}> Is Account owned by user? </Text>
                    <View style={styles.pickerContainer}> 
                        <Picker
                            label="Owned By User"
                            style={styles.picker}
                            selectedValue = {ownedByUser}
                            mode='dialog'
                            onValueChange={(itemValue) => setOwnedByUser(itemValue)}>

                            <Picker.Item key="yes" value={true} label="Yes" />
                            <Picker.Item key="no" value={false} label="No" />

                        </Picker>
                    
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}> Routing Number </Text>
                    <TextInput
                        style={styles.input}
                        placeholder=""
                        placeholderTextColor="#FFFFFF"
                        value={formData.routingNumber}
                        onChangeText={(text) => setFormData({ ...formData, routingNumber: text })}
                    />  
                </View>
                
                <View style={styles.inputContainer}>
                    <Text style={styles.label}> Select Account SubType </Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            style={styles.picker}
                            label="Bank Account SubType"
                            selectedValue = {selectedBankAccountSubType}
                            onValueChange={(itemValue) => setSelectedBankAccountSubType(itemValue)}>

                            {bankAccountSubTypeOptions.map((option, i) => (
                                <Picker.Item key={i} value={option} label={option} />
                            ))}

                        </Picker>          
                    </View>
                </View>

                {/* Add more TextInput components for additional form fields */}
                <View style={styles.submitButtonContainer}>
                    <Pressable onPress={handleFormSubmit} style={styles.submitButton}>
                        {loading
                            ? <ActivityIndicator size={18} style={styles.loader} color="#fff"/>
                            : <Text style={styles.buttonText}>Submit</Text>
                        }
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#0c0c0c',
        margin: 10,
    },
    backButton: {
        position: 'absolute',
        top: 15,
        left: 10,
        color: 'white',
        borderRadius: 50,
        backgroundColor: '#FE2C5E',
        padding:5
    },
    heading: {
        fontSize: 20,
        marginBottom: 20,
        color: '#ffffff',
        fontFamily: `EuclidCircularA-Medium`,
        fontWeight: 500,
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
        color: '#c0c0c0',
        borderRadius: 10,
    },
    inputContainer: {
//         backgroundColor: '#0f0f0f',
        marginTop: 5,
        padding: 5,
        borderRadius: 10,
        shadowColor: '#707070',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
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
        backgroundColor: '#FE2C5E',
        padding: 10,
        borderRadius: 10,
        width: '50%',
    },  
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: `EuclidCircularA-Medium`,
        fontWeight: 500,
        textAlign: 'center'
    },  
    picker: {
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#041421',
        width:'100%'
    },
    pickerContainer: {flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#707070',
        marginTop: 10
    },
    label : {
        color: '#ffffff',
        fontFamily: `EuclidCircularA-Medium`,
        fontWeight: 500
    }
});

export default AddBankAccount;
