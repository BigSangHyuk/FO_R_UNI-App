import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStorage } from '../../auth/asyncstorage';
import { UnClassified } from '../../data/types';
import Http from '../../address/backend_url';
import Icons from 'react-native-vector-icons/MaterialIcons';

const CalendarSearch = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [filteredData, setFilteredData] = useState<UnClassified[] | null>(null);
    const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
    const navigation = useNavigation();

    useEffect(() => {
        const parent = navigation.getParent();
        if (parent) {
            parent.setOptions({
                tabBarStyle: { display: 'none' },
            });
        }
        return () => {
            if (parent) {
                parent.setOptions({
                    tabBarStyle: { display: 'flex' },
                });
            }
        };
    }, [navigation]);

    const fetchPostsBySearch = async () => {
        setIsLoading(true);
        const accessToken = await getStorage('accessToken');
        try {
            const res = await fetch(
                `${Http}/posts/search?keyword=${encodeURIComponent(searchKeyword)}&classified=true`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (res.status === 200) {
                const result = await res.json();
                console.log(result);
                const filteredPosts = result.data.filter((post) =>
                    post.title.toLowerCase().includes(searchKeyword.toLowerCase())
                );
                setFilteredData(filteredPosts);
            } else {
                console.log('Search request failed');
                setFilteredData([]);
            }
        } catch (error) {
            console.error('Search failed', error);
            setFilteredData([]);
        }
        setIsLoading(false);
        setSearchInitiated(true);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="검색하고 싶은 제목을 입력해주세요"
                    autoFocus={true}
                    placeholderTextColor="#ccc"
                    keyboardType="default"
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                    onSubmitEditing={fetchPostsBySearch}
                    value={searchKeyword}
                    onChangeText={setSearchKeyword}
                />
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>취소</Text>
                </TouchableOpacity>
            </View>

            {isLoading && <Text style={{ justifyContent: 'center', alignContent: 'center' }}>불러오는 중...</Text>}
            {!isLoading && !searchInitiated && (
                <View style={styles.contentContainer}>
                    <Icons name="search-off" size={120} color="#ccc" />
                    <Text style={styles.noContentText}>검색된 게 없어요</Text>
                </View>
            )}
            {!isLoading &&
                searchInitiated &&
                (filteredData.length > 0 ? (
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item.postId.toString()}
                        renderItem={({ item }) => <Text style={styles.itemText}>{item.title}</Text>}
                    />
                ) : (
                    <View style={styles.contentContainer}>
                        <Icons name="search-off" size={120} color="#ccc" />
                        <Text style={styles.noContentText}>검색된 게 없어요</Text>
                    </View>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: '15%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        fontSize: 18,
        color: 'black',
        flex: 0.9,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    cancelText: {
        fontSize: 20,
        color: 'black',
        marginLeft: 5,
    },
    contentContainer: {
        marginTop: '50%',
        alignItems: 'center',
    },
    noContentText: {
        fontSize: 25,
        color: '#ccc',
        marginTop: 10,
    },
    itemText: {
        fontSize: 16,
        padding: 10,
    },
});
export default CalendarSearch;
