import React, { Component } from 'react';
import {View, Button, Modal, Text, TouchableHighlight, Alert} from "react-native";
import Rate, { AndroidMarket } from 'react-native-rate';

export default class RateThisApp extends React.Component {

    render() {
        Alert.alert(
            'Нравится Атлант-М?',
            'Расскажите миру об удобстве пользования этим приложением!',
            [
                // {text: 'Позже', onPress: () => {this.props.onAskLater && this.props.onAskLater()}, style: 'cancel'},
                {text: 'Не напоминать', onPress: () => {this.props.onSuccess && this.props.onSuccess()}, style: 'cancel'},
                {text: 'Оценить', onPress: () => {
                    let options = {
                        AppleAppID: "XXXX",
                        GooglePackageName: "com.atlantm",
                        preferredAndroidMarket: AndroidMarket.Google,
                        preferInApp: true,
                        openAppStoreIfInAppFails: false,
                    };

                    Rate.rate(options, success => {
                        if (success) {
                            this.props.onSuccess && this.props.onSuccess();
                        }
                    });
                }},
            ],
            { cancelable: false }
        )

        return null;
    }
}