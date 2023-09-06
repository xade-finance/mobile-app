import React from 'react';

import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';

import {Text} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import {color} from 'react-native-elements/dist/helpers';
import LinearGradient from 'react-native-linear-gradient';

import FastImage from 'react-native-fast-image';

const windowHeight = Dimensions.get('window').height;
const selectedIcon = '#FE2C5E';
const icon = '#9D9D9D';
const BottomNavbar = ({navigation, selected}) => {
  return (
    // <View style = {{height: windowHeight * 0.3}}>
    <View style={[styles.container, {paddingBottom: 10}]}>

      <View 
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-around',
        }}>
        <View>

          <TouchableOpacity onPress={() => navigation.push('Payments')}>
            <View style={styles.navItem}>
              <Icon
                name="home"
                type="feather"
                size={24}
                color={selected == 'Payments' ? selectedIcon : icon}
              />
              {/* {selected == 'Payments' ? (
                <FastImage
                  source={require(`./navbar-images/home-selected.png`)}
                  style={styles.icon}
                />
              ) : (
                <FastImage
                  source={require(`./navbar-images/home.png`)}
                  style={styles.icon}
                />
              )} */}

              <Text style={selected == 'Payments' ? styles.navItemLabelSelected : styles.navItemLabel}>Home</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity onPress={() => navigation.push('Card')}>
            <View style={styles.navItem}>
              <Icon
                name="credit-card"
                type="feather"
                size={24}
                color={selected == 'Card' ? selectedIcon : icon}
              />
              {/* {selected == 'Card' ? (
                <FastImage
                  source={require(`./navbar-images/card-selected.png`)}
                  style={styles.cardIcon}
                />
              ) : (
                <FastImage
                  source={require(`./navbar-images/card.png`)}
                  style={styles.cardIcon}
                />
              )} */}

              <Text style={selected == 'Card' ? styles.navItemLabelSelected : styles.navItemLabel}>Card</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View >
          {/* <Icon
            name="piggy-bank-outline"
            type="material-community"
            size={30}
            onPress={() => navigation.push('Savings')}
            color={selected == 'Savings' ? selectedIcon : icon}
          /> */}
          <TouchableOpacity onPress={() => navigation.push('Savings')}>
            <View style={styles.navItem}>            
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
              <Text style={selected == 'Savings' ? styles.navItemLabelSelected : styles.navItemLabel}>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          {/* <Icon
            name="stats-chart"
            type="ionicon"
            size={25}
            onPress={() => navigation.push('Investments')}
            color={selected == 'Investments' ? selectedIcon : icon}
          /> */}
          <TouchableOpacity onPress={() => navigation.push('Investments')}>
            <View style={styles.navItem}> 
              <Icon
                name="pie-chart"
                type="feather"
                size={24}
                color={selected == 'Investments' ? selectedIcon : icon}
              />
              {/* {selected == 'Investments' ? (
                <FastImage
                  source={require(`./navbar-images/investments-selected.png`)}
                  style={styles.icon}
                />
              ) : (
                <FastImage
                  source={require(`./navbar-images/investments.png`)}
                  style={styles.icon}
                />
              )} */}
              <Text style={selected == 'Investments' ? styles.navItemLabelSelected : styles.navItemLabel}>Trade</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* <View style={styles.navItem}>
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
        </View> */}
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#9D9D9D',
    width: 24,
    height: 24,
  },
  iconSelected: {
    color: '#FE2C5E',
    width: 24,
    height: 24,
  },
  cardIcon: {
    color: '#9D9D9D',
    width: 24,
    height: 18,
    marginVertical: 3
  },
  navIconSelected : {
    color: '#FE2C5E',
    width: 24,
    height: 24,
  },
  navIcon: {
    color: '#9D9D9D',
    width: 24,
    height: 24,
  },
  navItemLabel: {
    color: '#9D9D9D',
    fontSize: 11,
    fontFamily: 'EuclidCircularA-Medium',
    fontWeight: 400,
    paddingTop: 4,
  },
  navItemLabelSelected: {
    color: '#FE2C5E',
    fontSize: 11,
    fontFamily: 'EuclidCircularA-Medium',
    fontWeight: 400,
    paddingTop: 4,
  }
});

export default BottomNavbar;
