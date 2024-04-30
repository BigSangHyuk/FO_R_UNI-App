import React, { FC, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity, TextInput } from 'react-native';
import { Header } from 'react-native-elements';
import Http from '../address/backend_url';
import { getStorage } from '../auth/asyncstorage';
import { Scrapped } from '../data/types';
import { Posts } from '../data/types';
import Icons from 'react-native-vector-icons/MaterialIcons';
import UnclassifyDetail from './modals/unclassifydetail';

const Scrap: FC = () => {
    const [scrapped, setScrapped] = useState<Scrapped[] | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Posts[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [filteredData, setFilteredData] = useState<Scrapped[] | null>(null);
    const [searchInitiated, setSearchInitiated] = useState<boolean>(false);

    useEffect(() => {
        const fetchScrapped = async () => {
            setIsLoading(true);
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
                setScrapped(result.data);
                setFilteredData(result.data);
            } else {
                console.log('Request failed');
            }
            setIsLoading(false);
        };

        fetchScrapped();
    }, []);

    const fetchPostDetails = async (postId: number) => {
        setIsLoading(true);
        const accessToken = await getStorage('accessToken');
        const res = await fetch(Http + `/posts/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
        setIsLoading(false);
    };

    const fetchPostsBySearch = async () => {
        setSearchInitiated(true);
        setIsLoading(true);
        const accessToken = await getStorage('accessToken');
        try {
            const res = await fetch(`${Http}/posts/search?keyword=${encodeURIComponent(searchKeyword)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.status === 200) {
                const result = await res.json();
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
    };

    const renderEmptyComponent = () => {
        if (searchInitiated) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>아무것도 스크랩하지 않았습니다.</Text>
                </View>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <View style={styles.centeredView}>
                <Text>불러오는중...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header
                containerStyle={styles.headerContainer}
                centerComponent={{
                    text: '스크랩한 게시물',
                    style: styles.headerText,
                }}
            />
            <View style={styles.contentContainer}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="검색할 제목을 입력하세요"
                        value={searchKeyword}
                        onChangeText={(text) => setSearchKeyword(text)}
                    />
                    <TouchableOpacity onPress={fetchPostsBySearch}>
                        <Icons name="search" size={25} color="#000" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={filteredData}
                    ListEmptyComponent={renderEmptyComponent}
                    renderItem={({ item }) => (
                        <TouchableWithoutFeedback onPress={() => fetchPostDetails(item.postId)}>
                            <View style={styles.item}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    keyExtractor={(item) => item.postId.toString()}
                    contentContainerStyle={styles.listContainer}
                />
                {selectedPost && (
                    <UnclassifyDetail
                        modalVisible={modalVisible}
                        selectedPost={selectedPost}
                        setModalVisible={setModalVisible}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        borderBottomWidth: 0,
        backgroundColor: 'white',
        justifyContent: 'space-around',
    },
    headerText: {
        color: 'black',
        fontSize: 34,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        marginTop: 30,
    },
    listContainer: {
        flexGrow: 1,
        backgroundColor: '#F6F6F6',
        marginTop: 15,
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 20,
        color: 'gray',
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '50%',
        marginLeft: 'auto',
    },
    searchInput: {
        flex: 1,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        margin: 'auto',
    },
});

export default Scrap;
