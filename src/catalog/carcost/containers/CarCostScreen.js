import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView, StyleSheet, Alert, Platform} from 'react-native';
import {Content, List, StyleProvider} from 'native-base';

// redux
import {connect} from 'react-redux';
import {nameFill, phoneFill, emailFill} from '../../../profile/actions';
import {
  actionFillPhotosCarCost,
  actionFillBrandCarCost,
  actionFillModelCarCost,
  actionFillColorCarCost,
  actionSelectYearCarCost,
  actionFillMileageCarCost,
  actionSelectMileageUnitCarCost,
  actionFillEngineVolumeCarCost,
  actionSelectEngineTypeCarCost,
  actionSelectGearboxCarCost,
  actionSelectCarConditionCarCost,
  actionFillCommentCarCost,
  actionFillVinCarCost,
  actionCarCostOrder,
} from '../../actions';
import {CAR_COST__SUCCESS, CAR_COST__FAIL} from '../../actionTypes';

// components
import Spinner from 'react-native-loading-spinner-overlay';
import CommentOrderForm from '../../components/CommentOrderForm';
import ProfileForm from '../../../profile/components/ProfileForm';
import ListItemHeader from '../../../profile/components/ListItemHeader';
import DealerItemList from '../../../core/components/DealerItemList';
import ButtonFull from '../../../core/components/ButtonFull';
import HeaderIconMenu from '../../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../../core/components/HeaderIconBack/HeaderIconBack';
import CarCostForm from '../components/CarCostForm';
import CarCostPhotos from '../components/CarCostPhotos';

// helpers
import Amplitude from '../../../utils/amplitude-analytics';
import {get, valuesIn} from 'lodash';
import getTheme from '../../../../native-base-theme/components';
import styleConst from '../../../core/style-const';
import stylesHeader from '../../../core/components/Header/style';
import {ERROR_NETWORK} from '../../../core/const';
import isInternet from '../../../utils/internet';

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: styleConst.color.bg,
  },
  button: {
    marginTop: 20,
  },
});

const mapStateToProps = ({dealer, profile, nav, catalog}) => {
  const carCost = get(catalog, 'carCost', {});
  const {
    comment,
    photos,
    vin,
    brand,
    model,
    year,
    mileage,
    mileageUnit,
    engineVolume,
    engineType,
    gearbox,
    color,
    carCondition,
    meta,
  } = carCost;

  return {
    nav,
    name: profile.name,
    phone: profile.phone,
    email: profile.email,
    dealerSelected: dealer.selected,

    // car cost
    comment,
    photos,
    vin,
    brand,
    model,
    year,
    mileage,
    mileageUnit,
    engineVolume,
    engineType,
    gearbox,
    color,
    carCondition,
    isCarCostRequest: meta.isCarCostRequest,
  };
};

const mapDispatchToProps = {
  nameFill,
  phoneFill,
  emailFill,

  // carcost
  actionFillPhotosCarCost,
  actionFillBrandCarCost,
  actionFillModelCarCost,
  actionFillColorCarCost,
  actionSelectYearCarCost,
  actionFillMileageCarCost,
  actionSelectMileageUnitCarCost,
  actionFillEngineVolumeCarCost,
  actionSelectEngineTypeCarCost,
  actionSelectGearboxCarCost,
  actionSelectCarConditionCarCost,
  actionFillCommentCarCost,
  actionFillVinCarCost,
  actionCarCostOrder,
};

class CarCostScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: 'Оценить мой автомобиль',
    headerStyle: stylesHeader.common,
    headerTitleStyle: stylesHeader.title,
    headerLeft: <HeaderIconBack navigation={navigation} />,
    headerRight: <HeaderIconMenu navigation={navigation} />,
  });

  static propTypes = {
    dealerSelected: PropTypes.object,
    navigation: PropTypes.object,
    nameFill: PropTypes.func,
    phoneFill: PropTypes.func,
    emailFill: PropTypes.func,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  };

  onPressButton = async () => {
    const isInternetExist = await isInternet();

    if (!isInternetExist) {
      return setTimeout(() => Alert.alert(ERROR_NETWORK), 100);
    } else {
      const {
        navigation,

        name,
        phone,
        email,
        dealerSelected,

        actionCarCostOrder,
        isCarCostRequest,

        comment,
        photos,
        vin,
        brand,
        model,
        year,
        mileage,
        mileageUnit,
        engineVolume,
        engineType,
        gearbox,
        carCondition,
        color,
      } = this.props;

      // предотвращаем повторную отправку формы
      if (isCarCostRequest) {
        return false;
      }

      const dealerId = dealerSelected.id;
      const photoForUpload = valuesIn(photos);

      if (!name || !phone || !email || photoForUpload.length === 0) {
        return Alert.alert(
          'Не хватает информации',
          'Необходимо заполнить ФИО, телефон, email и добавить минимум 1 фотографию автомобиля',
        );
      }

      actionCarCostOrder({
        dealerId,
        name,
        phone,
        email,
        comment,
        vin,
        brand,
        model,
        year,
        photos: photoForUpload,
        mileage,
        mileageUnit,
        engineVolume,
        engineType,
        gearbox,
        carCondition,
        color,
      }).then(action => {
        if (action.type === CAR_COST__SUCCESS) {
          Amplitude.logEvent('order', 'catalog/carcost');

          setTimeout(() => {
            Alert.alert('Ваша заявка успешно отправлена', '', [
              {
                text: 'ОК',
                onPress() {
                  navigation.goBack();
                },
              },
            ]);
          }, 100);
        }

        if (action.type === CAR_COST__FAIL) {
          let message = get(
            action,
            'payload.message',
            'Произошла ошибка, попробуйте снова',
          );

          if (message === 'Network request failed') {
            message = ERROR_NETWORK;
          }

          setTimeout(() => Alert.alert(message), 100);
        }
      });
    }
  };

  shouldComponentUpdate(nextProps) {
    const nav = nextProps.nav.newState;
    let isActiveScreen = false;

    if (nav) {
      const rootLevel = nav.routes[nav.index];
      if (rootLevel) {
        isActiveScreen =
          get(rootLevel, `routes[${rootLevel.index}].routeName`) ===
          'CarCostScreen';
      }
    }

    return isActiveScreen;
  }

  render() {
    // Для iPad меню, которое находится вне роутера
    // window.atlantmNavigation = this.props.navigation;

    const {
      name,
      phone,
      email,
      nameFill,
      emailFill,
      phoneFill,
      navigation,
      dealerSelected,

      // carcost
      actionFillPhotosCarCost,
      actionFillBrandCarCost,
      actionFillModelCarCost,
      actionFillColorCarCost,
      actionSelectYearCarCost,
      actionFillMileageCarCost,
      actionSelectMileageUnitCarCost,
      actionFillEngineVolumeCarCost,
      actionSelectEngineTypeCarCost,
      actionSelectGearboxCarCost,
      actionSelectCarConditionCarCost,
      actionFillCommentCarCost,
      actionFillVinCarCost,

      isCarCostRequest,
      comment,
      photos,
      vin,
      brand,
      model,
      year,
      mileage,
      mileageUnit,
      engineVolume,
      engineType,
      gearbox,
      color,
      carCondition,
    } = this.props;

    console.log('== CarCost ==');

    return (
      <StyleProvider style={getTheme()}>
        <SafeAreaView style={styles.safearea}>
          <Content
            enableResetScrollToCoords={false}
            keyboardShouldPersistTaps={
              Platform.OS === 'android' ? 'always' : 'never'
            }>
            <List style={styles.list}>
              <Spinner
                visible={isCarCostRequest}
                color={styleConst.color.blue}
              />

              <ListItemHeader text="МОЙ АВТОЦЕНТР" />

              <DealerItemList
                navigation={navigation}
                city={dealerSelected.city}
                name={dealerSelected.name}
                brands={dealerSelected.brands}
                goBack={true}
              />

              <ListItemHeader text="КОНТАКТНАЯ ИНФОРМАЦИЯ" />
              <ProfileForm
                view="CarCostScreen"
                name={name}
                phone={phone}
                email={email}
                nameFill={nameFill}
                phoneFill={phoneFill}
                emailFill={emailFill}
              />

              <ListItemHeader text="АВТОМОБИЛЬ" />
              <CarCostForm
                vin={vin}
                brand={brand}
                model={model}
                year={year}
                mileage={mileage}
                mileageUnit={mileageUnit}
                engineVolume={engineVolume}
                engineType={engineType}
                gearbox={gearbox}
                color={color}
                carCondition={carCondition}
                vinFill={actionFillVinCarCost}
                brandFill={actionFillBrandCarCost}
                modelFill={actionFillModelCarCost}
                yearSelect={actionSelectYearCarCost}
                mileageFill={actionFillMileageCarCost}
                mileageUnitSelect={actionSelectMileageUnitCarCost}
                engineVolumeFill={actionFillEngineVolumeCarCost}
                engineTypeSelect={actionSelectEngineTypeCarCost}
                gearboxSelect={actionSelectGearboxCarCost}
                carConditionSelect={actionSelectCarConditionCarCost}
                colorFill={actionFillColorCarCost}
              />

              <ListItemHeader text="ДОПОЛНИТЕЛЬНО" />
              <CommentOrderForm
                comment={comment}
                commentFill={actionFillCommentCarCost}
              />

              <ListItemHeader text="ПРИКРЕПИТЬ ФОТОГРАФИИ" />
              <CarCostPhotos
                photos={photos}
                photosFill={actionFillPhotosCarCost}
              />

              <ButtonFull
                style={styles.button}
                arrow={true}
                text="Отправить"
                onPressButton={this.onPressButton}
              />
            </List>
          </Content>
        </SafeAreaView>
      </StyleProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CarCostScreen);
