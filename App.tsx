import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer, DefaultTheme, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './auth/login';
import FindPass from './auth/findPass';
import SignIn from './auth/signin';
import Info from './auth/info';
import Navigation from './menus/navigation';
import Http from './address/backend_url';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from './auth/asyncstorage';

const Stack = createNativeStackNavigator();

interface AppProps {
    navigation: NavigationProp<any>;
}

const App = ({ navigation }: AppProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogOut = async () => {
        const accessToken = await getStorage('accessToken');
        console.log('로그아웃시도');
        setIsLoggedIn(false);
        const res = await fetch(Http + `/log-out`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                accept: '*/*',
            },
            body: JSON.stringify({
                accessToken: await getStorage('accessToken'),
                refreshToken: await getStorage('refreshToken'),
            }),
        });
        if (res.ok) {
            setIsLoggedIn(false);
            console.log('로그아웃');
        } else {
            console.error(Error);
        }
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            const autoLogin = await AsyncStorage.getItem('autoLogin');
            const accessToken = await AsyncStorage.getItem('accessToken');

            if (autoLogin === 'true' && accessToken) {
                setIsLoggedIn(true);
            }
        };

        checkLoginStatus();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <NavigationContainer
                    theme={{
                        ...DefaultTheme,
                        colors: {
                            ...DefaultTheme.colors,
                            background: 'white',
                        },
                    }}
                >
                    <Stack.Navigator>
                        {isLoggedIn ? (
                            <Stack.Screen
                                name="Navigation"
                                component={() => <Navigation handleLogOut={handleLogOut} />}
                                options={{ headerShown: false }}
                            />
                        ) : (
                            <Stack.Screen name="LogIn" options={{ headerShown: false }}>
                                {(props) => <LogIn {...props} handleLogin={handleLogin} />}
                            </Stack.Screen>
                        )}
                        <Stack.Screen name="Info" component={Info} options={{ headerShown: false }} />
                        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                        <Stack.Screen name="FindPass" component={FindPass} options={{ headerShown: false }} />
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
