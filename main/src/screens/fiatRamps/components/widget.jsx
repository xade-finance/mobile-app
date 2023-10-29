import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TransakWebView from '@transak/react-native-sdk';
import {enableScreens} from 'react-native-screens';

const windowHeight = Dimensions.get('window').height;
const {width, height} = Dimensions.get('window');

const BuyCryptoPage = ({uri, onClose, widget, name, address}) => {
  const [showBuyCryptoModal, setShowBuyCryptoModal] = useState(false);
  const [add, setAdd] = useState('0x');
  const [email, setEmail] = useState('');

  const [modalVisible, setModalVisible] = useState(true);

  const handleCloseModal = () => {
    setModalVisible(false);
    onClose();
  };
  const transakEventHandler = (event, data) => {
    switch (event) {
      case 'ORDER_PROCESSING':
        console.log(data);
        break;

      case 'ORDER_COMPLETED':
        console.log(data);
        break;

      default:
        console.log(data);
    }
  };

  useEffect(() => {
    if (global.withAuth) {
      setAdd(global.loginAccount.scw);
    } else setAdd(global.connectAccount.address);
  }, []);

  useEffect(() => {
    if (global.withAuth) {
      setEmail(global.loginAccount.phoneEmail);
    } else {
      // setAdd(global.connectAccount.address);
    }
  }, []);

  return (
    <Modal animationType="slide" transparent={false} visible={modalVisible}>
      <View
        style={{
          backgroundColor: '#0C0C0C',
          height: windowHeight,
        }}>
        <SafeAreaView>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>Add Funds</Text>
              <TouchableOpacity>
                <Ionicons name="refresh-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.webViewContainer}>
              {widget == 'transak' ? (
                <TransakWebView
                  queryParams={{
                    apiKey: '630ad3bf-7aba-4ee8-8a25-87e9ee3363f6',
                    environment: 'PRODUCTION',
                    // .....
                    // For the full list of query params refer Props section below
                  }}
                  onTransakEventHandler={transakEventHandler}
                  style={styles.webView} // react-native-webview prop
                  // onLoadStart={}    // react-native-webview prop
                  // onLoadEnd={}      // react-native-webview prop
                  // .....
                  // For the full list of react-native-webview props refer Props section below
                />
              ) : 
                widget == 'kado' ? 
                (
                  <WebView 
                    source={{
                      uri: `https://app.kado.money/?apiKey=e55d6f82-6421-495f-928d-c9f5b39f0aae&onToAddress=${add}&network=POLYGON&email=${email}`,
                    }}
                    style={styles.webView}                  
                  />
                )
                : (
                <WebView
                  source={{
                    uri: `https://onramp.money/main/buy/?appId=251363&walletAddress=${add}`,
                  }}
                  style={styles.webView}
                />
              )}
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0c0c0c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  webViewContainer: {
    width: width * 0.9,
    height: height * 0.8,
    marginVertical: 20,
    alignSelf: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 20,
  },
  webView: {
    width: '100%',
    height: '80%',
    borderRadius: 20,
  },
});

export default BuyCryptoPage;
