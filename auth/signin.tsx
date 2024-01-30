import React from 'react';
import { Input, InputProps } from 'react-native-elements';
import { ViewStyle, TextStyle } from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

interface SignInProps extends InputProps {
    style?: ViewStyle;
}

const SignIn: React.FC<SignInProps> = ({ style }) => {
    const disabledInputStyle: TextStyle = { backgroundColor: 'white' };

    return (
        <Input
            containerStyle={[style, {}]}
            disabledInputStyle={disabledInputStyle}
            inputContainerStyle={{}}
            errorMessage="이메일 형식으로 써주세요."
            leftIcon={<Icons name="account-outline" size={20} />}
            leftIconContainerStyle={{}}
            rightIcon={<Icons name="close" size={20} />}
            rightIconContainerStyle={{}}
            placeholder="E-mail"
        />
    );
};

export default SignIn;
