import React, { FC, useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, FlatList } from 'react-native';
import { Header, Button } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';

const UnClassify: FC = () => {
    const comment = [
        { title: 'Item 5', duration: '3월 11일' },
        { title: 'Item 6', duration: '60min' },
        { title: 'Item 7', duration: '30min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
        { title: 'Item 8', duration: '15min' },
    ];
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
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={styles.listContainer}>
                    <FlatList
                        data={comment}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text style={styles.itemTitle}>○ {item.title}</Text>
                                <Text style={styles.itemDuration}>{item.duration}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.title}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        width: '100%',
        height: 354,
        backgroundColor: '#F6F6F6',
        marginTop: 32,
    },
    list: {
        width: 323,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemDuration: {
        fontSize: 14,
    },
});
export default UnClassify;
