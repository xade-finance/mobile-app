import {Platform, Dimensions, StyleSheet} from 'react-native';

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  black: {
    backgroundColor: '#0C0C0C',
    width: '100%',
    height: '100%',
  },

  logo: {
    fontFamily: 'VelaSans-ExtraBold',
    color: '#fff',
    fontSize: 25,
    marginLeft: '8%',
    marginTop: '2%',
    marginBottom: '2%',
  },

  navComponents: {
    borderWidth: 1,
    borderColor: '#747474',
    borderRadius: 50,
    paddingHorizontal: 25,
    paddingVertical: 7,
  },

  navText: {
    color: '#747474',
    fontFamily: 'VelaSans-ExtraBold',
  },

  navSelected: {
    borderWidth: 1,
    borderColor: '#1E1E1E',
    backgroundColor: '#1E1E1E',
    borderRadius: 50,
    paddingHorizontal: 25,
    paddingVertical: 7,
  },

  redSelected: {
    borderWidth: 1,
    borderColor: '#E14C4C',
    backgroundColor: '#E14C4C',
    borderRadius: 50,
    paddingHorizontal: 25,
    paddingVertical: 7,
  },

  greenSelected: {
    borderWidth: 1,
    borderColor: '#2FBE6A',
    backgroundColor: '#2FBE6A',
    borderRadius: 50,
    paddingHorizontal: 25,
    paddingVertical: 7,
  },

  navText: {
    color: '#747474',
    fontFamily: 'VelaSans-ExtraBold',
  },

  navSelectedText: {
    color: '#fff',
    fontFamily: 'VelaSans-ExtraBold',
  },

  marketText: {
    color: 'grey',
    fontFamily: `EuclidCircularA-Regular`,
    textAlign: 'center',
    fontSize: 15,
  },

  priceSlippage: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: '15%',
    width: '90%',
    marginLeft: '5%',
  },

  price: {
    width: '70%',
    backgroundColor: '#1E1E1E',
    borderRadius: 7,
    marginTop: '-7%',
  },

  slippage: {
    marginLeft: '3%',
    width: '25%',
    backgroundColor: '#1E1E1E',
    borderRadius: 7,
    marginTop: '-7%',
  },

  subContents: {
    width: '80%',
    marginLeft: 15,
    marginTop: 15,
  },

  subText: {
    color: '#868686',
    fontFamily: `EuclidCircularA-Medium`,
    textAlign: 'left',
    fontSize: 15,
  },

  subBtc: {
    color: '#868686',
    fontFamily: `EuclidCircularA-Medium`,
    textAlign: 'left',
    fontSize: 17.5,
  },

  subPrice: {
    fontFamily: `EuclidCircularA-SemiBold`,
    textAlign: 'left',
    marginTop: 4,
    fontSize: 26,
    color: '#fff',
    marginBottom: 15,
  },

  subPriceBtc: {
    fontFamily: `EuclidCircularA-SemiBold`,
    textAlign: 'left',
    marginTop: 4,
    fontSize: 30,
    color: '#fff',
    marginBottom: 15,
  },

  btcUsd: {
    width: '90%',
    marginLeft: '5%',
    alignItems: 'center',
    marginTop: '5%',
    position: 'relative',
  },

  btc: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 7,
    padding: '1%',
    flex: 1,
  },

  usd: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 7,
    marginTop: '5%',
    padding: '1%',
  },

  leverage: {
    width: '85%',
    marginLeft: '7.5%',
    marginTop: '5%',
  },

  leverageText: {
    color: '#FFF',
    fontFamily: `EuclidCircularA-Medium`,
    fontSize: 23,
  },

  leverageIndicator: {
    marginTop: 7,
    color: '#787777',
    fontSize: 20,
    fontFamily: 'VelaSans-Medium',
  },

  orderSummary: {
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'VelaSans-ExtraBold',
    marginTop: '3%',
    fontSize: 15,
  },

  longButton: {
    marginBottom: 105,
    backgroundColor: '#2FBE6A',
    paddingVertical: 12,
    width: '80%',
    marginLeft: '10%',
    borderRadius: 10,
  },

  shortButton: {
    marginBottom: 105,
    backgroundColor: '#E14C4C',
    paddingVertical: 12,
    width: '80%',
    marginLeft: '10%',
    borderRadius: 10,
  },

  confirmButton: {
    marginTop: 10,
    marginBottom: Platform.OS == 'ios' ? 42 : 79,
  },

  confirmText: {
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'VelaSans-ExtraBold',
    fontSize: 20,
  },

  summary: {
    marginTop: '15%',
    width: '90%',
    marginLeft: '5%',
    backgroundColor: '#1E1E1E',
    borderRadius: 7,
    paddingBottom: '10%',
  },

  summaryHeader: {
    marginTop: '10%',
    marginLeft: '5%',
    color: '#FFF',
    fontFamily: 'VelaSans-ExtraBold',
    fontSize: 20,
    marginBottom: '5%',
  },

  orderDescription: {
    color: '#FFF',
    fontFamily: 'VelaSans-Medium',
    paddingLeft: '5%',
  },

  orderAmount: {
    color: '#787777',
    fontFamily: 'VelaSans-Medium',
    paddingRight: '5%',
  },

  coinChart: {
    width: '90%',
    marginLeft: '5%',
  },

  marketInfo: {},

  stockName: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5%',
  },

  stockHead: {
    color: '#F0F0F0',
    fontFamily: `EuclidCircularA-Medium`,
    fontSize: 30,
  },

  stockPriceContainer: {
    marginTop: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  stockPrice: {
    color: '#F0F0F0',
    fontSize: 40,
    fontFamily: `EuclidCircularA-Medium`,
    marginLeft: '5%',
  },

  coinChart: {
    marginTop: '10%',
  },

  chartContainer: {
    marginTop: '10%',
  },

  goldSelected: {
    backgroundColor: '#CC9900',
    borderRadius: 50,
    paddingHorizontal: 25,
    paddingVertical: 7,
  },

  chartComponents: {
    borderRadius: 50,
    paddingHorizontal: 25,
    paddingVertical: 7,
  },

  chartText: {
    color: '#747474',
    fontFamily: 'VelaSans-ExtraBold',
  },

  additionalInfo: {
    width: '90%',
    marginLeft: '5%',
    marginTop: '2%',
    flexDirection: 'row',
  },

  column1: {
    flexDirection: 'column',
  },

  column2: {
    flexDirection: 'column',
    marginLeft: '3%',
  },

  marketCapInfo: {
    fontFamily: `EuclidCircularA-Medium`,
    color: '#999',
    fontSize: 15,
  },

  marketCapData: {
    fontFamily: `EuclidCircularA-Medium`,
    color: '#FFFFFF',
    fontSize: 23,
  },

  highText: {
    fontFamily: `EuclidCircularA-Medium`,
    color: '#2FBE6A',
    fontSize: 25,
  },

  lowText: {
    fontFamily: `EuclidCircularA-Medium`,
    color: '#E14C4C',
    fontSize: 25,
  },

  portfolio: {
    marginTop: '20%',
    marginBottom: '20%',
  },

  portfolioText: {
    color: '#fff',
    fontFamily: `EuclidCircularA-Medium`,
    fontSize: 30,
    marginLeft: '5%',
  },

  marketTrades: {
    width: '90%',
    marginLeft: '5%',
    backgroundColor: '#1E1E1E',
    borderRadius: 7,
    height: 270,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
  },

  positions: {
    marginTop: '10%',
    width: '90%',
    marginLeft: '5%',
    backgroundColor: '#1E1E1E',
    borderRadius: 7,
    height: 270,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
