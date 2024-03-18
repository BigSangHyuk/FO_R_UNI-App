import React, { useState, FC, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
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

interface MarkedDates {
    [key: string]: { marked: boolean };
}

interface Post {
    id: number;
    title: string;
    contents: string;
    date: string;
}

const CalendarComponent: FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('M월'));
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const fetchedPosts: Post[] = [
            {
                id: 1,
                title: '제목입니다.',
                contents: '내용입니다.',
                date: '2024-03-15',
            },
            {
                id: 2,
                title: '제목입니다.',
                contents: '내용입니다.',
                date: '2024-03-27',
            },
        ];
        setPosts(fetchedPosts);

        const markedDatesObj: MarkedDates = {};
        fetchedPosts.forEach((post) => {
            markedDatesObj[moment(post.date).format('YYYY-MM-DD')] = { marked: true };
        });
        setMarkedDates(markedDatesObj);
    }, []);

    const handleMonthChange = (month: DateData) => {
        setSelectedMonth(moment(month.dateString).format('M월'));
    };

    const handleOpenMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleDayPress = (day: DateData) => {
        setSelectedDate(day.dateString);
    };

    const renderItem = ({ item }: { item: Post }) => (
        <View style={styles.item}>
            <Text>{item.date}</Text>
            <Text>{item.title}</Text>
            <Text>{item.contents}</Text>
        </View>
    );

    const calendarTheme: any = {
        'stylesheet.calendar.header': {
            dayTextAtIndex0: {
                color: '#FF0000',
            },
            dayTextAtIndex6: {
                color: '#0064FF',
            },
        },
        todayTextColor: '#4DBFFF',
        textDayFontSize: 16,
        textDayFontWeight: '600',
        textMonthFontSize: 20,
        textMonthFontWeight: '',
        textSectionTitleColor: 'rgba(138, 138, 138, 1)',
    };

    return (
        <View style={styles.container}>
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
            <View style={styles.calendarContainer}>
                <Calendar
                    style={styles.calendar}
                    theme={calendarTheme}
                    hideExtraDays={true}
                    onMonthChange={(month: any) => {
                        handleMonthChange(month);
                    }}
                    monthFormat=""
                    renderArrow={(direction: string) =>
                        direction === 'left' ? (
                            <Icons name="chevron-left" size={20} />
                        ) : (
                            <Icons name="chevron-right" size={20} />
                        )
                    }
                    markedDates={{
                        ...markedDates,
                        ...(selectedDate && { [selectedDate]: { selected: true, selectedColor: '#4DBFFF' } }),
                    }}
                    onDayPress={handleDayPress}
                    markingType={'multi-dot'}
                />
            </View>
            <View style={styles.postsContainer}>
                <FlatList data={posts} renderItem={renderItem} keyExtractor={(item) => item.id.toString()} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    calendarContainer: {
        flex: 1,
    },
    calendar: {
        paddingBottom: 30,
        borderWidth: 1,
        borderColor: '#E9E9E9',
        borderRadius: 20,
        marginTop: 32,
    },
    postsContainer: {
        flex: 1,
        marginTop: 20,
    },
    item: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default CalendarComponent;
