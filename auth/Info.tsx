import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
    const [selectUni, setSelectUni] = useState<boolean>(false);
    const [selectDepart, setSelectDepart] = useState<boolean>(false);
    const [isUniOpen, setIsUniOpen] = useState<boolean>(false);
    const [isDepartOpen, setIsDepartOpen] = useState<boolean>(false);

    const onChangeNickname = useCallback((value: string) => {
        setNickName(value);
    }, []);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleUniToggle = () => {
        setIsUniOpen(!isUniOpen);
        setIsDepartOpen(false);
    };

    const handleDepartToggle = () => {
        setIsDepartOpen(!isDepartOpen);
    };

    const handleUniSelect = (value: string) => {
        setUni(value);
        setDepart(null);
        setIsUniOpen(false);
        setSelectUni(true);
        setIsDepartOpen(false);
    };

    const handleDepartSelect = (value: string) => {
        setDepart(value);
        setIsDepartOpen(false);
        setSelectDepart(true);
    };

    const handleBlur = () => {
        setIsUniOpen(false);
        setIsDepartOpen(false);
        Keyboard.dismiss();
    };

    const getDepartmentsByUni = (selectedUni: string | null) => {
        switch (selectedUni) {
            case '인문대학':
                return Humanity;
            case '자연과학대학':
                return NaturalScience;
            case '사회과학대학':
                return SocialScience;
            case '글로벌정경대학':
                return GlobalEconomics;
            case '공과대학':
                return Engineering;
            case '정보기술대학':
                return InformationTechnology;
            case '경영대학':
                return Business;
            case '예술체육대학':
                return ArtPhysical;
            case '사범대학':
                return Education;
            case '도시과학대학':
                return UrbanScience;
            case '생명과학기술대학':
                return LifeScience;
            case '동북아국제통상학부':
                return NortheastAsia;
            case '법학부':
                return Law;
        }
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
                        keyboardType="default"
                    />
                </View>
                <View style={{ marginTop: 32, zIndex: 1 }}>
                    <TouchableOpacity onPress={handleUniToggle} style={styles.dropdownToggle}>
                        <Text style={[styles.dropdownText, { color: uni ? 'black' : '#ADB3BC' }]}>
                            {uni || '학부 선택'}
                        </Text>
                        <Icons name="arrow-drop-down" size={25} style={{ color: '#BDBDBD' }} />
                    </TouchableOpacity>

                    {isUniOpen && (
                        <ScrollView style={styles.dropdownList}>
                            {UNI.map((item) => (
                                <TouchableOpacity
                                    key={item.value}
                                    style={styles.dropdownItem}
                                    onPress={() => handleUniSelect(item.value)}
                                >
                                    <Text>{item.value}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>
                {!selectUni || (
                    <View style={{ marginTop: 32, zIndex: 0 }}>
                        <TouchableOpacity onPress={handleDepartToggle} style={styles.dropdownToggle}>
                            <Text style={[styles.dropdownText, { color: depart ? 'black' : '#ADB3BC' }]}>
                                {depart || '과 선택'}
                            </Text>
                            <Icons name="arrow-drop-down" size={25} style={{ color: '#BDBDBD' }} />
                        </TouchableOpacity>

                        {isDepartOpen && (
                            <ScrollView style={styles.dropdownList}>
                                {getDepartmentsByUni(uni)?.map((item) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        style={styles.dropdownItem}
                                        onPress={() => handleDepartSelect(item.value)}
                                    >
                                        <Text>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                )}
                <View style={{ zIndex: -1, marginTop: 100 }}>
                    {selectUni && selectDepart && nickName && (
                        <Button
                            buttonStyle={{ width: 330, borderRadius: 120, height: 50 }}
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
                            disabled={!selectDepart || !nickName || !selectUni}
                        />
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: '#FFF',
        color: 'ADB3BC',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    dropdownToggle: {
        backgroundColor: '#FFF',
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
