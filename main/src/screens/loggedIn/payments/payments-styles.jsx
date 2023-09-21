import {StyleSheet, Platform} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  remmitexContainer: {
    width: '100%',
    marginVertical: '2%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  balanceContainer: {
    // width: '100%',
    // paddingLeft: '6%',
    alignItems: 'center',
    // paddingBottom:'2%',
    backgroundColor: '#131313',
    marginHorizontal:15,
    marginVertical: 5,
    borderRadius: 6,
    paddingVertical:10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },

  sendRequest: {
    width: '55%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: '#151A28',
  },

  depositButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: '#151A28',
    marginLeft: '5%',
  },

  exploreContainer: {
//    marginTop:32,
    marginTop: '10%',
    // marginHorizontal:'5%',
    // width: '100%',
    flexDirection: 'column',
  },

  transactionContainer: {
    marginTop: '7%',
    // width: '100%',
    marginHorizontal:15,
    flexDirection: 'column',
    paddingBottom: 10,
    paddingTop:10,
    borderRadius: 6,
    backgroundColor:'#131313'
  },

  txHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  transactions: {
    width: '100%',
    // marginHorizontal: '4%',
    marginVertical: '2%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 6,
    // backgroundColor: '#151515',
  },

  transactionLeft: {
    flexDirection: 'row',
    alignItems:'center'
  },

  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
    justifyContent: 'flex-end',
    textAlign: 'center',
    alignContent: 'flex-end',
    // alignSelf : 'right',
  },

  tup: {
    backgroundColor: 'rgba(49,59,62, 0.4)',
    borderRadius: 10,
    padding: 4,
  },

  ttext: {
    marginLeft: 15,
    marginTop: 5,
  },

  depWith: {
    flexDirection: 'row',
    height: '100%',
    width: '47%',
    borderRadius: 6,
  },

  innerDepColored: {
    backgroundColor: '#5038E1'
  },

  innerDep: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '1%',
    backgroundColor: '#141414',
  },

  noTransaction: {
    color: '#d9d9d9',
    marginTop: '7%',
    textAlign: 'center',
    fontFamily: 'Sarala-Regular',
    // fontFamily: `EuclidCircularA-Medium`,
    fontSize: 17,
  },

  dates: {
    color: '#6D797D',
    fontSize: 17,
    fontFamily: 'Sarala-Regular',
    // fontFamily: `EuclidCircularA-Medium`,
    marginLeft: '5%',
  },

  // topbar: {
  //   position: 'absolute',
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   top: 0,
  //   left: 0,
  //   width: '90%',
  //   marginLeft: '5%',
  //   backgroundColor: '#0C0C0C',
  // },

  // logo: {
  //   fontFamily: 'VelaSans-ExtraBold',
  //   color: '#fff',
  //   fontSize: 25,
  //   // marginLeft: '5%',
  //   marginBottom: '2%',
  // },

  // mainContent: {
  //   marginTop: '20%',
  //   width: '100%',
  //   backgroundColor: 'transparent',
  // },

  // topContent: {
  //   width: '100%',
  //   backgroundColor: 'transparent',
  // },

  // launch: {
  //   color: '#fff',
  //   fontFamily: 'NeueMontreal-Bold',
  //   textAlign: 'center',
  //   fontSize: 25,
  //   marginTop: '10%',
  // },

  // countdown: {
  //   marginTop: '25%',
  //   width: '100%',
  // },

  // digits: {
  //   fontFamily: 'NeueMachina-UltraBold',
  //   color: '#E8FF59',
  // },

  // timeLabels: {
  //   color: '#fff',
  //   fontFamily: 'NeueMachina-UltraBold',
  // },

  // subText: {
  //   color: '#999',
  //   fontFamily: 'VelaSans-Bold',
  //   textAlign: 'center',
  //   fontSize: 17,
  //   marginTop: '30%',
  // },

  // button: {
  //   height: '30%',
  //   width: '70%',
  //   borderRadius: 50,
  //   marginLeft: '15%',
  //   marginTop: '20%',
  //   paddingVertical: '5%',
  //   backgroundColor: '#0C0C0C',
  // },

  // buttonText: {
  //   color: '#fff',
  //   fontFamily: 'VelaSans-Medium',
  //   fontSize: 15,
  //   textAlign: 'center',
  // },

  // fontContainer: {
  //   alignItems: 'center',
  //   // marginTop: '17%',
  // },

  // buttonsContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   paddingLeft: 10,
  //   width: '100%',
  //   height: 60,
  //   // backgroundColor: 'white',
  // },

  // qrButton: {
  //   width: '15%',
  //   color: '#0C0C0C',
  //   borderRadius: 15,
  //   marginLeft: '1%',
  //   padding: '5%',
  //   backgroundColor: '#E8FF59',
  //   marginBottom: '5%',
  //   height: '100%',
  // },

  // mainButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   width: '37%',
  //   color: '#0C0C0C',
  //   borderRadius: 15,
  //   marginRight: '4%',
  //   padding: '0%',
  //   backgroundColor: '#E8FF59',
  //   marginBottom: '5%',
  //   height: '100%',
  //   backgroundColor: '#d9d9d9',
  //   shadowColor: '#0C0C0C',
  //   shadowOpacity: 0.8,
  //   shadowRadius: 10,
  //   shadowOffset: {
  //     height: 1,
  //     width: 1,
  //   },
  // },

  // buttonIcon: {
  //   borderRadius: 15,
  //   //   backgroundColor: 'blue',
  //   height: '100%',
  //   width: '40%',
  // },

  // buttonText: {
  //   marginRight: '20%',
  // },


  paymentActionContainer: {
    marginTop: '5%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly', 
    marginVertical: 10
  },

  paymentActionButton : {
    padding: 20,
    borderRadius: 20
  },

  transferButton : {
    backgroundColor: '#230D0F',
    color: '#DD6060'
  },

  depositButton : {
    backgroundColor: '#0E2216',
    color: '#66FF88'
  },

  scanQRButton : {
    backgroundColor: '#230E1D',
    color: '#FC66FF'
  }

});

export default styles;
