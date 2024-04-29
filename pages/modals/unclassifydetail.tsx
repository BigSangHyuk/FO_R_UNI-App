import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const UnclassifyDetail = ({ modalVisible, selectedPost, setModalVisible }) => {
    const openURL = () => {
        Linking.openURL(selectedPost.noticeUrl).catch((err) => console.error("Couldn't load page", err));
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
                                <Text style={styles.modalTitle}>{selectedPost.title}</Text>
                                <Text style={styles.modalCategory}>{selectedPost.category}</Text>
                                <Text style={styles.modalText}>{selectedPost.content}</Text>

                                <TouchableOpacity style={styles.linkStyle} onPress={openURL}>
                                    <Text style={styles.linkText}>원문 보기</Text>
                                </TouchableOpacity>
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
});

export default UnclassifyDetail;
