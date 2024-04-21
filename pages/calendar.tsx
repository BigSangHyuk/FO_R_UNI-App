import React, { useState, FC, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Alert,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import Filter from '../menus/filter';
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
    [key: string]: { marked?: boolean; dots?: { color: string; selectedDotColor: string }[] };
}

interface Post {
    id: number;
    title: string;
    contents: string;
    date: string;
}

const CalendarComponent: FC = () => {
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('M월'));
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [posts, setPosts] = useState<Post[]>([]);
    const flatListRef = useRef<FlatList | null>(null);

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
            {
                id: 3,
                title: '제목입니다.',
                contents: '내용입니다.',
                date: '2024-03-27',
            },
        ];
        setPosts(fetchedPosts);

        const markedDatesObj: MarkedDates = {};
        fetchedPosts.forEach((post) => {
            const formattedDate = moment(post.date).format('YYYY-MM-DD');
            markedDatesObj[formattedDate] = {
                marked: true,
                dots: [{ color: '#4DBFFF', selectedDotColor: '#4DBFFF' }],
            };
        });
        setMarkedDates(markedDatesObj);
    }, []);

    const handleMonthChange = (month: DateData) => {
        setSelectedMonth(moment(month.dateString).format('M월'));
    };

    const handleOpenFilter = () => {
        setIsFilterOpen((prev) => !prev);
    };

    const handleDayPress = (day: DateData) => {
        setSelectedDate((prevSelectedDate) => (prevSelectedDate === day.dateString ? null : day.dateString));
    };
    const filterPostsBySelectedDate = () => {
        if (selectedDate) {
            return posts.filter((post) => moment(post.date).format('YYYY-MM-DD') === selectedDate);
        }
        return [];
    };

    const handleLongPress = () => {
        if (selectedDate) {
            Alert.alert(
                '일정 등록',
                `일정을 등록하시겠습니까? (${moment(selectedDate).format('YYYY-MM-DD')})`,
                [
                    {
                        text: '취소',
                        style: 'cancel',
                    },
                    {
                        text: '확인',
                        onPress: () => {
                            console.log('일정이 등록되었습니다:', selectedDate);
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    };

    const renderItem = ({ item }: { item: Post }) => (
        <View style={styles.item}>
            <Text>{item.title}</Text>
            <Text>{moment(item.date).format('M월D일')}</Text>
        </View>
    );
    const selectedDatePosts = filterPostsBySelectedDate();

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
        textDayFontSize: 16,
        textDayFontWeight: '600',
        textMonthFontSize: 20,
        textMonthFontWeight: '',
        textSectionTitleColor: 'rgba(138, 138, 138, 1)',
    };

    return (
        <View style={styles.container}>
            <LinearGradient style={styles.linear} colors={['skyblue', 'white']}>
                <Header
                    containerStyle={{
                        borderBottomWidth: 0,
                        backgroundColor: 'transparent',
                        marginTop: 20,
                        alignItems: 'center',
                        paddingHorizontal: 20,
                    }}
                    barStyle="default"
                    centerComponent={{
                        text: selectedMonth,
                        style: { color: '#1B1B1B', fontSize: 34, fontWeight: 'bold' },
                    }}
                    rightComponent={
                        <TouchableOpacity>
                            <Icons
                                name="filter-list"
                                size={25}
                                style={{ color: '#BDBDBD' }}
                                onPress={handleOpenFilter}
                            />
                        </TouchableOpacity>
                    }
                    rightContainerStyle={{ flex: 1, justifyContent: 'center' }}
                />
            </LinearGradient>
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
                    onDayLongPress={handleLongPress}
                    markingType={'multi-dot'}
                    horizontal={true}
                    pagingEnabled={true}
                />
            </View>
            {isFilterOpen && (
                <View style={styles.overlay}>
                    <Filter isFilterOpen={false} onCloseFilter={() => setIsFilterOpen(false)} />;
                </View>
            )}
            <View style={{ flex: 1, marginTop: 100 }}>
                <FlatList
                    style={styles.postsContainer}
                    data={selectedDatePosts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={true}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    linear: {
        backgroundColor: '#15106b',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    calendarContainer: {
        flex: 1,
    },
    calendar: {
        borderColor: '#E9E9E9',
        borderRadius: 20,
        marginTop: 32,
    },
    postsContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        marginTop: 17,
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemDuration: {
        fontSize: 14,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
    },
});

export default CalendarComponent;
