import React, { useState, Component, useEffect } from 'react';
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
} from 'react-native';
import { Icon } from 'react-native-elements';
import { CRYPTO_LIST } from './data/crypto';
import TradeItemCard from './trade/TradeItemCard';
import { ImageAssets } from '../../../../assets';


const Trade = ({ navigation }) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const [cryptoData, setCryptoData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [section, setSection] = useState('crypto');

    useEffect(() => {

        async function fetchCryptoData() {
            setIsLoading(true);
            try {
                const data = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&locale=en', {
                    method: 'GET',
                    // body: json,
                    headers: {
                        'Content-Type': 'application/json',
                        'x-cg-demo-api-key': 'CG-vwTDdcvqR2QNrytke2e4WKVR',
                    },
                });
                let json = await data.json()
                console.log(json);

                setCryptoData(json);

            } catch (e) {
                console.log(e);
            }
            setIsLoading(false);
        }

        fetchCryptoData();
    }, []);

    return (
        <SafeAreaView
            style={{
                width: width,
                height: height,
                alignSelf: 'flex-start',
                backgroundColor: '#000',
                paddingBottom: 80
                // backgroundColor: 'red'
            }}>

            <View
                style={{
                    top: '3%',
                }}
            >
                <View
                    style={{
                        // position: 'absolute',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        paddingLeft: '5%',
                        width: width * 0.9,
                    }} >
                    <Icon
                        name={'keyboard-backspace'}
                        size={30}
                        color={'#f0f0f0'}
                        type="materialicons"
                        onPress={() => navigation.goBack()}
                    />

                    <Text style={styles.heading}>
                        Trade
                    </Text>

                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 4, marginTop: 24, paddingBottom: -8, paddingHorizontal: "4%", borderBottomWidth: 2, borderBottomColor: "#1C1C1C", paddingHorizontal: -16 }}>
                    <TouchableOpacity
                        style={{
                            borderBottomWidth: section === 'crypto' ? 2 : 0,
                            borderBottomColor: section === 'crypto' ? '#ffffff' : '#1C1C1C',
                            paddingBottom: 16,
                            paddingHorizontal: 16,
                            marginBottom: section === 'crypto' ? -2 : 0,
                        }}
                        onPress={() => setSection('crypto')}
                    >
                        <Text style={{
                            fontFamily: `Sarala-Bold`,
                            fontSize: 14,
                            color: section === 'crypto' ? '#ffffff' : '#717171',
                            fontWeight: 500,
                        }}>
                            CRYPTO
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            borderBottomWidth: section === 'stocks' ? 2 : 0,
                            borderBottomColor: section === 'stocks' ? '#ffffff' : '#1C1C1C',
                            paddingBottom: 16,
                            marginBottom: section === 'stocks' ? -2 : 0,
                        }}
                        onPress={() => setSection('stocks')}
                    >
                        <Text style={{
                            fontFamily: 'Sarala-Bold',
                            fontSize: 14,
                            color: section === 'stocks' ? '#ffffff' : '#717171',
                            fontWeight: 500,
                        }}>
                            STOCKS
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            borderBottomWidth: section === 'commodities' ? 2 : 0,
                            borderBottomColor: section === 'commodities' ? '#ffffff' : '#1C1C1C',
                            paddingBottom: 16,
                            marginBottom: section === 'commodities' ? -2 : 0,
                        }}
                        onPress={() => setSection('commodities')}
                    >
                        <Text style={{
                            fontFamily: 'Sarala-Bold',
                            fontSize: 14,
                            color: section === 'commodities' ? '#ffffff' : '#717171',
                            fontWeight: 500,
                        }}>
                            COMMODITIES
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            borderBottomWidth: section === 'forex' ? 2 : 0,
                            borderBottomColor: section === 'forex' ? '#ffffff' : '#1C1C1C',
                            paddingBottom: 16,
                            paddingHorizontal: 16,
                            marginBottom: section === 'forex' ? -2 : 0,
                        }}
                        onPress={() => setSection('forex')}
                    >
                        <Text style={{
                            fontFamily: 'Sarala-Bold',
                            fontSize: 14,
                            color: section === 'forex' ? '#ffffff' : '#717171',
                            fontWeight: 500,
                        }}>
                            FOREX
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {
                isLoading &&
                <View style={{ height: '100%' }}>
                    <ActivityIndicator size={30} style={{ marginTop: '40%' }} color="#fff" />
                </View>
            }

            {!isLoading && section === 'crypto' ?
                <ScrollView
                    scrollEnabled
                    style={{
                        // paddingTop:'15%',
                        marginTop: '10%',
                        // backgroundColor: 'blue',
                    }}>
                    {
                        cryptoData && cryptoData.map((e) => {
                            return <TradeItemCard navigation={navigation} item={e} />
                        })
                    }
                </ScrollView>
                :
                <View
                    style={{
                        height: height * 0.8,
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // paddingHorizontal: 20,
                        // paddingVertical: 12,
                    }}
                >
                    <View>
                        <Image source={ImageAssets.commingSoonImg} style={{ height: 200, width: 200 }} />
                    </View>
                    <View style={{ marginBottom: 50, alignItems: 'flex-start', gap: 10 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#D1D2D9', textAlign: 'justify', fontFamily: 'Sarala-Regular' }}>
                            Coming Soon
                        </Text>
                    </View>
                </View>
            }


        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        color: '#ffffff',
        fontFamily: `Sarala-Bold`,
        fontWeight: 500,
        marginLeft: 30
    },
})

export default Trade;
