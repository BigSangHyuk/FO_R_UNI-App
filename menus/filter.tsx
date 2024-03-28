import React, { FC, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';

const Filter: FC = () => {
    const [checkboxes, setCheckboxes] = useState([
        { id: 1, title: '학사', checked: false },
        { id: 2, title: '학점교류', checked: false },
        { id: 3, title: '일반/행사/모집', checked: false },
        { id: 4, title: '장학금', checked: false },
        { id: 5, title: '등록금 납부', checked: false },
        { id: 6, title: '교육시험', checked: false },
        { id: 7, title: '봉사', checked: false },
        { id: 8, title: '채용', checked: false },
        { id: 9, title: '학과', checked: false },
    ]);

    const toggleCheckbox = (id: number) => {
        setCheckboxes((prevCheckboxes) =>
            prevCheckboxes.map((checkbox) =>
                checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
            )
        );
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.filterContainer}>
                <Text style={styles.filterText}>게시글 필터</Text>
                <View style={styles.separator}></View>
                <View style={styles.checkboxContainer}>
                    {checkboxes.map((checkbox) => (
                        <View key={checkbox.id} style={styles.checkboxItem}>
                            <CheckBox checked={checkbox.checked} onPress={() => toggleCheckbox(checkbox.id)} />
                            <Text style={styles.checkboxLabel}>{checkbox.title}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    filterText: {
        color: 'rgba(27, 27, 27, 0.71)',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 72,
    },
    filterContainer: {
        width: '65%',
        height: '100%',
        backgroundColor: '#fff',
        alignSelf: 'flex-end',
    },
    checkboxContainer: {
        alignItems: 'flex-start',
        flexDirection: 'column',
    },
    separator: {
        height: 3,
        backgroundColor: '#000',
        width: '100%',
        marginBottom: 21,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxLabel: {
        fontSize: 14,
    },
});

export default Filter;
