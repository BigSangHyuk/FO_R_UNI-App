import React, { useState, useRef, FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, FlatList } from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

const calendar: FC = () => {
    return (
        <Calendar
            style={styles.calendar}
            theme={{
                todayTextColor: 'black',
                textDayFontSize: 20,
                textDayFontWeight: 'bold',
                textMonthFontSize: 20,
                textMonthFontWeight: 'bold',
                textSectionTitleColor: 'rgba(138, 138, 138, 1)',
            }}
            hideExtraDays={true}
            monthFormat={'M월'}
            onMonthChange={(month) => {
                console.log(month);
            }}
            // 달 이동 화살표 구현 왼쪽이면 왼쪽 화살표 이미지, 아니면 오른쪽 화살표 이미지
            renderArrow={(direction) =>
                direction === 'left' ? <Icons name="left" size={20} /> : <Icons name="right" size={20} />
            }
        />
    );
};

const styles = StyleSheet.create({
    calendar: {
        paddingBottom: 30,
        borderWidth: 1,
        borderColor: '#E9E9E9',
        borderRadius: 20,
    },
});

export default calendar;
