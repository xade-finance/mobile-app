import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '50%',
  },

  topbar: {
    width: '100%',
    backgroundColor: 'transparent',
  },

  logo: {
    fontFamily: 'LemonMilk-Regular',
    color: '#fff',
    fontSize: 30,
    marginLeft: '8%',
    marginTop: '2%',
  },

  mainContent: {
    marginTop: '20%',
    width: '100%',
    backgroundColor: 'transparent',
  },

  topContent: {
    width: '100%',
    backgroundColor: 'transparent',
  },

  launch: {
    color: '#fff',
    fontFamily: 'NeueMontreal-Bold',
    textAlign: 'center',
    fontSize: 25,
  },

  countdown: {
    marginTop: '25%',
    width: '100%',
  },

  digits: {
    fontFamily: 'NeueMachina-UltraBold',
    color: '#E8FF59',
  },

  timeLabels: {
    color: '#fff',
    fontFamily: 'NeueMachina-UltraBold',
  },

  subText: {
    color: '#999',
    fontFamily: 'VelaSans-Bold',
    textAlign: 'center',
    fontSize: 17,
    marginTop: '30%',
  },

  button: {
    width: '70%',
    borderRadius: 50,
    marginLeft: '15%',
    marginTop: '20%',
    paddingVertical: '5%',
    backgroundColor: '#000',
  },

  buttonText: {
    color: '#fff',
    fontFamily: 'VelaSans-Medium',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default styles;
