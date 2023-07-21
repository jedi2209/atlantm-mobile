import React, {useState, useEffect, useRef} from 'react';
import {Dimensions, Linking} from 'react-native';
import {
  HStack,
  Image,
  ScrollView,
  Text,
  VStack,
  View,
  Pressable,
} from 'native-base';
import {connect} from 'react-redux';

import {fetchInfoList, actionListReset} from '../../info/actions';
import {actionMenuOpenedCount, actionAppRated} from '../../core/actions';

import styleConst from '../../core/style-const';
import {MainScreenButton} from '../components/MainScreenButtons';
import FlagButton from '../../core/components/FlagButton';

import {get} from 'lodash';

const {width, height} = Dimensions.get('screen');

const mapStateToProps = ({dealer, profile, contacts, nav, info, core}) => {
  return {
    infoList: info.list,
    isFetchInfoList: info.meta.isFetchInfoList,
    nav,
    profile,
    dealerSelected: dealer.selected,
    region: dealer.region,

    isAppRated: core.isAppRated,
    menuOpenedCount: core.menuOpenedCount,
    mainScreenSettings: core.mainScreenSettings,
  };
};

const mapDispatchToProps = {
  fetchInfoList,
  actionListReset,
  actionAppRated,
  actionMenuOpenedCount,
};

const _linkProcess = (link, props) => {
  switch (link.type) {
    case 'screen':
      if (link.path === 'WebviewScreen') {
        if (link?.params?.getValue) {
          const linkValue = link.params.getValue.split('.');
          const linkObject = linkValue.shift();
          if (linkObject === 'props') {
            const htmlData = get(props, linkValue.join('.'));
            if (htmlData) {
              return ['WebviewScreen', {html: htmlData}];
            }
          }
        }
        return ['WebviewScreen', {html: link.path}];
      }
      if (link?.params) {
        return [link.path, link.params];
      }
      return [link.path];
    case 'webview':
      return ['WebviewScreen', {html: link.path}];
  }
};

const RowConstruct = props => {
  const {json, rowNum, rowLength, navigation} = props;
  if (rowLength === 2) {
    return (
      <View p={2} key={'containerRow' + rowNum}>
        <HStack justifyContent={'space-between'} space={1}>
          {_processRow({rowData: json, rowNum, navigation, ...props})}
        </HStack>
      </View>
    );
  }

  if (rowLength > 2) {
    return (
      <ScrollView
        mt={3}
        p={2}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        horizontal={true}>
        <HStack justifyContent={'space-around'} space={3}>
          {_processRow({rowData: json, rowNum, navigation, ...props})}
        </HStack>
      </ScrollView>
    );
  }

  return (
    <View p={2} key={'containerRow' + rowNum}>
      {_processRow({rowData: json, rowNum, navigation, ...props})}
    </View>
  );
};

const _processRow = props => {
  const {rowData, rowNum, navigation} = props;
  let i = 0;
  let onPressBlockButton = () => {};

  return rowData.map(item => {
    i++;
    const screenName = item.link.path;
    const screenImgAsset = screenName + '.png';

    let widthNew = null;
    let heightNew = null;

    if (item.type === 'half') {
      widthNew = width / 2.1;
      heightNew = width / 2.1;
    }

    if (item?.link?.type === 'url') {
      onPressBlockButton = () => Linking.openURL(item?.link?.path);
    } else {
      const [link, linkParams] = _linkProcess(item.link, props);
      onPressBlockButton = () => navigation.navigate(link, linkParams);
    }

    return (
      <MainScreenButton
        key={['button', rowNum, i].join('_')}
        title={item.title?.text.replace('||', '\n')}
        titleStyle={item?.titleStyle}
        subTitle={item.subTitle?.replace('||', '\n')}
        subTitleStyle={item?.subTitleStyle}
        type={item?.titleStyle ? null : item.title?.position}
        size={item.type}
        width={widthNew ? widthNew : null}
        height={heightNew ? heightNew : null}
        onPress={onPressBlockButton}
        background={{uri: item?.img}}
      />
    );
  });
};

const MainScreen = props => {
  const {navigation, dealerSelected, region, mainScreenSettings} = props;

  if (!mainScreenSettings) {
    return null;
  }

  let i = 0;

  return (
    <ScrollView style={styleConst.safearea.default} testID="MainScreen.Wrapper">
      <VStack style={{paddingBottom: 100}}>
        {mainScreenSettings.map(el => {
          i++;
          return (
            <RowConstruct
              key={'row' + i}
              rowNum={i}
              rowLength={el.length}
              json={el}
              {...props}
            />
          );
        })}
        <View p={2}>
          <FlagButton
            style={{padding: 10}}
            styleText={{textAlign: 'center'}}
            onPress={() => navigation.navigate('IntroScreenNew')}
            country={region}
            type={'button'}
            variant={'unstyle'}
          />
        </View>
      </VStack>
    </ScrollView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
