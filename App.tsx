import React from 'react';
import { StyleSheet, View } from 'react-native';
import SignIn from './auth/signin';

const App = () => {
    return (
        <View style={styles.container}>
            <SignIn style={styles.headerContainer} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    headerContainer: {
        backgroundColor: 'white',
        justifyContent: 'space-around',
        borderColor: 'black',
        borderWidth: 1,
    },
});

export default App;
