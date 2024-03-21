import React, { FC, useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput } from 'react-native';
import { Header, Button } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';

const UnClassify: FC = () => {
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
                    text: '미분류 게시글',
                    style: { color: '#1B1B1B', fontSize: 34, fontWeight: 'bold' },
                }}
            />
        </View>
    );
};
export default UnClassify;
