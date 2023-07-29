import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    // borderWidth: 1,
    // borderColor: 'rgba(128,128,128, 0.5)',
    // borderRadius: 50,
    // borderTopRightRadius: 0,
    // borderTopLeftRadius: 0,
    // borderBottomWidth: 0,
    // borderRightWidth: 0,
    // borderLeftWidth: 0,
    // borderTopWidth: 0,
    // flex: 0.5,
    // height: '70%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0C0C0C'
  },

  row: {
    flexDirection: 'row',
    borderColor: 'grey',
  },
  button: {
    width: 90,
    height: 65,
    borderRadius: 25,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
});

export default styles;
