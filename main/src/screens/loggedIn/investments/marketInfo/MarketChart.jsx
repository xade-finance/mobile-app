import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {Text, Icon} from '@rneui/themed';
import {Slider} from 'react-native-elements';
import styles from '../investment-styles';
// import BottomNavbar from '../../navbar';
// import getSpotPrice from './backend/viewFunctions';
// import transactions from './backend/txFunctions';
// import FastImage from 'react-native-fast-image';
import BTC from '../data_old.json';
import { ethers } from 'ethers';

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

function toDateTime(secs) {
  var t = new Date(secs); // Epoch
  console.log(t.toLocaleDateString('en-US'));
  return t;
}

red = true;
class MarketChart extends React.Component {
  constructor(props) {
    super(props);

    console.log(this.props);
    console.log(';--------');
    this.state = {
      item : this.props.item,
      scwAddress: this.props.scwAddress,
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
    };
    this.updateChart = this.updateChart.bind(this);
  }


  // test() {
  //   let web3;
  //   if (global.withAuth) {
  //     user = global.loginAccount.publicAddress;
  //     console.log('Global Account:', authAddress);
  //     web3 = this.createProvider();
  //     console.log(web3);
  //   } else {
  //     authAddress = global.connectAccount.publicAddress;
  //     console.log('Global Account:', global.connectAccount);
  //     console.log('Global Wallet Type:', global.walletType);
  //   }
  // }

