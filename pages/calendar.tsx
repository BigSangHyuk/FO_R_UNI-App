import React, { useState, useRef, FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, FlatList } from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { CalendarList, DateData, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';

LocaleConfig.locales['en'] = {
    monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
};
LocaleConfig.defaultLocale = 'en';

const CalendarComponent: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('M월'));
    const [selectedDates, setSelectedDates] = useState<{ [date: string]: { selected: boolean } }>({});
    const handleMonthChange = (month: DateData) => {
        setSelectedMonth(moment(month.dateString).format('M월'));
    };

    const handleOpenMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const calendarTheme: any = {
        'stylesheet.calendar.header': {
            dayTextAtIndex0: {
                color: '#FF0000',
            },
            dayTextAtIndex6: {
                color: '#4169e1',
            },
        },
        todayTextColor: '#4DBFFF',
        textDayFontSize: 20,
        textDayFontWeight: '600',
        textMonthFontSize: 20,
        textMonthFontWeight: '',
        textSectionTitleColor: 'rgba(138, 138, 138, 1)',
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
                    text: selectedMonth,
                    style: { color: '#1B1B1B', fontSize: 34, fontWeight: 'bold' },
                }}
                leftComponent={
                    <TouchableOpacity onPress={handleOpenMenu}>
                        <Icons name="menu" size={25} style={{ color: '#000000' }} />
                    </TouchableOpacity>
                }
                leftContainerStyle={{ flex: 1, justifyContent: 'center' }}
            />
            <CalendarList
                style={styles.calendar}
                horizontal
                theme={calendarTheme}
                hideExtraDays={true}
                onMonthChange={(month: any) => {
                    handleMonthChange(month);
                }}
                monthFormat=""
                renderArrow={(direction: string) =>
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
        marginTop: 32,
    },
});

export default CalendarComponent;
