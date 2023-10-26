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
import styles from '../investment-styles';
import { getUserCollectiblePortfolio } from '../../../../utils/alchemy';
import MyCollectionItemCard from './myCollectionItemCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyCollection = ({navigation}) => {
    const [collectiblePortfolio, setCollectiblePortfolio] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function init() {
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

            const userCollectiblePortfolio = await getUserCollectiblePortfolio(mainnet, scwAddress);
            setCollectiblePortfolio(userCollectiblePortfolio);
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
                !loading && collectiblePortfolio.length > 0 &&
                    collectiblePortfolio.map(e => {
                        return <MyCollectionItemCard navigation={navigation} item={e} />
                    })
                
            }

            {
                !loading && collectiblePortfolio.length === 0 &&
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

export default MyCollection;
