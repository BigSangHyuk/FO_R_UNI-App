import React, { useState, useCallback, useEffect } from 'react';
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
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input, Button } from 'react-native-elements';
import Http from '../../address/backend_url';
import { getStorage, refreshAccessToken } from '../../auth/asyncstorage';

interface EditPassProps {
    isVisible: boolean;
    onClose: () => void;
    onEditSuccess: () => void;
    handleLogOut: () => void;
}

const EditPass: React.FC<EditPassProps> = ({ isVisible, onClose, handleLogOut, onEditSuccess }) => {
    const [oldpass, setOldPass] = useState<string>('');
    const [newpass, setNewPass] = useState<string>('');
    const [newpassconfirm, setNewPassConfirm] = useState<string>('');
    const [isPasswordConfirm, setIsPasswordConfirm] = useState<boolean>(false);
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [isPassword, setIsPassword] = useState<boolean>(false);
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState<string>('');
    const passEdit = async () => {
        const accessToken = await getStorage('accessToken');
        const res = await fetch(Http + `/users/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                accept: '*/*',
            },
            body: JSON.stringify({
                oldPassword: oldpass,
                newPassword: newpass,
            }),
        });
        console.log('Status Code:', res.status);
        if (res.status === 200) {
            console.log('Password change successful');
            Alert.alert(
                '비밀번호 변경',
                '비밀번호가 변경되었습니다.',
                [
                    {
                        text: '확인',
                        onPress: () => {
                            onClose();
                        },
                    },
                ],
                { cancelable: false }
            );
        } else if (res.status === 401) {
            try {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    passEdit();
                } else {
                    console.log('토큰 재발급 실패');
                }
            } catch (error) {
                console.error('Refresh token process failed:', error);
            }
        } else {
            console.error('bbb오류: ', res.status);
        }
    };

    const oldpassword = useCallback((value: string) => {
        setOldPass(value);
    }, []);

    const newpassword = useCallback((value: string) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        setNewPass(value);
        if (value === '') {
            setPasswordMessage('');
            setIsPassword(false);
        } else if (!passwordRegex.test(value)) {
            setPasswordMessage('숫자+영문자+특수문자 조합으로 8자리 이상으로 입력해주세요.');
            setIsPassword(false);
        } else {
            setPasswordMessage('변경 가능한 비밀번호 입니다.');
            setIsPassword(true);
        }
    }, []);

    const newpasswordconfirm = useCallback((value: string) => {
        setNewPassConfirm(value);
    }, []);

    useEffect(() => {
        if (isPassword) {
            if (newpass === newpassconfirm && newpass !== '' && newpassconfirm !== '') {
                setPasswordConfirmMessage('비밀번호를 똑같이 입력했어요!');
                setIsPasswordConfirm(true);
            } else if (newpassconfirm !== '' && newpass !== '') {
                setPasswordConfirmMessage('비밀번호가 틀려요. 다시 확인해주세요');
                setIsPasswordConfirm(false);
            } else {
                setPasswordConfirmMessage('');
                setIsPasswordConfirm(false);
            }
        } else {
            setPasswordConfirmMessage('');
            setIsPasswordConfirm(false);
        }
    }, [isPassword, newpass, newpassconfirm]);

    return (
        <Modal visible={isVisible} animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>비밀번호 수정</Text>
                    <Input
                        style={styles.input}
                        onChangeText={oldpassword}
                        value={oldpass}
                        placeholder={'원래의 비밀번호를 입력하세요'}
                        placeholderTextColor={'gray'}
                    />
                    <Input
                        style={styles.input}
                        onChangeText={newpassword}
                        value={newpass}
                        placeholder={'변경할 비밀번호를 입력하세요'}
                        placeholderTextColor={'gray'}
                        errorMessage={passwordMessage}
                        errorStyle={{ color: isPassword ? 'blue' : 'red' }}
                    />
                    <Input
                        style={styles.input}
                        onChangeText={newpasswordconfirm}
                        value={newpassconfirm}
                        placeholder={'변경할 비밀번호를 다시 입력'}
                        placeholderTextColor={'gray'}
                        errorMessage={passwordConfirmMessage}
                        errorStyle={{ color: isPasswordConfirm ? 'blue' : 'red' }}
                    />

                    <View style={{ marginTop: 100, flexDirection: 'row' }}>
                        <Button
                            onPress={passEdit}
                            buttonStyle={{ width: 120, borderRadius: 120, height: 50 }}
                            containerStyle={{ margin: 5, alignItems: 'center', justifyContent: 'center' }}
                            disabledTitleStyle={{ color: 'white' }}
                            loadingProps={{ animating: false }}
                            loadingStyle={{}}
                            title="변경하기"
                            titleProps={{}}
                            titleStyle={{ textAlign: 'center' }}
                        />
                        <Button
                            onPress={onClose}
                            buttonStyle={{ width: 100, borderRadius: 120, height: 50, backgroundColor: '#FF607F' }}
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

export default EditPass;
