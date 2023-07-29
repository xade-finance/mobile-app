import React from 'react';

import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';

import {Text} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import {color} from 'react-native-elements/dist/helpers';
import LinearGradient from 'react-native-linear-gradient';

import FastImage from 'react-native-fast-image';

const windowHeight = Dimensions.get('window').height;
const selectedIcon = '#fff';
const icon = '#9D9D9D';
const BottomNavbar = ({navigation, selected}) => {
  return (
    // <View style = {{height: windowHeight * 0.3}}>
    <View style={[styles.container, {paddingBottom: 25}]}>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
        }}>
        <View style={styles.navItem}>
          {/* <Icon
            name="home"
            type="octicon"
            size={26}
            // style={selected == 'Payments'?selectedIcon:icon}
            onPress={() => navigation.push('Payments')}
            color={selected == 'Payments' ? selectedIcon : icon}
          /> */}
          <TouchableOpacity onPress={() => navigation.push('Payments')}>
            {selected == 'Payments' ? (
              <FastImage
                source={require(`./navbar-images/home-selected.png`)}
                style={styles.icon}
              />
            ) : (
              <FastImage
                source={require(`./navbar-images/home.png`)}
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.navItem}>
          {/* <Icon
            name="piggy-bank-outline"
            type="material-community"
            size={30}
            onPress={() => navigation.push('Savings')}
            color={selected == 'Savings' ? selectedIcon : icon}
          /> */}
          <TouchableOpacity onPress={() => navigation.push('Savings')}>
            {selected == 'Savings' ? (
              <FastImage
                source={require(`./navbar-images/savings-selected.png`)}
                style={styles.icon}
              />
            ) : (
              <FastImage
                source={require(`./navbar-images/savings.png`)}
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.navItem}>
          {/* <Icon
            name="stats-chart"
            type="ionicon"
            size={25}
            onPress={() => navigation.push('Investments')}
            color={selected == 'Investments' ? selectedIcon : icon}
          /> */}
          <TouchableOpacity onPress={() => navigation.push('Investments')}>
            {selected == 'Investments' ? (
              <FastImage
                source={require(`./navbar-images/investments-selected.png`)}
                style={styles.icon}
              />
            ) : (
              <FastImage
                source={require(`./navbar-images/investments.png`)}
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.navItem}>
          {/* <Icon
            name="shopping-bag"
            type="feather"
            size={25}
            onPress={() => navigation.push('Card')}
            color={selected == 'Card' ? selectedIcon : icon}
          /> */}
          <TouchableOpacity onPress={() => navigation.push('Card')}>
            {selected == 'Card' ? (
              <FastImage
                source={require(`./navbar-images/card-selected.png`)}
                style={styles.cardIcon}
              />
            ) : (
              <FastImage
                source={require(`./navbar-images/card.png`)}
                style={styles.cardIcon}
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.navItem}>
          {/* <Icon
            name="shopping-bag"
            type="feather"
            size={25}
            onPress={() => navigation.push('Card')}
            color={selected == 'Card' ? selectedIcon : icon}
          /> */}
          <TouchableOpacity onPress={() => navigation.push('Redeem')}>
            {selected == 'Redeem' ? (
              <FastImage
                source={require(`./navbar-images/redeem-selected.png`)}
                style={styles.icon}
              />
            ) : (
              <FastImage
                source={require(`./navbar-images/redeem.png`)}
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  top: {
    height: 1,
    marginBottom: 20,
  },
  container: {
    backgroundColor: '#191919',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    height: 80,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: '2%',
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#9D9D9D',
    width: 24,
    height: 24,
  },
  cardIcon: {
    color: '#9D9D9D',
    width: 24,
    height: 18,
  },
});

export default BottomNavbar;
