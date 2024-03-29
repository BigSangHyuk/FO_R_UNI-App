import React, { useState, FC, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Header, Button } from 'react-native-elements';
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
                id: 2,
                title: '제목입니다.',
                contents: '내용입니다.',
                date: '2024-03-27',
            },
            {
                id: 2,
                title: '제목입니다.',
                contents: '내용입니다.',
                date: '2024-03-27',
            },
            {
                id: 2,
                title: '제목입니다.',
                contents: '내용입니다.',
                date: '2024-03-27',
            },
            {
                id: 2,
                title: '제목입니다.',
                contents: '내용입니다.',
                date: '2024-03-27',
            },
            {
                id: 2,
                title: '제목입니다.',
                contents: '내용입니다.',
                date: '2024-03-27',
            },
            {
                id: 2,
                title: '제목입니다.',
                contents: '내용입니다.',
                date: '2024-03-27',
            },
            {
                id: 2,
                title: '제목입니다.',
                contents: '내용입니다.',
                date: '2024-03-27',
            },
            {
                id: 2,
                title: '제목입니다.',
                contents: '내용입니다.',
                date: '2024-03-27',
            },
            {
                id: 2,
                title: '제목입니다.',
                contents: '내용입니다.',
                date: '2024-03-27',
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
                            // 여기에 일정 등록 로직을 추가하세요.
                            // 사용자로부터 일정 정보를 입력 받아 처리할 수 있습니다.
                            // 예: 일정 모달을 열거나, 다른 화면으로 이동하여 일정을 입력 받습니다.
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
    const selectedDatePosts = posts.filter((post) => post.date === selectedDate);

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
            <Header
                containerStyle={{
                    borderBottomWidth: 0,
                    backgroundColor: 'white',
                    marginTop: 20,
                    alignItems: 'center',
                    paddingHorizontal: 20,
                }}
                backgroundColor="white"
                barStyle="default"
                centerComponent={{
                    text: selectedMonth,
                    style: { color: '#1B1B1B', fontSize: 34, fontWeight: 'bold' },
                }}
                rightComponent={
                    <TouchableOpacity>
                        <Icons name="filter-list" size={25} style={{ color: '#BDBDBD' }} onPress={handleOpenFilter} />
                    </TouchableOpacity>
                }
                rightContainerStyle={{ flex: 1, justifyContent: 'center' }}
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
                    onDayLongPress={handleLongPress}
                    markingType={'multi-dot'}
                    horizontal={true}
                    pagingEnabled={true}
                />
            </View>
            <View style={{ flex: 1, marginTop: 100 }}>
                <View style={styles.postsContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={selectedDatePosts}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                </View>
            </View>
            <View style={{ marginBottom: 60, alignSelf: 'center' }}>
                <Button
                    title="스크랩한 게시물"
                    loading={false}
                    loadingProps={{ size: 'small', color: 'white' }}
                    buttonStyle={{
                        backgroundColor: 'rgba(111, 202, 186, 1)',
                        borderRadius: 5,
                    }}
                    titleStyle={{ fontWeight: 'bold', fontSize: 15 }}
                    containerStyle={{
                        height: 50,
                        width: 200,
                    }}
                    onPress={() => console.log('aye')}
                />
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
        borderColor: '#E9E9E9',
        borderRadius: 20,
        marginTop: 32,
    },
    postsContainer: {
        maxHeight: '70%',
        backgroundColor: 'white',
        marginTop: 17,
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 20,
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
});

export default CalendarComponent;
