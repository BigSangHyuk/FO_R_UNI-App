import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from 'react-native-elements';
import EditInfo from './modals/editinfo';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Http from '../address/backend_url';
import { getStorage, refreshAccessToken } from '../auth/asyncstorage';
import { UserEdit, UserComment, UserInfo, UserLike } from '../data/types';
import * as ImagePicker from 'expo-image-picker';
interface MypageProps {
    navigation: NavigationProp<any>;
}

const Mypage: React.FC<MypageProps> = ({ navigation }) => {
    const [isToggled, setIsToggled] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [userComment, setUserComment] = useState<UserComment[]>(null);
    const [userLike, setUserLike] = useState<UserLike[]>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editImageOverlayVisible, setEditImageOverlayVisible] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const slideAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        GetInfo();
        GetComment();
        GetLike();
    }, []);

    const GetInfo = async () => {
        console.log('GETINFO');
        try {
            const accessToken = await getStorage('accessToken');

            const res = await fetch(Http + `/users/info`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    accept: '*/*',
                },
            });
            console.log('accesstoken', accessToken);

            if (res.status === 200) {
                const data = await res.json();
                setUserInfo(data);
            } else if (res.status === 400) {
                try {
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        GetInfo();
                    } else {
                        console.log('Failed to refresh token, redirecting to login');
                    }
                } catch (error) {
                    console.error('Refresh token process failed:', error);
                }
            } else {
                console.error('Error fetching user info:', res.status);
            }
        } catch (error) {
            console.error('An error occurred while fetching user info:', error);
        }
    };

    const GetComment = async () => {
        try {
            const accessToken = await getStorage('accessToken');

            const res = await fetch(Http + `/posts/commented`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    accept: '*/*',
                },
            });

            if (res.status === 200) {
                const data = await res.json();
                setUserComment(data.data);
                console.log(data);
            } else if (res.status === 400) {
                try {
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        GetComment();
                    } else {
                        console.log('Failed to refresh token, redirecting to login');
                    }
                } catch (error) {
                    console.error('Refresh token process failed:', error);
                }
            } else {
                console.error('Error fetching user info:', res.status);
            }
        } catch (error) {
            console.error('An error occurred while fetching user info:', error);
        }
    };

    const GetLike = async () => {
        try {
            const accessToken = await getStorage('accessToken');

            const res = await fetch(Http + `/comments/liked`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    accept: '*/*',
                },
            });

            if (res.status === 200) {
                const data = await res.json();
                setUserLike(data.data);
                console.log(data);
            } else if (res.status === 400) {
                try {
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        GetLike();
                    } else {
                        console.log('Failed to refresh token, redirecting to login');
                    }
                } catch (error) {
                    console.error('Refresh token process failed:', error);
                }
            } else {
                console.error('Error fetching user info:', res.status);
            }
        } catch (error) {
            console.error('An error occurred while fetching user info:', error);
        }
    };

    const handleToggle = () => {
        setIsToggled((previousState) => !previousState);
        Animated.timing(slideAnimation, {
            toValue: isToggled ? 0 : 1,
            duration: 400,
            useNativeDriver: false,
        }).start();
    };
    const uploadImage = async (imageUri) => {
        const accessToken = await getStorage('accessToken');
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        const formData = new FormData();
        formData.append('images', {
            uri: imageUri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        } as any);

        try {
            const response = await fetch(Http + '/users/image', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`,
                    accept: 'application/json',
                },
                body: formData,
            });

            const result = await response.json();
            if (response.status === 200) {
                console.log('Image uploaded successfully:', result);
                setUserInfo((prevUserInfo) => ({
                    ...prevUserInfo,
                    image: result.image,
                }));
            } else {
                console.error('Failed to upload image:', result);
            }
        } catch (error) {
            console.error('An error occurred during the image upload:', error);
        }
    };

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your photos!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync();
        if (pickerResult.canceled === true) {
            return;
        }

        const pickedUri = pickerResult.assets?.[0].uri;
        if (pickedUri) {
            await uploadImage(pickedUri);
        }
    };

    const toggleEditImageOverlay = () => {
        setEditImageOverlayVisible(!editImageOverlayVisible);
    };
    const hideImageEditOverlay = () => {
        setEditImageOverlayVisible(false);
    };

    const removeDuplicates = (data) => {
        if (!data) return [];
        const postIdSet = new Set();
        const filteredData = data.filter((item) => {
            if (postIdSet.has(item.postId)) {
                return false;
            } else {
                postIdSet.add(item.postId);
                return true;
            }
        });
        return filteredData;
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

    const handlePostSelect = (item) => {
        navigation.navigate('CalendarDetailPage', { post: item.postId });
        console.log(item.postId);
    };

    const uniqueUserComments = removeDuplicates(userComment);
    const uniqueUserLikes = removeDuplicates(userLike);

    return (
        <TouchableWithoutFeedback onPress={hideImageEditOverlay}>
            <View>
                <LinearGradient style={styles.linear} colors={['#145C97', '#7EAAD7', 'white']}>
                    <Header
                        containerStyle={{
                            borderBottomWidth: 0,
                            backgroundColor: 'transparent',
                            marginTop: 20,
                            alignItems: 'center',
                            paddingHorizontal: 20,
                        }}
                        backgroundColor="white"
                        barStyle="default"
                        centerComponent={{
                            text: '내 정보',
                            style: { color: '#1B1B1B', fontSize: 34, fontWeight: 'bold' },
                        }}
                        rightComponent={
                            <TouchableOpacity onPress={() => {}}>
                                <Icons
                                    name="edit"
                                    size={30}
                                    style={{ color: '#BDBDBD' }}
                                    onPress={() => setIsEditModalVisible(true)}
                                />
                            </TouchableOpacity>
                        }
                        rightContainerStyle={{ flex: 1, justifyContent: 'center' }}
                    />
                </LinearGradient>
                <EditInfo
                    isVisible={isEditModalVisible}
                    onClose={() => setIsEditModalVisible(false)}
                    userInfo={userInfo}
                    onEditSuccess={() => GetInfo()}
                />
                <View style={{ alignItems: 'center' }}>
                    <View style={styles.profileContainer}>
                        <TouchableOpacity
                            onPress={editImageOverlayVisible ? pickImage : toggleEditImageOverlay}
                            style={styles.imageTouchable}
                        >
                            {userInfo?.image && <Image source={{ uri: userInfo.image }} style={styles.profileImage} />}
                            {editImageOverlayVisible && (
                                <TouchableOpacity style={styles.overlay} onPress={pickImage}>
                                    <Text style={styles.overlayText}>이미지 변경</Text>
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: '600' }}>
                            {userInfo?.nickName}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                            <Text style={styles.depart}>{userInfo?.department}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.toggleContainer} onPress={handleToggle}>
                        <Animated.View
                            style={[
                                styles.toggle,
                                {
                                    transform: [
                                        {
                                            translateX: slideAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, 171.5],
                                            }),
                                        },
                                    ],
                                },
                            ]}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>
                                {isToggled ? '내가 댓글 남긴 글' : '좋아요한 댓글'}
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.listContainer}>
                        {isToggled ? (
                            <FlatList
                                data={uniqueUserComments}
                                extraData={uniqueUserComments}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handlePostPress(item.postId)}>
                                        <View style={styles.item}>
                                            <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
                                                ○ {item.title}
                                            </Text>
                                            <Text style={styles.itemDuration}>{item.deadline}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.postId.toString()}
                                ListEmptyComponent={() => (
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>남긴 댓글이 없습니다.</Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <FlatList
                                data={uniqueUserLikes}
                                extraData={uniqueUserLikes}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => handlePostPress(item.postId)}>
                                        <View style={styles.item}>
                                            <Text style={styles.itemTitle}>○ {item.content}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.postId.toString()}
                                ListEmptyComponent={() => (
                                    <View style={styles.emptyContainer}>
                                        <Text style={styles.emptyText}>좋아요한 댓글이 없습니다.</Text>
                                    </View>
                                )}
                            />
                        )}
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    linear: {
        backgroundColor: '#15106b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileContainer: {
        width: 158,
        height: 158,
        borderRadius: 158,
        borderWidth: 4,
        borderColor: 'black',
        marginTop: 32,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 158,
        height: 158,
        borderRadius: 158,
    },
    infoContainer: {
        width: 133,
        height: 72,
        marginTop: 15,
        backgroundColor: 'transparent',
    },
    depart: {
        marginBottom: 9,
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 343,
        height: 50,
        marginTop: 17,
        borderRadius: 30,
        backgroundColor: '#F6F6F6',
    },
    toggle: {
        width: 171.5,
        height: 46,
        backgroundColor: 'white',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContainer: {
        width: 358,
        height: 240,
        backgroundColor: '#F6F6F6',
        marginTop: 17,
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
        flex: 1,
        flexShrink: 1,
        maxWidth: '70%',
    },
    itemDuration: {
        fontSize: 14,
    },
    imageTouchable: {
        width: 158,
        height: 158,
        borderRadius: 158 / 2,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 158 / 2,
    },
    overlayText: {
        color: 'white',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    emptyText: {
        fontSize: 20,
        color: 'gray',
    },
});

export default Mypage;
