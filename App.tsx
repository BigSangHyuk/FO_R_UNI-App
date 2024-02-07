import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './auth/login';
import SignIn from './auth/signin';
import FindPass from './auth/findPass';
import Info from './auth/Info';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                {/* <Info/> */}
                <NavigationContainer
                    theme={{
                        ...DefaultTheme,
                        colors: {
                            ...DefaultTheme.colors,
                            background: 'white',
                        },
                    }}
                >
                    <Stack.Navigator initialRouteName="Info">
                        <Stack.Screen
                            name="Info"
                            component={Info}
                            options={{ headerShown: false, contentStyle: { paddingHorizontal: 20 } }}
                        />
                        <Stack.Screen
                            name="LogIn"
                            component={LogIn}
                            options={{ headerShown: false, contentStyle: { paddingHorizontal: 20 } }}
                        />
                        <Stack.Screen
                            name="SignIn"
                            component={SignIn}
                            options={{ headerShown: false, contentStyle: { paddingHorizontal: 20 } }}
                        />
                        <Stack.Screen
                            name="FindPass"
                            component={FindPass}
                            options={{ headerShown: false, contentStyle: { paddingHorizontal: 20 } }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
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
