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

const ExternalLinkModal = ({uri, onClose, heading}) => {

  const [modalVisible, setModalVisible] = useState(true);
  const [address, setAdd] = useState('');

  const handleCloseModal = () => {
    setModalVisible(false);
    onClose();
  };

  useEffect(() => {
    if (global.withAuth) {
      setAdd(global.loginAccount.scw);
    } else setAdd(global.connectAccount.address);
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
              <Text style={styles.title}>{heading}</Text>
              <TouchableOpacity>
                <Ionicons name="refresh-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.webViewContainer}>              
              <WebView 
                source={{
                  uri: uri
                }}
                style={styles.webView}                  
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d0d0d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: height*0.1,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Sarala-Bold',
    color: '#fff',
  },
  webViewContainer: {
    width: width,
    height: height * 0.9,
    // marginVertical: 10,
    alignSelf: 'center',
    backgroundColor: '#1f1f1f',
    // borderRadius: 20,
  },
  webView: {
    width: '100%',
    height: '80%',
    borderRadius: 20,
  },
});

export default ExternalLinkModal;
