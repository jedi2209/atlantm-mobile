/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {useSelector} from 'react-redux';
import {StyleSheet, StyleProp, ViewStyle, ImageStyle} from 'react-native';
import {Pressable, View, Text, VStack} from 'native-base';
import * as NavigationService from '../../navigation/NavigationService';

import Badge from '../../core/components/Badge';
import Imager from '../components/Imager';

import RNBounceable from '@freakycoder/react-native-bounceable';
import styleConst from '../style-const';

const styles = StyleSheet.create({
  slide: {
    paddingBottom: 20,
  },
  image: {
    resizeMode: 'cover',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  badge: {
    flexDirection: 'row',
    marginTop: 3,
  },
  title: {
    fontSize: 20,
    color: '#000000',
    letterSpacing: 0.25,
    textAlign: 'left',
    lineHeight: 26,
    fontWeight: 'bold',
  },
  titleRound: {
    fontSize: 12,
    fontWeight: 'normal',
    paddingHorizontal: 10,
    paddingVertical: 10,
    lineHeight: 16,
  },
});

interface ImageWrapperProps {
  pressable?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ImageWrapper: React.FC<ImageWrapperProps> = props => {
  if (props.pressable) {
    return <RNBounceable {...props} />;
  } else {
    return <View {...props} />;
  }
};

interface MainWrapperProps {
  bounceable?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

const MainWrapper: React.FC<MainWrapperProps> = props => {
  if (props.bounceable) {
    return <RNBounceable {...props} />;
  } else {
    return <Pressable {...props} />;
  }
};

interface OfferProps {
  imagePressable?: boolean;
  bounceable?: boolean;
  dealerCustom?: any;
  data: {
    id: string;
    date: string;
    type?: {
      badge?: {
        background: string;
        color: string;
      };
      name: Record<string, string>;
    };
    img: {
      main?: string;
    };
    name: string;
    announce?: string;
  };
  height: number;
  cardWidth: number;
  theme: 'round' | 'default';
  imageStyle?: StyleProp<ImageStyle>;
}

const Offer: React.FC<OfferProps> = ({
  imagePressable = false,
  bounceable = false,
  dealerCustom = null,
  data,
  height,
  cardWidth,
  theme,
  imageStyle,
}) => {
  const currLang = useSelector((state: any) => state.core.language.selected);

  const params = {
    id: data.id,
    date: data.date,
    type: data?.type,
    dealerCustom,
  };

  return (
    <MainWrapper
      testID="OfferItemWrapper"
      onPress={() => {
        NavigationService.navigate('InfoPostScreen', params);
      }}
      bounceable={bounceable}
      style={{width: cardWidth}}>
      {data.img.main ? (
        <ImageWrapper
          pressable={imagePressable}
          onPress={() => {
            NavigationService.navigate('InfoPostScreen', params);
          }}>
          <Imager
            key={'id' + data.img.main}
            source={{uri: data.img.main}}
            style={[
              styles.image,
              {
                width: cardWidth,
                height: height,
              },
              imageStyle,
            ]}
          />
        </ImageWrapper>
      ) : null}
      <View backgroundColor={theme === 'round' ? 'none' : styleConst.color.bg}>
        <VStack>
          <Text
            fontSize={20}
            fontWeight={'bold'}
            color={styleConst.color.black}
            letterSpacing={0.25}
            textAlign={'left'}
            lineHeight={24}>
            {data.name}
          </Text>
          {data.type?.badge ? (
            <View pr={theme === 'round' ? 9 : 0} flexDirection={'row'} mt={1}>
              <Badge
                id={params.id}
                key={'badgeItem' + params.id}
                index={0}
                bgColor={params.type?.badge?.background}
                name={params.type?.name?.[currLang] || null}
                textColor={params.type?.badge?.color}
              />
            </View>
          ) : null}
        </VStack>
        {theme === 'round' && (
          <Text style={[styles.title, styles.titleRound]}>{data.announce}</Text>
        )}
      </View>
    </MainWrapper>
  );
};

export default Offer;
