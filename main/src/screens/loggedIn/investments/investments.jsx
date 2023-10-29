import React, {useState, Component, useEffect} from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  Text,
  View,
  Image,
  ScrollView,
  Clipboard,
  Alert,
  Modal,
  Linking,
  Dimensions,
  RefreshControl,
  Platform,
  StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';
import styles from './investment-styles';
import LinearGradient from 'react-native-linear-gradient';
import DepositSvg from './icon/depositSvg';
import TradeSvg from './icon/tradeSvg';
import GainSvg from './icon/gainSvg';
import { addXUSD } from '../payments/utils';
import { TradeEventCarousel } from './tradeEventCarousel';
import images from './images';
import TradeCollection from './tradeCollection';
import { getUserInvestmentPortfolio, getUserCollectiblePortfolio } from '../../../utils/alchemy';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Investments = ({navigation}) => {

    const [estimatedBalance, setEstimatedBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        async function init() {
            try{
                setLoading(true);
                const mainnetJSON = await AsyncStorage.getItem('mainnet');
                const mainnet = JSON.parse(mainnetJSON);

                if (global.withAuth) {
                    authAddress = global.loginAccount.publicAddress;
                    scwAddress = global.loginAccount.scw;
                } else {
                    authAddress = global.connectAccount.publicAddress;
                    scwAddress = global.connectAccount.publicAddress;
                }

                const userInvestmentPortfolio = await getUserInvestmentPortfolio(mainnet, scwAddress);
                // setInvestmentPortfolio(userInvestmentPortfolio);
                let total = 0;
                userInvestmentPortfolio.forEach(element => {
                    total += (element.balance * element.current_price)
                });

                // console.log(total);
                setEstimatedBalance(total.toFixed(3));

            }catch(e){
                console.log(e);
            }
            setLoading(false);

        }
        init();
    },[]);

    return (
        <SafeAreaView
            style={{
                width: '100%',
                height: '100%',
                alignSelf: 'flex-start'
            }}>
                
            <View style={{
                marginHorizontal:20,
                marginTop: 16
                }}>
                <Text
                    style={{
                        fontFamily: 'Sarala-Regular',
                        fontSize: 16,
                        color: "#fff",
                        fontWeight: 400,
                    }}>
                    Estimated Balance
                </Text>
            </View>

            <View style={{
                marginHorizontal:20, 
                }}>
                <Text
                    style={{
                        fontFamily: 'Sarala-Bold',
                        fontSize: 32,
                        color: "#fff",
                        fontWeight: 700,
                    }}>
                    $ {estimatedBalance}
                </Text>
            </View>

            {/* <View style={{flexDirection:'row', alignItems:'center', marginHorizontal:20,marginTop: 10}}>
                <GainSvg />

                <Text
                    style={{
                        fontFamily: 'Sarala-Bold',
                        fontSize: 16,
                        color: "#ADFF6C",
                        fontWeight: 700,
                        marginHorizontal:4
                    }}>
                    $465.12 (+3.46%)
                </Text>

                <Text
                    style={{
                        fontFamily: 'Sarala-Regular',
                        fontSize: 16,
                        color: "#999999",
                        fontWeight: 400,
                        marginHorizontal:4
                    }}>
                    24h
                </Text>

            </View> */}

            <View
                style={{
                    flexDirection: 'row',
                    // width: '80%',
                    height: 50,
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    marginTop: 30,
                    marginHorizontal:10
                }}>

                    
                <TouchableOpacity
                    style={styles.depWith}
                    onPress={() => {
                        navigation.push('Trade');
                    }}>
                    
                    <LinearGradient useAngle={true} angle={150} colors={['#5038E1','#B961FF']} style={[styles.innerDep]}>
                        
                            <TradeSvg />
                            <Text style={{color: '#fff', fontSize: 14, paddingLeft:'5%', fontFamily: 'Sarala-Bold', fontWeight: 300}}>
                                Trade
                            </Text>                
                              
                    </LinearGradient> 
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.depWith}
                    onPress={() => {
                        {
                            {
                            global.mainnet
                                ? navigation.push('FiatRamps')
                                : addXUSD(
                                    navigation,
                                    global.withAuth
                                    ? global.loginAccount.scw
                                    : global.connectAccount.publicAddress,
                                    'Investments'
                                );
                            }
                        }
                    }}>
                    <View
                        style={[styles.innerDep, styles.innerDepColored]}>
                        <DepositSvg />
                        <Text style={{color: '#fff', fontSize: 14,paddingLeft:'5%', fontFamily: 'Sarala-Bold', fontWeight: 300}}>
                            Deposit
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>

            <View style={{ 
                    marginTop: 30,
                    // marginHorizontal:10
            }}>
                <TradeEventCarousel 
                    images={images}
                    navigation={navigation}
                    address={
                        global.withAuth
                        ? global.loginAccount.scw
                        : global.connectAccount.publicAddress
                    }
                    key={images}/>
            </View>


            <View style={{ 
                marginTop: 10,
                // marginHorizontal:10 
            }}>
                <TradeCollection navigation={navigation} />
            </View>

        </SafeAreaView>
    );
}

export default Investments;
