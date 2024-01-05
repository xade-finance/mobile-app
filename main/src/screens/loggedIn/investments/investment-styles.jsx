import {Platform, Dimensions, StyleSheet} from 'react-native';

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  black: {
    backgroundColor: '#000',
    // width: '100%',
    // height: '100%',
  },

  logo: {
    fontFamily: 'Sarala-Bold',
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
    fontFamily: 'Sarala-Bold',
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
    color: '#787878',
    fontFamily: 'Sarala-Bold',
  },

  navSelectedText: {
    color: '#fff',
    fontFamily: 'Sarala-Bold',
  },

  marketText: {
    color: 'grey',
    fontFamily: `Sarala-Regular`,
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
    marginTop: 1,
  },

  subText: {
    color: '#868686',
    fontFamily: `Sarala-Regular`,
    textAlign: 'left',
    fontSize: 15,
  },

  subBtc: {
    color: '#868686',
    fontFamily: `Sarala-Regular`,
    textAlign: 'left',
    fontSize: 17.5,
  },

  subPrice: {
    fontFamily: `Sarala-Bold`,
    textAlign: 'left',
    marginTop: 4,
    fontSize: 26,
    color: '#fff',
    marginBottom: 15,
  },

  subPriceBtc: {
    fontFamily: `Sarala-Bold`,
    textAlign: 'left',
    marginTop: 0,
    fontSize: 24,
    color: '#fff',
    marginBottom: 5,
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
    fontFamily: `Sarala-Regular`,
    fontSize: 23,
  },

  leverageIndicator: {
    marginTop: 7,
    color: '#787777',
    fontSize: 20,
    fontFamily: 'Sarala-Regular',
  },

  orderSummary: {
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Sarala-Bold',
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
    fontFamily: 'Sarala-Bold',
    fontSize: 20,
  },

  summary: {
    marginTop: '5%',
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
    fontFamily: 'Sarala-Bold',
    fontSize: 20,
    marginBottom: '5%',
  },

  orderDescription: {
    color: '#FFF',
    fontFamily: 'Sarala-Regular',
    paddingLeft: '5%',
  },

  orderAmount: {
    color: '#787777',
    fontFamily: 'Sarala-Regular',
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
    fontFamily: `Sarala-Regular`,
    fontSize: 16,
  },

  stockPriceContainer: {
    // marginTop: '2%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  stockPrice: {
    color: '#F0F0F0',
    fontSize: 32,
    fontFamily: `Sarala-Bold`,
    marginLeft: '5%',
  },

  coinChart: {
    // marginTop: '10%',
  },

  chartContainer: {
    marginTop: '10%',
  },

  goldSelected: {
    backgroundColor: '#232323',
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
    fontFamily: 'Sarala-Bold',
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
    fontFamily: `Sarala-Regular`,
    color: '#999',
    fontSize: 15,
  },

  marketCapData: {
    fontFamily: `Sarala-Regular`,
    color: '#FFFFFF',
    fontSize: 23,
  },

  highText: {
    fontFamily: `Sarala-Regular`,
    color: '#2FBE6A',
    fontSize: 25,
  },

  lowText: {
    fontFamily: `Sarala-Regular`,
    color: '#E14C4C',
    fontSize: 25,
  },

  portfolio: {
    marginTop: '20%',
    marginBottom: '20%',
  },

  portfolioText: {
    color: '#fff',
    fontFamily: `Sarala-Regular`,
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

  depWith: {
    flexDirection: 'row',
    height: '100%',
    width: '47%',
    borderRadius: 6,
  },

  innerDepColored: {
    backgroundColor: '#1D1D1D',
  },

  innerDep: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '1%',
    // backgroundColor: '#141414',
  },
});

export default styles;
