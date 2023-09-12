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
import SvgUri from 'react-native-svg-uri';

import ContributeSvg from './icon/contribute.svg';
import QuestSvg from './icon/quest.svg';
import ReferralSvg from './icon/referral.svg';
import PremiumSvg from './icon/subscribe.svg';
import QuestIcon from './icon/questIcon';

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
      'https://tally.so/r/w7LEV0',
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
          // marginTop: '4%',
          flexDirection: 'row',
          // width: DEVICE_WIDTH,
        }}>
          <View style={styles.depWith}>
            <TouchableOpacity
              style={styles.depFurther}
              onPress={() => {
                Linking.openURL('https://xadefinance.crew3.xyz/invite/OEL6nx6wDDIxAFsZVHPsv');
              }}>
              <View style={styles.actionContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>
                    Complete quests
                  </Text>
                  <Text style={styles.descriptionText}>
                    To get Xade coins & amazing rewards for free
                  </Text>
                </View>
                <View>
                  <QuestIcon />
                </View>

              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.depWith}>
            <TouchableOpacity
              style={styles.depFurther}
              onPress={() => {
                Linking.openURL('https://explorers.xade.finance/');
              }}>
              <View style={styles.actionContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>
                    Get Premium
                  </Text>
                  <Text style={styles.descriptionText}>
                    To get everything from the new era of banking
                  </Text>
                </View>
                <View>
                  <SvgUri
                    width="54"
                    height="54"
                    svgXmlData={PremiumSvg}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.depWith}>
            <TouchableOpacity
              style={styles.depFurther}
              onPress={() => {
               this.review();
            }}>
              <View style={styles.actionContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.titleText}>
                    Contribute
                  </Text>
                  <Text style={styles.descriptionText}>
                    Help Xade community grow and exclusive perks
                  </Text>
                </View>
                <SvgUri
                  width="54"
                  height="54"
                  svgXmlData={ContributeSvg}
                />
                {/* <FastImage
                  source={require('./icon/contribute.png')}
                  resizeMode="cover"
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 10, 
                  }}
                /> */}
              </View>
            </TouchableOpacity>
          </View>

        <View style={styles.depWith}>
          <TouchableOpacity
            style={styles.depFurther}
            onPress={() => {
              this.func()
            }}>
            <View style={styles.actionContainer}>
              <View style={styles.textContainer}>
                <Text style={styles.titleText}>
                  Invite friends
                </Text>
                <Text style={styles.descriptionText}>
                  To become a part of Xade referral program
                </Text>
              </View>
              <SvgUri
                  width="54"
                  height="54"
                  svgXmlData={ReferralSvg}
                />
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  depWith: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: DEVICE_WIDTH - '30',
    marginHorizontal : 15,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor:'#131313',
    // borderStyle: 'dashed',
    // borderWidth: 1,
    // borderColor: '#8e8e8e',
    borderRadius: 6
  },
  titleText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: `Sarala-Bold`,
    fontWeight: 700
  },
  descriptionText: {
    fontSize: 14,
    color: '#b9b9b9',
    fontFamily: `Sarala-Regular`,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems:'center',
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    width: '70%'
  }
});

export {EventsCarousel};
