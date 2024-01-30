import React from 'react';
import { Input, InputProps, Button, Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { TextStyle, ViewStyle, StyleSheet, View } from 'react-native';

interface SignInProps extends InputProps {
    style?: ViewStyle;
}

const SignIn: React.FC<SignInProps> = ({ style }) => {
    const disabledInputStyle: TextStyle = { backgroundColor: 'white' };

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
                errorMessage="이메일 형식으로 써주세요."
                placeholder="이메일"
            />
            <Input
                containerStyle={[style, styles.inputContainer]}
                disabledInputStyle={disabledInputStyle}
                inputContainerStyle={{}}
                errorMessage="비밀번호 형식을 확인해주세요"
                placeholder="비밀번호"
            />
            <Input
                containerStyle={[style, styles.inputContainer]}
                disabledInputStyle={disabledInputStyle}
                inputContainerStyle={{}}
                errorMessage="비밀번호가 일치하지 않습니다."
                rightIcon={<Icons name="visibility" size={20} style={{ color: '#BDBDBD' }} />}
                rightIconContainerStyle={{}}
                placeholder="비밀번호 확인"
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
