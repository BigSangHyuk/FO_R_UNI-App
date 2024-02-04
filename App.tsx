import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import SignIn from './auth/signin';
import LogIn from './auth/login';

const App = () => {
    return (
        <ScrollView style={styles.main}>
            <StatusBar style="auto" />
            <View>
                <LogIn />
                {/* <SignIn /> */}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    main: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
});

export default App;
