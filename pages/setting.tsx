import React, { FC, useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput } from 'react-native';
import { Header, Button } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';

interface SettingProps {
    handleLogOut: () => void;
}

const Setting: FC<SettingProps> = ({ handleLogOut }) => {
    const [pushEnabled, setPushEnabled] = useState<boolean>(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);
    const [english, setEnglish] = useState<boolean>(false);
    const [about, setAbout] = useState<boolean>(false);
    const [contact, setContact] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string>('');

    const togglePushSwitch = () => {
        setPushEnabled((prevState) => !prevState);
    };

    const toggleDarkModeSwitch = () => {
        setDarkModeEnabled((prevState) => !prevState);
    };

    const toggleEnglishSwitch = () => {
        setEnglish((prevState) => !prevState);
    };

    const toggleAbout = () => {
        setAbout((prevState) => !prevState);
    };

    const toggleContact = () => {
        setContact((prev) => !prev);
    };

    const handleSendFeedback = () => {
        console.log('Feedback submitted:', feedback);
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
                    text: '설정',
                    style: { color: '#1B1B1B', fontSize: 34, fontWeight: 'bold' },
                }}
                rightComponent={
                    <View style={styles.rightContainer}>
                        <Text style={styles.rightText} onPress={handleLogOut}>
                            로그아웃
                        </Text>
                    </View>
                }
            />
            <View style={[styles.separator, { marginTop: 18 }]} />
            <View style={[styles.settingContainer, { alignSelf: 'center' }]}>
                <View style={styles.itemContainer}>
                    <Text style={styles.item}>Push 알림</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Off</Text>
                        <Switch
                            value={pushEnabled}
                            onValueChange={togglePushSwitch}
                            trackColor={{ false: '#FFFFFF', true: '#46BD7B' }}
                            thumbColor={pushEnabled ? '#ffffff' : '#fffff'}
                        />
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>On</Text>
                    </View>
                </View>
                <View style={styles.separator} />
                <View style={styles.itemContainer}>
                    <Text style={styles.item}>언어/Languages</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Off</Text>
                        <Switch
                            value={english}
                            onValueChange={toggleEnglishSwitch}
                            trackColor={{ false: '#FFFFFF', true: '#46BD7B' }}
                            thumbColor={'#fffff'}
                        />
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>On</Text>
                    </View>
                </View>
                <View style={styles.separator} />
                <View style={styles.itemContainer}>
                    <Text style={styles.item}>다크 모드</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Off</Text>
                        <Switch
                            value={darkModeEnabled}
                            onValueChange={toggleDarkModeSwitch}
                            trackColor={{ false: '#FFFFFF', true: '#46BD7B' }}
                            thumbColor={'#fffff'}
                        />
                        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>On</Text>
                    </View>
                </View>
                <View style={styles.separator} />
                <View style={styles.itemContainer}>
                    <Text style={styles.item}>문의하기</Text>
                    <Icons name="contact-support" size={25} onPress={toggleContact} />
                </View>
                {contact && (
                    <View style={styles.aboutContainer}>
                        <View style={styles.feedbackContainer}>
                            <TextInput
                                style={styles.feedbackInput}
                                placeholder="어떤점이 불편하세요?"
                                value={feedback}
                                onChangeText={(text) => setFeedback(text)}
                                multiline
                            />
                            <Button title="전송" onPress={handleSendFeedback} buttonStyle={styles.sendButton} />
                        </View>
                    </View>
                )}
                <View style={styles.separator} />
                <View style={styles.itemContainer}>
                    <Text style={styles.item}>About us</Text>
                    <Icons name="keyboard-arrow-down" size={25} onPress={toggleAbout} />
                </View>
                <View></View>
                {about && (
                    <View style={styles.aboutContainer}>
                        <Text style={styles.aboutText}>컴퓨터 공학부 고재현</Text>
                        <Text style={styles.aboutText}>컴퓨터 공학부 김동후</Text>
                        <Text style={styles.aboutText}>컴퓨터 공학부 조제훈</Text>
                        <Text style={styles.aboutText}>컴퓨터 공학부 한재경</Text>
                    </View>
                )}
            </View>
            <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'bold', marginTop: 12 }}>
                FO_R_UNI version 1.0.1
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightText: {
        fontSize: 16,
        marginRight: 10,
        marginTop: 19,
    },
    separator: {
        height: 1,
        backgroundColor: '#000',
    },
    settingContainer: {
        width: 344,
        borderRadius: 10,
        borderColor: '#000',
        backgroundColor: '#F6F6F6',
        borderWidth: 1,
        marginTop: 16,
    },
    itemContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    item: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
    },
    aboutContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    aboutText: {
        fontSize: 16,
        fontWeight: 'normal',
        marginTop: 3,
    },
    feedbackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    feedbackInput: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: 5,
        marginTop: 5,
        width: '80%',
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#46BD7B',
        borderRadius: 5,
    },
});

export default Setting;
