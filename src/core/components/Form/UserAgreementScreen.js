import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, ActivityIndicator} from 'react-native';
import {Text, Button} from 'native-base';
import {connect} from 'react-redux';

import API from '../../../utils/api';
import WebViewAutoHeight from '../WebViewAutoHeight';
import * as NavigationService from '../../../navigation/NavigationService';

import moment from 'moment';
import styleConst from '../../style-const';
import {strings} from '../../lang/const';

const mapStateToProps = ({dealer, profile}) => {
    return {
        region: dealer.selected.region,
    };
  };

const UserAgreementScreen = ({region, SubmitButton}) => {
    const [HTML, setHTML] = useState(null);

    useEffect(() => {
        console.info('== UserAgreementScreen ==');
        API.fetchUserAgreement(region).then(res => {
            setHTML(res);
        });
      }, []);

    if (HTML) {
        return (
            <>
            <ScrollView style={styles.mainView}>
            <WebViewAutoHeight
                style={styles.webView}
                key={moment().unix()}
                source={{html: HTML}}
                />
            </ScrollView>
            <Button full style={styles.submitButton} onPress={() => NavigationService.goBack()}>
                <Text>{SubmitButton.text}</Text>
            </Button>
            </>
        );
    } else {
        return <ActivityIndicator color={styleConst.color.blue} style={styleConst.spinner}/>;
    }
}

UserAgreementScreen.defaultProps = {
    SubmitButton: {
        text: strings.ModalView.close,
    },
};

const styles = StyleSheet.create({
    submitButton: {
        marginBottom: 25,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    mainView: {
        paddingHorizontal: 10,
        flex: 1,
        paddingBottom: 25,
        backgroundColor: styleConst.color.bg,
    },
    webView: {
        backgroundColor: styleConst.color.bg,
    },
});

export default connect(mapStateToProps)(UserAgreementScreen);