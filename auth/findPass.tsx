import React, { ChangeEvent, useState, useEffect, useCallback } from 'react';
import { Input, InputProps, Button, Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { TextStyle, ViewStyle, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Http from '../address/backend_url';

interface findPassProps extends InputProps {
    style?: ViewStyle;
    navigation: NavigationProp<any>;
}

const FindPass: React.FC<findPassProps> = ({ style, navigation }) => {
    const disabledInputStyle: TextStyle = { backgroundColor: 'white' };
    const [email, setEmail] = useState<string>('');
    const [emailMessage, setEmailMessage] = useState<string>('');
    const [isEmail, setIsEmail] = useState<Boolean>(false);

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

    const handleGoBack = () => {
        navigation.goBack();
    };

    const rePW = async () => {
        const res = await fetch(Http + `/auth/temp-pw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
        });
        if (res.status === 200) {
            console.log(res);
            Alert.alert('임시 비밀번호 발급 완료. 메일을 확인해주세요');
            navigation.navigate('LogIn');
        } else {
            console.error(Error);
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
                    text: '비밀번호 찾기',
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
                    containerStyle={[style, styles.inputContainer]}
                    disabledInputStyle={disabledInputStyle}
                    inputContainerStyle={{}}
                    onChangeText={onChangeEmail}
                    errorMessage={emailMessage}
                    placeholder="이메일"
                    errorStyle={{ color: isEmail ? 'blue' : 'red' }}
                />
            </View>

            <Button
                onPress={rePW}
                buttonStyle={{ width: 330, marginTop: 70, borderRadius: 100, height: 50 }}
                containerStyle={{ margin: 5, alignItems: 'center', justifyContent: 'center' }}
                disabledStyle={{
                    borderWidth: 2,
                    borderColor: '#F6F6F6',
                }}
                disabledTitleStyle={{ color: 'white' }}
                loadingProps={{ animating: false }}
                loadingStyle={{}}
                title="인증 메일 전송"
                titleProps={{}}
                titleStyle={{ textAlign: 'center' }}
                disabled={!isEmail}
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

export default FindPass;
