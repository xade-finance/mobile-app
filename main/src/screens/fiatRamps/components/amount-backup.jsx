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

const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '⌫'],
  ];
  
// import {EventsCarousel} from './eventsCarousel';


// import {signAndSendTransactionConnect} from '../../particle-connect';



const Component = ({navigation}) => {
    const [amount, setAmount] = React.useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const slideAnimation = new Animated.Value(0);

  const toggleVisibility = () => {
    if (isVisible) {
      Animated.timing(slideAnimation, {
        // toValue: 0,
        easing: Easing.out(Easing.exp), // updated easing function
        duration: 500,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
    } else {
      setIsVisible(true);
      Animated.timing(slideAnimation, {
        // toValue: 1,
        easing: Easing.out(Easing.exp), // updated easing function
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };
    function handleButtonPress(button) {
        if (button !== '' && button !== '⌫') {
          let num = parseInt(button);
          setAmount(amount * 10 + num);
        } else if (button === '⌫') setAmount(parseInt(amount / 10));
    }


  return (
    <SafeAreaView style={{width: '100%', height: '100%'}}>
      {/* <View colors={['#222222', '#000']} style={styles.container}> */}
      <Button title={isVisible ? 'Hide' : 'Show'} onPress={toggleVisibility} />

      {/* <View style = {{height: height/4}}></View> */}
      <View style = {{backgroundColor: 'black', height: height/4}}>
      {/* <View style = {{height: height}}> */}
      {/* </View> */}
      {isVisible && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: height / 2,
            zIndex: 1,
            transform: [
              {
                translateY: slideAnimation.interpolate({
                    inputRange: [0, height],
                    outputRange: [height, 0],
                }),
              },
            ],
          }}>
            <View
          style={{
            // zIndex: 1,
            // height: height / 2,
            // backgroundColor: 'gray',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {buttons.map((row, i) => {
          return (
            
            <View key={`row-${i}`} style={styles.row}>
              {row.map(button => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      handleButtonPress(button);
                    }}
                    key={`button-${button}`}
                    style={styles.button}>
                    <Text style={styles.buttonText}>{button}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
        </View>
        </Animated.View>
      )}
    </View>
      {/* </View> */}
    </SafeAreaView>
  );
};






export default Component;
