import React, { FC, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableWithoutFeedback,
    Modal,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { Header } from 'react-native-elements';
import Http from '../address/backend_url';
import { getStorage } from '../auth/asyncstorage';
import { UnClassified } from '../data/types';
import UnclassifyDetail from './modals/unclassifydetail';
import Icons from 'react-native-vector-icons/MaterialIcons';

const UnClassify: FC = () => {
    const [unclass, setUnclass] = useState<UnClassified[] | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<UnClassified | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [filteredData, setFilteredData] = useState<UnClassified[] | null>(null);
    const [searchInitiated, setSearchInitiated] = useState<boolean>(false);

    useEffect(() => {
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
    }, []);

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
                <View style={styles.centeredView}>
                    <Text>해당 게시글이 없습니다.</Text>
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
        <View style={{ flex: 1 }}>
            <Header
                containerStyle={{
                    borderBottomWidth: 0,
                    backgroundColor: 'white',
                    justifyContent: 'space-around',
                }}
                backgroundColor="white"
                centerComponent={{
                    text: '미분류 게시글',
                    style: { color: 'black', fontSize: 34, fontWeight: 'bold' },
                }}
            />
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
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setSelectedPost(item);
                            setModalVisible(true);
                        }}
                    >
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
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
export default UnClassify;
