import React, { Component } from 'react';
import {View, Button, Modal, Text, TouchableHighlight, Alert} from "react-native";
import Rate, { AndroidMarket } from 'react-native-rate';

export default class RateThisApp extends React.Component {

    render() {
        Alert.alert(
            'Нравится приложение?',
            'Расскажите миру о вашем опыте и оставьте свой отзыв!',
            [
                {text: 'Оценить', onPress: () => {
                    let options = {
                        AppleAppID: "XXXX",
                        GooglePackageName: "com.atlantm",
                        preferredAndroidMarket: AndroidMarket.Google,
                        preferInApp: true,
                        openAppStoreIfInAppFails: true,
                        inAppDelay: 2.0,
                    };

                    Rate.rate(options, success => {
                        console.log('Rate success', success);
                        if (success) {
                            console.log('Rate this.props.onSuccess', this.props.onSuccess);
                            this.props.onSuccess && this.props.onSuccess();
                        } else {
                            console.log('Rate this.props.onAskLater', this.props.onAskLater);
                            this.props.onAskLater && this.props.onAskLater();
                        }
                    });
                }},
                {text: 'Не сейчас', onPress: () => {this.props.onAskLater && this.props.onAskLater()}, style: 'cancel'},
                {text: 'Нет, спасибо', onPress: () => {this.props.onSuccess && this.props.onSuccess()}, style: 'cancel'},
            ],
            { cancelable: false }
        );

        return null;
    }
}