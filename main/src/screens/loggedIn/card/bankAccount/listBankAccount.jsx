import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Pressable, AppRegistry } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Icon} from 'react-native-elements';
import { BankAccountType, BankAccountSubType } from '@spritz-finance/api-client'
import {SPRITZ_API_KEY, SPRITZ_INTEGRATION_KEY_PROD} from '@env';
import {
    SpritzApiClient,
    Environment,
} from '../../../../../node_modules/@spritz-finance/api-client/dist/spritz-api-client.mjs';
import FastImage from 'react-native-fast-image';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import Snackbar from 'react-native-snackbar';

const ListBankAccounts = ({navigation}) => {

    const [loading, setLoading] = useState(true);
    const [bankAccountList, setBankAccountList] = useState([]);
    const [selectedBankAccountId, setSelectedBankAccountId] = useState(null);
    const [apiKey, setApiKey] = useState(null);

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = (id) => {
        setModalVisible(!isModalVisible);
        setSelectedBankAccountId(id);
    };

    const handleConfirm = async () => {
        // Implement your confirmation logic here
        try{
            console.log(selectedBankAccountId);
            client.setApiKey(apiKey);
            await client.bankAccount.delete(selectedBankAccountId);
            Snackbar.show({
                text: 'Bank Account removed successfully',
                duration: Snackbar.LENGTH_SHORT,
            })
            fetchBankAccounts();
        }catch(e){
            console.log(e);
        }
        console.log('Confirmed');
        toggleModal();
    };

    const client = SpritzApiClient.initialize({
        environment: Environment.Production,
        // apiKey: SPRITZ_API_KEY,
        integrationKey: SPRITZ_INTEGRATION_KEY_PROD,
    });

    const fetchBankAccounts = async (api_key) => {
        try{
            console.log(api_key);
            client.setApiKey(api_key);
            console.log(client);
            const bankAccounts = await client.bankAccount.list();
            console.log(bankAccounts);
            setBankAccountList(bankAccounts);
            setLoading(false);
        }catch(e){
            console.log(e);
            setLoading(false);
        }
    }
    
    useEffect(() => {

        async function init() {
            try{
              const api_key = await AsyncStorage.getItem('spritzAPI');
              console.log(api_key);
              if (api_key === null) {
                navigation.push('Card');
              }else{
                setApiKey(api_key);
                client.setApiKey(api_key);
                console.log("--------");
                console.log("13333332");
                console.log(client);
                console.log(apiKey);
                await fetchBankAccounts(api_key);
              }
            }catch(err){
              console.log(err);
              navigation.push('Card');
            }
        }
        
        setLoading(true);
        init();
    }, []);

    const renderCard = ({ item }) => (
        
            <LinearGradient colors={['#1D2426', '#383838']} style={styles.linearGradient}>
            {/* <LinearGradient colors={['#C3338A', '#FE2C5E']} style={styles.linearGradient}> */}
                <View style={styles.bankAccountSubTypeContainer}>
                    <Text style={styles.actionText}>{item.bankAccountSubType}</Text>
                </View>
                <View style={styles.card}>
                    
                    <Text style={styles.cardTitle}>Account Number : {item.accountNumber}</Text>
                    <Text style={styles.cardText}>Routing Number : {item.bankAccountDetails.routingNumber}</Text>
                    <Text style={styles.cardText}>Account Type : {item.bankAccountType}</Text>
                    <Text style={styles.cardText}>Account Holder : {item.holder}</Text>

                    <View style={styles.listItemActionContainer}>
                        <TouchableOpacity onPress={() => {
                            toggleModal(item.id);
                        }}>
                            <View style={[styles.listItemActionButton]} blurType="light"
                                blurAmount={10}
                                reducedTransparencyFallbackColor="white">
                                <Text style={styles.actionText}>Disconnect</Text>
                            </View>
                        </TouchableOpacity>
                        {/* <View style={[styles.listItemActionButton, {
                            backgroundColor: 'green'
                        }]} blurType="light"
                        blurAmount={10}
                        reducedTransparencyFallbackColor="white">
                            <Text style={styles.actionText}>View </Text>
                        </View> */}
                    </View>
                </View>
            </LinearGradient>
    );

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
            <Text style={styles.heading}>My bank accounts</Text>
            <Modal isVisible={isModalVisible}>
                <View style={styles.modal}>
                    <Text style={styles.modalText}>Are you sure you want to disconnect this account?</Text>
                    <View style={styles.buttonContainer}>
                        <Pressable onPress={handleConfirm} style={styles.confirmButton}>
                            <Text style={styles.buttonText}>Confirm</Text>
                        </Pressable>
                        <Pressable onPress={toggleModal} style={styles.cancelButton}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <View>
                {loading
                ? <ActivityIndicator size={30} style={styles.loader} color="#fff" />
                : <View>
                    {
                        bankAccountList.length == 0
                        ? <View style={styles.noAccountContainer}>
                            {/* <FastImage source={require('./404.jpg')} style={styles.image} /> */}
                            <Text style={styles.noAccountText}>No bank accounts were found.</Text>
                        </View>
                        : <View style={styles.listContainer}>
                            <FlatList
                                data={bankAccountList}
                                renderItem={renderCard}
                                keyExtractor={(item) => item.id}
                            />
                        </View>
                    }    
                </View>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        margin: 10,
    },
    backButton: {
        position: 'absolute',
        top: 15,
        left: 10,
        color: 'fff',
        borderRadius: 50,
        backgroundColor: '#FE2C5E',
        padding:5,
    },
    heading: {
        fontSize: 20,
        marginBottom: 20,
        color: '#ffffff',
        fontFamily: `EuclidCircularA-Medium`,
        fontWeight: 500,
        marginLeft: 50
    },
    listContainer : {
        width: '100%', 
        marginTop: 10,
        // backgroundColor: '#fff'
    },
    noAccountContainer : {
        flexDirection : 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 200
    },  
    noAccountText : {
        color: '#f0f0f0',
        fontSize: 18,
        fontFamily: `EuclidCircularA-Medium`,
        fontWeight: 400,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 20
    },
    listItemContainer : {
        width: '100%',
        margin: 10,
        padding: 10,
        height: 100,
        // backgroundColor: '#4f4f4f',
    },
    cardContainer: {
        padding: 5,
        backgroundColor: '#3f3f3f',
        marginVertical: 5,
        borderRadius: 8,
        
    },
    // card: {
    //     // backgroundColor: '#1E313B',
    //     borderRadius: 8,
    //     padding: 16,
    //     // marginBottom: 12,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 4,
    //     elevation: 2,
    //   },
      cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#fff',
        fontFamily: `EuclidCircularA-Medium`,
        fontWeight: 500,
        marginTop: 30,
      },
      cardText: {
        fontSize: 14,
        marginBottom: 8,
        color: '#fff',
        fontFamily: `EuclidCircularA-Medium`,
        fontWeight: 400,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
      },
      actionButton: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginLeft: 10,
      },
      buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
      },
      linearGradient: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        marginVertical: 10
        // paddingLeft: 15,
        // paddingRight: 15,
        // borderRadius: 5
      },
      bankAccountSubTypeContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        elevation: 100,
        zIndex: 100,
        backgroundColor: 'green',
        padding: 8,
        borderRadius: 5,
        // transform: [{ rotate: '-14deg' }]
        // borderRadius: 20,
        // width: 120,
        // height: 30,
        // backgroundColor: 'transparent',
        // borderWidth: 1,
        // borderColor: '#8f8f8f',
        // padding: 4,
        // flexDirection: 'row',
        // justifyContent: 'center',
        // marginBottom: 10
      },
      listItemActionContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20
      },
      listItemActionButton : {
        borderRadius: 20,
        width: 120,
        height: 30,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#7f7f8f',
        padding: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
      },
      actionText: {
        fontSize: 14,
        color: '#fff',
        fontFamily: `EuclidCircularA-Medium`,
        fontWeight: 400,
      },  

    modal : {
        backgroundColor: 'white',
        elevation : 10,
        height: 140,   
        padding : 20 
    },
    modalText: {
        fontSize: 18,
        fontWeight: 500,
        fontFamily: 'EuclidCircularA-Medium',
        color: '#000',
    },
    confirmButton :{
        borderRadius: 10,
        color: '#000',
        margin: 10
    },
    cancelButton : {
        borderRadius: 10,
        margin: 10
    },
    buttonText : {
        color: '#000',
        fontSize: 16,
        fontWeight: 500,
        fontFamily: 'EuclidCircularA-Medium',
    }
    
});

export default ListBankAccounts;
