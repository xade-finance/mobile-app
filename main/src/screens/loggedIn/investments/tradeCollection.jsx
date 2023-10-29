import * as React from 'react';
import { Animated, StyleSheet, Pressable, Box, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import MyInvestment from './tradeCollection/myInvestment';
import MyCollection from './tradeCollection/myCollection';
import { Text, Center } from 'react-native';
import { Image } from 'react-native';
import { Button, Flex } from 'react-native';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view'

// import {
//   createMaterialTopTabNavigator,
//   MaterialTopTabBarProps,
// } from "@react-navigation/material-top-tabs";

const renderScene = SceneMap({
    investments: MyInvestment,
    collectibles: MyCollection,
});

const HEADER_HEIGHT = 50

const DATA = [0, 1, 2, 3, 4]
const identity = (v) => v + ''

const Header = () => {
  return <View style={styles.header} />
}

const TradeCollection = ({navigation}) => {

    const layout = useWindowDimensions();

    // const Tab = createMaterialTopTabNavigator();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'investments', title: 'My Investments' },
        { key: 'collectibles', title: 'My Collectibles' },
    ]);

    const renderTabBar = (props) => {
      const inputRange = routes.map((x, i) => i);

      return (
        <View style={styles.tabBar}>
          {routes.map((route, i) => {
            // const opacity = props.position.interpolate({
            //   inputRange,
            //   outputRange: inputRange.map((inputIndex) =>
            //     inputIndex === i ? 1 : 0.5
            //   ),
            // });

            const borderColor = index === i ? '#fff' : 'transparent';

            return (
              <Pressable
                  style={[styles.tabItem, {
                    borderColor: borderColor,
                    borderBottomWidth: 3,
                    marginHorizontal: 10
                  }]}
                  onPress={() => setIndex(i)}>
                  <Animated.Text style={[
                    // {opacity}, 
                    styles.tabTitle ]}>{route.title}</Animated.Text>
                </Pressable>
            );
          })}
        </View>
      );
    };

    return (

      <Tabs.Container
        // renderTabBar={renderTabBar}
        containerStyle={{ minHeight: 250, fontSize: '14px', fontFamily: 'Sarala-Bold'}}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{backgroundColor: '#000'}}
        renderTabBar={props => <MaterialTabBar {...props} pressColor={'transparent'} activeColor={'#fff'}  inactiveColor={'#ffffffcc'} indicatorStyle={{ backgroundColor: '#fff' }} labelStyle={{fontSize: 14, fontFamily: 'Sarala-Bold', }} />}
        headerContainerStyle={{ backgroundColor : '#000'}}
        // renderHeader={Header}
        // headerHeight={HEADER_HEIGHT} // optional
      >
        <Tabs.Tab name="My Investments" label={"My Investments"} key={1} >
          <Tabs.ScrollView>
            <MyInvestment navigation={navigation} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="My Collectibles" label={"My Collectibles"} key={2}>
          <Tabs.ScrollView>
            <MyCollection  navigation={navigation} />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
  //   paddingTop: StatusBar.currentHeight,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  //   backgroundColor:'red'
    paddingVertical: 16,
  //   backgroundColor: '#0D0D0D',
  },
  tabTitle: {
      fontFamily: 'Sarala-Bold',
      fontSize: 14,
      color: '#fff',
  },
  box: {
    height: 250,
    width: '100%',
  },
  boxA: {
    backgroundColor: 'white',
  },
  boxB: {
    backgroundColor: '#D8D8D8',
  },
  header: {
    height: HEADER_HEIGHT,
    width: '100%',
    backgroundColor: '#2196f3',
  },
});

export default TradeCollection;
