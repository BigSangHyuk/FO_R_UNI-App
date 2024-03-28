import React, { FC } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Filter: FC = () => {
    return (
        <View style={styles.overlay}>
            <View style={styles.filterContainer}>
                <Text>게시글 필터</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    filterContainer: {
        width: '75%',
        height: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
    },
});

export default Filter;
