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
    { label: '국어국문학과', value: '1' },
    { label: '영어영문학과', value: '2' },
    { label: '독어독문학과', value: '3' },
    { label: '불어불문학과', value: '4' },
    { label: '일본지역문화학과', value: '5' },
    { label: '중어중국학과', value: '6' },
    { label: '수학과', value: '7' },
    { label: '물리학과', value: '8' },
    { label: '화학과', value: '9' },
    { label: '패션산업학과', value: '10' },
    { label: '해양학과', value: '11' },
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
                    <Text style={styles.dropdownText}>{depart || 'Select item'}</Text>
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

            <Button
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
            />
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
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    dropdownText: {
        fontSize: 16,
    },
    dropdownList: {
        maxHeight: 150,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        position: 'absolute',
        top: 50, // Adjust based on your UI
        width: '100%',
        backgroundColor: 'white',
        zIndex: 999,
    },
    dropdownItem: {
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
    },
});

export default Info;
