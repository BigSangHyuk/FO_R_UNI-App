import React, { useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './auth/login';
import SignIn from './auth/signin';
import FindPass from './auth/findpass';
import Info from './auth/info';
import Navigation from './menus/navigation';

const Stack = createNativeStackNavigator();

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                {/* <NavigationContainer
                    theme={{
                        ...DefaultTheme,
                        colors: {
                            ...DefaultTheme.colors,
                            background: 'white',
                        },
                    }}
                >
                    {isLoggedIn ? (
                        <Navigation />
                    ) : (
                        <Stack.Navigator>
                            <Stack.Screen
                                name="LogIn"
                                component={LogIn}
                                options={{ headerShown: false }}
                                initialParams={{ handleLogin }}
                            />
                            <Stack.Screen name="Info" component={Info} options={{ headerShown: false }} />
                            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
                            <Stack.Screen name="FindPass" component={FindPass} options={{ headerShown: false }} />
                        </Stack.Navigator>
                    )}
                </NavigationContainer> */}
                <Navigation />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});

export default App;
