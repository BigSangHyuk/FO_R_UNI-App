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
    Alert,
} from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Add from 'react-native-vector-icons/MaterialCommunityIcons';
import Thumbs from 'react-native-vector-icons/Feather';
import Reply from 'react-native-vector-icons/Entypo';
import Report from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { getStorage } from '../../auth/asyncstorage';
import Http from '../../address/backend_url';
import { useUserContext } from '../../AuthProvider';
import ReportModal from '../modals/report';

const CalendarDetailPage = ({ route }) => {
    const navigation = useNavigation();
    const post = route.params.post.detail;
    const [comments, setComments] = useState(route.params.post.comments);
    const [commentText, setCommentText] = useState('');
    const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
    const [parentCommentId, setParentCommentId] = useState(null);
    const { userData, setUserData } = useUserContext();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedComment, setSelectedComment] = useState(null);

    useEffect(() => {
        console.log(userData?.nickName);
    }, [userData]);

    const titleParts = post.title.match(/(\[.*?\]|\(.*?\))?(.*)/) || ['', '', ''];
    const firstLine = titleParts[1] || '';
    const secondLine = titleParts[2].trim();
    if (!post) {
        return <Text>정보를 불러올 수 없습니다.</Text>;
    }

    const openURL = () => {
        Linking.openURL(post.noticeUrl).catch((err) => console.error("Couldn't load page", err));
    };

    const ShowKeyboard = () => {
        setShowKeyboard(true);
    };
    const HideKeyboard = () => {
        setShowKeyboard(false);
    };

    const handleReply = (commentId) => {
        setParentCommentId(commentId);
        setShowKeyboard(true);
    };

    const handleReportPress = (comment) => {
        console.log('dkdk', comment?.content);
        setSelectedComment(comment);
        setModalVisible(true);
    };
    const handleAddComment = async () => {
        const accessToken = await getStorage('accessToken');
        const commentData = {
            postId: post.id,
            content: commentText,
            parentCommentId,
        };

        const response = await fetch(Http + `/comments`, {
            method: 'POST',
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData),
        });

        if (response.ok) {
            const newComment = await response.json();
            fetchComment();
            console.log('Comment added:', newComment);
            setCommentText('');
            setShowKeyboard(false);
            setParentCommentId(null);
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

    const fetchComment = async () => {
        const accessToken = await getStorage('accessToken');

        const response = await fetch(Http + `/comments/${post.id}`, {
            method: 'GET',
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(post);

        if (response.ok) {
            console.log(response);
            const result = await response.json();
            console.log(result.data);

            setComments(result.data);
        } else {
            console.error('Failed to post comment:', response.status);
        }
    };

    const AddCalender = () => {
        Alert.alert('외부달력 추가', '외부달력에 추가하시겠습니까?', [
            {
                text: '예',
            },
            {
                text: '아니오',
            },
        ]);
    };
    const toggleLike = async (comment) => {
        const accessToken = await getStorage('accessToken');
        const url = comment.isLiked ? `${Http}/comments/unlike/${comment.id}` : `${Http}/comments/like/${comment.id}`;

        const method = comment.isLiked ? 'DELETE' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                console.log(`좋아요 ${comment.isLiked ? '취소' : '추가'} 성공!`);
                fetchComment();
            } else {
                throw new Error(`Failed to ${comment.isLiked ? 'unlike' : 'like'} the comment`);
            }
        } catch (error) {
            console.error('좋아요 처리 에러:', error);
        }
    };

    useEffect(() => {
        fetchComment();
    }, [post.comment]);

    function CreateTime(timestamp) {
        if (!timestamp) {
            return '알수없음';
        }

        const now = new Date();
        const past = new Date(timestamp);
        const timeDiff = now.getTime() - past.getTime();
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days >= 7) {
            const Month = past.getMonth() + 1;
            const Day = past.getDate();
            return `${Month}월 ${Day}일`;
        } else if (days >= 1) {
            return `${days}일 전`;
        } else if (hours >= 1) {
            return `${hours}시간 전`;
        } else if (minutes >= 1) {
            return `${minutes}분 전`;
        }

        return '방금 전';
    }
    const renderComments = (comments, level = 0) => {
        return comments.map((comment) => {
            const userNameStyle =
                comment.user && userData && comment.user.nickName === userData.nickName
                    ? styles.nicknameHighlighted
                    : styles.nickname;
            return (
                <View key={comment.id} style={[styles.commentItem, { marginLeft: 20 * level }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={userNameStyle}>{comment.user ? comment.user.nickName : '익명의 사용자'}</Text>
                            <Text style={styles.commentText}>{comment.content}</Text>
                        </View>
                        <View>
                            <View style={styles.actions}>
                                <Text style={styles.timestamp}>{CreateTime(comment.createdAt)}</Text>
                                {!comment.isDeleted && (
                                    <React.Fragment>
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => toggleLike(comment)}
                                        >
                                            <Thumbs
                                                name="thumbs-up"
                                                size={15}
                                                color={comment.isLiked ? '#46AAFF' : '#888'}
                                            />
                                            <Text style={styles.likeCount}>{comment.commentLike}</Text>
                                        </TouchableOpacity>
                                        {!comment.children && (
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                onPress={() => handleReply(comment.id)}
                                            >
                                                <Reply name="reply" size={15} color="#888" />
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            style={styles.actionButton}
                                            onPress={() => {
                                                console.log('Item on press:', comment);
                                                handleReportPress(comment);
                                            }}
                                        >
                                            <Report name="report" size={15} color="#888" />
                                        </TouchableOpacity>
                                    </React.Fragment>
                                )}
                            </View>
                        </View>
                    </View>
                    {comment.children && renderComments(comment.children, level + 1)}
                </View>
            );
        });
    };

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
                    rightComponent={
                        <TouchableOpacity onPress={() => AddCalender()}>
                            <Add name="calendar-plus" size={25} style={styles.backIcon} />
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
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity style={styles.linkStyle} onPress={openURL}>
                            <Text style={styles.linkText}>원문 보기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.linkStyle} onPress={ShowKeyboard}>
                            <Text style={styles.linkText}>댓글 달기</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.container2}>
                        <FlatList
                            data={comments}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => {
                                const userName = item.user ? item.user.nickName : '익명의 사용자';
                                const commentText = item.isDeleted ? '삭제된 댓글입니다.' : item.content;

                                const userNameStyle =
                                    item.user && userData && item.user.nickName === userData.nickName
                                        ? styles.nicknameHighlighted
                                        : styles.nickname;
                                return (
                                    <View key={item.id} style={[styles.commentItem]}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View>
                                                <Text style={userNameStyle}>{userName}</Text>
                                                <Text style={styles.commentText}>{commentText}</Text>
                                            </View>
                                            <View>
                                                <View style={styles.actions}>
                                                    <Text style={styles.timestamp}>{CreateTime(item.createdAt)}</Text>
                                                    {!item.isDeleted && (
                                                        <React.Fragment>
                                                            <TouchableOpacity
                                                                style={styles.actionButton}
                                                                onPress={() => toggleLike(item)}
                                                            >
                                                                <Thumbs
                                                                    name="thumbs-up"
                                                                    size={15}
                                                                    color={item.isLiked ? '#46AAFF' : '#888'}
                                                                />
                                                                <Text style={styles.likeCount}>{item.commentLike}</Text>
                                                            </TouchableOpacity>

                                                            <TouchableOpacity
                                                                style={styles.actionButton}
                                                                onPress={() => handleReply(item.id)}
                                                            >
                                                                <Reply name="reply" size={15} color="#888" />
                                                            </TouchableOpacity>

                                                            <TouchableOpacity
                                                                style={styles.actionButton}
                                                                onPress={() => {
                                                                    console.log('Item on press:', item); // item 구조 확인
                                                                    handleReportPress(item);
                                                                }}
                                                            >
                                                                <Report name="report" size={15} color="#888" />
                                                            </TouchableOpacity>
                                                        </React.Fragment>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                        {modalVisible && (
                                            <ReportModal
                                                modalVisible={modalVisible}
                                                setModalVisible={setModalVisible}
                                                commentId={selectedComment.id}
                                                comment={selectedComment.content}
                                            />
                                        )}
                                        {item.children && renderComments(item.children, 1)}
                                    </View>
                                );
                            }}
                        />

                        {showKeyboard && (
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={styles.inputContainer}
                            >
                                <TextInput
                                    style={styles.input}
                                    placeholder="댓글을 달아주세요"
                                    value={commentText}
                                    onChangeText={setCommentText}
                                    autoFocus={true}
                                    returnKeyLabel="취소"
                                    onSubmitEditing={HideKeyboard}
                                />
                                <TouchableOpacity onPress={handleAddComment} style={styles.icon}>
                                    <Icons name="send" size={25} color="#000" />
                                </TouchableOpacity>
                            </KeyboardAvoidingView>
                        )}
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
    likeCount: {
        marginLeft: 5,
        color: '#888',
        fontSize: 12,
    },
    linkStyle: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#E8F5E9',
        borderRadius: 5,
        flex: 1,
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
    nicknameHighlighted: {
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#46AAFF',
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
        flexDirection: 'row',
    },
    commentContent: {
        backgroundColor: '#F8F8F8',
    },
    sendButton: {
        padding: 10,
        backgroundColor: 'green',
    },
    sendButtonText: {
        color: 'white',
    },
});

export default CalendarDetailPage;
