import React from 'react';
import { Modal, View, Text, TouchableOpacity, Linking, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
const { height } = Dimensions.get('window');

const MyPageDetail = ({ modalVisible, selectedPost, setModalVisible }) => {
    const openURL = () => {
        Linking.openURL(selectedPost.detail.noticeUrl).catch((err) => console.error("Couldn't load page", err));
    };

    const renderComments = (comments) => {
        return comments
            .map((comment) => {
                if (comment.isDeleted) {
                    return null; // 삭제된 댓글은 렌더링하지 않습니다.
                }

                return (
                    <View key={comment.id} style={styles.commentContainer}>
                        <Text style={styles.commentNickname}>{comment.user?.nickName}</Text>
                        <Text style={styles.commentContent}>{comment?.content}</Text>
                        {comment.children && renderComments(comment.children)}
                    </View>
                );
            })
            .filter((comment) => comment !== null); // null 값을 제거하여 렌더링 목록에서 삭제
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        {selectedPost ? (
                            <View>
                                <Text style={styles.modalTitle}>{selectedPost.detail.title}</Text>
                                <Text style={styles.modalCategory}>{selectedPost.detail.category}</Text>
                                <Text style={styles.modalText}>{selectedPost.detail.content}</Text>
                                {selectedPost.detail.imageUrl.map((url, index) => (
                                    <Image key={index} source={{ uri: url }} style={styles.postImage} />
                                ))}
                                <TouchableOpacity style={styles.linkStyle} onPress={openURL}>
                                    <Text style={styles.linkText}>원문 보기</Text>
                                </TouchableOpacity>
                                <View style={styles.commentsSection}>{renderComments(selectedPost.comments)}</View>
                            </View>
                        ) : (
                            <Text>불러오는 중...</Text>
                        )}
                    </ScrollView>
                    <TouchableOpacity
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={styles.textStyle}>닫기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxHeight: height * 0.7,
    },
    scrollView: {
        flexGrow: 1,
    },
    modalTitle: {
        textAlign: 'center',
        color: '#1B1B1B',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalText: {
        marginBottom: 15,
        color: '#1B1B1B',
        fontSize: 15,
    },
    modalCategory: {
        marginLeft: 'auto',
        marginTop: 5,
        textAlign: 'center',
        color: '#1B1B1B',
        fontSize: 16,
    },
    linkStyle: {
        marginTop: 10,
        padding: 10,
    },
    linkText: {
        color: '#2196F3',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 10,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    commentContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    commentNickname: {
        fontWeight: 'bold',
    },
    commentContent: {
        color: '#333',
    },
    commentsSection: {
        marginTop: 10,
    },
    postImage: {
        width: 300,
        height: 200,
        resizeMode: 'contain',
        marginVertical: 10,
    },
});

export default MyPageDetail;
