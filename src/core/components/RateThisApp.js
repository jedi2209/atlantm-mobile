import React, { Component } from 'react';
import {View, Button, Modal} from "react-native";
import Rate, { AndroidMarket } from 'react-native-rate';

export default class RateThisApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rated: false
        }
    }

    componentDidMount() {
        let options = {
            AppleAppID: "515931794",
            GooglePackageName: "com.atlantm",
            preferredAndroidMarket: AndroidMarket.Google,
            preferInApp: true,
            openAppStoreIfInAppFails: true,
        };
        Rate.rate(options, success => {
            if (success) {
                // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
                this.setState({rated: true})
            }
        });
    }

    render() {
        return null;
    }
}