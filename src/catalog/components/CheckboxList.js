import React, {useState, useReducer, useEffect} from 'react';
import {View, StyleSheet, Text, Platform, TouchableHighlight} from 'react-native';
import {CheckBox} from 'native-base';
import {get} from 'lodash';

import PropTypes from 'prop-types';

import Imager from '../../core/components/Imager';

import styleConst from '../../core/style-const';

const reducer = (state = [], action) => {
    const idTmp = Number(action.id);
    if (state.includes(idTmp)) {
        state.splice(state.indexOf(idTmp), 1);
    } else {
        state.push(idTmp);
    }
    return state;
}

const def = [];

const CheckboxList = ({items, selectedItems, type, dataExtra, onPressCallback}) => {
    const [selected, dispatchSelected] = useReducer(reducer, def);
    const forceUpdate = useReducer(bool => !bool)[1];

    let itemsArr = {};
    items.map(item => {
        itemsArr[item.value] = item.label;
    });

    useEffect(() => {
        let res = [];
        selected.map(val => {
            res.push({label: itemsArr[val], value: val});
        });
        onPressCallback(res);
    }, [selected.length]);

    return (
        <View>
        {items.map(val => {
            const text = val.label;
            const id = Number(val.value);
            return (
                <TouchableHighlight
                    onPressOut={() => {
                        dispatchSelected({id});
                        forceUpdate();
                    }}
                    activeOpacity={.7}
                    underlayColor={styleConst.color.white}>
                    <View style={styles.row}>
                        {type === 'colors' ? (
                        <View style={styles.colorBoxWrapper}>
                            <View style={[styles.colorBox, {
                            backgroundColor: get(dataExtra[text.toString()], 'codes.hex'),
                            }, styles[`colorBox_${dataExtra[text.toString()].keyword}`]]} />
                        </View>
                        ) : null}
                        {type === 'body' ? (
                        <View style={styles.bodyTypeBoxWrapper}>
                            <Imager style={styles.bodyTypeBox} source={{uri: 'https://cdn.atlantm.com/icons/bodyType/svg/'+ dataExtra[text.toString()] +'.svg'}}/>
                        </View>
                        ) : null}
                        <View style={styles.wrapper}>
                            <Text style={styles.text}>{text}</Text>
                            <CheckBox
                                checked={selected.includes(id) ? true : false}
                                onPress={() => {
                                    dispatchSelected({id});
                                    forceUpdate();
                                }}
                            />
                        </View>
                    </View>
                </TouchableHighlight>
            );
        })}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        paddingVertical: 12,
        flexDirection: 'row',
    },
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5,
    },
    text: {
        fontSize: 17,
        fontFamily: styleConst.font.regular,
    },
    colorBoxWrapper: {
        marginRight: 15,
    },
    bodyTypeBoxWrapper: {
        marginRight: 15,
        width: 30,
    },
    bodyTypeBox: {
        width: 30,
        height: 30,
    },
    colorBox: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    colorBox_white: {
        borderWidth: 1,
        borderColor: styleConst.color.greyText5,
    },
});

CheckboxList.defaultProps = {
}

export default CheckboxList;