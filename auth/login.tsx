import React, { useState, useCallback } from 'react';
import { Input, Button, Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { View, TouchableOpacity, Text, StyleSheet, TextStyle } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import Http from '../address/backend_url';

interface LogInProps {
    navigation: NavigationProp<any>;
    handleLogin: () => void;
}

const LogIn: React.FC<LogInProps> = ({ navigation, handleLogin }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [emailMessage, setEmailMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [isshowPassword, setIsshowPassword] = useState<boolean>(false);
    const [isEmail, setIsEmail] = useState<boolean>(false);
    const [isPassword, setIsPassword] = useState<boolean>(false);

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

    const handleSignUpPress = () => {
        navigation.navigate('SignIn');
    };

    const handleFindPassPress = () => {
        navigation.navigate('FindPass');
    };

    const signIn = async () => {
        try {
            const res = await fetch(Http + `/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            if (res.status === 200) {
                console.log('로그인 시도');
                const data = await res.json();
                sessionStorage.setItem('token', data.token);
                handleLogin();
            }
        } catch (error) {
            console.error('에러', error);
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
                    text: '로그인',
                    style: { color: 'black', fontSize: 34, fontWeight: 'bold' },
                }}
                leftContainerStyle={{ flex: 1, justifyContent: 'center' }}
            />
            <View style={{ marginTop: 32 }}>
                <Input
                    onChangeText={onChangeEmail}
                    errorMessage={emailMessage}
                    placeholder="이메일"
                    errorStyle={{ color: isEmail ? 'blue' : 'red' }}
                />
                <Input
                    onChangeText={onChangePassword}
                    errorMessage={passwordMessage}
                    placeholder="비밀번호"
                    errorStyle={{ color: isPassword ? 'blue' : 'red' }}
                    rightIcon={
                        <TouchableOpacity onPress={togglePasswordVisibility} style={{ padding: 10 }}>
                            <Icons name="visibility" size={20} style={{ color: '#BDBDBD' }} />
                        </TouchableOpacity>
                    }
                    secureTextEntry={!isshowPassword}
                />
            </View>
            <View style={styles.textContainer}>
                <TouchableOpacity onPress={handleSignUpPress}>
                    <Text style={styles.text}>회원가입</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleFindPassPress}>
                    <Text style={[styles.text, { marginLeft: 60 }]}>비밀번호 찾기</Text>
                </TouchableOpacity>
            </View>
            <Button
                buttonStyle={{ width: 330, marginTop: 70, borderRadius: 100, height: 50 }}
                title="로그인"
                disabled={!isEmail || !isPassword}
                onPress={signIn}
                style={styles.button}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LogIn;
