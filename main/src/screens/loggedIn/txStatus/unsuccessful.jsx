import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
  View,
  Linking,
  ScrollView,
  Platform,
} from 'react-native';
import {Text} from '@rneui/themed';
import Video from 'react-native-video';
const successVideo = require('./unsuccess.mov');

export default function Component({navigation, route}) {
  error = route.params.error;
  // Some routing must be done after Pending state
  console.log('Err:', error);
  return (
    <View style={{width: '100%', height: '100%', backgroundColor: '#0C0C0C'}}>
      <Text
        style={{
          color: '#fff',
          fontSize: 30,
          marginTop: '20%',
          textAlign: 'center',
          fontFamily: `EuclidCircularA-Bold`,
        }}>
        Transaction Unsuccessful
      </Text>
      <View
        style={{
          width: '80%',
          marginTop: '20%',
          marginLeft: Platform.OS == 'ios' ? '12%' : '22%',
        }}>
        <Video
          source={successVideo}
          style={{width: 300, height: 300}}
          controls={false}
          repeat={true}
          ref={ref => {
            this.player = ref;
          }}
        />
      </View>
      <Text
        style={{
          color: '#fff',
          fontSize: 20,
          marginTop: '20%',
          textAlign: 'center',
          fontFamily: `EuclidCircularA-Medium`,
        }}>
        {JSON.stringify(error)}
      </Text>
      <TouchableOpacity onPress={() => navigation.push('Payments')}>
        <Text
          style={{
            color: '#fff',
            fontSize: 22,
            marginTop: '10%',
            textAlign: 'center',
            fontFamily: `EuclidCircularA-Medium`,
          }}>
          Return Home
        </Text>
      </TouchableOpacity>
    </View>
  );
}
