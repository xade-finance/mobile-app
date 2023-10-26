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
} from 'react-native';
import { Icon } from 'react-native-elements';
import {CRYPTO_LIST} from './data/crypto';
import TradeItemCard from './trade/TradeItemCard';

const Trade = ({navigation}) => {
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const [cryptoData, setCryptoData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        async function fetchCryptoData(){
            setIsLoading(true);
            try{
                const data = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&locale=en', {
                    method: 'GET',
                    // body: json,
                    headers: {
                    'Content-Type': 'application/json',
                    },
                });
                let json = await data.json()
                console.log(json);

                setCryptoData(json);

            }catch(e){
                console.log(e);
            }
            setIsLoading(false);
        }

        fetchCryptoData();
    },[]);

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
                        Trade
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
                    {
                        cryptoData && cryptoData.map((e) => {
                            return <TradeItemCard navigation={navigation} item={e} />
                        })
                    }
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
})

export default Trade;
