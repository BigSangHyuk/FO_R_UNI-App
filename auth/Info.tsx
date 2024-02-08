import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Input, Button, Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface InfoProps {
    navigation: NavigationProp<any>;
}

interface Department {
    label: string;
    value: string;
}

const data: Department[] = [
    { label: '인문대학', value: '인문대학' },
    { label: '자연과학대학', value: '자연과학대학' },
    { label: '사회과학대학', value: '사회과학대학' },
    { label: '글로벌정경대학', value: '글로벌정경대학' },
    { label: '공과대학', value: '공과대학' },
    { label: '정보기술대학', value: '정보기술대학' },
    { label: '경영대학', value: '경영대학' },
    { label: '예술체육대학', value: '예술체육대학' },
    { label: '사범대학', value: '사범대학' },
    { label: '도시과학대학', value: '도시과학대학' },
    { label: '생명과학기술대학', value: '생명과학기술대학' },
    { label: '동북아국제통상학부', value: '동북아국제통상학부' },
    { label: '법학부', value: '법학부' },
];

const Info: React.FC<InfoProps> = ({ navigation }) => {
    const [nickName, setNickName] = useState<string>('');
    const [depart, setDepart] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const onChangeNickname = useCallback((value: string) => {
        setNickName(value);
    }, []);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleDropdownSelect = (value: string) => {
        setDepart(value);
        setIsDropdownOpen(false);
    };

    return (
        <View>
            <Header
                containerStyle={{
                    borderBottomWidth: 0,
                    backgroundColor: 'white',
                    marginTop: 20,
                    alignItems: 'center',
                }}
                backgroundColor="white"
                barStyle="default"
                centerComponent={{
                    text: '정보입력',
                    style: { color: 'black', fontSize: 34, fontWeight: 'bold' },
                }}
                leftComponent={
                    <TouchableOpacity onPress={handleGoBack}>
                        <Icons name="arrow-back-ios" size={25} style={{ color: '#BDBDBD' }} />
                    </TouchableOpacity>
                }
                leftContainerStyle={{ flex: 1, justifyContent: 'center' }}
            />
            <View style={{ marginTop: 32 }}>
                <Input containerStyle={[styles.inputContainer]} onChangeText={onChangeNickname} placeholder="닉네임" />
            </View>
            <View style={{ marginTop: 32 }}>
                <TouchableOpacity onPress={handleDropdownToggle} style={styles.dropdownToggle}>
                    <Text style={styles.dropdownText}>{depart || '학과를 선택해주세요'}</Text>
                </TouchableOpacity>
                {isDropdownOpen && (
                    <ScrollView style={styles.dropdownList}>
                        {data.map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                style={styles.dropdownItem}
                                onPress={() => handleDropdownSelect(item.value)}
                            >
                                <Text>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>

            {/* <Button
                buttonStyle={{ width: 330, marginTop: 170, borderRadius: 100, height: 50 }}
                containerStyle={{ margin: 5, alignItems: 'center', justifyContent: 'center' }}
                disabledStyle={{
                    borderWidth: 2,
                    borderColor: '#F6F6F6',
                }}
                disabledTitleStyle={{ color: 'white' }}
                loadingProps={{ animating: false }}
                loadingStyle={{}}
                title="시작하기"
                titleProps={{}}
                titleStyle={{ textAlign: 'center' }}
            /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: '#F6F6F6',
        color: 'ADB3BC',
        justifyContent: 'space-around',
        borderColor: '#E8E8E8',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 16,
    },
    dropdownToggle: {
        backgroundColor: '#F6F6F6',
        color: 'ADB3BC',
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    dropdownText: {
        fontSize: 16,
        color: '#ADB3BC',
    },
    dropdownList: {
        maxHeight: 130,
        borderColor: 'gray',
        backgroundColor: '#F6F6F6',
        borderWidth: 0.5,
        borderRadius: 8,
        position: 'absolute',
        top: 50,
        width: '100%',
        zIndex: 999,
        flex: 1,
    },
    dropdownItem: {
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
    },
});

export default Info;
