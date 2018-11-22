import React, { Component } from 'react';
import {View, Button, Modal, Text, TouchableHighlight, Alert} from "react-native";
import Rate, { AndroidMarket } from 'react-native-rate';

export default class RateThisApp extends React.Component {

    render() {
        Alert.alert(
            'Нравится Атлант-М?',
            'Расскажите миру об удобстве пользования этим приложением!',
            [
                {text: 'Позже', onPress: () => {this.props.onAskLater && this.props.onAskLater()}, style: 'cancel'},
                {text: 'Не напоминать', onPress: () => {this.props.onSuccess && this.props.onSuccess()}, style: 'cancel'},
                {text: 'Оценить', onPress: () => {
                    let options = {
                        AppleAppID: "515931794",
                        GooglePackageName: "com.atlantm",
                        preferredAndroidMarket: AndroidMarket.Google,
                        preferInApp: true,
                        openAppStoreIfInAppFails: true,
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
            ],
            { cancelable: false }
        );

        return null;
    }
}