import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    FlatList,
} from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Thumbs from 'react-native-vector-icons/Feather';
import Reply from 'react-native-vector-icons/Entypo';
import Report from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { getStorage } from '../../auth/asyncstorage';
import Http from '../../address/backend_url';

const CalendarDetailPage = ({ route }) => {
    const navigation = useNavigation();
    const post = route.params.post.detail;
    console.log(post);
    const comments = route.params.post.comments;

    const [commentText, setCommentText] = useState('');
    const titleParts = post.title.match(/(\[.*?\]|\(.*?\))?(.*)/) || ['', '', ''];
    const firstLine = titleParts[1] || '';
    const secondLine = titleParts[2].trim();
    if (!post) {
        return <Text>정보를 불러올 수 없습니다.</Text>;
    }

    const openURL = () => {
        Linking.openURL(post.noticeUrl).catch((err) => console.error("Couldn't load page", err));
    };

    const handleAddComment = async () => {
        const accessToken = await getStorage('accessToken');
        const response = await fetch(Http + `/comments`, {
            method: 'POST',
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postId: post.id,
                content: commentText,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Comment added:', data);
            setCommentText('');
        } else {
            console.error('Failed to post comment:', response.status);
        }
    };

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
                    tabBarStyle: {},
                });
            }
        };
    }, []);

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{ flex: 1 }}>
                <Header
                    containerStyle={styles.headerContainer}
                    barStyle="default"
                    centerComponent={{
                        text: '상세 보기',
                        style: styles.headerTitle,
                    }}
                    leftComponent={
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icons name="arrow-back-ios" size={25} style={styles.backIcon} />
                        </TouchableOpacity>
                    }
                />
                <ScrollView style={styles.detailContainer} contentContainerStyle={styles.scrollViewContent}>
                    <Text style={styles.ftitle}>{firstLine}</Text>
                    <Text style={styles.stitle}>{secondLine}</Text>
                    {post.imageUrl && post.imageUrl.length > 0 && (
                        <Image source={{ uri: post.imageUrl[0] }} style={styles.image} />
                    )}
                    <Text style={styles.content}>{post.content}</Text>
                    <Text>등록일: {post.postedAt}</Text>
                    <Text>마감일: {post.deadline}</Text>
                    <TouchableOpacity style={styles.linkStyle} onPress={openURL}>
                        <Text style={styles.linkText}>원문 보기</Text>
                    </TouchableOpacity>
                    <View style={styles.container2}>
                        <FlatList
                            data={comments}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.commentItem}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={styles.nickname}>{item.user.nickName}</Text>
                                            <Text style={styles.commentText}>{item.content}</Text>
                                        </View>
                                        <View>
                                            <View style={styles.actions}>
                                                <Text style={styles.timestamp}>{item.timestamp}</Text>
                                                <TouchableOpacity style={styles.actionButton}>
                                                    <Thumbs name="thumbs-up" size={15} color="#888" />
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.actionButton}>
                                                    <Reply name="reply" size={15} color="#888" />
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.actionButton}>
                                                    <Report name="report" size={15} color="#888" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.inputContainer}
                        >
                            <View style={styles.textInputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Add a comment..."
                                    value={commentText}
                                    onChangeText={setCommentText}
                                />
                                <TouchableOpacity onPress={handleAddComment} style={styles.icon}>
                                    <Icons name="send" size={25} color="#000" />
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
        marginTop: 20,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerTitle: {
        color: '#1B1B1B',
        fontSize: 34,
        fontWeight: 'bold',
    },
    backIcon: {
        color: '#BDBDBD',
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    detailContainer: {
        padding: 10,
        maxHeight: '90%',
    },
    ftitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    stitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    linkStyle: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#E8F5E9',
        borderRadius: 5,
    },
    linkText: {
        color: '#2196F3',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    container2: {
        backgroundColor: '#fff',
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#E0E0E0',
    },
    textInputContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        paddingRight: 10,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 20,
    },
    icon: {
        position: 'absolute',
        right: 10,
        alignSelf: 'center',
    },
    commentsList: {
        flex: 2,
    },
    nickname: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    commentItem: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    commentText: {
        fontSize: 16,
        marginLeft: '15%',
    },
    timestamp: {
        fontSize: 12,
        color: 'gray',
    },
    replyButton: {
        marginTop: 4,
        padding: 8,
        backgroundColor: '#F0F0F0',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    actionButton: {
        marginLeft: 10,
    },
});

export default CalendarDetailPage;
