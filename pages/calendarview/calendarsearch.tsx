import React, { FC, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { getStorage } from '../../auth/asyncstorage';
import { UnClassified } from '../../data/types';
import Http from '../../address/backend_url';
import Icons from 'react-native-vector-icons/MaterialIcons';

interface CalendarSearchProps {
    navigation: NavigationProp<any>;
}

const CalendarSearch: FC<CalendarSearchProps> = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [filteredData, setFilteredData] = useState<UnClassified[] | null>(null);
    const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
    const [orderBy, setOrderBy] = useState<string>('latest');
    const inputRef = useRef(null);
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

    const handleOrderBy = (orderOption) => {
        setOrderBy(orderOption);
        fetchPostsBySearch();
    };

    const Dropdown = () => (
        <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => handleOrderBy('latest')}>
                <Text style={orderBy === 'latest' ? styles.dropdownText : styles.dropdownTextInactive}>마감근접순</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleOrderBy('deadline')}>
                <Text style={orderBy === 'deadline' ? styles.dropdownText : styles.dropdownTextInactive}>최신순</Text>
            </TouchableOpacity>
        </View>
    );
    useEffect(() => {
        const focusUnsubscribe = navigation.addListener('focus', () => {
            setSearchKeyword('');
            setFilteredData([]);
            setSearchInitiated(false);

            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 0);
        });

        return () => {
            focusUnsubscribe();
        };
    }, [navigation]);

    const fetchPostsBySearch = async () => {
        setIsLoading(true);
        const accessToken = await getStorage('accessToken');
        const url = `${Http}/posts/search?orderBy=${orderBy}&keyword=${encodeURIComponent(searchKeyword)}`;

        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.status === 200) {
                const result = await res.json();
                setFilteredData(result.data);
            } else {
                Alert.alert('Error', 'Failed to fetch posts.');
            }
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setIsLoading(false);
            setSearchInitiated(true);
        }
    };

    const handlePostPress = async (postId) => {
        const url = `${Http}/posts/${postId}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await getStorage('accessToken')}`,
                },
            });
            const result = await response.json();
            if (response.status === 200) {
                navigation.navigate('CalendarDetailPage', { post: result });
            } else {
                Alert.alert('Error', 'Failed to fetch post details.');
            }
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const ItemSeparator = () => {
        return <View style={styles.itemSeparator} />;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.searchContainer}>
                <TextInput
                    ref={inputRef}
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
                    <View>
                        <Dropdown />
                        <FlatList
                            data={filteredData}
                            keyExtractor={(item) => item.postId.toString()}
                            renderItem={({ item }) => (
                                <View>
                                    <Text
                                        style={styles.itemText}
                                        numberOfLines={1}
                                        onPress={() => handlePostPress(item.postId)}
                                    >
                                        {item.title}
                                    </Text>
                                    <Text style={styles.itemDeadLine}>
                                        {orderBy === 'latest' ? `마감일: ${item.deadline}` : `등록일: ${item.postedAt}`}
                                    </Text>
                                </View>
                            )}
                            ItemSeparatorComponent={ItemSeparator}
                        />
                    </View>
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
        fontSize: 15,
        padding: 10,
    },
    itemDeadLine: {
        fontSize: 12,
        textAlign: 'right',
        marginRight: '3%',
    },
    itemSeparator: {
        height: 1,
        width: '100%',
        backgroundColor: '#ccc',
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: 'white',
    },
    dropdownText: {
        fontSize: 18,
        color: '#50C8FF',
    },
    dropdownTextInactive: {
        fontSize: 18,
        color: 'grey',
    },
});
export default CalendarSearch;
