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
        const reportData = {
            commentId: commentId,
            reason: selectedReason,
            detail,
        };

        try {
            const response = await fetch('/reports/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
    console.log(comment);
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
                        <Text style={styles.commentContent}>내용: {comment}</Text>
                        <RadioButton.Group
                            onValueChange={(newValue) => setSelectedReason(newValue)}
                            value={selectedReason}
                        >
                            {reasons.map((reason, index) => (
                                <View key={index} style={styles.radioButtonContainer}>
                                    <RadioButton value={reason.value} />
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
        flexGrow: 1,
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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        margin: 'auto',
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 20,
        height: 100,
        textAlignVertical: 'top',
    },
    commentContent: {
        fontSize: 14,
        marginBottom: 4,
    },
    closeButton: {
        position: 'absolute',
        right: 15,
        top: 15,
        padding: 10,
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#333',
    },
});

export default ReportModal;
