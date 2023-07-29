import React, {useState} from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  SafeAreaView,
  View,
  Button,
  Image,
  Animated,
  ScrollView,
  Clipboard,
  Dimensions,
  Alert,
  Easing
} from 'react-native';
import {Text} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import styles from './../styles/amount';
import {Icon} from 'react-native-elements';
import {useEffect} from 'react';
const { height } = Dimensions.get('window');

// import {EventsCarousel} from './eventsCarousel';


// import {signAndSendTransactionConnect} from '../../particle-connect';



const Component = ({navigation}) => {
    const [amount, setAmount] = React.useState(0);
  return (
    <SafeAreaView style={{width: '100%', height: '100%', backgroundColor: 'black'}}>
        
    </SafeAreaView>
  );
};






export default Component;
