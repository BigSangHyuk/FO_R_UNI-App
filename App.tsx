import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer, DefaultTheme, NavigationContainerRef } from '@react-navigation/native';
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
        console.log('로그아웃 시도');
        try {
            await AsyncStorage.removeItem('autoLogin');
            await AsyncStorage.removeItem('accessToken'); // If you store accessToken, remove it as well.
            setIsLoggedIn(false);
            // Use reset to clear the navigation stack and bring the user back to the login screen
            navigationRef.current?.reset({
                index: 0,
                routes: [{ name: 'LogIn' }],
            });
            console.log('로그아웃 완료');
        } catch (error) {
            console.error('로그아웃 에러:', error);
        }
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
export const navigationRef = React.createRef();
export default App;
