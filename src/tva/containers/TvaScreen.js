import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {SafeAreaView, View, Alert, StyleSheet, Platform, Linking} from 'react-native';
import {
    Body,
    Right,
    Label,
    Item,
    Input,
    Switch,
    Content,
    ListItem,
    StyleProvider,
} from 'native-base';

// redux
import {connect} from 'react-redux';
import {actionFetchTva, actionSetPushTracking} from '../actions';
import {carNumberFill} from '../../profile/actions';
//import { actionSetPushGranted } from '../../core/actions';

// components

import Spinner from 'react-native-loading-spinner-overlay';
import HeaderIconMenu from '../../core/components/HeaderIconMenu/HeaderIconMenu';
import HeaderIconBack from '../../core/components/HeaderIconBack/HeaderIconBack';
import ListItemHeader from '../../profile/components/ListItemHeader';
import DealerItemList from '../../core/components/DealerItemList';
import FooterButton from '../../core/components/FooterButton';
import PushNotifications from '../../core/components/PushNotifications';

// styles
import stylesList from '../../core/components/Lists/style';

// helpers
import {get} from 'lodash';
import getTheme from '../../../native-base-theme/components';
import styleConst from '../../core/style-const';
import stylesHeader from '../../core/components/Header/style';
import {TVA__SUCCESS, TVA__FAIL} from '../actionTypes';

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: styleConst.color.bg,
    },
});

const mapStateToProps = ({dealer, nav, tva, profile, core}) => {
    return {
        nav,
        carNumber: profile.carNumber,
        pushTracking: tva.pushTracking,
        isTvaRequest: tva.meta.isRequest,
        dealerSelected: dealer.selected,
//    fcmToken: core.fcmToken,
        pushGranted: core.pushGranted,
    };
};

const mapDispatchToProps = {
    carNumberFill,
    actionFetchTva,
    actionSetPushTracking,
//  actionSetFCMToken,
//  actionSetPushGranted,
};

class TvaScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        headerTitle: 'Табло выдачи авто',
        headerStyle: stylesHeader.common,
        headerTitleStyle: stylesHeader.title,
        headerLeft: <HeaderIconBack returnScreen="MenuScreen" navigation={navigation}/>,
        headerRight: <HeaderIconMenu navigation={navigation}/>,
    })

    static propTypes = {
        dealerSelected: PropTypes.object,
        navigation: PropTypes.object,
        isTvaRequest: PropTypes.bool,
        actionFetchTva: PropTypes.func,
        carNumberFill: PropTypes.func,
        carNumber: PropTypes.string,
        pushTracking: PropTypes.bool,
    }

    componentDidMount() {
        const {navigation} = this.props;
        const params = get(navigation, 'state.params', {});

        if (params.isPush) {
            this.onPressButton(params);
        }
    }

    shouldComponentUpdate(nextProps) {
        const nav = nextProps.nav.newState;
        let isActiveScreen = false;

        if (nav) {
            const rootLevel = nav.routes[nav.index];
            if (rootLevel) {
                isActiveScreen = get(rootLevel, `routes[${rootLevel.index}].routeName`) === 'TvaScreen';
            }
        }

        return isActiveScreen;
    }

    onPressButton = (pushProps) => {
        let {
            carNumber,
            navigation,
            pushTracking,
            dealerSelected,
            actionFetchTva,
        } = this.props;

        let dealerId = dealerSelected.id;

        if (pushProps) {
            carNumber = pushProps.carNumber;
            dealerId = pushProps.dealerId;
            pushTracking = false;
            this.onPressPushTracking(false);
        }

        if (!carNumber && !pushProps) {
            return setTimeout(() => {
                Alert.alert(
                    'Недостаточно информации',
                    'Необходимо заполнить гос. номер автомобиля',
                );
            }, 100);
        }

        actionFetchTva({
            number: carNumber,
            dealer: dealerId,
            region: pushProps ? null : dealerSelected.region,
            pushTracking,
        }).then(action => {
            switch (action.type) {
                case TVA__SUCCESS:
                    setTimeout(() => {
                        if (pushTracking === true) {
                            function str_replace($f, $r, $s) {
                                return $s.replace(new RegExp("(" + $f.map(function (i) {
                                        return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
                                    }).join("|") + ")", "g"), function (s) {
                                    return $r[$f.indexOf(s)]
                                });
                            }

                            const carNumber_find = ["о", "О", "т", "Т", "е", "Е", "а", "А", "н", "Н", "к", "К", "м", "М", "в", "В", "с", "С", "х", "Х", "р", "Р", "у", "У", "-"];
                            const carNumber_replace = ["T", "O", "T", "T", "E", "E", "A", "A", "H", "H", "K", "K", "M", "M", "B", "B", "C", "C", "X", "X", "P", "P", "Y", "Y", ""];

                            console.log('carNumber', carNumber);

                            let carNumberChanged = carNumber.replace(new RegExp("(" + carNumber_find.map(function (i) {
                                    return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")
                                }).join("|") + ")", "g"), function (s) {
                                return carNumber_replace[carNumber_find.indexOf(s)]
                            });
                            ;

                            PushNotifications.subscribeToTopic('tva', carNumberChanged.toUpperCase());
                        } else {
                            PushNotifications.unsubscribeFromTopic('tva');
                        }
                        navigation.navigate('TvaResultsScreen'), 200
                    });
                    break;
                case TVA__FAIL:
                    setTimeout(() => {
                        if (pushTracking === true) {
                            PushNotifications.unsubscribeFromTopic('tva');
                            this.onPressPushTracking(false);
                        }
                        Alert.alert('', `${action.payload.message}. Возможно вы указали неправильный номер или автоцентр`), 250
                    });
                    break;
            }
        });
    }

    onChangeCarNumber = (value) => this.props.carNumberFill(value);

    renderListItems = () => {
        const {carNumber, pushTracking} = this.props;

        return (
            <View>
                <View style={stylesList.listItemContainer}>
                    <ListItem style={[stylesList.listItem, stylesList.listItemReset]}>
                        <Body>
                        <Item style={stylesList.inputItem} fixedLabel>
                            <Label style={stylesList.label}>Гос. номер</Label>
                            <Input
                                style={stylesList.input}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Поле для заполнения"
                                onChangeText={this.onChangeCarNumber}
                                value={carNumber}
                                returnKeyType="done"
                                returnKeyLabel="Готово"
                                underlineColorAndroid="transparent"
                            />
                        </Item>
                        </Body>
                    </ListItem>
                </View>

                <View style={stylesList.listItemContainer}>
                    <ListItem style={stylesList.listItem} last>
                        <Body>
                        <Label style={stylesList.label}>Отслеживание</Label>
                        </Body>
                        <Right>
                            <Switch onValueChange={this.onPressPushTracking} value={pushTracking}/>
                        </Right>
                    </ListItem>
                </View>

            </View>
        );
    };

    onPressPushTracking = (isPushTracking) => {
        const {actionSetPushTracking, carNumber} = this.props;
        if (isPushTracking === true) {
            PushNotifications.subscribeToTopic('tva', carNumber)
                .then(isPushTracking => {
                    actionSetPushTracking(isPushTracking);
                });
        } else {
            PushNotifications.unsubscribeFromTopic('tva');
            actionSetPushTracking(isPushTracking);
        }
    };

    render() {
        // Для iPad меню, которое находится вне роутера
        window.atlantmNavigation = this.props.navigation;

        const {navigation, dealerSelected, isTvaRequest} = this.props;

        console.log('== TvaScreen ==');

        return (
            <StyleProvider style={getTheme()}>
                <SafeAreaView style={styles.safearea}>
                    <Content>

                        <Spinner visible={isTvaRequest} color={styleConst.color.blue}/>

                        <DealerItemList
                            navigation={navigation}
                            city={dealerSelected.city}
                            name={dealerSelected.name}
                            brands={dealerSelected.brands}
                            goBack={true}
                        />

                        <ListItemHeader text="АВТОМОБИЛЬ"/>

                        {this.renderListItems()}
                    </Content>
                    <FooterButton
                        text="Проверить"
                        onPressButton={() => this.onPressButton()}
                    />
                </SafeAreaView>
            </StyleProvider>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TvaScreen);
