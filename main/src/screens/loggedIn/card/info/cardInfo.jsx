import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Icon} from 'react-native-elements';
import { BankAccountType, BankAccountSubType } from '@spritz-finance/api-client'
import {SPRITZ_API_KEY, SPRITZ_INTEGRATION_KEY} from '@env';
import {
    SpritzApiClient,
    Environment,
} from '../../../../../node_modules/@spritz-finance/api-client/dist/spritz-api-client.mjs';

const CardInfo = ({navigation}) => {

    const [loading, setLoading] = useState(true);
    const [userExists, setUserExists] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [verificationUrl, setVerificationUrl] = useState(null);
    const [virtualCardRenderSecret, setVirtualCardRenderSecret] = useState(null);
    const [apiKey, setApiKey] = useState(null);
    const [virtualCardInfo, setVirtualCardInfo] = useState(null);
  
    const client = SpritzApiClient.initialize({
        environment: Environment.Staging,
        // apiKey: SPRITZ_API_KEY,
        integrationKey: SPRITZ_INTEGRATION_KEY,
    });

    async function init() {
        try{
          const api_key = await AsyncStorage.getItem('spritzAPI');
          console.log(api_key);
          if (api_key === null) {
            navigation.push('Card');
          }else{
            client.setApiKey(api_key);
            
            const verificationData = await client.user.getUserVerification(); 
            setVerificationStatus(verificationData.identity.status);
            if (verificationData.identity.status !== 'ACTIVE') {
                setVerificationUrl(verificationData.identity.verificationUrl);
            }
            
            setUserExists(true);
            setApiKey(api_key);
            
            const virtualCard = await client.virtualCard.fetch();
            setVirtualCardInfo(virtualCard);

            console.log(api_key);
            console.log(virtualCard);
            console.log(virtualCard.renderSecret);

            setLoading(false);
          }
        }catch(err){
          console.log(err);
          navigation.push('Card');
        }
    }

    useEffect(() => {
        setLoading(true);
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
            <Text style={styles.heading}>Card Details</Text>
            
            <View>
                {loading
                ? <ActivityIndicator size={30} style={styles.loader} color="#fff" />
                : <View>
                    {
                        (verificationStatus !== 'ACTIVE') && 
                        <View style={styles.kycContainer}>
                            <Text style={styles.verificationWarning}>Please complete verification to activate your card.</Text>
                            
                            <TouchableOpacity
                                onPress={() => Linking.openURL(
                                `${verificationUrl}`,
                                )}
                                style={styles.verificationStartButton}>
                                <View>
                                <Text style={styles.buttonText}>Verify</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        
                        
                    }

                    {
                        (verificationStatus === 'ACTIVE') && 
                        <View style={styles.cardDetailContainer}>
                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    Card Type
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.type}
                                </Text>
                            </View>

                            {
                                virtualCardInfo.type === 'VirtualCard' &&
                                <View style={styles.cardDetailRow}>
                                    <Text style={styles.cardDetailLabel}>
                                        Virtual Card Type
                                    </Text>
                                    <Text style={styles.cardDetailValue}>
                                        {virtualCardInfo.virtualCardType}
                                    </Text>
                                </View>
                            }

                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    Balance
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.balance}
                                </Text>
                            </View>

                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    Currency
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.currency}
                                </Text>
                            </View>

                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    Country
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.country}
                                </Text>
                            </View>


                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    Card Holder Name 
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.billingInfo.holder}
                                </Text>
                            </View>

                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    Email 
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.billingInfo.email}
                                </Text>
                            </View>

                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    Phone 
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.billingInfo.phone}
                                </Text>
                            </View>

                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    Street Address 
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.billingInfo.address.street}
                                </Text>
                            </View>

                            {
                                virtualCardInfo.billingInfo.address.street2 !== null &&
                                <View style={styles.cardDetailRow}>
                                    <Text style={styles.cardDetailLabel}>
                                        Street Line 2 
                                    </Text>
                                    <Text style={styles.cardDetailValue}>
                                        {virtualCardInfo.billingInfo.address.street2}
                                    </Text>
                                </View>
                            }

                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    City 
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.billingInfo.address.city}
                                </Text>
                            </View>

                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    Subdivision 
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.billingInfo.address.subdivision}
                                </Text>
                            </View>

                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    Country Code
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.billingInfo.address.countryCode}
                                </Text>
                            </View>

                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    Postal Code 
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.billingInfo.address.postalCode}
                                </Text>
                            </View>

                            <View style={styles.cardDetailRow}>
                                <Text style={styles.cardDetailLabel}>
                                    Generated at
                                </Text>
                                <Text style={styles.cardDetailValue}>
                                    {virtualCardInfo.createdAt}
                                </Text>
                            </View>

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
        justifyContent: 'space-evenly',
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

      kycContainer: {
        width: '100%',
        marginVertical: 30,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 10,
      },
      verificationStartButton: {
        backgroundColor: '#FE2C5E',
        flexWrap: 'wrap',
        color: '#fff',
        borderRadius: 5,
        elevation: 10,
        padding:10,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      },
      verificationWarning: {
        color: '#fff',
        width: '70%',
        fontSize: 16, 
        fontWeight: 400,
        fontFamily: `EuclidCircularA-Medium`,
      },
      verificationButtonText: {
        color: '#fff', 
        fontSize: 14,
        width: '30%',
        fontFamily: `EuclidCircularA-Medium`,
      },

      cardDetailRow :{
        flexDirection: 'row',
        justifyContent: 'space-between',    
        marginVertical: 10    
      },
      cardDetailLabel : {
        fontSize: 16,
        fontFamily : 'EuclidCircularA-Medium',
        fontWeight: 500,
        color: '#8f8f8f',
        width: '40%'
      },
      cardDetailValue : {
        fontSize: 16,
        fontFamily : 'EuclidCircularA-Medium',
        fontWeight: 500,
        color: '#fff',
        width: '60%',
        textAlign: 'right'
      }
});

export default CardInfo;
