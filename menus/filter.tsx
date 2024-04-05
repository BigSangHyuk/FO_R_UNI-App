import React, { FC, useState } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
interface FilterProp {
    isFilterOpen: boolean;
    onCloseFilter: () => void;
}
const Filter: FC<FilterProp> = ({ isFilterOpen, onCloseFilter }) => {
    const [allChecked, setAllChecked] = useState(false);
    const [checkboxes, setCheckboxes] = useState([
        { id: 1, title: '학사', checked: false, color: '#dcdcdc' },
        { id: 2, title: '학점교류', checked: false, color: 'red' },
        { id: 3, title: '일반/행사/모집', checked: false, color: 'orange' },
        { id: 4, title: '장학금', checked: false, color: 'yellow' },
        { id: 5, title: '등록금 납부', checked: false, color: 'green' },
        { id: 6, title: '교육시험', checked: false, color: 'blue' },
        { id: 7, title: '봉사', checked: false, color: 'indigo' },
        { id: 8, title: '채용', checked: false, color: 'purple' },
        { id: 9, title: '학과', checked: false, color: 'black' },
    ]);

    const toggleCheckbox = (id: number) => {
        setCheckboxes((prevCheckboxes) =>
            prevCheckboxes.map((checkbox) =>
                checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
            )
        );
    };

    const toggleSelect = () => {
        setAllChecked(!allChecked);
        setCheckboxes((prevCheckboxes) =>
            prevCheckboxes.map((checkbox) => ({
                ...checkbox,
                checked: !allChecked,
            }))
        );
    };

    const closFilter = () => {
        onCloseFilter();
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.filterContainer}>
                <Text style={styles.filterText}>게시글 필터</Text>
                <View style={styles.separator}></View>
                <View style={styles.checkboxContainer}>
                    {checkboxes.map((checkbox) => (
                        <View key={checkbox.id} style={styles.checkboxItem}>
                            <View style={styles.checkboxLabelContainer}>
                                <CheckBox checked={checkbox.checked} onPress={() => toggleCheckbox(checkbox.id)} />
                                <Text style={styles.checkboxLabel}>{checkbox.title}</Text>
                            </View>
                            <View style={{ marginLeft: 'auto' }}>
                                <Icons name="circle" size={24} color={checkbox.color} />
                            </View>
                        </View>
                    ))}
                </View>
                <View style={styles.switch}>
                    <Text>전체 해제</Text>
                    <Switch value={allChecked} onValueChange={toggleSelect} />
                    <Text>전체 선택</Text>
                </View>

                <View style={{ marginTop: 30 }}>
                    <Button
                        title="적용"
                        loading={false}
                        loadingProps={{ size: 'small', color: 'white' }}
                        buttonStyle={{
                            borderRadius: 100,
                        }}
                        titleStyle={{ fontWeight: 'bold', fontSize: 16 }}
                        containerStyle={{
                            height: 51,
                            width: 170,
                        }}
                        onPress={() => closFilter()}
                    />
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
        marginTop: 30,
    },
    filterContainer: {
        width: '65%',
        height: '100%',
        backgroundColor: '#fff',
        alignSelf: 'flex-end',
        alignItems: 'center',
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
        justifyContent: 'space-between',
    },
    checkboxLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxLabel: {
        fontSize: 14,
        marginRight: 8,
    },
    switch: {
        fontSize: 14,
        flexDirection: 'row',
        gap: 17,
        marginTop: 20,
    },
});

export default Filter;
