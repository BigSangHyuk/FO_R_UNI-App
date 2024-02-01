import React, { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { Input, InputProps, Button, Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { TextStyle, ViewStyle, StyleSheet, View } from 'react-native';

interface SignInProps extends InputProps {
    style?: ViewStyle;
}

const SignIn: React.FC<SignInProps> = ({ style }) => {
    const disabledInputStyle: TextStyle = { backgroundColor: 'white' };
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirm, setConfirm] = useState<string>('');
    const [emailMessage, setEmailMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordConfirmMessage, setPasswordConfirmMessage] = useState<string>('');

    const [isEmail, setIsEmail] = useState<Boolean>(false);
    const [isPassword, setIsPassword] = useState<Boolean>(false);
    const [isPasswordConfirm, setIsPasswordConfirm] = useState<Boolean>(false);

    const onChangeEmail = useCallback((value: string) => {
        const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        setEmail(value);
        if (!EmailRegex.test(value)) {
            setEmailMessage('이메일 형식이 아닙니다.');
            setIsEmail(false);
        } else {
            setEmailMessage('');
            setIsEmail(true);
        }
    }, []);

    const onChangePassword = useCallback((value: string) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        setPassword(value);
        if (!passwordRegex.test(value)) {
            setPasswordMessage('숫자+영문자+특수문자 조합으로 8자리 이상!');
            setIsPassword(false);
        } else {
            setPasswordMessage('안전한 비밀번호에요!');
            setIsPassword(true);
        }
    }, []);

    const onChangeConfirm = useCallback((value: string) => {
        setConfirm(value);
    }, []);

    useEffect(() => {
        if (password === confirm && password !== '' && confirm !== '') {
            setPasswordConfirmMessage('비밀번호를 똑같이 입력했어요!');
            setIsPasswordConfirm(true);
        } else if (password !== '' && confirm !== '') {
            setPasswordConfirmMessage('비밀번호가 틀려요. 다시 확인해주세요');
            setIsPasswordConfirm(false);
        }
    }, [password, confirm]);

    return (
        <View>
            <Header
                containerStyle={{
                    borderBottomWidth: 0,
                    backgroundColor: 'white',
                    marginTop: 70,
                    alignItems: 'center',
                }}
                backgroundColor="white"
                barStyle="default"
                centerComponent={{
                    text: '가입하기',
                    style: { color: 'black', fontSize: 34, fontWeight: 'bold' },
                }}
                leftComponent={{ icon: 'close', color: '#BDBDBD' }}
                leftContainerStyle={{ flex: 1, justifyContent: 'center' }}
            />
            <Input
                containerStyle={[style, styles.inputContainer]}
                disabledInputStyle={disabledInputStyle}
                inputContainerStyle={{}}
                onChangeText={onChangeEmail}
                errorMessage={emailMessage}
                placeholder="이메일"
            />
            <Input
                containerStyle={[style, styles.inputContainer]}
                disabledInputStyle={disabledInputStyle}
                inputContainerStyle={{}}
                onChangeText={onChangePassword}
                errorMessage={passwordMessage}
                placeholder="비밀번호"
                secureTextEntry={true}
            />
            <Input
                containerStyle={[style, styles.inputContainer]}
                disabledInputStyle={disabledInputStyle}
                inputContainerStyle={{}}
                errorMessage={passwordConfirmMessage}
                onChangeText={onChangeConfirm}
                rightIcon={<Icons name="visibility" size={20} style={{ color: '#BDBDBD' }} />}
                rightIconContainerStyle={{}}
                placeholder="비밀번호 확인"
                secureTextEntry={true}
            />
            <Button
                buttonStyle={{ width: 330, marginTop: 70, borderRadius: 100, height: 50 }}
                containerStyle={{ margin: 5, alignItems: 'center', justifyContent: 'center' }}
                disabledStyle={{
                    borderWidth: 2,
                    borderColor: '#4EA2EF',
                }}
                disabledTitleStyle={{ color: '#00F' }}
                loadingProps={{ animating: true }}
                loadingStyle={{}}
                title="회원가입"
                titleProps={{}}
                titleStyle={{ textAlign: 'center' }}
            />
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
        backgroundColor: '#F6F6F6',
        color: 'ADB3BC',
        justifyContent: 'space-around',
        borderColor: '#E8E8E8',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20,
    },
    header: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 30,
        marginTop: 70,
    },
    closeIcon: {
        marginLeft: 10,
    },
});

export default SignIn;
