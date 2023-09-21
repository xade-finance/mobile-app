import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Icon} from 'react-native-elements';
import { BankAccountType, BankAccountSubType } from '@spritz-finance/api-client'
import {SPRITZ_API_KEY, SPRITZ_INTEGRATION_KEY_PROD} from '@env';
import {
    SpritzApiClient,
    Environment,
} from '../../../../../node_modules/@spritz-finance/api-client/dist/spritz-api-client.mjs';

import LinearGradient from 'react-native-linear-gradient';

const CardInfo = ({navigation}) => {

    const [loading, setLoading] = useState(true);
    const [userExists, setUserExists] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [verificationUrl, setVerificationUrl] = useState(null);
    const [virtualCardRenderSecret, setVirtualCardRenderSecret] = useState(null);
    const [apiKey, setApiKey] = useState(null);
    const [virtualCardInfo, setVirtualCardInfo] = useState(null);
  
    const client = SpritzApiClient.initialize({
        environment: Environment.Production,
        // apiKey: SPRITZ_API_KEY,
        integrationKey: SPRITZ_INTEGRATION_KEY_PROD,
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


            setLoading(false);
          }
        }catch(err){
          console.log(err);
          navigation.push('Card');
          setLoading(false);
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
                        name={'keyboard-backspace'}
                        size={30}
                        color={'#f0f0f0'}
                        type="materialicons"
                        onPress={() => navigation.goBack()}
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
                            <LinearGradient
                                colors={['#1D2426', '#383838']}
                                useAngle
                                angle={45}
                                angleCenter={{x: 0.5, y: 0.5}} 
                                style={styles.cardInformationContainer}>
                                <View style={styles.sectionHeadingContainer}>
                                    <Text style={styles.sectionHeading}>Card Information</Text>
                                </View>
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
                            </LinearGradient>

                            <LinearGradient
                                colors={['#1D2426', '#383838']}
                                useAngle
                                angle={45}
                                angleCenter={{x: 0.5, y: 0.5}} 
                                style={styles.personalInformationContainer}>
                                <View style={styles.sectionHeadingContainer}>
                                    <Text style={styles.sectionHeading}>Personal Information</Text>
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
                            </LinearGradient>

                            <LinearGradient
                                colors={['#1D2426', '#383838']}
                                useAngle
                                angle={45}
                                angleCenter={{x: 0.5, y: 0.5}} 
                                style={styles.billingInformationContainer}>
                                <View style={styles.sectionHeadingContainer}>
                                    <Text style={styles.sectionHeading}>Billing Information</Text>
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
                                        Country
                                    </Text>
                                    <Text style={styles.cardDetailValue}>
                                        {virtualCardInfo.country}
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
                            </LinearGradient>

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
        // backgroundColor: '#FE2C5E',
        padding:5,
    },
    heading: {
        fontSize: 20,
        marginBottom: 20,
        color: '#ffffff',
        fontFamily: `Sarala-Regular`,
        fontWeight: 500,
        marginLeft: 50
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
        fontFamily: `Sarala-Regular`,
      },
      verificationButtonText: {
        color: '#fff', 
        fontSize: 14,
        width: '30%',
        fontFamily: `Sarala-Regular`,
      },

      cardDetailRow :{
        flexDirection: 'column',
        justifyContent: 'center',    
        marginVertical: 10    
      },
      cardDetailLabel : {
        fontSize: 13,
        fontFamily : 'Sarala-Regular',
        fontWeight: 500,
        color: '#8f8f8f',
        width: '100%'
      },
      cardDetailValue : {
        fontSize: 16,
        fontFamily : 'Sarala-Regular',
        fontWeight: 500,
        color: '#fff',
        width: '100%',
        textAlign: 'left'
      },
      cardInformationContainer: {
        borderRadius: 10,
        backgroundColor: '#131313',
        elevation: 10,
        padding:10,
        marginVertical: 10,
        paddingTop: 30,
      },
      personalInformationContainer: {
        borderRadius: 10,
        // backgroundColor: '#131313',
        elevation: 10,
        padding:10,
        marginVertical: 10,
        paddingTop: 30,
      },
      billingInformationContainer: {
        borderRadius: 10,
        // backgroundColor: '#131313',
        elevation: 10,
        padding:10,
        marginVertical: 10,
        paddingTop: 30,
        backgroundColor: 'red'
      },
      sectionHeadingContainer: {
        left: 0,
        position: 'absolute',
        top: 0,
        backgroundColor: '#5038E1',         
        elevation: 100,
        zIndex: 100,
        padding: 8,
        borderRadius: 5,       
      },
      sectionHeading: {
        fontSize: 14,
        fontWeight: 400,
        color: '#fff',
        fontFamily: `Sarala-Regular`,
      }
});

export default CardInfo;
