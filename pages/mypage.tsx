import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, FlatList } from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface MypageProps {
    navigation: NavigationProp<any>;
}

const Mypage: React.FC<MypageProps> = ({ navigation }) => {
    const [isToggled, setIsToggled] = useState<boolean>(false);
    const slideAnimation = useRef(new Animated.Value(0)).current;

    const handleToggle = () => {
        setIsToggled((previousState) => !previousState);
        Animated.timing(slideAnimation, {
            toValue: isToggled ? 0 : 1,
            duration: 400,
            useNativeDriver: false,
        }).start();
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const data = [
        { title: 'Item 1', duration: '9월 13일' },
        { title: 'Item 2', duration: '60min' },
        { title: 'Item 3', duration: '30min' },
        { title: 'Item 4', duration: '15min' },
    ];

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
                leftComponent={
                    <TouchableOpacity onPress={handleGoBack}>
                        <Icons name="menu" size={25} style={{ color: '#000000' }} />
                    </TouchableOpacity>
                }
                leftContainerStyle={{ flex: 1, justifyContent: 'center' }}
            />
            <View style={{ alignItems: 'center' }}>
                <View style={styles.profileContainer} />
                <View style={styles.infoContainer}>
                    <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: '600' }}>장려상혁</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.depart}>컴퓨터공학부</Text>
                        <Icons name="edit" size={15}></Icons>
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
                    <FlatList
                        data={data}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.itemDuration}>{item.duration}</Text>
                            </View>
                        )}
                        keyExtractor={(item) => item.title}
                    />
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
        borderColor: 'white',
        marginTop: 32,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
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
        height: 331,
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
