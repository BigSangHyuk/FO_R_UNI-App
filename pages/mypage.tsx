import { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { Input, InputProps, Button, Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { TextStyle, ViewStyle, StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';

interface MypageProps {
    navigation: NavigationProp<any>;
}

const Mypage: React.FC<MypageProps> = ({ navigation }) => {
    const handleGoBack = () => {
        navigation.goBack();
    };
    return (
        <View>
            <Header
                containerStyle={{
                    borderBottomWidth: 0,
                    backgroundColor: 'white',
                    marginTop: 20,
                    alignItems: 'center',
                }}
                backgroundColor="white"
                barStyle="default"
                centerComponent={{
                    text: '내 정보',
                    style: { color: '#1B1B1B', fontSize: 34, fontWeight: 'bold' },
                }}
                leftComponent={
                    <TouchableOpacity onPress={handleGoBack}>
                        <Icons name="menu" size={25} style={{ color: '#000000' }} />
                    </TouchableOpacity>
                }
                leftContainerStyle={{ flex: 1, justifyContent: 'center' }}
            />
            <View style={{ alignItems: 'center' }}>
                <View style={styles.profileContainer}></View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileContainer: {
        width: 158,
        height: 158,
        borderRadius: 158,
        borderWidth: 4,
        borderColor: 'white',
        marginTop: 32,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        width: 133,
        height: 72,
    },
    depart: {
        width: 89,
        height: 19,
    },
});

export default Mypage;
