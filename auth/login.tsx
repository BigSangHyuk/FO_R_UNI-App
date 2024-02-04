import React, { useState, useEffect, useCallback } from 'react';
import { Input, InputProps, Button, Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { TextStyle, ViewStyle, StyleSheet, View, TouchableOpacity, Text } from 'react-native';

interface SignInProps extends InputProps {
    style?: ViewStyle;
}

const LogIn: React.FC<SignInProps> = ({ style }) => {
    const disabledInputStyle: TextStyle = { backgroundColor: 'white' };
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailMessage, setEmailMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [isshowPassword, setIsshowPassword] = useState<Boolean>(false);
    const [isEmail, setIsEmail] = useState<Boolean>(false);
    const [isPassword, setIsPassword] = useState<Boolean>(false);

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
            setEmailMessage('');
            setIsEmail(true);
        }
    }, []);

    const onChangePassword = useCallback((value: string) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        setPassword(value);
        if (value === '') {
            setPasswordMessage('');
            setIsPassword(false);
        } else if (!passwordRegex.test(value)) {
            setPasswordMessage('숫자+영문자+특수문자 조합으로 8자리 이상으로 입력해주세요.');
            setIsPassword(false);
        } else {
            setPasswordMessage('');
            setIsPassword(true);
        }
    }, []);

    const togglePasswordVisibility = () => {
        setIsshowPassword(!isshowPassword);
    };

    return (
        <View>
            <Header
                containerStyle={{
                    borderBottomWidth: 0,
                    backgroundColor: 'white',
                    marginTop: 60,
                    alignItems: 'center',
                }}
                backgroundColor="white"
                barStyle="default"
                centerComponent={{
                    text: '로그인',
                    style: { color: 'black', fontSize: 34, fontWeight: 'bold' },
                }}
                leftContainerStyle={{ flex: 1, justifyContent: 'center' }}
            />
            <View style={{ marginTop: 32 }}>
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
                    errorStyle={{ color: isPassword ? 'blue' : 'red' }}
                    rightIcon={
                        <TouchableOpacity onPress={togglePasswordVisibility} style={{ padding: 10 }}>
                            <Icons name="visibility" size={20} style={{ color: '#BDBDBD' }} />
                        </TouchableOpacity>
                    }
                    rightIconContainerStyle={{}}
                    secureTextEntry={!isshowPassword}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>회원가입</Text>
                <Text style={[styles.text, { marginLeft: 60 }]}>비밀번호 찾기</Text>
            </View>
            <Button
                buttonStyle={{ width: 330, marginTop: 70, borderRadius: 100, height: 50 }}
                containerStyle={{ margin: 5, alignItems: 'center', justifyContent: 'center' }}
                disabledStyle={{
                    borderWidth: 2,
                    borderColor: '#F6F6F6',
                }}
                disabledTitleStyle={{ color: 'white' }}
                loadingProps={{ animating: false }}
                loadingStyle={{}}
                title="로그인"
                titleProps={{}}
                titleStyle={{ textAlign: 'center' }}
                disabled={!isEmail || !isPassword}
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
    textContainer: {
        marginTop: 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    text: {
        color: '#4EA2EF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LogIn;
