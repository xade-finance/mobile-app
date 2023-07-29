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

class EventsCarousel extends React.Component {
  scrollRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
    };
    this.scrollRef = React.createRef();
  }
  review = () => {
    Linking.openURL(
      'https://twitter.com/intent/tweet?text=%23XadeReview%20%23XADE%0a',
    );
  };
  func = () => {
    Clipboard.setString(
      `
Xade is reshaping finance with its super decentralised bank powered by DeFi where you can help us both earn Xade Coins by joining Xade using my refer code: ${
        global.withAuth
          ? global.loginAccount.scw
          : global.connectAccount.publicAddress
      }

Download Now: https://bit.ly/xadefinance
`,
    );

    Alert.alert('Referral link copied');
  };
  componentDidMount = () => {
    setInterval(() => {
      this.setState(
        prev => ({
          selectedIndex:
            prev.selectedIndex === this.props.images.length - 1
              ? 0
              : prev.selectedIndex + 1,
        }),
        () => {
          this.scrollRef.current.scrollTo({
            animated: true,
            x: DEVICE_WIDTH * this.state.selectedIndex,
            y: 0,
          });
        },
      );
    }, 3000);
  };

  setSelectedIndex = event => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    const selectedIndex = Math.floor(contentOffset.x / viewSize.width);
    this.setState({selectedIndex});
  };

  render(navigation) {
    const {images} = this.props;
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
        {images.map(imageGroups =>
          imageGroups.map(image => (
            <View style={styles.depWith}>
              <TouchableOpacity
                style={styles.depFurther}
                key={image.name}
                onPress={() => {
                  image.name == 'Referrals'
                    ? this.func()
                    : image.name == 'Review'
                    ? this.review()
                    : Linking.openURL(image.link);
                }}>
                <FastImage
                  source={{
                    uri: image.image,
                  }}
                  resizeMode="cover"
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: 10,
                  }}
                />
              </TouchableOpacity>
            </View>
          )),
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  depWith: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: DEVICE_WIDTH / 2,
  },
});

export {EventsCarousel};
