/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Dimensions, ImageBackground} from 'react-native';
import {Text, Box, VStack, Heading, View} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

// helpers
import styleConst from '../../core/style-const';
import { background } from 'native-base/lib/typescript/theme/styled-system';

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  block: {
    marginVertical: 10,
    marginLeft: 10,
  },
  badgeService: {
    color: '#FFFFFF',
    background: '#FB4D3D',
  },
  badgeCars: {
    color: '#FFFFFF',
    background: '#7765E3',
  },
});

const deviceWidth = Dimensions.get('window').width;
const cardWidth = deviceWidth - 20;
const imgHeight = 200;

const NotificationItem = props => {
  const {date, title, img, text, colorBackground, borderBackgroundSource} = props;

  return (
    <Box
      border="1"
      shadow="2"
      flex={1}
      // backgroundColor={styleConst.color.blue}
      style={[styles.block, {width: cardWidth}]}>
      <View
        rounded={'md'}
        flex={1}
        style={{borderRadius: styleConst.borderRadius}}>
        <ImageBackground
          source={borderBackgroundSource}
          borderRadius={styleConst.borderRadius}
          objectFit={'fill'}
          alt="image">
          <Box
            background={styleConst.color.accordeonGrey1}
            ml={1}
            rounded={'md'}>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              locations={[0.5, 1]}
              // useAngle
              // angle={90}
              colors={['rgba(237, 237, 237, 0.1)', colorBackground]}
              style={{borderRadius: styleConst.borderRadius}}>
              <VStack space="1" px={2} py={1}>
                {/* <Imager
              key={'Imager-' + item.url}
              priority={'123'}
              source={{
                uri: item.url,
              }}
              style={[styles.imageContainer, {height: imgHeight}]}
            /> */}
                <Text fontSize={12} color={'#929292'}>
                  {date}
                </Text>
                <Heading size="xs" color={'#3D455B'}>
                  {title}
                </Heading>
                <Text>{text}</Text>
              </VStack>
            </LinearGradient>
          </Box>
        </ImageBackground>
      </View>
    </Box>
  );
};

NotificationItem.defaultProps = {
  colorBackground: 'rgba(251, 77, 61, 0.1)',
  borderBackgroundSource: require('../../../assets/notifications/palette1.png'),
};

export default NotificationItem;
