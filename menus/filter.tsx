import React, { FC, useState, useEffect, Dispatch, SetStateAction, useMemo } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { getStorage } from '../auth/asyncstorage';
import Http from '../address/backend_url';

interface FilterProp {
    isFilterOpen: boolean;
    onCloseFilter: () => void;
    setParentFilter: (filter: string) => void;
    filter: string;
}
const Filter: FC<FilterProp> = ({ isFilterOpen, onCloseFilter, setParentFilter, filter }) => {
    const [allChecked, setAllChecked] = useState(true);
    const [checkboxes, setCheckboxes] = useState([]);
    const [deptId, setDeptId] = useState('');

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
            console.log(result.deptId);
            setDeptId(result.deptId);
        } else {
            console.error('Failed to post comment:', response.status);
        }
    };
    useEffect(() => {
        handleUserInfo();
        const initialCheckboxesState = [
            { id: 246, title: '학사', checked: filter.includes('246'), color: '#dcdcdc' },
            { id: 247, title: '학점교류', checked: filter.includes('247'), color: 'red' },
            { id: 248, title: '일반/행사/모집', checked: filter.includes('248'), color: 'orange' },
            { id: 249, title: '장학금', checked: filter.includes('249'), color: 'yellow' },
            { id: 250, title: '등록금 납부', checked: filter.includes('250'), color: 'green' },
            { id: 252, title: '교육시험', checked: filter.includes('252'), color: 'blue' },
            { id: 253, title: '봉사', checked: filter.includes('253'), color: 'purple' },
            { id: deptId, title: '학과', checked: filter.includes('0'), color: 'black' },
        ];
        console.log(deptId);

        const allSelected = initialCheckboxesState.every((checkbox) => checkbox.checked);
        setAllChecked(allSelected);

        setCheckboxes(initialCheckboxesState);
    }, [filter]);

    const toggleCheckbox = (id: number) => {
        setCheckboxes((prevCheckboxes) => {
            const updatedCheckboxes = prevCheckboxes.map((checkbox) =>
                checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox
            );

            const allSelected = updatedCheckboxes.every((checkbox) => checkbox.checked);
            setAllChecked(allSelected);

            return updatedCheckboxes;
        });
    };

    const applyFilter = () => {
        const selectedFilterIds = checkboxes
            .filter((c) => c.checked)
            .map((c) => c.id)
            .join('-');
        setParentFilter(selectedFilterIds);
        closFilter();
        console.log(checkboxes);
        console.log('안녕');
    };

    const toggleSelect = () => {
        const newAllChecked = !allChecked;
        setAllChecked(newAllChecked);
        setCheckboxes(checkboxes.map((checkbox) => ({ ...checkbox, checked: newAllChecked })));
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
                        onPress={applyFilter}
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
        marginTop: 70,
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
