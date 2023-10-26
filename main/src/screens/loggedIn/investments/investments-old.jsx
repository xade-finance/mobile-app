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
import styles from './investment-styles';
import BottomNavbar from '../../navbar';
import getSpotPrice from './backend/viewFunctions';
import transactions from './backend/txFunctions';
import FastImage from 'react-native-fast-image';
import BTC from './data';

const screenWidth = Dimensions.get('window').width;

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

function toDateTime(secs) {
  var t = new Date(secs); // Epoch
  console.log(t.toLocaleDateString('en-US'));
  return t;
}

red = true;
class Investments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

    let btcInfoUrl = `https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

    let btcUrl = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`;

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

  componentDidMount() {
    this.updateChart('1');
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
                <View
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
                </View>
                <View
                  style={
                    this.state.btnSelected == 'long' ||
                    this.state.btnSelected == 'short'
                      ? {display: 'none'}
                      : styles.longshortContainer
                  }>
                  <View style={styles.coinChart}>
                    <View style={styles.marketInfo}>
                      <View style={styles.stockName}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.stockHead}>Bitcoin</Text>
                        </View>
                      </View>
                      <View style={styles.stockPriceContainer}>
                        <Text style={styles.stockPrice}>
                          <Text style={{color: 'grey'}}>$</Text>
                          {this.state.price.toLocaleString()}
                        </Text>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
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
                              fontFamily: `EuclidCircularA-Bold`,
                              fontSize: 20,
                              marginLeft: '5%',
                            }}>
                            {this.state.priceChangePercentage.toFixed(2)}%
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.chartContainer}>
                      <LineChart
                        // bezier
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
                          backgroundColor: '#0C0C0C',
                          backgroundGradientToOpacity: 1,
                          backgroundGradientFrom: '#0C0C0C',
                          backgroundGradientTo: '#0C0C0C',
                          useShadowColorFromDataset: false, // optional
                          barPercentage: 1,
                          barRadius: 360,
                          fillShadowGradientFromOpacity: 0,
                          fillShadowGradientToOpacity: 0,
                          strokeWidth: 2,
                          propsForBackgroundLines: {
                            strokeWidth: 0,
                          },

                          color: (opacity = 0) => '#CC9900',
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
                    <View style={styles.additionalInfo}>
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
                    </View>
                  </View>
                  <View style={styles.portfolio}>
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
                  </View>
                </View>
              </View>
              <View
                style={
                  this.state.btnSelected == 'long' ||
                  this.state.btnSelected == 'short'
                    ? styles.longshortContainer
                    : {display: 'none'}
                }>
                <View style={styles.priceSlippage}>
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
                </View>
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
                              fontSize: 25,
                              fontFamily: `EuclidCircularA-Bold`,
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
                                color: '#ffd700',
                                fontSize: 25,
                                fontFamily: `EuclidCircularA-Bold`,
                                marginTop: '-1%',
                              }}>
                              BTC
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
                              color: '#ffd700',
                              fontSize: 25,
                              fontFamily: `EuclidCircularA-Bold`,
                              marginTop: '-1%',
                            }}>
                            BTC
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
                                fontFamily: `EuclidCircularA-Bold`,
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
                <View style={styles.leverage}>
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
                </View>
                <View>
                  <Text style={styles.orderSummary}>
                    Scroll To See Order Summary
                  </Text>
                </View>
                <View style={styles.summary}>
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
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
          <View style={styles.confirmButton}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ComingSoon')}
              style={
                this.state.btnSelected == 'long' ||
                this.state.btnSelected == 'short'
                  ? this.state.btnSelected == 'short'
                    ? styles.shortButton
                    : styles.longButton
                  : {display: 'none'}
              }>
              {this.state.btnSelected == 'short' ? (
                <Text style={styles.confirmText}>Coming Soon!</Text>
              ) : (
                <Text style={styles.confirmText}>Coming Soon!</Text>
              )}
            </TouchableOpacity>
            <BottomNavbar
              navigation={this.props.navigation}
              selected="Investments"
            />
          </View>
        </View>
      );
    } catch (err) {
      console.log(err);
    }
  }
}

export default Investments;
