import React, { useState, useCallback } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Dimensions,
    ScrollView,
    Keyboard,
} from 'react-native';
import { UserInfo } from '../../data/types';
import { Input, Button } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
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
} from '../../data/department';

interface EditInfoProps {
    isVisible: boolean;
    onClose: () => void;
    userInfo: UserInfo;
}

const EditInfo: React.FC<EditInfoProps> = ({ isVisible, onClose, userInfo }) => {
    const [nickName, setNickName] = useState<string>('');
    const [uni, setUni] = useState<string | null>(null);
    const [depart, setDepart] = useState<string | null>(null);
    const [departCode, setDepartCode] = useState<string | null>(null);
    const [selectUni, setSelectUni] = useState<boolean>(false);
    const [selectDepart, setSelectDepart] = useState<boolean>(false);
    const [isUniOpen, setIsUniOpen] = useState<boolean>(false);
    const [isDepartOpen, setIsDepartOpen] = useState<boolean>(false);

    const onChangeNickname = useCallback((value: string) => {
        setNickName(value);
    }, []);

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
        const selectedDepartmentCode = getDepartmentsByUni(uni)?.find((department) => department.value === value)?.code;
        setDepart(value);
        setDepartCode(selectedDepartmentCode);
        setIsDepartOpen(false);
        setSelectDepart(true);
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
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>정보 수정</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeNickname}
                        value={nickName}
                        placeholder={userInfo?.nickName || '닉네임을 입력하세요'}
                        placeholderTextColor={'gray'}
                    />
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
                    <View style={{ marginTop: 150, flexDirection: 'row' }}>
                        <Button
                            buttonStyle={{ width: 50, borderRadius: 120, height: 50 }}
                            containerStyle={{ margin: 5, alignItems: 'center', justifyContent: 'center' }}
                            disabledTitleStyle={{ color: 'white' }}
                            loadingProps={{ animating: false }}
                            loadingStyle={{}}
                            title="저장"
                            titleProps={{}}
                            titleStyle={{ textAlign: 'center' }}
                        />
                        <Button
                            onPress={onClose}
                            buttonStyle={{ width: 50, borderRadius: 120, height: 50, backgroundColor: '#FF607F' }}
                            containerStyle={{ margin: 5, alignItems: 'center', justifyContent: 'center' }}
                            disabledTitleStyle={{ color: 'white' }}
                            loadingProps={{ animating: false }}
                            loadingStyle={{}}
                            title="취소"
                            titleProps={{}}
                            titleStyle={{ textAlign: 'center' }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: width * 0.8,
        height: height * 0.6,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        marginTop: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: '600',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        marginTop: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
    input: {
        backgroundColor: '#FFF',
        width: '100%',
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
        marginTop: 10,
        fontSize: 16,
    },
    saveButton: {
        marginTop: 10,
        backgroundColor: '#2196F3',
        borderRadius: 20,
        padding: 10,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dropdownToggle: {
        backgroundColor: '#FFF',
        width: '100%',
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
        zIndex: 999,
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
        zIndex: 999,
    },
});

export default EditInfo;
