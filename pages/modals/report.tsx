import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    Modal,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { RadioButton } from 'react-native-paper';
import { getStorage } from '../../auth/asyncstorage';
import Http from '../../address/backend_url';
const { height } = Dimensions.get('window');
const ReportModal = ({ modalVisible, setModalVisible, commentId, comment }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [detail, setDetail] = useState('');

    const reasons = [
        { label: '욕설/비하', value: '욕설_비하가_포함된_내용이에요' },
        { label: '상업적 광고 및 판매', value: '상업적_광고_및_판매' },
        { label: '음란물/청소년에게 부적합', value: '음란물_청소년에게_부적합' },
        { label: '사칭/사기', value: '사칭_사기' },
        { label: '낚시/도배', value: '낚시_도배' },
        { label: '저작권 위반', value: '저작권_위반' },
    ];

    const submitReport = async () => {
        const accessToken = await getStorage('accessToken');
        const reportData = {
            commentId: commentId,
            reason: selectedReason,
        };
        console.log(commentId, selectedReason);

        try {
            const response = await fetch(`${Http}/reports/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                    accept: '*/*',
                },
                body: JSON.stringify(reportData),
            });

            if (response.ok) {
                alert('신고가 접수되었습니다.');
                setModalVisible(false);
            } else {
                throw new Error('Failed to submit report');
            }
        } catch (error) {
            alert('신고 접수 중 오류가 발생했습니다: ' + error.message);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.container}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Icons name="close" size={25} style={styles.closeButtonText} />
                    </TouchableOpacity>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.title}>신고하기</Text>
                        <View style={styles.horizontalLine}></View>
                        <Text style={styles.commentContent}>내용: {comment}</Text>
                        <RadioButton.Group
                            onValueChange={(newValue) => setSelectedReason(newValue)}
                            value={selectedReason}
                        >
                            {reasons.map((reason, index) => (
                                <View key={index} style={styles.radioButtonContainer}>
                                    <RadioButton value={reason.value} uncheckedColor="gray" />
                                    <Text>{reason.label}</Text>
                                </View>
                            ))}
                        </RadioButton.Group>

                        <Button title="신고하기" onPress={submitReport} />
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    scrollView: {
        width: '100%',
    },
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '70%',
        maxHeight: height * 0.8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingLeft: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
        height: 100,
        textAlignVertical: 'top',
        backgroundColor: '#f8f8f8',
    },
    commentContent: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
    },
    closeButton: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 10,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#4285F4',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    horizontalLine: {
        borderBottomColor: 'red',
        borderBottomWidth: 3,
        width: '40%',
        alignSelf: 'center',
        marginBottom: 20,
    },
});

export default ReportModal;
