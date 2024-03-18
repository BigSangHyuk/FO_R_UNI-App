import React, { ChangeEvent, useState, useEffect, useCallback, FC } from 'react';
import { Input, InputProps, Button, Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { TextStyle, ViewStyle, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SideBar: FC = () => {
    return <View style={styles.container}>내 정보</View>;
};

const styles = StyleSheet.create({
    container: {
        width: '70%',
        height: '100%',
        backgroundColor: 'black',
        justifyContent: 'flex-start',
        paddingHorizontal: 0,
    },
});
export default SideBar;
