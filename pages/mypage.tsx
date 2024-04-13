import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, FlatList, Image } from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Http from '../address/backend_url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, refreshAccessToken } from '../auth/asyncstorage';
interface MypageProps {
    navigation: NavigationProp<any>;
}
interface UserInfo {
    id: number;
    email: string;
    password: string;
    departmentType: string;
    nickName: string;
    image: string;
    roles: { name: string }[];
}

const Mypage: React.FC<MypageProps> = ({ navigation }) => {
    const [isToggled, setIsToggled] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const slideAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        GetInfo();
    }, []);

    const GetInfo = async () => {
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
                console.log(data);
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

    const handleToggle = () => {
        setIsToggled((previousState) => !previousState);
        Animated.timing(slideAnimation, {
            toValue: isToggled ? 0 : 1,
            duration: 400,
            useNativeDriver: false,
        }).start();
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
                    text: '내 정보',
                    style: { color: '#1B1B1B', fontSize: 34, fontWeight: 'bold' },
                }}
            />
            <View style={{ alignItems: 'center' }}>
                <View style={styles.profileContainer}>
                    {userInfo && userInfo.image && (
                        <Image source={{ uri: userInfo.image }} style={styles.profileImage} />
                    )}
                </View>
                <View style={styles.infoContainer}>
                    <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: '600' }}>{userInfo?.nickName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                        <Text style={styles.depart}>{userInfo?.departmentType}</Text>
                        <TouchableOpacity onPress={() => {}}>
                            <Icons name="edit" size={15} />
                        </TouchableOpacity>
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
                            data={null}
                            renderItem={({ item }) => (
                                <View style={styles.item}>
                                    <Text style={styles.itemTitle}>○ {item.title}</Text>
                                    <Text style={styles.itemDuration}>{item.duration}</Text>
                                </View>
                            )}
                            keyExtractor={(item) => item.title}
                        />
                    ) : (
                        <FlatList
                            data={null}
                            renderItem={({ item }) => (
                                <View style={styles.item}>
                                    <Text style={styles.itemTitle}>○ {item.title}</Text>
                                    <Text style={styles.itemDuration}>{item.duration}</Text>
                                </View>
                            )}
                            keyExtractor={(item) => item.title}
                        />
                    )}
                </View>
            </View>
        </View>
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
    },
    itemDuration: {
        fontSize: 14,
    },
});

export default Mypage;
