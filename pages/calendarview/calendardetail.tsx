import React, { useEffect, useRef, useState } from 'react';
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
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { getStorage } from '../../auth/asyncstorage';
import Http from '../../address/backend_url';
import ReportModal from '../modals/report';

const CalendarDetailPage = ({ route }) => {
    const navigation = useNavigation();
    const postId = route.params.post?.detail.id;
    const post = route.params.post?.detail;
    console.log(post);
    console.log(postId);
    const [comments, setComments] = useState(route.params.post?.comments);
    const [commentText, setCommentText] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
    const [showKeyboard2, setShowKeyboard2] = useState<boolean>(false);
    const [parentCommentId, setParentCommentId] = useState(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [myName, setMyName] = useState<string>('');
    const [myId, setMyId] = useState<number>();
    const [icsUrl, setIcsUrl] = useState<string>('');

    useEffect(() => {
        const handleUserInfo = async () => {
            const accessToken = await getStorage('accessToken');
            const response = await fetch(Http + `/users/info`, {
                method: 'GET',
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setMyName(result.nickName);
                setMyId(result.id);
            } else {
                console.error('Failed to fetch user info:', response.status);
            }
        };
        handleUserInfo();
    }, [myId, myName]);

    const titleParts = post?.title.match(/(\[.*?\]|\(.*?\))?(.*)/) || ['', '', ''];
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
    const handleEdit = async () => {
        if (!editingComment) {
            console.error('선택되지 않았어요');
            return;
        }

        const accessToken = await getStorage('accessToken');
        const response = await fetch(`${Http}/comments/${editingComment.id}`, {
            method: 'PUT',
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newCommentText }),
        });

        if (response.ok) {
            Alert.alert('댓글이 수정되었습니다.');
            fetchComment();
            setShowKeyboard2(false);
            setNewCommentText('');
            setEditingComment(null);
        } else {
            console.error('댓글 수정 실패:', response.status);
        }
    };
    const handleDelete = async (comment) => {
        const accessToken = await getStorage('accessToken');
        const response = await fetch(Http + `/comments/${comment.id}`, {
            method: 'DELETE',
            headers: {
                Accept: '*/*',
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            Alert.alert('삭제되었습니다.');
            fetchComment();
            console.log('Comment deleted');
        } else {
            console.error('실패', response.status);
        }
    };

    const handleLongPress = (comment) => {
        if (comment.user?.userId === myId) {
            Alert.alert(
                '댓글 내용',
                `${comment.content}`,
                [
                    {
                        text: '삭제',
                        onPress: () => handleDelete(comment),

                        style: 'destructive',
                    },
                    {
                        text: '수정',
                        onPress: () => {
                            setShowKeyboard2(true);
                            setNewCommentText(comment.content);
                            setEditingComment(comment);
                        },
                    },
                    {
                        text: '취소',
                        onPress: () => console.log('Cancel'),
                        style: 'cancel',
                    },
                ],
                { cancelable: true }
            );
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

    const AddCalendar = () => {
        const handleics = async () => {
            const accessToken = await getStorage('accessToken');
            const response = await fetch(Http + `/s3/ics?postid=${postId}`, {
                method: 'POST',
                headers: {
                    Accept: '*/*',
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const result = await response.json();
                console.log(result.data);
                setIcsUrl(result?.imageUrl);

                Linking.openURL(icsUrl).catch((err) => {
                    console.error('Failed to open URL:', err);
                });
            } else {
                console.error('ics 에러:', response.status);
            }
        };

        Alert.alert('외부달력 추가', '외부달력에 추가하시겠습니까?', [
            {
                text: '예',
                onPress: () => {
                    handleics();
                },
            },
            {
                text: '아니오',
                style: 'cancel',
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

    const scrapPost = async (postId: number) => {
        const accessToken = await getStorage('accessToken');
        console.log(postId);
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
                comment.user && comment.user.nickName === myName ? styles.nicknameHighlighted : styles.nickname;

            return (
                <View
                    key={comment.id}
                    style={[styles.commentItem, { marginLeft: 20 * level }, level === 0 ? styles.underline : {}]}
                >
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableWithoutFeedback onLongPress={() => handleLongPress(comment)}>
                                <View>
                                    <Text style={userNameStyle}>
                                        {comment.user ? comment.user.nickName : '익명의 사용자'}
                                    </Text>
                                    <Text style={styles.commentText}>{comment.content}</Text>
                                </View>
                            </TouchableWithoutFeedback>
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
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity onPress={openURL}>
                                <Add name="link" size={25} style={styles.backIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => AddCalendar()}>
                                <Add name="calendar-plus" size={25} style={styles.backIcon} />
                            </TouchableOpacity>
                        </View>
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
                        <TouchableOpacity style={styles.linkStyle} onPress={() => scrapPost(postId)}>
                            <Text style={styles.linkText}>스크랩 하기</Text>
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
                                    item.user && item.user.nickName === myName
                                        ? styles.nicknameHighlighted
                                        : styles.nickname;

                                const commentStyle =
                                    item.level != 0 ? [styles.commentItem, styles.underline] : styles.commentItem;

                                return (
                                    <View key={item.id} style={commentStyle}>
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <TouchableWithoutFeedback onLongPress={() => handleLongPress(item)}>
                                                    <View>
                                                        <Text style={userNameStyle}>{userName}</Text>
                                                        <Text style={styles.commentText}>{commentText}</Text>
                                                    </View>
                                                </TouchableWithoutFeedback>
                                                <View>
                                                    <View style={styles.actions}>
                                                        <Text style={styles.timestamp}>
                                                            {CreateTime(item.createdAt)}
                                                        </Text>
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
                                                                    <Text style={styles.likeCount}>
                                                                        {item.commentLike}
                                                                    </Text>
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
                                                                        console.log('Item on press:', item);
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

                                            {item.children && renderComments(item.children, 1)}
                                        </View>
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
                        {showKeyboard2 && (
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={styles.inputContainer}
                            >
                                <TextInput
                                    style={styles.input}
                                    placeholder={commentText}
                                    value={newCommentText}
                                    onChangeText={setNewCommentText}
                                    autoFocus={true}
                                    returnKeyLabel="Done"
                                    onSubmitEditing={handleEdit}
                                />
                                <TouchableOpacity onPress={() => handleEdit()} style={styles.icon}>
                                    <Icons name="edit" size={25} color="#000" />
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
        backgroundColor: '#46AAFF',
        borderRadius: 5,
        flex: 1,
    },
    underline: {
        borderBottomWidth: 1,
        borderBottomColor: '#CCC',
    },
    linkText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    container2: {
        backgroundColor: '#fff',
        flex: 0.1,
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
    rightActionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: 10,
    },
});

export default CalendarDetailPage;
