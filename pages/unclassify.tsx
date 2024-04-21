import React, { FC, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Header } from 'react-native-elements';
import Http from '../address/backend_url';
import { getStorage } from '../auth/asyncstorage';
import { UnClassified } from '../data/types';
import { Posts } from '../data/types';

const UnClassify: FC = () => {
    const [unclass, setUnclass] = useState<UnClassified[] | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Posts[] | null>(null);

    useEffect(() => {
        const unclassified = async () => {
            const accessToken = await getStorage('accessToken');
            const res = await fetch(Http + '/posts/unclassified', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    accept: 'application/json',
                },
            });
            if (res.status === 200) {
                const result = await res.json();
                setUnclass(result.data);
            } else {
                console.log('Request failed');
            }
        };

        unclassified();
    }, []);

    const fetchPostDetails = async (postId) => {
        const accessToken = await getStorage('accessToken');
        const res = await fetch(Http + `/posts/${postId}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (res.status === 200) {
            const result = await res.json();
            setSelectedPost(result.detail);
            setModalVisible(true);
        } else {
            console.log('Request failed');
        }
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
                    text: '미분류 게시글',
                    style: { color: '#1B1B1B', fontSize: 34, fontWeight: 'bold' },
                }}
            />
            <FlatList
                data={unclass}
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
    listContainer: {
        flexGrow: 1,
        backgroundColor: '#F6F6F6',
        marginTop: 52,
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
});
export default UnClassify;
