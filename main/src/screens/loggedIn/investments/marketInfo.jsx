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
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Icon } from 'react-native-elements';
import {CRYPTO_LIST} from './data/crypto';
import TradeItemCard from './trade/TradeItemCard';
import {WebView} from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import TradeSvg from './icon/tradeSvg';
import DepositSvg from './icon/depositSvg';
import BuyForm from './marketInfo/BuyForm';
import SellForm from './marketInfo/SellForm';
import MarketChart from './marketInfo/MarketChart';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MarketInfo = ({route, navigation, item}) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
 
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState();

    const [showSellModal, setShowSellModal] = useState(false);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [index, setIndex] = useState(0);
    const layout = useWindowDimensions();

    console.log(item);
    const handleCloseBuyModal = () => {
        setShowBuyModal(false);
    }

    const handleCloseSellModal = () => {
        setShowSellModal(false);
    }

    // console.log(route.params);

    const uri =
    Platform.OS === 'android'
    ? `file:///android_asset/index.html?theme=dark&symbol=BINANCE:BTCUSDT&hide_top_toolbar=true&hide_legend=true&save_image=false&hide_volume=true`
    // ? `file:///android_asset/index.html?theme=dark&symbol=${item.symbol}&hide_top_toolbar=true&hide_legend=true&save_image=false&hide_volume=true`
      : 'index.html';

    console.log(uri);

    useEffect(() => {

        async function init() {
            try{
                setIsLoading(true);
                const mainnetJSON = await AsyncStorage.getItem('mainnet');
                const mainnet = JSON.parse(mainnetJSON);

                if (global.withAuth) {
                    authAddress = global.loginAccount.publicAddress;
                    const scwAddress = global.loginAccount.scw;
                    setAddress(scwAddress);

                } else {
                    authAddress = global.connectAccount.publicAddress;
                    const scwAddress = global.connectAccount.publicAddress;
                    setAddress(scwAddress);
                }

                // fetch selected coin contract address

            }catch(e){
                console.log(e);
            }
            setIsLoading(false);

        }

        init();
    },[]);

    return (
        <SafeAreaView
            style={{
                width: width,
                height: height,
                alignSelf: 'flex-start',
                // backgroundColor: '#000',
                paddingBottom: 80,
                // backgroundColor: 'red'
            }}>
                
            <View
                style={{
                    // position: 'absolute',
                    top: '5%',
                    left: '3%',
                    width: width * 0.9,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }} >
                    <Icon
                        name={'keyboard-backspace'}
                        size={30}
                        color={'#f0f0f0'}
                        type="materialicons"
                        onPress={() => navigation.goBack()}
                    /> 

                    <Text style={styles.heading}>
                        Market Info
                    </Text>

            </View>

            {
                isLoading && 
                    <View style={{height:'100%'}}>
                        <ActivityIndicator size={30} style={{marginTop:'40%'}} color="#fff" />
                    </View>
            }


            {!isLoading && <ScrollView
                scrollEnabled
                style={{
                    // paddingTop:'15%',
                    marginTop:'10%',
                    // backgroundColor: 'blue',
                }}>
                    {/* <WebView
                        style={{flex: 1, height: 300}}
                        source={{uri}}
                        dataUrl={'https://tradingview.com/'}
                        allowFileAccessFromFileURLs={true}
                        domStorageEnabled={true}
                        allowFileAccess={true}
                        allowUniversalAccessFromFileURLs={true}
                        originWhitelist={['*']}
                        onShouldStartLoadWithRequest={() => true}
                    /> */}

                    <View>
                        <View style={{}}>
                            <MarketChart item={item} scwAddress={address} />
                        </View>
                    </View>

                    <View margin={4} />

                    {showBuyModal && (
                        <BuyModal
                            marketData={{}}
                            // transactionData={transactionData}
                            onClose={handleCloseBuyModal}
                        />
                    )}

                    {showSellModal && (
                        <SellModal
                            // transactionData={transactionData}
                            onClose={handleCloseSellModal}
                        />
                    )}
{/* 
                    <View>
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
                                Your total balance
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
                                {item.balance}
                            </Text>
                        </View>
                    </View> */}


                    {/* <Tabs.Container
                        // renderTabBar={renderTabBar}
                        containerStyle={{ minHeight: 400, fontSize: '14px', fontFamily: 'Sarala-Bold'}}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        style={{backgroundColor: '#000'}}
                        renderTabBar={props => <MaterialTabBar {...props} pressColor={'transparent'} activeColor={'#fff'}  inactiveColor={'#ffffffcc'} indicatorStyle={{ backgroundColor: '#fff' }} labelStyle={{fontSize: 14, fontFamily: 'Sarala-Bold', }} />}
                        headerContainerStyle={{ backgroundColor : '#000'}}
                    >
                        <Tabs.Tab name="Buy" label={"Buy"} key={1} >
                            <Tabs.ScrollView>
                                <BuyForm navigation={navigation} />
                            </Tabs.ScrollView>
                        </Tabs.Tab>
                        <Tabs.Tab name="Sell" label={"Sell"} key={2}>
                            <Tabs.ScrollView>
                                <SellForm navigation={navigation} />
                            </Tabs.ScrollView>
                        </Tabs.Tab>
                    </Tabs.Container> */}

                    {/* <View
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
                                setShowBuyModal(true);
                            }}>
                            
                            <LinearGradient useAngle={true} angle={150} colors={['#5038E1','#B961FF']} style={[styles.innerDep]}>
                                
                                    <Text style={{color: '#fff', fontSize: 14, paddingLeft:'5%', fontFamily: 'Sarala-Bold', fontWeight: 300}}>
                                        Buy
                                    </Text>                
                                    
                            </LinearGradient> 
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.depWith}
                            onPress={() => {
                                setShowSellModal(true);
                            }}>
                            <View
                                style={[styles.innerDep, styles.innerDepColored]}>
                                <Text style={{color: '#fff', fontSize: 14,paddingLeft:'5%', fontFamily: 'Sarala-Bold', fontWeight: 300}}>
                                    Sell
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View> */}
                </ScrollView>
            }

        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    heading : { 
        fontSize: 20,
        color: '#ffffff',
        fontFamily: `Sarala-Bold`,
        fontWeight: 500,
        marginLeft: 30
    },
    depWith: {
        flexDirection: 'row',
        height: '100%',
        width: '47%',
        borderRadius: 6,
      },
    
      innerDepColored: {
        backgroundColor: '#1D1D1D',
      },
    
      innerDep: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: '1%',
        // backgroundColor: '#141414',
      },
})

export default MarketInfo;
