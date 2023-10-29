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
import styles from '../investment-styles';
import LinearGradient from 'react-native-linear-gradient';
import { getUserInvestmentPortfolio } from '../../../../utils/alchemy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TradeItemCard from '../trade/TradeItemCard';
import MyInvestmentItemCard from './myInvestmentItemCard';
import { Button } from 'react-native';

const MyInvestment = ({navigation}) => {
    
    const [investmentPortfolio, setInvestmentPortfolio] = useState([]);

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
                setInvestmentPortfolio(userInvestmentPortfolio);

            }catch(e){
                console.log(e);
            }
            setLoading(false);

        }
        init();
    },[])

    return ( 
        <View style={{
            flex: 1,
            marginTop: 8,
        }}>
            
            {
                loading && <ActivityIndicator size={30} style={styles.loader} color="#fff"  />
            }

            {
                !loading && investmentPortfolio.length > 0 &&
                    investmentPortfolio.map((e,i) => {
                        return <MyInvestmentItemCard key={i} navigation={navigation} item={e} />
                    })
                
            }

            {
                !loading && investmentPortfolio.length === 0 &&
                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        marginTop: 10,
                        alignItems: 'center',
                    }}>
                        <Text style={{fontSize: 16, fontFamily: 'Sarala-Regular'}}>No data available</Text>
                    </View>
                
            }

        </View>  
    );
}

export default MyInvestment;
