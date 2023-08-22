import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  SafeAreaView,
  Platform,
  ActivityIndicator
} from 'react-native';

import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import {
  SpritzApiClient,
  Environment,
} from '../../../node_modules/@spritz-finance/api-client/dist/spritz-api-client.mjs';

import {
  BankAccountType,
  BankAccountSubType,
  VirtualCardType,
} from '../../../node_modules/@spritz-finance/api-client/dist/spritz-api-client.mjs';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {SpritzCard} from '@spritz-finance/react-native-secure-elements';

import {SPRITZ_API_KEY, SPRITZ_INTEGRATION_KEY} from '@env';
import CardTransactions from './card/transaction';

import Snackbar from 'react-native-snackbar';


import * as particleAuth from 'react-native-particle-auth';
import * as particleConnect from 'react-native-particle-connect';

import {WalletType, ChainInfo, Env} from 'react-native-particle-connect';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


const Card = ({navigation}) => {

  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verificationUrl, setVerificationUrl] = useState(null);
  const [virtualCardRenderSecret, setVirtualCardRenderSecret] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  const client = SpritzApiClient.initialize({
    environment: Environment.Staging,
    // apiKey: SPRITZ_API_KEY,
    integrationKey: SPRITZ_INTEGRATION_KEY,
  });

  particleAuth.init(
    particleAuth.ChainInfo.PolygonMainnet,
    particleAuth.Env.Production,
  );

  async function createUser() {
    try {
      // try{
      //   await AsyncStorage.removeItem('spritzAPI');
      // }catch(e) {
      //   console.log(e);
      // }
      setLoading(true);
      var account = await particleAuth.getUserInfo();
      account = JSON.parse(account);

      let email = account.email
        ? account.email.toLowerCase()
        : account.phone
        ? account.phone
        : account.googleEmail.toLowerCase();

      console.log('Phone/Email:', email);
      const user = await client.user.createUser({
        email: email,
      });
      console.log("-----------------");
      console.log(user);
      client.setApiKey(user.apiKey);
      await AsyncStorage.setItem('spritzAPI', JSON.stringify(user.apiKey));

      setUserExists(true);
      setApiKey(user.apiKey);

      // const verificationData = await client.user.getUserVerification();
      // console.log(verificationData);
      // const virtualCard = await client.virtualCard.fetch();
      // return virtualCard;
      // const bankAccounts = await client.bankAccount.list();
      // const bankAccount = await client.bankAccount.create(
      //   BankAccountType.USBankAccount,
      //   {
      //     accountNumber: '123456789',
      //     routingNumber: '031201360',
      //     email: emailID,
      //     holder: 'Anshuman Tekriwal',
      //     name: 'Precious Savings',
      //     ownedByUser: true,
      //     subType: BankAccountSubType.Savings,
      //   },
      // );
      // const updatedBankAccounts = await client.bankAccount.list();
      // console.log('Bank:', bankAccounts);
      // const virtualCard = await client.virtualCard.create(
      //   VirtualCardType.USVirtualDebitCard,
      // );
      // const virtualCard = await client.virtualCard.fetch();
      // console.log(virtualCard);
      // console.log('Updated Banks:', updatedBankAccounts);

      
      setLoading(false);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  }

  async function getUser() {
    try{ 
      await AsyncStorage.setItem('spritzAPI', 'ak_OWEyNWJhNmUtMTIyZC00NzFlLTlmN2ItNjVlNTA0MjhmYjg3' );
      const api_key = await AsyncStorage.getItem('spritzAPI');
      client.setApiKey('ak_OWEyNWJhNmUtMTIyZC00NzFlLTlmN2ItNjVlNTA0MjhmYjg3');
      const verificationData = await client.user.getUserVerification(); 

    }catch (err) {
      console.log(err);
    }
  }

  async function createVirtualCard() {
    try{
      const virtualCard = await client.virtualCard.create(VirtualCardType.USVirtualDebitCard);
      setVirtualCardRenderSecret(virtualCard.renderSecret);
    }catch (e){
      console.log(e);
    }
  }

  async function fetchRecentPayments() {
    try{
      // const payments = await client.payment.listForAccount(account.id)
    }catch (e){
      console.log(e);
    }
  }

  useEffect(() => {

    async function init() {
      console.log("---------");
      // try{
      //   await AsyncStorage.setItem('spritzAPI', 'ak_YTAzMmY1MzEtYjRjMi00NTE0LTlmNDgtNTZjZGYxNmFlZDgy');
      // }catch(e) {
      //   console.log(e);
      // }

      try{
        const api_key = await AsyncStorage.getItem('spritzAPI');
        console.log(api_key);
        if (api_key === null) {
          setUserExists(false);
        }else{
          client.setApiKey(api_key);
          setApiKey(api_key);
          setUserExists(true);        
        }
      }catch(err){
        console.log(err);
        setUserExists(false);
      }
      setLoading(false);
    }

    init();

  }, []);


  useEffect(() => {
    async function fetchVerificationStatus() {
      try{
        setLoading(true); 
        client.setApiKey(apiKey);
        
        const verificationData = await client.user.getUserVerification();  
        setVerificationStatus(verificationData.identity.status);
        if (verificationData.identity.status !== 'ACTIVE') {
          setVerificationUrl(verificationData.identity.verificationUrl);
        }
        
        //Fetch virtual card information
        const virtualCard = await client.virtualCard.fetch();
        if(virtualCard == null) {
          await createVirtualCard();
        }else{
          setVirtualCardRenderSecret(virtualCard.renderSecret);
        }
      }catch(e) {
        console.log(e);
      }
      setLoading(false);
    }

    if (userExists){
      fetchVerificationStatus()
    }

  },[userExists]);


  return ( 
    !userExists
      ? <View style={styles.container}>
          <FastImage source={require('./card.png')} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>Get a personalised {'\n'} Xade card</Text>
            <Text style={styles.subtitle}>
              Get your own non-custodial card powered by Visa to spend globally and
              to win exclusive rewards
            </Text>
            <View style={{marginTop:'5%'}}></View>
            {loading ? <ActivityIndicator size={30} style={styles.loader} color="#fff" />
            : <TouchableOpacity
                style={styles.button}
                onPress={() => createUser()
                  //Linking.openURL('https://docs.xade.finance')
                }>
                <Text style={styles.buttonText}>Apply now</Text>
              </TouchableOpacity> 
            }
          </View>
        </View>
      : <View style={styles.container}>
          <SpritzCard
            environment={Environment.Staging}
            apiKey={apiKey}
            renderSecret = {virtualCardRenderSecret}
            // apiKey={'ak_YmNmOTg5ZjMtMmQ5NS00ODBkLThiMmUtY2MxYmYwZWM3NzMw'}
            // renderSecret={
            //   'U2FsdGVkX1+Y2OTwL309Ey4HUvP+nIChHiFTjVKt0FHZeQNZ/tOHcfotlSUB0oG62ja5cVrte6liweze1Y+BBPLUOtjlS6Dah6oxWXa0XQhBPtcto2mZiJduDaGFbPLxj0AHTZLUexTAZ967swgH24123W7CBuKjg032ovHrQpF31j5+xqsaqC/OTNjqkjw+'
            // }
            onCopyText={text => console.log('onCopyText', text)}
            onDetailsLoaded={() => console.log('Card details loaded')}
          />

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

          <View style={{
            justifyContent: 'flex-start',
            width: '100%',
          }}>
            <Text style={styles.sectionHeading}>Actions</Text>
          </View>

          <View style={styles.cardActionContainer}>

            <TouchableOpacity
              onPress={() => {
                navigation.push('ListBankAccount');
              }}>
                <View  style={styles.cardActionItemContainer}>
              
                  <View style={styles.cardActionButton}>
                    <Icon
                      // style={styles.tup}
                      name={'people'}
                      size={30}
                      color={'#fff'}
                      type="material"
                    />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionHeading}>View all accounts</Text>
                    <Text style={styles.actionDescription}>See all your accounts</Text>
                  </View>
                  <Icon
                    // style={styles.tup}
                    name={'chevron-right'}
                    size={24}
                    color={'#7f7f7f'}
                    type="material"
                  />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.push('CreateBankAccount');
              }}>
                <View  style={styles.cardActionItemContainer}>
              
                  <View style={styles.cardActionButton}>
                    <Icon
                      // style={styles.tup}
                      name={'person-add'}
                      size={30}
                      color={'#fff'}
                      type="material"
                    />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionHeading}>Add an account</Text>
                    <Text style={styles.actionDescription}>Connect existing account</Text>
                  </View>
                  <Icon
                    // style={styles.tup}
                    name={'chevron-right'}
                    size={24}
                    color={'#7f7f7f'}
                    type="material"
                  />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.push('CardInfo');
              }}>
                <View  style={styles.cardActionItemContainer}>
              
                  <View style={styles.cardActionButton}>
                    <Icon
                      // style={styles.tup}
                      name={'info'}
                      size={28}
                      color={'#fff'}
                      type="material"
                    />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionHeading}>View card details</Text>
                    <Text style={styles.actionDescription}>All info about your card</Text>
                  </View>
                  <Icon
                    // style={styles.tup}
                    name={'chevron-right'}
                    size={24}
                    color={'#7f7f7f'}
                    type="material"
                  />
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() => {
                navigation.push('AddFund');
              }}>
                <View  style={styles.cardActionItemContainer}>
              
                  <View style={styles.cardActionButton}>
                    <Icon
                      // style={styles.tup}
                      name={'add'}
                      size={30}
                      color={'#fff'}
                      type="clarity"
                    />
                  </View>
                  <View style={styles.actionTextContainer}>
                    <Text style={styles.actionHeading}>Create payment request</Text>
                    <Text style={styles.actionDescription}>Generate a payment request</Text>
                  </View>
                  <Icon
                    // style={styles.tup}
                    name={'chevron-right'}
                    size={24}
                    color={'#7f7f7f'}
                    type="material"
                  />
              </View>
            </TouchableOpacity> */}

          </View>

      </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#0c0c0c',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    marginBottom:100
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
    marginTop: '0%',
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
  sectionHeading : {
    fontSize: 24,
    fontFamily: `EuclidCircularA-Medium`,
    fontWeight: 500,
    color: '#fff',
    textAlign: 'left',
    marginVertical: 20
  },
  cardActionContainer : {
    flexDirection: 'column',
    width: '100%',
  },
  cardActionItemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    alignItems: 'center',
  },  
  cardActionButton : {
    backgroundColor: '#FE2C5E',
    margin: 10,
    borderRadius: 10,
    width: 48,
    height: 48,
    // flexDirection: 'column',
    // verticalAlign: 'middle',
    justifyContent: 'center',
    // alignContent: 'center',
  },
  actionTextContainer :{
    flex: 1,
    flexDirection : 'column',
    justifyContent: 'center',
    paddingLeft: 10
  },  
  actionHeading: {
    color: '#fff',
    fontSize: 16,
    justifyContent: 'center',
    fontFamily: `EuclidCircularA-Medium`,
    fontWeight: 500,
  },
  actionDescription: {
    color: '#7f7f7f',
    fontSize: 14,
    justifyContent: 'center',
    fontFamily: `EuclidCircularA-Medium`,
    fontWeight: 400
  },
  cardActionText: {
    color: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: windowWidth,
    flexShrink:1,
    alignSelf: 'center',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: `EuclidCircularA-Medium`,
  },
  kycContainer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10
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
  }
});

export default Card;
