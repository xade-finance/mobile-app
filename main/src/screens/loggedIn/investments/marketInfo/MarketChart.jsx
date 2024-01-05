import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  StyleSheet,
  Linking
} from 'react-native';
import { Text, Icon, Image } from '@rneui/themed';
import { Slider } from 'react-native-elements';
import styles from '../investment-styles';
// import BottomNavbar from '../../navbar';
// import getSpotPrice from './backend/viewFunctions';
// import transactions from './backend/txFunctions';
// import FastImage from 'react-native-fast-image';
import BTC from '../data_old.json';
import { ethers } from 'ethers';
import TradePage from './BuyForm';
import { useNavigation } from '@react-navigation/native';
import { ImageAssets } from '../../../../../assets';

const screenWidth = Dimensions.get('window').width;

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import GainSvg from '../icon/gainSvg';
import ChangeSvg from '../icon/changeSvg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import LinearGradient from 'react-native-linear-gradient';
import { getTokenBalance } from '../../../../utils/alchemy';


function toDateTime(secs) {
  var t = new Date(secs); // Epoch
  console.log(t.toLocaleDateString('en-US'));
  return t;
}


const MarketChart = (props) => {
  const [state, setState] = useState({
    item: props.item,
    scwAddress: props.scwAddress,
    contractAddress : '',
    price: 'Updating',
    buyPrice: 'Updating',
    marketCap: 'Updating',
    totalVolume: 'Updating',
    allTimeHigh: 'Updating',
    allTimeLow: 'Updating',
    btnSelected: 'long',
    nBtc: '',
    status: true,
    leverageValue: 1,
    latestBlock: {},
    data: BTC.prices,
    chartSelected: '365',
    coinInfo: {},
    priceChangePercentage: Number(0),

    // written by Adarsh
    about: 'Loading...',
    fully_diluted_valuation: 'Updating',
    section: 'news',
  });

  const [news, setNews] = useState([]);

  const navigation = useNavigation();

  const updateChart = async (days) => {
    setState({
      ...state,
      chartSelected: days,
    });

    let btcInfoUrl = `https://api.coingecko.com/api/v3/coins/${state.item.id.toLowerCase()}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

    let btcUrl = `https://api.coingecko.com/api/v3/coins/${state.item.id.toLowerCase()}/market_chart?vs_currency=usd&days=${days}`;

    try {
      const response = await fetch(btcUrl);
      const prices = await response.json();

      setState({
        ...state,
        data: prices.market_caps,
      });
    } catch (error) {
      console.log("111111");
      console.error(error);
    }

    try {
      const response = await fetch(btcInfoUrl);
      const info = await response.json();

      //       console.log("INFO_RESPONSE", info, "INFO_RESPONSE");

      // Define a regular expression to match <a> tags and capture their text content
      const linkRegex = /<a\b[^>]*>(.*?)<\/a>/g;

      // Use replace function to replace <a> tags with their text content
      // console.log(info);
      const contractAddress = info.detail_platforms.ethereum.contract_address;
      // console.log(info.description);
      console.log('--------------------------------');
      const sanitizedText = info.description.en.replace(linkRegex, (match, group) => group);

      setState({
        ...state,
        marketCap: info.market_data.market_cap.usd,
        totalVolume: info.market_data.total_volume.usd,
        allTimeHigh: info.market_data.ath.usd,
        allTimeLow: info.market_data.atl.usd,
        price: info.market_data.current_price.usd.toFixed(3).toString(),
        buyPrice: info.market_data.current_price.usd.toFixed(3).toString(),
        fully_diluted_valuation: info.market_data.fully_diluted_valuation.usd,
        about: sanitizedText,
        nBtc: 1.0,
        contractAddress: contractAddress,
        priceChangePercentage:
          state.chartSelected === '1'
            ? info.market_data.price_change_percentage_24h
            : state.chartSelected === '14'
              ? info.market_data.price_change_percentage_14d
              : state.chartSelected === '60'
                ? info.market_data.price_change_percentage_60d
                : state.chartSelected === '180'
                  ? info.market_data.price_change_percentage_200d
                  : info.market_data.price_change_percentage_1y,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const btcFirst = () => {
    setState({
      ...state,
      status: !state.status,
    });
  };

  const fetchUserDetails = async () => {
    try {
      const mainnetJSON = await AsyncStorage.getItem('mainnet');
      const mainnet = JSON.parse(mainnetJSON);
      console.log('=-=======');

      if (global.withAuth) {
        authAddress = global.loginAccount.publicAddress;
        const scwAddress = global.loginAccount.scw;
        // console.log(scwAddress);
        setState({
          ...state,
          address: scwAddress,
        });
      } else {
        authAddress = global.connectAccount.publicAddress;
        const scwAddress = global.connectAccount.publicAddress;
        setState({
          ...state,
          address: scwAddress,
        });
      }
    } catch (e) {
      console.log('333333');
      console.log(e);
    }
  };

  const tradeApi = async () => {
    try {
      const from = state.status ? 'USD' : state.item.symbol.toUpperCase();
      const _makingAmount = state.status ? state.buyPrice : state.buyPrice / state.price;
      const _takingAmount = state.status ? state.buyPrice / state.price : state.buyPrice;

      const makingAmount = ethers.utils.parseUnits(_makingAmount.toString(), 6);
      const takingAmount = ethers.utils.parseUnits(_takingAmount.toString(), 18);

      const makerAsset = from === 'USD' ? '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' : '0x0000000000000000000000000000000000001010';
      const takerAsset = from === 'USD' ? '0x0000000000000000000000000000000000001010' : '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';

      console.log(Math.floor(Date.now() / 1000) + 60 * 60);

      const postData = {
        chainId: '137',
        makerAsset: makerAsset,
        takerAsset: takerAsset,
        maker: state.scwAddress,
        allowedSenders: [state.scwAddress],
        makingAmount: Number(makingAmount).toString(),
        takingAmount: Number(takingAmount).toString(),
        expiredAt: Math.floor(Date.now() / 1000) + 60 * 60,
      };

      console.log(postData);
      const json = JSON.stringify(postData || {}, null, 2);

      console.log(json);

      const response = await fetch('https://limit-order.kyberswap.com/write/api/v1/orders/sign-message', {
        method: 'POST',
        body: json,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response);
      if (response.status === 200) {
        const data = await response.text();
        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const about = async () => {
    const marketStatsURL = `https://api.coingecko.com/api/v3/coins/${state.item.id.toLowerCase()}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`;

    try {
      const response = await fetch(marketStatsURL, {
        headers: {
          'x-cg-demo-api-key': 'CG-vwTDdcvqR2QNrytke2e4WKVR',
        },
      });

      const info = await response.json();

      console.log(info, 'info');
      try {
        if (info.status.error_code === 429) {
          return;
        }
      } catch (e) {
        console.log(e);
      }
      setState({
        ...state,
        coinMarketStats: info[0],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getNews = async () => {
    const newsURL = "https://cryptopanic.com/api/v1/posts/?auth_token=14716ecd280f741e4db8efc471b738351688f439";

    try {
      const response = await fetch(newsURL);

      const info = await response.json();

      // console.log(info["results"], 'news');

      setNews(info["results"]);

      // console.log("NEWS", news, "NEWS");

    } catch (error) {
      console.log(newsURL);
      console.log('444444444444');
      console.error(error);
      // console.log('----');
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    // Get hours and minutes
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format hours and minutes
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    // Get day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });

    // Format the final string
    return {
      time: formattedTime,
      date: `${day} ${month}`,
    };
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    updateChart('1');
    fetchUserDetails();
    getNews();
    // about();
    // console.log(BTC.image.large);
    // console.log(getSpotPrice('BTC'));
    // console.log(BTC.prices.map(price => toDateTime(Number(price[0]))));
  }, []);

  useEffect(()=>{
    getNews();
  }, [state.section])

  useEffect(() => {
    try{

      console.log(state.scwAddress);
      console.log(state.contractAddress);
      // console.log(state.item);
      const tokenBalance = getTokenBalance(mainnet, state.scwAddress, [state.contractAddress]);
      console.log(tokenBalance);
    }catch(e){
      console.log(e);
    }
  },[state.contractAddress])

  return (
    <View style={styles.black}>
      <ScrollView>
        <SafeAreaView style={{ flex: 1 }} >
          <View style={styles.investmentsNav}>
            {/* <View
                  style={{
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    marginTop: '2%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        btnSelected: 'chart',
                      });
                      console.log(this.state.btnSelected);
                    }}
                    style={
                      this.state.btnSelected == 'chart'
                        ? styles.navSelected
                        : styles.navComponents
                    }>
                    <Text
                      style={
                        this.state.btnSelected == 'chart'
                          ? styles.navSelectedText
                          : styles.navText
                      }>
                      Overview
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        btnSelected: 'long',
                      });
                      console.log(this.state.btnSelected);
                    }}
                    style={
                      this.state.btnSelected == 'long'
                        ? styles.greenSelected
                        : styles.navComponents
                    }>
                    <Text
                      style={
                        this.state.btnSelected == 'long'
                          ? styles.navSelectedText
                          : styles.navText
                      }>
                      Long
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        btnSelected: 'short',
                      });
                      console.log(this.state.btnSelected);
                    }}
                    style={
                      this.state.btnSelected == 'short'
                        ? styles.redSelected
                        : styles.navComponents
                    }>
                    <Text
                      style={
                        this.state.btnSelected == 'short'
                          ? styles.navSelectedText
                          : styles.navText
                      }>
                      Short
                    </Text>
                  </TouchableOpacity>
                </View> */}
            <View
              style={
                // this.state.btnSelected == 'long' ||
                // this.state.btnSelected == 'short'
                // ? {display: 'none'}
                // : 
                styles.longshortContainer
              }>
              <View style={styles.coinChart}>
                <View style={styles.marketInfo}>
                  <View style={styles.stockName}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.stockHead}>
                        {state.item?.name}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stockPriceContainer}>
                    <Text style={styles.stockPrice}>
                      ${state.price}
                    </Text>

                    {/* <View style={{flexDirection:'row', alignItems:'center', marginHorizontal:20,marginTop: 10}}>
                          {
                            this.state.priceChangePercentage > 0
                            ? <GainSvg />
                            : <LossSvg />
                          }

                          <Text
                              style={{
                                  fontFamily: 'Sarala-Bold',
                                  fontSize: 16,
                                  color: "#ADFF6C",
                                  fontWeight: 700,
                                  marginHorizontal:4
                              }}>
                              $465.12 (+3.46%)
                          </Text>

                          <Text
                              style={{
                                  fontFamily: 'Sarala-Regular',
                                  fontSize: 16,
                                  color: "#999999",
                                  fontWeight: 400,
                                  marginHorizontal:4
                              }}>
                              24h
                          </Text>

                      </View> */}
                    <View
                      style={{ flexDirection: 'row', alignItems: 'flex-end', marginLeft: '5%' }}>
                      <Icon
                        name={
                          state.priceChangePercentage > 0
                            ? 'caretup'
                            : 'caretdown'
                        }
                        type="antdesign"
                        color={
                          state.priceChangePercentage > 0
                            ? '#2FBE6A'
                            : '#E14C4C'
                        }
                        size={20}
                      />
                      <Text
                        style={{
                          color:
                            state.priceChangePercentage > 0
                              ? '#2FBE6A'
                              : '#E14C4C',
                          fontFamily: `Sarala-Regular`,
                          fontSize: 16,
                          marginLeft: '1%',
                          alignItems: 'center'
                        }}>
                        {state.priceChangePercentage.toFixed(2)}% (24h)
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.chartContainer}>
                  <LineChart
                    bezier
                    data={{
                      datasets: [
                        {
                          data: state.data.map(price =>
                            Number(price[1]),
                          ),
                        },
                      ],
                    }}
                    width={screenWidth}
                    height={200}
                    withDots={false}
                    withHorizontalLabels={false}
                    chartConfig={{
                      backgroundColor: '#000',
                      backgroundGradientToOpacity: 1,
                      backgroundGradientFrom: '#000',
                      backgroundGradientTo: '#000',
                      useShadowColorFromDataset: false, // optional
                      barPercentage: 1,
                      barRadius: 360,
                      fillShadowGradientFromOpacity: 0,
                      fillShadowGradientToOpacity: 0,
                      strokeWidth: 2,
                      propsForBackgroundLines: {
                        strokeWidth: 0,
                      },

                      color: (opacity = 0) => '#9853F5',
                    }}
                    style={{
                      paddingRight: 0,
                      backgroundColor: 'transparent',
                    }}
                  />
                </View>
                <View
                  style={{
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                    marginTop: '5%',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      updateChart('1');
                    }}
                    style={
                      state.chartSelected == '1'
                        ? styles.goldSelected
                        : styles.chartComponents
                    }>
                    <Text
                      style={
                        state.chartSelected == '1'
                          ? styles.navSelectedText
                          : styles.chartText
                      }>
                      1D
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      updateChart('14');
                    }}
                    style={
                      state.chartSelected == '14'
                        ? styles.goldSelected
                        : styles.chartComponents
                    }>
                    <Text
                      style={
                        state.chartSelected == '14'
                          ? styles.navSelectedText
                          : styles.chartText
                      }>
                      2W
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      updateChart('60');
                    }}
                    style={
                      state.chartSelected == '60'
                        ? styles.goldSelected
                        : styles.chartComponents
                    }>
                    <Text
                      style={
                        state.chartSelected == '60'
                          ? styles.navSelectedText
                          : styles.chartText
                      }>
                      2M
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      updateChart('180');
                    }}
                    style={
                      state.chartSelected == '180'
                        ? styles.goldSelected
                        : styles.chartComponents
                    }>
                    <Text
                      style={
                        state.chartSelected == '180'
                          ? styles.navSelectedText
                          : styles.chartText
                      }>
                      6M
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      await updateChart('365');
                    }}
                    style={
                      state.chartSelected == '365'
                        ? styles.goldSelected
                        : styles.chartComponents
                    }>
                    <Text
                      style={
                        state.chartSelected == '365'
                          ? styles.navSelectedText
                          : styles.chartText
                      }>
                      1Y
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* <View style={styles.additionalInfo}>
                      <View style={styles.column1}>
                        <View style={{marginTop: 15}}>
                          <Text style={styles.marketCapInfo}>
                            All Time High
                          </Text>
                          <Text style={styles.highText}>
                            ${state.allTimeHigh}
                          </Text>
                        </View>
                        <View style={{marginTop: 15}}>
                          <Text style={styles.marketCapInfo}>Market Cap</Text>
                          <Text style={styles.marketCapData}>
                            ${state.marketCap.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.column2}>
                        <View style={{marginTop: 15}}>
                          <Text style={styles.marketCapInfo}>All Time Low</Text>
                          <Text style={styles.lowText}>{'<'}$1</Text>
                        </View>
                        <View style={{marginTop: 15}}>
                          <Text style={styles.marketCapInfo}>Total Volume</Text>
                          <Text style={styles.marketCapData}>
                            {state.totalVolume.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    </View> */}
              </View>
              {/* <View style={styles.portfolio}>
                    <Text style={styles.portfolioText}>Portfolio</Text>
                    <View style={styles.marketTrades}>
                      <View style={styles.subContents}>
                        <Text style={styles.marketText}>
                          Market Trades Appear Here
                        </Text>
                      </View>
                    </View>
                    <View style={styles.positions}>
                      <View style={styles.subContents}>
                        <Text style={styles.marketText}>
                          Your Positions Appear Here
                        </Text>
                      </View>
                    </View>
                  </View> */}
            </View>
          </View>
          <View
            style={
              // state.btnSelected == 'long' ||
              // state.btnSelected == 'short'
              // ? 
              styles.longshortContainer
              // : {display: 'none'}
            }>
            {/* <View style={styles.priceSlippage}>
                  <View style={styles.price}>
                    <View style={styles.subContents}>
                      <Text style={styles.subText}>Price</Text>
                      <TextInput
                        //    onPress={updatePrice()}
                        editable={false}
                        style={styles.subPrice}
                        placeholderTextColor={'#C4C4C4'}
                        value={state.price}
                        onChangeText={newText =>
                          setState({price: newText})
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.slippage}>
                    <View style={styles.subContents}>
                      <Text style={styles.subText}>Slippage</Text>
                      <TextInput
                        style={styles.subPrice}
                        placeholder="0%"
                        placeholderTextColor={'#C4C4C4'}
                      />
                    </View>
                  </View>
                </View> */}
            { /* <View style={styles.btcUsd}>
                  <View style={styles.btc}>
                    <View style={styles.subContents}>
                      <Text style={styles.subBtc}>You Sell</Text>
                      {state.status ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <TextInput
                            //    onPress={updatePrice()}
                            keyboardType='numeric'
                            style={styles.subPriceBtc}
                            placeholderTextColor={'#C4C4C4'}
                            value={state.buyPrice}
                            onChangeText={newText =>
                              setState({buyPrice: newText})
                            }
                          />
                          <Text
                            style={{
                              color: 'white',
                              fontSize: 24,
                              fontFamily: `Sarala-Bold`,
                              marginTop: '1%',
                            }}>
                            USD
                          </Text>
                        </View>
                      ) : (
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <TextInput
                              //    onPress={updatePrice()}
                              style={styles.subPriceBtc}
                              placeholderTextColor={'#C4C4C4'}
                              value={state.nBtc.toString()}
                              onChangeText={newText =>
                                setState({
                                  nBtc: newText,
                                })
                              }
                            />
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 25,
                                fontFamily: `Sarala-Bold`,
                                marginTop: '-1%',
                              }}>
                              {state.item.symbol.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.usd}>
                    <TouchableOpacity
                      onPress={() => btcFirst()}
                      style={{
                        transform: [{rotate: '90deg'}],
                        position: 'absolute',
                        marginTop: '-10%',
                        alignSelf: 'center',
                      }}>
                      <Icon
                        reverse
                        name="swap"
                        type="antdesign"
                        color="#161616"
                        size={30}
                      />
                    </TouchableOpacity>
                    <View style={styles.subContents}>
                      <Text style={styles.subBtc}>You Receive</Text>
                      {state.status ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={styles.subPriceBtc}>
                            {(
                              Number(state.buyPrice) /
                              Number(state.price)
                            ).toFixed(3)}
                          </Text>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 25,
                              fontFamily: `Sarala-Bold`,
                              marginTop: '-1%',
                            }}>
                            {state.item.symbol.toUpperCase()}
                          </Text>
                        </View>
                      ) : (
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <Text style={styles.subPriceBtc}>
                              {(
                                Number(state.nBtc) *
                                Number(state.price)
                              ).toFixed(3)}
                            </Text>
                            <Text
                              style={{
                                color: 'white',
                                fontSize: 25,
                                fontFamily: `Sarala-Bold`,
                                marginTop: '-1%',
                              }}>
                              USD
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                            </View> */}
            {/* <View style={styles.leverage}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.leverageText}>Leverage</Text>
                    <Text style={styles.leverageIndicator}>
                      {state.leverageValue}x
                    </Text>
                  </View>
                  <Slider
                    thumbStyle={{
                      height: 20,
                      width: 20,
                      backgroundColor: '#232323',
                    }}
                    trackStyle={{height: 5}}
                    style={{marginTop: 10}}
                    value={state.leverageValue}
                    onValueChange={value =>
                      setState({leverageValue: value})
                    }
                    step={1}
                    minimumValue={1}
                    maximumValue={10}
                  />
                </View> */}
            {/* <View>
                  <Text style={styles.orderSummary}>
                    Scroll To See Order Summary
                  </Text>
                </View> */}
            {/* <View style={styles.summary}>
                  <Text style={styles.summaryHeader}>Order Summary</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}>
                    <Text style={styles.orderDescription}>Entry Price</Text>
                    <Text style={styles.orderAmount}>${state.price}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}>
                    <Text style={styles.orderDescription}>Index Price</Text>
                    <Text style={styles.orderAmount}>
                      ${state.buyPrice}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}>
                    <Text style={styles.orderDescription}>Funding Rate</Text>
                    <Text style={styles.orderAmount}>0%</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}>
                    <Text style={styles.orderDescription}>Trading Fees</Text>
                    <Text style={styles.orderAmount}>$0</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}>
                    <Text style={styles.orderDescription}>Position Size</Text>
                    <Text style={styles.orderAmount}>$0</Text>
                  </View>
                </View> */}
            <TouchableOpacity
              style={{
                paddingHorizontal: '5%',
                marginTop: '8%',
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#747474",
                    fontFamily: 'Sarala'
                  }}
                >
                  Amount owned
                </Text>
                <Text
                  style={{
                    color: '#F0F0F0',
                    fontSize: 28,
                    fontFamily: `Sarala-Bold`,
                    marginTop: '1%'
                  }}
                >
                  $0
                </Text>
                <Text
                  style={{
                    color: "#8C63BF",
                    fontWeight: "bold",
                    fontFamily: 'Sarala-Bold'
                  }}
                >
                  {/* 0 */}
                </Text>
              </View>
              <ChangeSvg />
            </TouchableOpacity>

            <View
              style={{
                height: 50,
                marginHorizontal: '5%',
                marginTop: '8%',
                justifyContent: 'space-evenly',
                flexDirection: 'row',
                borderRadius: 6,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  height: '100%',
                  width: '100%',
                  borderRadius: 6,
                }}
                onPress={() => {
                  navigation.navigate('TradePage');
                  //                             <TradePage navigation={props.navigation} />
                }}>
                <LinearGradient useAngle={true} angle={150} colors={['#5038E1', '#B961FF']} style={{ width: "100%", borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Sarala-Bold', fontWeight: "bold" }}>
                    Trade
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', height: 50, borderRadius: 10, backgroundColor: '#1C1B20', alignItems: 'center', justifyContent: 'space-between', padding: 4, marginVertical: 24, marginHorizontal: "5%" }}>
              <TouchableOpacity style={state.section === 'news' ? { padding: 9, paddingHorizontal: 30, fontWeight: 'bold', backgroundColor: '#5B5A60', borderRadius: 10, color: '#FAF9FC', fontSize: 0.85, cursor: 'pointer' } : { color: '#ADADAF', fontWeight: 'bold', fontSize: 0.85, padding: 12, paddingHorizontal: 30, cursor: 'pointer' }} onPress={() => setState({ ...state, section: 'news' })} >
                <Text style={{ color: "#FFFFFF" }}>News</Text>
              </TouchableOpacity>

              <TouchableOpacity style={state.section === 'degenai' ? { padding: 9, paddingHorizontal: 30, fontWeight: 'bold', backgroundColor: '#5B5A60', borderRadius: 10, color: '#FAF9FC', fontSize: 0.85, cursor: 'pointer' } : { color: '#ADADAF', fontWeight: 'bold', fontSize: 0.85, padding: 12, paddingHorizontal: 30, cursor: 'pointer' }} onPress={() => setState({ ...state, section: 'degenai' })}>
                <Text style={{ color: "#FFFFFF" }}>Degen AI</Text>
              </TouchableOpacity>

              <TouchableOpacity style={state.section === 'about' ? { padding: 9, paddingHorizontal: 30, fontWeight: 'bold', backgroundColor: '#5B5A60', borderRadius: 10, color: '#FAF9FC', fontSize: 0.85, cursor: 'pointer' } : { color: '#ADADAF', fontWeight: 'bold', fontSize: 0.85, padding: 12, paddingHorizontal: 30, cursor: 'pointer' }} onPress={() => setState({ ...state, section: 'about' })}>
                <Text style={{ color: "#FFFFFF" }}>About</Text>
              </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: "5%" }}>
              {
                state.section === 'news' ?
                  news.map((data, index) => (
                    <View key={index} style={{ marginBottom: 50, alignItems: 'flex-start', gap: 10 }}>
                      <TouchableOpacity onPress={() => Linking.openURL(data.url)}>
                        <View style={{ flexDirection: 'row', gap: 5, color: 'gray', alignItems: 'center' }}>
                          {/* Avatars - Uncomment and replace with your avatar components */}
                          {/* <View style={{ flexDirection: 'row', gap: 5 }}>
                              <Image source={{ uri: 'https://randomuser.me/api/portraits/women/65.jpg' }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                              <Image source={{ uri: 'https://randomuser.me/api/portraits/men/25.jpg' }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                              <Image source={{ uri: 'https://randomuser.me/api/portraits/women/25.jpg' }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                              <Image source={{ uri: 'https://randomuser.me/api/portraits/men/55.jpg' }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                              <Image source={{ uri: 'https://via.placeholder.com/300/09f/fff.png' }} style={{ width: 30, height: 30, borderRadius: 15 }} />
                          </View> */}
                          <Text style={{ fontSize: 13, color: 'gray' }}>{formatDate(data.published_at).time}</Text>
                          <Text style={{ marginHorizontal: 5, color: 'gray' }}>·</Text>
                          <Text style={{ fontSize: 13, color: 'gray' }}>{formatDate(data.published_at).date}</Text>
                          <Text style={{ marginHorizontal: 5, color: 'gray' }}>·</Text>
                          <Text style={{ fontSize: 13, color: 'gray' }}>{capitalizeFirstLetter(data.source.title)}</Text>
                        </View>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#D1D2D9', textAlign: 'justify' }}>
                          {data.title}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))
                  :
                  state.section === 'about' ?
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'column',
                        // paddingHorizontal: 20,
                        // paddingVertical: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: '#ffffff',
                          fontSize: 16,
                          fontWeight: 'bold',
                          letterSpacing: 0.1,
                        }}
                      >
                        About
                      </Text>
                      {/* ReadMoreLess component with inline styling */}
                      <ReadMoreLess
                        text={state.about}
                        maxChars={300}
                      />
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 15,
                        }}
                      >
                        <Text
                          style={{
                            color: '#82828f',
                            textAlign: 'center',
                            borderBottomWidth: 0.5,
                            borderBottomColor: '#82828f',
                            fontSize: 12,
                          }}
                        >
                          Token address
                        </Text>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: 11,
                            color: "white"
                          }}
                        >
                          0x0000...1010
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#282A2F',
                          marginVertical: 12,
                        }}
                      ></View>
                      <Text
                        style={{
                          color: '#ffffff',
                          fontSize: 16,
                          fontWeight: 'bold',
                          letterSpacing: 0.1,
                        }}
                      >
                        Market Stats
                      </Text>
                      <View style={{ width: '100%', flexDirection: 'column' }}>
                        {/* Market Cap */}
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 10,
                          }}
                        >
                          <Text
                            style={{
                              color: '#82828f',
                              textAlign: 'center',
                              borderBottomWidth: 0.5,
                              borderBottomColor: '#82828f',
                              fontSize: 14,
                            }}
                          >
                            Market Cap
                          </Text>
                          <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 13, color: "white" }}>
                            $ {state.marketCap}
                          </Text>
                        </View>

                        {/* All Time High */}
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            style={{
                              color: '#82828f',
                              textAlign: 'center',
                              borderBottomWidth: 0.5,
                              borderBottomColor: '#82828f',
                              fontSize: 14,
                            }}
                          >
                            All Time High
                          </Text>
                          <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 13, color: "white" }}>
                            $ {state.allTimeHigh}
                          </Text>
                        </View>

                        {/* All Time Low */}
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            style={{
                              color: '#82828f',
                              textAlign: 'center',
                              borderBottomWidth: 0.5,
                              borderBottomColor: '#82828f',
                              fontSize: 14,
                            }}
                          >
                            All Time Low
                          </Text>
                          <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 13, color: "white" }}>
                            $ {state.allTimeLow}
                          </Text>
                        </View>

                        {/* Fully Diluted Value */}
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Text
                            style={{
                              color: '#82828f',
                              textAlign: 'center',
                              borderBottomWidth: 0.5,
                              borderBottomColor: '#82828f',
                              fontSize: 14,
                            }}
                          >
                            Fully Diluted Value
                          </Text>
                          <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 13, color: "white" }}>
                            $ {state.fully_diluted_valuation}
                          </Text>
                        </View>

                        {/* Total Volume Locked */}
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 5,
                          }}
                        >
                          <Text
                            style={{
                              color: '#82828f',
                              textAlign: 'center',
                              borderBottomWidth: 0.5,
                              borderBottomColor: '#82828f',
                              fontSize: 14,
                            }}
                          >
                            Total Volume Locked
                          </Text>
                          <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 13, color: "white" }}>
                            $ {state.totalVolume}
                          </Text>
                        </View>
                      </View>
                      {/* <View
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: '#282A2F',
                          marginVertical: 12,
                        }}
                      ></View>
                      <Text
                        style={{
                          color: '#ffffff',
                          fontSize: 16,
                          fontWeight: 'bold',
                          letterSpacing: 0.1,
                          marginBottom: 5,
                        }}
                      >
                        Resources
                      </Text>
                      <Text
                        style={{
                          color: '#4F9CD9',
                          fontSize: 14,
                          textDecorationLine: 'underline',
                          marginBottom: 5,
                        }}
                        onPress={() => Linking.openURL('https://bitcoin.org/')}
                      >
                        https://bitcoin.org/
                      </Text>
                      <Text
                        style={{
                          color: '#4F9CD9',
                          fontSize: 14,
                          textDecorationLine: 'underline',
                          marginBottom: 5,
                        }}
                        onPress={() => Linking.openURL('https://blog.bitcoin.com/')}
                      >
                        https://blog.bitcoin.com/
                      </Text> */}
                    </View>

                    :
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
              }
            </View>

            {/*
                <View style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 20
                }}>
                  <TouchableOpacity
                    onPress={() =>
                      Snackbar.show({ 'text': 'Coming soon' })
                      // tradeApi()

                    }
                    style={{
                      borderRadius: 6,
                      backgroundColor: '#5038E1',
                      paddingHorizontal: 50,
                      paddingVertical: 10,

                    }}>
                    <Text style={{
                      color: '#fff',
                      fontFamily: 'Sarala-Bold',
                      fontSize: 16
                    }}>Continue</Text>
                  </TouchableOpacity>
                </View>
*/}
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
}

const ReadMoreLess = ({ text, maxChars }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const displayText = isExpanded ? text : `${text.slice(0, maxChars)}`;

  return (
    <View>
      <Text style={{ margin: 0, marginTop: 10, marginBottom: 8, color: "white" }}>{displayText}</Text>
      {text.length > maxChars && (
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={{ color: '#4F9CD9', fontWeight: 'bold', fontSize: 12, cursor: 'pointer' }}>
            {isExpanded ? 'Read Less' : 'Read More'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MarketChart;
