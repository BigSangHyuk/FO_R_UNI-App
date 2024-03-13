import React, { useState, useRef, FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, FlatList } from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

const calendar: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const handleOpenMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <View>
            <Header
                containerStyle={{
                    borderBottomWidth: 0,
                    backgroundColor: 'white',
                    marginTop: 20,
                    alignItems: 'center',
                }}
                backgroundColor="white"
                barStyle="default"
                centerComponent={{
                    text: '내 정보',
                    style: { color: '#1B1B1B', fontSize: 34, fontWeight: 'bold' },
                }}
                leftComponent={
                    <TouchableOpacity onPress={handleOpenMenu}>
                        <Icons name="menu" size={25} style={{ color: '#000000' }} />
                    </TouchableOpacity>
                }
                leftContainerStyle={{ flex: 1, justifyContent: 'center' }}
            />
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
                renderArrow={(direction) =>
                    direction === 'left' ? <Icons name="left" size={20} /> : <Icons name="right" size={20} />
                }
            />
        </View>
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
