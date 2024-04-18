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
} from 'react-native';
import { Header } from 'react-native-elements';
import EditInfo from './editProfile/editinfo';
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
    const [image, setImage] = useState<UserEdit | string>('');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editImageOverlayVisible, setEditImageOverlayVisible] = useState<boolean>(false);

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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            // userInfo 상태에 새 이미지를 설정하는 로직을 추가하세요.
            //   setUserInfo({ ...userInfo, image: result.uri });
            setEditImageOverlayVisible(false); // 이미지 피커가 닫힌 후 오버레이 숨기기
        }
    };

    // 이미지 오버레이 상태를 토글하는 함수
    const toggleEditImageOverlay = () => {
        setEditImageOverlayVisible(!editImageOverlayVisible);
    };
    const hideImageEditOverlay = () => {
        setEditImageOverlayVisible(false);
    };

    return (
        <TouchableWithoutFeedback onPress={hideImageEditOverlay}>
            <View>
                <Header
                    containerStyle={{
                        borderBottomWidth: 0,
                        backgroundColor: 'white',
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
                                size={25}
                                style={{ color: '#BDBDBD' }}
                                onPress={() => setIsEditModalVisible(true)}
                            />
                        </TouchableOpacity>
                    }
                    rightContainerStyle={{ flex: 1, justifyContent: 'center' }}
                />
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
                            {userInfo && userInfo.image && (
                                <Image source={{ uri: userInfo.image }} style={styles.profileImage} />
                            )}
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
                                {isToggled ? '내가 댓글 남긴 글' : '좋아요 한 댓글'}
                            </Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.listContainer}>
                        {isToggled ? (
                            <FlatList
                                data={userComment}
                                extraData={userComment}
                                renderItem={({ item }) => (
                                    <View style={styles.item}>
                                        <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
                                            ○ {item.title}
                                        </Text>
                                        <Text style={styles.itemDuration}>{item.deadline}</Text>
                                    </View>
                                )}
                                keyExtractor={(item) => item.postId.toString()}
                            />
                        ) : (
                            <FlatList
                                data={userLike}
                                renderItem={({ item }) => (
                                    <View style={styles.item}>
                                        <Text style={styles.itemTitle}>○ {item.content}</Text>
                                    </View>
                                )}
                                keyExtractor={(item) => item.postId.toString()}
                            />
                        )}
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
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
        // 다른 스타일을 필요에 따라 추가하세요.
    },
    // profileImage: {
    //     width: 158,
    //     height: 158,
    //     borderRadius: 79,
    // },
    addImageText: {},
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
});

export default Mypage;
