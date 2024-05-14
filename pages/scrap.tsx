import React, { FC, useState, useEffect, useRef } from 'react';
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
import { Swipeable } from 'react-native-gesture-handler';
import { Scrapped } from '../data/types';
import { Posts } from '../data/types';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ScrapDetail from './modals/scrapdetail';

const Scrap: FC = () => {
    const [scrapped, setScrapped] = useState<Scrapped[] | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Posts[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [filteredData, setFilteredData] = useState<Scrapped[] | null>(null);
    const [searchInitiated, setSearchInitiated] = useState<boolean>(false);
    const [refreshData, setRefreshData] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const swipeableRef = useRef(null);

    useEffect(() => {
        fetchScrapped();
    }, [refreshData]);

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
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchScrapped();
        setIsRefreshing(false);
    };

    const unscrapPost = async (postId: number) => {
        const accessToken = await getStorage('accessToken');
        try {
            const res = await fetch(`${Http}/posts/unscrap/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.status === 200) {
                Alert.alert('스크랩 삭제 성공');
                setFilteredData((currentData) => currentData.filter((item) => item.postId !== postId));
                setRefreshData((old) => !old);
            } else {
                console.log('삭제 실패');
            }
        } catch (error) {
            console.error('Deletion failed', error);
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

    const handleDelete = (postId: number) => {
        if (swipeableRef.current) {
            swipeableRef.current.close();
        }
        Alert.alert('스크랩 삭제하기', '스크랩한 게시물을 삭제하시겠습니까?', [
            {
                text: '예',
                onPress: () => unscrapPost(postId),
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
                    return handleDelete(postId);
                }}
                style={styles.deleteButton}
            >
                <Icons name="delete" size={25} />
            </TouchableOpacity>
        );
    };

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
                <FlatList
                    data={filteredData}
                    ListEmptyComponent={renderEmptyComponent}
                    renderItem={({ item }) => (
                        <Swipeable
                            ref={swipeableRef}
                            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.postId)}
                        >
                            <TouchableWithoutFeedback onPress={() => fetchPostDetails(item.postId)}>
                                <View style={styles.item}>
                                    <Text style={styles.itemTitle} numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </Swipeable>
                    )}
                    keyExtractor={(item) => item.postId.toString()}
                    contentContainerStyle={styles.listContainer}
                    onRefresh={handleRefresh}
                    refreshing={isRefreshing}
                />
                {selectedPost && (
                    <ScrapDetail
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
    deleteButton: {
        backgroundColor: '#FA8282',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: '100%',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Scrap;
