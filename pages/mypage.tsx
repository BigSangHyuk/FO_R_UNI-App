import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { Input, InputProps, Button, Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { TextStyle, ViewStyle, StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';

interface MypageProps {
    navigation: NavigationProp<any>;
}

const Mypage: React.FC<MypageProps> = () => {
    return <View></View>;
};

export default Mypage;
