import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './auth/login';
import FindPass from './auth/findPass';
import SignIn from './auth/signin';
import Info from './auth/info';
import Navigation from './menus/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogOut = async () => {
        console.log('로그아웃시도');
        setIsLoggedIn(false);
        await AsyncStorage.removeItem('autoLogin');
        console.log('로그아웃');
    };

    useEffect(() => {
        const checkAutoLogin = async () => {
            const autoLogin = await AsyncStorage.getItem('autoLogin');
            const accessToken = await AsyncStorage.getItem('accessToken');

            if (autoLogin === 'true' && accessToken) {
                handleLogin();
            }
        };
        checkAutoLogin();
    }, []);

    return (
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
