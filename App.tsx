import React, { useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer, DefaultTheme, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './auth/login';
import SignIn from './auth/signin';
import FindPass from './auth/findpass';
import Info from './auth/info';
import Navigation from './menus/navigation';

const Stack = createNativeStackNavigator();

interface AppProps {
    navigation: NavigationProp<any>;
}

const App = ({ navigation }: AppProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleLogOut = () => {
        setIsLoggedIn(false);
        sessionStorage.removeItem('token');
    };

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
                            <Stack.Screen
                                name="LogIn"
                                component={() => <LogIn handleLogin={handleLogin} navigation={navigation} />}
                                options={{ headerShown: false }}
                            />
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
