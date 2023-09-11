import * as React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const DEVICE_WIDTH = Dimensions.get('window').width;
import Clipboard from '@react-native-clipboard/clipboard';
import FastImage from 'react-native-fast-image';

class BreakdownCarousel extends React.Component {
  scrollRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
    this.scrollRef = React.createRef();
  }

  componentDidMount = () => {
    // setInterval(() => {
    //   this.setState(
    //     prev => ({
    //       selectedIndex:
    //         prev.selectedIndex === this.props.breakdowns.length - 1
    //           ? 0
    //           : prev.selectedIndex + 1,
    //     }),
    //     () => {
    //       this.scrollRef.current.scrollTo({
    //         animated: true,
    //         x: DEVICE_WIDTH * this.state.selectedIndex,
    //         y: 0,
    //       });
    //     },
    //   );
    // }, 3000);
  };

  setSelectedIndex = event => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    const selectedIndex = Math.floor(contentOffset.x / viewSize.width);
    this.setState({selectedIndex});
  };

  render(navigation) {
    const {breakdowns} = this.props;
    const {selectedIndex} = this.state;
    return (
      <ScrollView
        horizontal
        pagingEnabled
        ref={this.scrollRef}
        style={{
          marginTop: '4%',
          flexDirection: 'row',
          width: DEVICE_WIDTH,
        }}>
        {breakdowns.map(breakdown => (
          <View style={styles.depWith} key={breakdown.key}>
            <TouchableOpacity
              style={styles.depFurther}
              key={breakdown.name}
              >
                <View style={styles.actionContainer}>
                  <FastImage
                    source={{
                        uri: breakdown.image
                    }}
                    resizeMode="cover"
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius:50, 
                    }}
                  />
                  <View style={styles.textContainer}>
                    <Text style={styles.breakdownValue}>
                      {breakdown.value}
                    </Text>
                    <Text style={styles.breakdownName}>
                      {breakdown.name}
                    </Text>
                  </View>
                  
                </View>
              </TouchableOpacity>
            </View>
          ),
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  depWith: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 140,
    marginHorizontal:10,
    paddingVertical: 15,
    backgroundColor: '#131313',
    borderRadius: 10
  },
  actionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignContent: 'flex-start',
  },
  textContainer: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  
  breakdownValue : {
    color: '#FFFFFF',
    fontFamily: `EuclidCircularA-Medium`,
    fontSize: 24,
  },

  breakdownName : {
    color: '#7F7F7F',
    fontFamily: `EuclidCircularA-Medium`,
    fontSize: 14,
  },
});

export {BreakdownCarousel};
