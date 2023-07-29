import React from 'react';
import {TouchableOpacity, View, Linking} from 'react-native';
import {Text} from '@rneui/themed';
import CountDown from 'react-native-countdown-component';
import LinearGradient from 'react-native-linear-gradient';

import styles from './countdown-styles';

timeToday = Date.now();
endDate = new Date(Date.UTC((year = 2023), (monthIndex = 2), (date = 15)));

var time = (endDate - timeToday) / 1000.0;

const Countdown = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.topContent}>
          <Text style={styles.launch}>
            Xade Mainnet V1 is launching on {'\n'}
            15th March 2023 at 10pm UTC
          </Text>
        </View>
        <View style={styles.countdown}>
          <CountDown
            style={styles.counter}
            digitStyle={{background: 'transparent'}}
            digitTxtStyle={styles.digits}
            timeLabelStyle={styles.timeLabels}
            timeLabels={{d: 'Days', h: 'Hours', m: 'Mins', s: 'Seconds'}}
            until={time}
            size={40}
          />
        </View>
        <Text style={styles.subText}>The countdown has already begun...</Text>
        <LinearGradient colors={['#ff4869', '#fa06ff']} style={styles.button}>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://discord.com/channels/1023970802099572847/1039229895781404692',
              )
            }>
            <Text style={styles.buttonText}>Take Part In Private Beta</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default Countdown;
