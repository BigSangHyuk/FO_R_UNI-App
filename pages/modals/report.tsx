import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';

const ReportModal = () => {
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
            commentId: 0,
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
            } else {
                throw new Error('Failed to submit report');
            }
        } catch (error) {
            alert('신고 접수 중 오류가 발생했습니다: ' + error.message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>신고하기</Text>
            <RadioButton.Group onValueChange={(newValue) => setSelectedReason(newValue)} value={selectedReason}>
                {reasons.map((reason, index) => (
                    <View key={index} style={styles.radioButtonContainer}>
                        <RadioButton value={reason.value} />
                        <Text>{reason.label}</Text>
                    </View>
                ))}
            </RadioButton.Group>
            <TextInput style={styles.input} onChangeText={setDetail} value={detail} placeholder="상세 사유" multiline />
            <Button title="신고하기" onPress={submitReport} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
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
});

export default ReportModal;
