import React, {useState} from 'react';
import {Dimensions, Linking, Platform, StyleSheet} from 'react-native';
import {HStack, ScrollView, Text, VStack, View, Button} from 'native-base';
import DeviceInfo from 'react-native-device-info';
import {connect} from 'react-redux';

import {fetchInfoList, actionListReset} from '../../info/actions';
import {
  actionMenuOpenedCount,
  actionAppRated,
  actionFetchMainScreenSettings,
} from '../actions';

import styleConst from '../style-const';
import {MainScreenButton} from '../components/MainScreenButtons';
import FlagButton from '../components/FlagButton';

import {get} from 'lodash';
import {STORE_LINK, APP_REGION} from '../const';
import RefreshSpinner from '../components/RefreshSpinner';
import {RefreshControl} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('screen');
const isApple = Platform.OS === 'ios';

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
  actionFetchMainScreenSettings,
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
  } else if (rowLength > 2) {
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
  const {dealerSelected, rowData, rowNum, navigation} = props;
  let i = 0;
  let onPressBlockButton = () => {};

  return rowData.map(item => {
    i++;
    let widthNew = null;
    let heightNew = null;
    let style = {};
    let titleBackgroundStyle = {};

    const screenName = item.link.path;
    const screenImgAsset = screenName + '.png';
    const isDealerButton = screenName === 'ChooseDealerScreen';
    if (isDealerButton) {
      item.img = dealerSelected.img.main[0];
      item.title.text = dealerSelected.name;
      item.titleStyle = {
        fontSize: 9,
        bottom: 0,
      };
      titleBackgroundStyle = {
        borderBottomRightRadius: styleConst.borderRadius,
        borderBottomLeftRadius: styleConst.borderRadius,
        bottom: 0,
      };
    }

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

    if (i === rowData.length) {
      style = {marginRight: 18};
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
        link={item.link}
        width={widthNew ? widthNew : null}
        height={heightNew ? heightNew : null}
        onPress={onPressBlockButton}
        background={{uri: item?.img}}
        style={style}
        titleBackgroundStyle={titleBackgroundStyle}
      />
    );
  });
};

const MainScreen = props => {
  const {navigation, dealerSelected, region, mainScreenSettings} = props;
  const [isLoading, setLoading] = useState(false);

  let i = 0;

  const _onRefresh = () => {
    setLoading(true);
    props.actionFetchMainScreenSettings(APP_REGION).then(res => {
      console.log('props.actionFetchMainScreenSettings res', res);
      setLoading(false);
    });
  };

  if (!mainScreenSettings) {
    return null;
  }

  return (
    <ScrollView
      style={styleConst.safearea.default}
      testID="MainScreen.Wrapper"
      refreshControl={
        isApple ? (
          <RefreshSpinner isRequest={isLoading} onRefresh={_onRefresh} />
        ) : (
          <RefreshControl refreshing={isLoading} onRefresh={_onRefresh} />
        )
      }>
      <VStack paddingBottom={styleConst.menu.paddingBottom}>
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
        <View px={2} pt={2}>
          <FlagButton
            style={{padding: 10}}
            styleText={{textAlign: 'center'}}
            onPress={() => navigation.navigate('IntroScreenNew')}
            country={region}
            type={'button'}
            variant={'unstyle'}
            backgroundColor={styleConst.color.bg}
            shadow={null}
          />
        </View>
        <View px={2}>
          <Button
            variant="link"
            size="md"
            borderColor={styleConst.color.accordeonGrey1}
            onPress={() => Linking.openURL(STORE_LINK[Platform.OS])}>
            <Text
              selectable={false}
              fontFamily={styleConst.font.regular}
              fontSize={12}
              color={styleConst.color.lightBlue}
              opacity={0.5}>
              {'v. ' +
                DeviceInfo.getVersion() +
                '.' +
                DeviceInfo.getBuildNumber()}
            </Text>
          </Button>
        </View>
      </VStack>
    </ScrollView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
