import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, SafeAreaView, ScrollView } from 'react-native';

// Import your images (replace with actual paths)
// import algo from './assets/algo.png';
// import leverage from './assets/leverage.png';
// import limit from './assets/limit.png';
// import stop from './assets/stop.png';
import { ImageAssets } from '../../../../../assets';
import { Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';


const TradePage = ({ navigation }) => {
  const [tradeType, setTradeType] = useState("buy");
  const [orderType, setOrderType] = useState("market");
  const [selectedDropDownValue, setSelectedDropDownValue] = useState("spot");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [value, setValue] = useState("1");
  const [convertedValue, setConvertedValue] = useState("token");
  const [commingSoon, setCommingSoon] = useState(false);
  const [changeSlipage, setChangeSlipage] = useState(false);
  const [slipageValue, setSlipageValue] = useState("1");
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;


  useEffect(() => {
    if (selectedDropDownValue === "Margin" || selectedDropDownValue === "Algo" || orderType === "limit" || orderType === "spot") {
      setCommingSoon(true);
    } else {
      setCommingSoon(false);
    }
  }, [selectedDropDownValue, orderType]);

  return (
    <SafeAreaView
      style={{ 
        backgroundColor: '#000',
        paddingBottom: 80,
        flex: 1, 
      }}> 
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: "3%", width: width, marginBottom: 24 }}>
        <View
          style={{ 
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: '5%',
            width: width * 0.9,
          }} >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name={'keyboard-backspace'}
              size={30}
              color={'#f0f0f0'}
              type="materialicons"
              onPress={() => navigation.goBack()}
            />

            <Text
              style={{
                fontSize: 20,
                color: '#ffffff',
                fontFamily: `Sarala-Bold`,
                fontWeight: 500,
                marginLeft: 30
              }}>
              Trade
            </Text>
          </View>
          <TouchableOpacity
          // onPress={() => setIsDropDownOpen(!isDropDownOpen)}
          >
            <View>
              <LinearGradient
                colors={['#5038e1', '#b961ff']}
                useAngle={true}
                angle={103.64}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 22,
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{selectedDropDownValue}</Text>
              </LinearGradient>
              {/* <Image source={require('./path-to-your-arrow-image.png')} style={{ width: 24, height: 24 }} /> */}
            </View>
            {/* Drop-down options go here */}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          height: 500,
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          // paddingHorizontal: 20,
          // paddingVertical: 12,
        }}
      >
        <View>
          <Image source={ImageAssets.algoImg} style={{height: 200, width: 200}} />
        </View>
        <View style={{ marginBottom: 50, alignItems: 'flex-start', gap: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#D1D2D9', textAlign: 'justify' }}>
            Coming Soon
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TradePage;
