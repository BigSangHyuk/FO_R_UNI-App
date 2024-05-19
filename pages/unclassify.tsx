import React, { FC, useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { Header } from 'react-native-elements';
import Http from '../address/backend_url';
import { getStorage } from '../auth/asyncstorage';
import { UnClassified, Posts } from '../data/types';
import UnclassifyDetail from './modals/unclassifydetail';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const UnClassify: FC = () => {
    const [unclass, setUnclass] = useState<UnClassified[] | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Posts | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [filteredData, setFilteredData] = useState<UnClassified[] | null>(null);
    const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
    const swipeableRefs = useRef(new Map()).current;

    useFocusEffect(
        useCallback(() => {
            const unclassified = async () => {
                setIsLoading(true);
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
                    setFilteredData(result.data);
                } else {
                    console.log('Request failed');
                }
                setIsLoading(false);
            };

            unclassified();
            setSearchKeyword('');
        }, [])
    );

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

    const scrapPost = async (postId: number) => {
        const accessToken = await getStorage('accessToken');
        try {
            const res = await fetch(`${Http}/posts/scrap/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.status === 200) {
                Alert.alert('스크랩 성공');
                console.log('성공');
            } else {
                console.log('스크랩 실패');
            }
        } catch (error) {
            console.error('Add failed', error);
        }
        setIsLoading(false);
    };

    const renderEmptyComponent = () => {
        if (!filteredData || filteredData.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>해당 게시글이 없습니다.</Text>
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
    const handleSwipeableRef = (ref, postId) => {
        if (ref && !swipeableRefs.has(postId)) {
            swipeableRefs.set(postId, ref);
        }
    };

    const handleAdd = (postId) => {
        const swipeableItem = swipeableRefs.get(postId);

        if (swipeableItem) {
            swipeableItem.close();
        }

        Alert.alert('스크랩 하기', '해당 게시물을 스크랩하시겠습니까?', [
            {
                text: '예',
                onPress: () => scrapPost(postId),
            },
            {
                text: '아니오',
            },
        ]);
    };

    const renderRightActions = (progress, dragX, postId) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    return handleAdd(postId);
                }}
                style={styles.addButton}
            >
                <Icons name="add-circle-outline" size={25} />
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }) => (
        <Swipeable
            ref={(ref) => handleSwipeableRef(ref, item.postId)}
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.postId)}
        >
            <TouchableWithoutFeedback onPress={() => fetchPostDetails(item.postId)}>
                <View style={styles.item}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={styles.itemPostedAt}>{item.postedAt}</Text>
                </View>
            </TouchableWithoutFeedback>
        </Swipeable>
    );

    return (
        <View style={styles.container}>
            <Header
                containerStyle={styles.headerContainer}
                centerComponent={{
                    text: '미분류 게시글',
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
                    <TouchableOpacity
                        onPress={fetchPostsBySearch}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Icons name="search" size={25} color="#000" />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={filteredData}
                    ListEmptyComponent={renderEmptyComponent}
                    renderItem={renderItem}
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
    itemPostedAt: {
        fontSize: 10,
        marginTop: 4,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    emptyContainer: {
        margin: 20,
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
        padding: 4,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        margin: 'auto',
    },
    addButton: {
        backgroundColor: '#BEEFFF',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: '100%',
    },
});

export default UnClassify;