  async updateChart(days) {
    this.setState({
      chartSelected: days,
    });

    let btcInfoUrl = `https://api.coingecko.com/api/v3/coins/${this.state.item.id.toLowerCase()}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

    let btcUrl = `https://api.coingecko.com/api/v3/coins/${this.state.item.id.toLowerCase()}/market_chart?vs_currency=usd&days=${days}`;

    await fetch(btcUrl)
      .then(response => response.json())
      .then(prices => {
        // console.log(prices.market_caps[0]);
        this.setState({
          data: prices.market_caps,
        });
      });

    await fetch(btcInfoUrl)
      .then(response => response.json())
      .then(info => {
        this.setState({
          marketCap: info.market_data.market_cap.usd,
          totalVolume: info.market_data.total_volume.usd,
          allTimeHigh: info.market_data.ath.usd,
          allTimeLow: info.market_data.atl.usd,
          price: info.market_data.current_price.usd.toFixed(3).toString(),
          buyPrice: info.market_data.current_price.usd.toFixed(3).toString(),
          nBtc: 1.0,
          priceChangePercentage:
            this.state.chartSelected == '1'
              ? info.market_data.price_change_percentage_24h
              : this.state.chartSelected == '14'
              ? info.market_data.price_change_percentage_14d
              : this.state.chartSelected == '60'
              ? info.market_data.price_change_percentage_60d
              : this.state.chartSelected == '180'
              ? info.market_data.price_change_percentage_200d
              : info.market_data.price_change_percentage_1y,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  btcFirst = () => {
    if (this.state.status == true) {
      this.setState({status: false});
    } else {
      this.setState({status: true});
    }
  };

  async fetchUserDetails() {
    try{
      const mainnetJSON = await AsyncStorage.getItem('mainnet');
      const mainnet = JSON.parse(mainnetJSON);
      console.log('=-=======');

      if (global.withAuth) {
          authAddress = global.loginAccount.publicAddress;
          const scwAddress = global.loginAccount.scw;
          console.log(scwAddress);
          this.setState({
            address: scwAddress
          });

      } else {
          authAddress = global.connectAccount.publicAddress;
          const scwAddress = global.connectAccount.publicAddress;
          this.setState({
            address: scwAddress
          });
      }

      // fetch selected coin contract address

    }catch(e){
        console.log(e);
    }
  }

  async tradeApi() {
    try{

      const from = (this.state.status) ? 'USD' :  this.state.item.symbol.toUpperCase();
      const _makingAmount = (this.state.status) ? this.state.buyPrice : (this.state.buyPrice/ this.state.price);
      const _takingAmount = (this.state.status) ? (this.state.buyPrice/ this.state.price) : this.state.buyPrice;

      const makingAmount = ethers.utils.parseUnits(_makingAmount.toString(), 6);
      const takingAmount = ethers.utils.parseUnits(_takingAmount.toString(), 18);

      // fetch token detail here



      const makerAsset = (from === 'USD') ? '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' : '0x0000000000000000000000000000000000001010';
      const takerAsset = (from === 'USD') ? '0x0000000000000000000000000000000000001010' : '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'

      // approve the coin here



      // Call kyber market order api here

      console.log(Math.floor(Date.now() / 1000) + 60 * 60);

      const postData = {
        "chainId": "137",
        "makerAsset": makerAsset,
        "takerAsset": takerAsset,
        "maker": this.state.scwAddress,
        "allowedSenders": [
          this.state.scwAddress
        ],
        "makingAmount": Number(makingAmount).toString(),
        "takingAmount": Number(takingAmount).toString(),
        "expiredAt": Math.floor(Date.now() / 1000) + 60 * 60
      }

      console.log(postData);
      const json = JSON.stringify(postData || {}, null, 2);

      console.log(json);

      await fetch('https://limit-order.kyberswap.com/write/api/v1/orders/sign-message', {
        method: 'POST',
        body: json,
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(function (response) {
        console.log(response);
        if (response.status == 200) {
          return response.text();
        } else return '';
      })
      .then(async data => {
        console.log(data);
      });

    }catch(e) {
      console.log(e);
    } 
  }

  componentDidMount() {
    this.updateChart('1');
    this.fetchUserDetails();
    // console.log(BTC.image.large);
    // console.log(getSpotPrice('BTC'));
    // console.log(BTC.prices.map(price => toDateTime(Number(price[0]))));
  }

  render(navigation) {
    // events.test();
    try {
      return (
        <View style={styles.black}>
          <ScrollView>
            <SafeAreaView>
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
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.stockHead}>{this.state.item.name}</Text>
                        </View>
                      </View>
                      <View style={styles.stockPriceContainer}>
                        <Text style={styles.stockPrice}>
                          ${this.state.price.toLocaleString()}
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
                          style={{flexDirection: 'row', alignItems: 'flex-end', marginLeft:'5%'}}>
                          <Icon
                            name={
                              this.state.priceChangePercentage > 0
                                ? 'caretup'
                                : 'caretdown'
                            }
                            type="antdesign"
                            color={
                              this.state.priceChangePercentage > 0
                                ? '#2FBE6A'
                                : '#E14C4C'
                            }
                            size={20}
                          />
                          <Text
                            style={{
                              color:
                                this.state.priceChangePercentage > 0
                                  ? '#2FBE6A'
                                  : '#E14C4C',
                              fontFamily: `Sarala-Regular`,
                              fontSize: 16,
                              marginLeft: '1%',
                              alignItems:'center'
                            }}>
                            {this.state.priceChangePercentage.toFixed(2)}% (24h)
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
                              data: this.state.data.map(price =>
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
                          this.updateChart('1');
                        }}
                        style={
                          this.state.chartSelected == '1'
                            ? styles.goldSelected
                            : styles.chartComponents
                        }>
                        <Text
                          style={
                            this.state.chartSelected == '1'
                              ? styles.navSelectedText
                              : styles.chartText
                          }>
                          1D
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.updateChart('14');
                        }}
                        style={
                          this.state.chartSelected == '14'
                            ? styles.goldSelected
                            : styles.chartComponents
                        }>
                        <Text
                          style={
                            this.state.chartSelected == '14'
                              ? styles.navSelectedText
                              : styles.chartText
                          }>
                          2W
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.updateChart('60');
                        }}
                        style={
                          this.state.chartSelected == '60'
                            ? styles.goldSelected
                            : styles.chartComponents
                        }>
                        <Text
                          style={
                            this.state.chartSelected == '60'
                              ? styles.navSelectedText
                              : styles.chartText
                          }>
                          2M
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.updateChart('180');
                        }}
                        style={
                          this.state.chartSelected == '180'
                            ? styles.goldSelected
                            : styles.chartComponents
                        }>
                        <Text
                          style={
                            this.state.chartSelected == '180'
                              ? styles.navSelectedText
                              : styles.chartText
                          }>
                          6M
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          await this.updateChart('365');
                        }}
                        style={
                          this.state.chartSelected == '365'
                            ? styles.goldSelected
                            : styles.chartComponents
                        }>
                        <Text
                          style={
                            this.state.chartSelected == '365'
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
                            ${this.state.allTimeHigh}
                          </Text>
                        </View>
                        <View style={{marginTop: 15}}>
                          <Text style={styles.marketCapInfo}>Market Cap</Text>
                          <Text style={styles.marketCapData}>
                            ${this.state.marketCap.toLocaleString()}
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
                            {this.state.totalVolume.toLocaleString()}
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
                  // this.state.btnSelected == 'long' ||
                  // this.state.btnSelected == 'short'
                    // ? 
                    styles.longshortContainer
                    // : {display: 'none'}
                }>
                {/* <View style={styles.priceSlippage}>
                  <View style={styles.price}>
                    <View style={styles.subContents}>
                      <Text style={styles.subText}>Price</Text>
                      <TextInput
                        //    onPress={this.updatePrice()}
                        editable={false}
                        style={styles.subPrice}
                        placeholderTextColor={'#C4C4C4'}
                        value={this.state.price}
                        onChangeText={newText =>
                          this.setState({price: newText})
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
                <View style={styles.btcUsd}>
                  <View style={styles.btc}>
                    <View style={styles.subContents}>
                      <Text style={styles.subBtc}>You Sell</Text>
                      {this.state.status ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <TextInput
                            //    onPress={this.updatePrice()}
                            keyboardType='numeric'
                            style={styles.subPriceBtc}
                            placeholderTextColor={'#C4C4C4'}
                            value={this.state.buyPrice}
                            onChangeText={newText =>
                              this.setState({buyPrice: newText})
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
                              //    onPress={this.updatePrice()}
                              style={styles.subPriceBtc}
                              placeholderTextColor={'#C4C4C4'}
                              value={this.state.nBtc.toString()}
                              onChangeText={newText =>
                                this.setState({
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
                              {this.state.item.symbol.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.usd}>
                    <TouchableOpacity
                      onPress={() => this.btcFirst()}
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
                      {this.state.status ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text style={styles.subPriceBtc}>
                            {(
                              Number(this.state.buyPrice) /
                              Number(this.state.price)
                            ).toFixed(3)}
                          </Text>
                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 25,
                              fontFamily: `Sarala-Bold`,
                              marginTop: '-1%',
                            }}>
                            {this.state.item.symbol.toUpperCase()}
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
                                Number(this.state.nBtc) *
                                Number(this.state.price)
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
                </View>
                {/* <View style={styles.leverage}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.leverageText}>Leverage</Text>
                    <Text style={styles.leverageIndicator}>
                      {this.state.leverageValue}x
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
                    value={this.state.leverageValue}
                    onValueChange={value =>
                      this.setState({leverageValue: value})
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
                    <Text style={styles.orderAmount}>${this.state.price}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}>
                    <Text style={styles.orderDescription}>Index Price</Text>
                    <Text style={styles.orderAmount}>
                      ${this.state.buyPrice}
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

                <View style={{
                  flex:1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop:20
                }}>
                  <TouchableOpacity 
                    onPress={() => 
                      Snackbar.show({'text' : 'Coming soon'})
                      // this.tradeApi()
                    
                    }
                  style={{
                    borderRadius: 6,
                    backgroundColor: '#5038E1',
                    paddingHorizontal:50,
                    paddingVertical:10,
                    
                  }}>
                    <Text style={{
                      color: '#fff',
                      fontFamily: 'Sarala-Bold',
                      fontSize: 16
                    }}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
          
        </View>
      );
    } catch (err) {
      console.log(err);
    }
  }
}

export default MarketChart;
