import React, { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { Input, InputProps, Button, Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { TextStyle, ViewStyle, StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Http from '../address/backend_url';

interface SignInProps extends InputProps {
    style?: ViewStyle;
    navigation: NavigationProp<any>;
}

const SignIn: React.FC<SignInProps> = ({ style, navigation }) => {
    const disabledInputStyle: TextStyle = { backgroundColor: 'white' };
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [emailMessage, setEmailMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState<string>('');
    const [isshowPassword, setIsshowPassword] = useState<Boolean>(false);
    const [isEmail, setIsEmail] = useState<Boolean>(false);
    const [isPassword, setIsPassword] = useState<Boolean>(false);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState<Boolean>(false);
    const [verify, setVerify] = useState<string>('');
    const [isVerify, setIsVerify] = useState<boolean>(false);
    const [isbuttonclick, setIsButtonClick] = useState<boolean>(false);
    const onChangeEmail = useCallback((value: string) => {
        const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setEmail(value);

        if (value === '') {
            setEmailMessage('');
            setIsEmail(false);
        } else if (!EmailRegex.test(value)) {
            setEmailMessage('이메일 형식이 아닙니다.');
            setIsEmail(false);
        } else {
            setEmailMessage('가입 가능한 이메일입니다.');
            setIsEmail(true);
        }
    }, []);

    const onChangePassword = useCallback(
        (value: string) => {
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
            setPassword(value);
            if (value === '') {
                setPasswordMessage('');
                setIsPassword(false);
            } else if (!passwordRegex.test(value)) {
                setPasswordMessage('숫자+영문자+특수문자 조합으로 8자리 이상으로 입력해주세요.');
                setIsPassword(false);
                setPasswordConfirmMessage('');
            } else {
                setPasswordMessage('안전한 비밀번호입니다.');
                setIsPassword(true);
            }
        },
        [confirm]
    );

    const onChangeConfirm = useCallback((value: string) => {
        setConfirm(value);
    }, []);

    const onChangeVerify = useCallback((value: string) => {
        setVerify(value);
        if (value === '') {
            setIsVerify(false);
        } else {
            setIsVerify(true);
        }
    }, []);

    useEffect(() => {
        if (isPassword) {
            if (password === confirm && password !== '' && confirm !== '') {
                setPasswordConfirmMessage('비밀번호를 똑같이 입력했어요!');
                setIsPasswordConfirm(true);
            } else if (password !== '' && confirm !== '') {
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
    }, [isPassword, password, confirm]);

    const togglePasswordVisibility = () => {
        setIsshowPassword(!isshowPassword);
    };
    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleSendEmail = async () => {
        const res = await fetch(Http + `/auth/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        if (res.status == 200) {
            setIsButtonClick(true);
            console.log(res);
        }
    };

    const handleConfirmEmail = async () => {
        const emailValue = email.toString();
        const codeValue = verify.toString();

        try {
            const response = await fetch(`${Http}/auth/certificate?email=${emailValue}&code=${codeValue}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            console.log(data);
            navigation.navigate('Info', { email: email, password: password });
        } catch (error) {
            console.log('에러인디용');
        }
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
                    text: '가입하기',
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
                {!isbuttonclick && (
                    <>
                        <Input
                            containerStyle={[style, styles.inputContainer]}
                            disabledInputStyle={disabledInputStyle}
                            inputContainerStyle={{}}
                            onChangeText={onChangeEmail}
                            errorMessage={emailMessage}
                            placeholder="이메일"
                            errorStyle={{ color: isEmail ? 'blue' : 'red' }}
                        />
                        <Input
                            containerStyle={[style, styles.inputContainer]}
                            disabledInputStyle={disabledInputStyle}
                            inputContainerStyle={{}}
                            onChangeText={onChangePassword}
                            errorMessage={passwordMessage}
                            placeholder="비밀번호"
                            secureTextEntry={true}
                            errorStyle={{ color: isPassword ? 'blue' : 'red' }}
                        />
                        <Input
                            containerStyle={[style, styles.inputContainer]}
                            disabledInputStyle={disabledInputStyle}
                            inputContainerStyle={{}}
                            errorMessage={passwordConfirmMessage}
                            onChangeText={onChangeConfirm}
                            rightIcon={
                                <TouchableOpacity onPress={togglePasswordVisibility} style={{ padding: 10 }}>
                                    <Icons name="visibility" size={20} style={{ color: '#BDBDBD' }} />
                                </TouchableOpacity>
                            }
                            rightIconContainerStyle={{}}
                            placeholder="비밀번호 확인"
                            secureTextEntry={!isshowPassword}
                            errorStyle={{ color: isPasswordConfirm ? 'blue' : 'red' }}
                        />
                    </>
                )}
                {isbuttonclick && (
                    <Input
                        containerStyle={[style, styles.inputContainer]}
                        disabledInputStyle={disabledInputStyle}
                        inputContainerStyle={{}}
                        onChangeText={onChangeVerify}
                        rightIconContainerStyle={{}}
                        placeholder="인증코드"
                        secureTextEntry={!isshowPassword}
                    />
                )}
            </View>
            {!isbuttonclick ? (
                <Button
                    onPress={handleSendEmail}
                    buttonStyle={{ width: 330, marginTop: 70, borderRadius: 100, height: 50 }}
                    containerStyle={{ margin: 5, alignItems: 'center', justifyContent: 'center' }}
                    disabledStyle={{
                        borderWidth: 2,
                        borderColor: '#F6F6F6',
                    }}
                    disabledTitleStyle={{ color: 'white' }}
                    loadingProps={{ animating: false }}
                    loadingStyle={{}}
                    title="인증 메일 보내기"
                    titleProps={{}}
                    titleStyle={{ textAlign: 'center' }}
                    disabled={!isEmail || !isPassword || !isPasswordConfirm}
                />
            ) : (
                <Button
                    onPress={handleConfirmEmail}
                    buttonStyle={{ width: 330, marginTop: 70, borderRadius: 100, height: 50 }}
                    containerStyle={{ margin: 5, alignItems: 'center', justifyContent: 'center' }}
                    disabledStyle={{
                        borderWidth: 2,
                        borderColor: '#F6F6F6',
                    }}
                    disabledTitleStyle={{ color: 'white' }}
                    loadingProps={{ animating: false }}
                    loadingStyle={{}}
                    title="정보 입력"
                    titleProps={{}}
                    titleStyle={{ textAlign: 'center' }}
                    disabled={!isVerify}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        backgroundColor: '#FFF',
        color: 'ADB3BC',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    header: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 50,
        marginTop: 70,
    },
    closeIcon: {
        marginLeft: 10,
    },
});

export default SignIn;
