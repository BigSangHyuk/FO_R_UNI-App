import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Input, Button, Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import {
    UNI,
    Humanity,
    NaturalScience,
    SocialScience,
    GlobalEconomics,
    Engineering,
    InformationTechnology,
    Business,
    ArtPhysical,
    Education,
    UrbanScience,
    LifeScience,
    NortheastAsia,
    Law,
} from '../data/department';

interface InfoProps {
    navigation: NavigationProp<any>;
}

const Info: React.FC<InfoProps> = ({ navigation }) => {
    const [nickName, setNickName] = useState<string>('');
    const [uni, setUni] = useState<string | null>(null);
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
        setUni(value);
        setIsDropdownOpen(false);
    };

    const handleBlur = () => {
        setIsDropdownOpen(false);
    };

    return (
        <TouchableWithoutFeedback onPress={handleBlur}>
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
                    <Input
                        containerStyle={[styles.inputContainer]}
                        onChangeText={onChangeNickname}
                        placeholder="닉네임"
                    />
                </View>
                <View style={{ marginTop: 32 }}>
                    <TouchableOpacity onPress={handleDropdownToggle} style={styles.dropdownToggle}>
                        <Text style={[styles.dropdownText, { color: uni ? 'black' : '#ADB3BC' }]}>
                            {uni || '학부 선택'}
                        </Text>
                        <Icons name="arrow-drop-down" size={25} style={{ color: '#BDBDBD' }} />
                    </TouchableOpacity>

                    {isDropdownOpen && (
                        <ScrollView style={styles.dropdownList}>
                            {UNI.map((item) => (
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
        </TouchableWithoutFeedback>
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
        borderRadius: 8,
        paddingHorizontal: 8,
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#E8E8E8',
        borderWidth: 1,
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
