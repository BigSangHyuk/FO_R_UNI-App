import React, { FC, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, FlatList } from 'react-native';
import { Header, Button } from 'react-native-elements';
import Http from '../../address/backend_url';
import { Scrapped } from '../../data/types';
import { getStorage } from '../../auth/asyncstorage';
const Scrap: FC = () => {
    const [isscrapped, setIsScrapped] = useState<Scrapped[] | null>(null);

    useEffect(() => {
        const scrapped = async () => {
            const accessToken = await getStorage('accessToken');
            const res = await fetch(Http + '/posts/scrapped', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    accept: 'application/json',
                },
            });
            if (res.status === 200) {
                const result = await res.json();
                setIsScrapped(result.data);
            } else {
                console.log('Request failed');
            }
        };

        scrapped();
    }, []);

    return (
        <View style={styles.container}>
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
                    text: '스크랩한 게시물',
                    style: { color: '#1B1B1B', fontSize: 34, fontWeight: 'bold' },
                }}
            />
            <FlatList
                data={isscrapped}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
                            {item.title}
                        </Text>
                    </View>
                )}
                keyExtractor={(item) => item.postId.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        flexGrow: 1,
        backgroundColor: '#F6F6F6',
        marginTop: 52,
        justifyContent: 'center',
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
        fontSize: 15,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    emptyContainer: {
        alignItems: 'center',
        margin: 20,
    },
    emptyText: {
        fontSize: 20,
        color: 'gray',
    },
});
export default Scrap;
