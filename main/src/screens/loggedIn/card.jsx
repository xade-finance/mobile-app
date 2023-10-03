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
  ActivityIndicator,
  Modal,
  Pressable,
  TextInput
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

import {SPRITZ_API_KEY, SPRITZ_INTEGRATION_KEY_TEST, SPRITZ_INTEGRATION_KEY_PROD} from '@env';
import CardTransactions from './card/transaction';

import Snackbar from 'react-native-snackbar';

import * as particleAuth from 'react-native-particle-auth';
import * as particleConnect from 'react-native-particle-connect';
import { Polygon, PolygonMumbai } from '@particle-network/chains';
import {WalletType, ChainInfo, Env} from 'react-native-particle-connect';
import Clipboard from '@react-native-clipboard/clipboard';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

// import Animated, {
//   Extrapolate,
//   interpolate,
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
//   withTiming,
// } from "react-native-reanimated";

import ChipSvg from './card/icon/ChipSvg';
import { SvgUri } from 'react-native-svg';
import VisaSvg from './card/icon/VisaSvg';
import LogoSvg from './card/icon/LogoSvg';
import AvatarSvg from './card/icon/AvatarSvg';
import ExternalLinkModal from './externalLink/widget';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Card = ({navigation}) => {

  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verificationUrl, setVerificationUrl] = useState(null);
  const [virtualCardRenderSecret, setVirtualCardRenderSecret] = useState(null);
  const [apiKey, setApiKey] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEmailModalVisible, setEmailModalVisible] = useState(false);
  const [showExternalLinkModal, setShowExternalLinkModal] = useState('');
  const [externalLinkUri, setExternalLinkUri] = useState('');
  const [externalLinkHeading, setExternalLinkHeading] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const client = SpritzApiClient.initialize({
    environment: mainnet ? Environment.Production : Environment.Staging, 
    integrationKey: mainnet ? SPRITZ_INTEGRATION_KEY_PROD : SPRITZ_INTEGRATION_KEY_TEST,
  });

  // const spin = useSharedValue(0);

  // const rStyle = useAnimatedStyle(() => {
  //   const spinVal = interpolate(spin.value, [0, 1], [0, 180]);
  //   return {
  //     transform: [
  //       {
  //         rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
  //       },
  //     ],
  //   };
  // }, []);

  // const bStyle = useAnimatedStyle(() => {
  //   const spinVal = interpolate(spin.value, [0, 1], [180, 360]);
  //   return {
  //     transform: [
  //       {
  //         rotateY: withTiming(`${spinVal}deg`, { duration: 500 }),
  //       },
  //     ],
  //   };
  // }, []);

  async function createUser() {
    try {
      setLoading(true);

      // call api to store spritz api key in the backend
      try{
        if(global.withAuth){
          const name = global.loginAccount.name;
          const address = global.loginAccount.publicAddress;
          const scw = global.loginAccount.scw;
          const email = global.loginAccount.phoneEmail;
          const uuid = global.loginAccount.uiud;

          const user = await client.user.createUser({
            email: email,
          });

          client.setApiKey(user.apiKey);
          await AsyncStorage.setItem('spritzAPI', JSON.stringify(user.apiKey));
          setApiKey(user.apiKey);

          const object = {
            email: email.toLowerCase(),
            phone: 'NULL',
            name: name,
            typeOfLogin: 'login',
            eoa: scw,
            scw: scw,
            id: uuid,
            spritzApiKey: user.apiKey
          };
          const json = JSON.stringify(object || {}, null, 2);
          console.log('Request Being Sent:', json);
          
          await fetch('https://mongo.api.xade.finance/polygon', {
            method: 'POST',
            body: json,
            headers: {
              'Content-Type': 'application/json',
            },
          });
          setUserExists(true);

        }else{
          // ask user for email address
          toggleEmailModal();
        }
      }catch(e){
        console.log(e);
      } 
      setLoading(false);

    } catch (err) {
      console.log(err);
      Snackbar.show({text: 'Unable to create new user'});
    }

    setLoading(false);
    setTimeout(() => {
      toggleModal();
    },1000)
  }

  // async function getUser() {
  //   try{ 
  //     await AsyncStorage.setItem('spritzAPI', 'ak_OWEyNWJhNmUtMTIyZC00NzFlLTlmN2ItNjVlNTA0MjhmYjg3' );
  //     const api_key = await AsyncStorage.getItem('spritzAPI');
  //     client.setApiKey('ak_OWEyNWJhNmUtMTIyZC00NzFlLTlmN2ItNjVlNTA0MjhmYjg3');
  //     const verificationData = await client.user.getUserVerification(); 

  //   }catch (err) {
  //     console.log(err);
  //   }
  // }

  async function createVirtualCard() {
    try{
      const virtualCard = await client.virtualCard.create(VirtualCardType.USVirtualDebitCard);
      setVirtualCardRenderSecret(virtualCard.renderSecret);
    }catch (e){
      console.log(e);
    }
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleEmailModal = () => {
    setEmailModalVisible(!isEmailModalVisible);
  };

  async function createUserForConnectAccount () {
    try{
      if(global.withConnect){
        setLoading(true);
        const name = global.connectAccount.name;
        const address = global.connectAccount.publicAddress;
        const email = emailInput;
        const uuid = global.connectAccount.uiud;

        const user = await client.user.createUser({
          email: email,
        });
        client.setApiKey(user.apiKey);
        await AsyncStorage.setItem('spritzAPI', JSON.stringify(user.apiKey));

        const object = {
          email: emailInput.toLowerCase(),
          phone: 'NULL',
          name: name,
          typeOfLogin: 'connect',
          eoa: address,
          scw: address,
          id: uuid,
          spritzApiKey: user.apiKey
        };
        const json = JSON.stringify(object || {}, null, 2);
        console.log('Request Being Sent:', json);
        
        await fetch('https://mongo.api.xade.finance/polygon', {
          method: 'POST',
          body: json,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setUserExists(true);

      }
    }catch(e) {
      console.log(e);
    }
    setLoading(false);
    toggleEmailModal();

  }

  useEffect(() => {

    async function init() {
      try{
        let scwAddress = ''

        if(global.withAuth){
          scwAddress = global.loginAccount.scw;
        }else{
          scwAddress = global.connectAccount.publicAddress;
        }

        try{

          await fetch(
            `https://spritz.api.xade.finance/polygon?address=${scwAddress.toLowerCase()}`,
            {
              method: 'GET',
            },
          )
          .then(response => {
            if (response.status == 200) {
              return response.text();
            } else return '';
          })
          .then(async data => {
            name = data;
            try{
              await AsyncStorage.setItem('spritzAPI', data);
            }catch(e) {
              console.log(e);
            }
          });
        }catch(e){
          console.log(e);
        }
        console.log('-------------------------------12');

        // try{
        //   await AsyncStorage.setItem('spritzAPI', 'ak_OWEyNWJhNmUtMTIyZC00NzFlLTlmN2ItNjVlNTA0MjhmYjg3');
        // }catch(e) {
        //   console.log(e);
        // }
        
        console.log('-------------------------------');
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
      }catch(e){
        console.log(e);
      }
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
    console.log(userExists);
    if (userExists){
      fetchVerificationStatus()
    }
    setLoading(false);

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
            {showExternalLinkModal && (
              <ExternalLinkModal
                uri={externalLinkUri}
                heading={externalLinkHeading}
                // onClose={handleCloseExternalLinkModal()}
                onClose={() => {
                    setExternalLinkHeading('');
                    setExternalLinkUri('');
                    setShowExternalLinkModal(false);
                    // handleCloseExternalLinkModal()
                }}
              />
            )}
            {
              isModalVisible &&
              <Modal animationType="slide"
                hasBackdrop={true} 
                backdropOpacity={1} 
                isVisible={isModalVisible} 
                onBackdropPress={() => {
                    toggleModal();
                }}
                style={styles.modalContainer}>
              
                <View style={{
                  flex: 1,
                  backgroundColor: '#000',
                  padding:20
                }}>
                    <View style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'flex-end'
                    }}>
                      
                      <TouchableOpacity onPress={toggleModal}>
                        <Ionicons name="close-outline" size={32} color="#fff" />
                      </TouchableOpacity>
                  </View>
                    <View style={{
                      justifyContent: 'center',
                      color: '#fff',
                      marginTop: '20%',
                      margin: 20
                    }}>
                      <Text style={styles.modalText}>Are you an US Citizen?</Text>
                      <View style={styles.buttonContainer}>
                          <Pressable onPress={createUser} style={styles.confirmButton}>
                            {loading 
                              ? <ActivityIndicator size={30} style={styles.loader} color="#fff" />
                              : <Text style={styles.modalButtonText}>Yes</Text>
                            }
                          </Pressable>
                          <Pressable onPress={() => {
                            try{
                              // open card application form here 
                              setExternalLinkHeading('Card Application Form');
                              setExternalLinkUri('https://tally.so/r/wbjzRE');
                              toggleModal();
                              setShowExternalLinkModal(true);
                            }catch(e){
                              console.log(e);
                            }
                          }} style={styles.cancelButton}>
                              <Text style={styles.modalButtonText}>No</Text>
                          </Pressable>
                      </View>
                    </View>
                </View>
            </Modal>
            }

            {
              isEmailModalVisible &&
              <Modal animationType="slide"
                hasBackdrop={true} 
                backdropOpacity={1} 
                isVisible={isEmailModalVisible} 
                onBackdropPress={() => {
                    toggleModal();
                }}
                style={styles.modalContainer}>
                <View style={{
                  flex: 1,
                  backgroundColor: '#000',
                  padding:20
                }}>
                    <View style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'flex-end'
                    }}>
                      
                      <TouchableOpacity onPress={toggleEmailModal}>
                        <Ionicons name="close-outline" size={32} color="#fff" />
                      </TouchableOpacity>
                  </View>
                    <View style={{
                      justifyContent: 'center',
                      color: '#fff',
                      marginTop: '20%',
                      margin: 20
                    }}>
                      <Text style={styles.modalText}>Please enter your email address</Text>
                      <View>
                        <TextInput
                          style={styles.input}
                          placeholder="Enter email address here..."
                          placeholderTextColor="#FFFFFF"
                          defaultValue={emailInput}
                          onChangeText={(text) => setEmailInput(text)}
                        />  
                      </View>
                      <View style={styles.buttonContainer}>
                          <Pressable onPress={createUserForConnectAccount} style={styles.confirmButton}>
                            {loading 
                              ? <ActivityIndicator size={30} style={styles.loader} color="#fff" />
                              : <Text style={styles.modalButtonText}>Submit</Text>
                            }
                          </Pressable>
                      </View>
                    </View>
                </View>
            </Modal>
            }

            {loading ? <ActivityIndicator size={30} style={styles.loader} color="#fff" />
            : <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                      // show popup to choose citizenship
                      toggleModal();
                      // if (selectedCountry === 'yes'){
                      //   createUser()
                      // }else{
                      //   Linking.openURL('https://tally.so/r/wbjzRE')
                      // }
                    }
                  }>
                  <Text style={styles.buttonText}>Apply now</Text>
                </TouchableOpacity>  
            }
          </View>
        </View>
      : <View style={styles.container}>
          <LinearGradient colors={[ '#00D1FF', '#4E5FFF']} style={styles.cardContainer}>
            {/* <View style={styles.cardContainer}> */}
            {/* <SpritzCard
              environment={mainnet ? Environment.Production : Environment.Staging}
              apiKey={apiKey}
              renderSecret = {virtualCardRenderSecret}
              background={false}
              description={false}
              // color={'red'}
              // apiKey={'ak_YmNmOTg5ZjMtMmQ5NS00ODBkLThiMmUtY2MxYmYwZWM3NzMw'}
              // renderSecret={
              //   'U2FsdGVkX1+Y2OTwL309Ey4HUvP+nIChHiFTjVKt0FHZeQNZ/tOHcfotlSUB0oG62ja5cVrte6liweze1Y+BBPLUOtjlS6Dah6oxWXa0XQhBPtcto2mZiJduDaGFbPLxj0AHTZLUexTAZ967swgH24123W7CBuKjg032ovHrQpF31j5+xqsaqC/OTNjqkjw+'
              // }
              onCopyText={text => {
                Clipboard.setString(text);
                Snackbar.show({text: 'Copied to clipboard'})
              }}
              onDetailsLoaded={() => console.log('Card details loaded')}
            /> */}
            {/* <View
              style={{
                position:'absolute',
                top:20,
                left: 20,
                zIndex:10
              }}
            >
              <LogoSvg />
            </View> */}

            <View
              style={{
                position:'absolute',
                bottom: 0,
                left: 20,
                zIndex:100
              }}
            >
              <AvatarSvg />
            </View>

            <View
              style={{
                position:'absolute',
                bottom:40,
                right:20,
                zIndex:10
              }}
            >
              <ChipSvg />
            </View>

            <View
              style={{
                position:'absolute',
                top:20,
                right: 20,
                zIndex:10
              }}
            >
              <VisaSvg />
            </View>
          </LinearGradient>
          
          {
            (verificationStatus != null && verificationStatus !== 'ACTIVE') && 
            <View style={styles.kycContainer}>
              <Text style={styles.verificationWarning}>Please complete verification to activate your card.</Text>
              
              <TouchableOpacity
                onPress={() => {
                  setExternalLinkHeading('Spritz KYC');
                  setExternalLinkUri(verificationUrl);
                  setShowExternalLinkModal(true);

                  // Linking.openURL(
                  // `${verificationUrl}`,  )
                }}
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

            <TouchableOpacity
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
                    <Text style={styles.actionHeading}>Add Funds</Text>
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
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() => {
                navigation.push('WithdrawFunds');
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
                    <Text style={styles.actionHeading}>Withdraw Funds</Text>
                    <Text style={styles.actionDescription}>Transfer to your bank account</Text>
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
    // backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    marginBottom:100
  },
  cardContainer: {
    flex:1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    borderRadius: 8
  },
  image: {
    width: 400,
    height: 250,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontFamily: `Sarala-Regular`,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 30,
    fontFamily: `Sarala-Regular`,
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
    fontFamily: `Sarala-Regular`,
  },
  sectionHeading : {
    fontSize: 22,
    fontFamily: `Sarala-Bold`,
    // fontWeight: 500,
    color: '#fff',
    textAlign: 'left',
    marginTop: 20,
    marginHorizontal: 10,
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
    backgroundColor: '#5038E1',
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
    fontFamily: `Sarala-Bold`,
    fontWeight: 300,
  },
  actionDescription: {
    color: '#7f7f7f',
    fontSize: 14,
    justifyContent: 'center',
    fontFamily: `Sarala-Regular`,
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
    fontFamily: `Sarala-Regular`,
  },
  kycContainer: {
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10
  },
  verificationStartButton: {
    backgroundColor: '#5038E1',
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
  picker: {
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    width:'20%',
    height: 10
},
pickerContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    width:'100%',
    borderColor: '#707070',
    marginBottom: 50,
    marginTop: 50,
},
modal : {
  backgroundColor: '#000',
  elevation : 10,
  height: 140,   
  padding : 20 
},
modalText: {
  fontSize: 18,
  fontWeight: 500,
  fontFamily: 'Sarala-Regular',
  color: '#fff',
},
confirmButton :{
  borderRadius: 10,
  color: '#fff',
  margin: 10,
  padding: 10,
  width: '30%',
  justifyContent: 'center',
  flexDirection: 'row',
  backgroundColor: '#5038E1'
},
cancelButton : {
  borderRadius: 10,
  margin: 10,
  padding: 10,
  width: '30%',
  justifyContent: 'center',
  flexDirection: 'row',
  backgroundColor: '#222'

},
modalButtonText : {
  color: '#fff',
  fontSize: 16,
  fontWeight: 500,
  fontFamily: 'Sarala-Regular',
},
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 10,
},
modalContainer : {
  height:'500',
  backgroundColor: '#000',
  color: '#fff',
  marginHorizontal: '10%',
  marginVertical: '30%',
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
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
});

export default Card;
