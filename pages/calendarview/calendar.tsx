import React, { useState, FC, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    Alert,
    TouchableOpacity,
    PanResponder,
    Dimensions,
    Animated,
    Button,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import Filter from '../../menus/filter';
import { CalendarPosts } from '../../data/types';
import { getStorage } from '../../auth/asyncstorage';
import Http from '../../address/backend_url';
import { NavigationProp, useNavigation } from '@react-navigation/native';

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
interface CalendarProps {
    navigation: NavigationProp<any>;
}

const CalendarView: FC<CalendarProps> = ({ navigation }) => {
    const getGradientColorsByMonth = (month: number) => {
        if (month >= 12 || month <= 2) {
            return ['#0064CD', '#5ABEF5', 'white'];
        } else if (month >= 3 && month <= 5) {
            return ['#FFDC3C', '#FFFF96', 'white'];
        } else if (month >= 6 && month <= 8) {
            return ['#3CB371', '#82F9B7', 'white'];
        } else if (month >= 9 && month <= 11) {
            return ['#DB631F', '#F4A460', 'white'];
        }
    };

    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<string>(moment().format('YYYY년 M월'));
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [gradientColors, setGradientColors] = useState<string[]>(getGradientColorsByMonth(moment().month() + 1));
    const [posts, setPosts] = useState<CalendarPosts[]>([]);
    const filterTranslateX = useRef(new Animated.Value(Dimensions.get('window').width)).current;
    const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
    const [filter, setFilter] = useState('246-247-248-249-250-252-253');
    const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM'));

    useEffect(() => {
        const fetchPosts = async () => {
            const accessToken = await getStorage('accessToken');
            try {
                const res = await fetch(`${Http}/posts/filter?date=${currentMonth}&id=${filter}&dept=true`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (res.status === 200) {
                    const result = await res.json();
                    setPosts(result.data);

                    const newMarkedDates = {};
                    result.data.forEach((post) => {
                        const formattedDate = moment(post.deadline).format('YYYY-MM-DD');
                        newMarkedDates[formattedDate] = {
                            marked: true,
                            dots: [{ color: '#4DBFFF', selectedDotColor: '#4DBFFF' }],
                        };
                    });

                    setMarkedDates(newMarkedDates);
                } else {
                    console.log('Fetch failed:', res.statusText);
                }
            } catch (error) {
                console.error('Fetch API failed', error);
            }
        };
        console.log('필터변경', filter);
        fetchPosts();
    }, [currentMonth, filter]);

    const handlePostPress = async (postId) => {
        const url = `${Http}/posts/${postId}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await getStorage('accessToken')}`,
                },
            });
            const result = await response.json();
            if (response.status === 200) {
                navigation.navigate('CalendarDetailPage', { post: result });
            } else {
                Alert.alert('Error', 'Failed to fetch post details.');
            }
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event([null, { dx: filterTranslateX }], { useNativeDriver: false }),
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx > 50) {
                    Animated.spring(filterTranslateX, {
                        toValue: Dimensions.get('window').width,
                        useNativeDriver: true,
                    }).start(() => setIsFilterOpen(false));
                } else {
                    Animated.spring(filterTranslateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handleOpenFilter = () => {
        setIsFilterOpen(true);
        Animated.spring(filterTranslateX, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    const handleMonthChange = (month) => {
        const monthNumber = moment(month.dateString).month() + 1;
        setSelectedMonth(moment(month.dateString).format('YYYY년 M월'));
        setCurrentMonth(moment(month.dateString).format('YYYY-MM'));
        setGradientColors(getGradientColorsByMonth(monthNumber));
    };

    const handleDayPress = (day: DateData) => {
        setSelectedDate((prevSelectedDate) => (prevSelectedDate === day.dateString ? null : day.dateString));
    };
    const filterPostsBySelectedDate = () => {
        if (selectedDate) {
            return posts.filter((post) => moment(post.deadline).format('YYYY-MM-DD') === selectedDate);
        }
        return [];
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => handlePostPress(item.postId)}>
            <Text style={{ width: '100%' }} numberOfLines={1} ellipsizeMode="tail">
                {item.title}
            </Text>
        </TouchableOpacity>
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
            <LinearGradient style={styles.linear} colors={gradientColors}>
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
                                size={30}
                                style={{ color: '#BDBDBD' }}
                                onPress={handleOpenFilter}
                            />
                        </TouchableOpacity>
                    }
                    rightContainerStyle={{ justifyContent: 'center' }}
                />
            </LinearGradient>
            <View style={styles.calendarContainer}>
                <Calendar
                    style={styles.calendar}
                    theme={calendarTheme}
                    initialDate={currentDate}
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
                    horizontal={true}
                    pagingEnabled={true}
                />
            </View>
            {isFilterOpen && (
                <Animated.View
                    style={[styles.overlay, { transform: [{ translateX: filterTranslateX }] }]}
                    {...panResponder.panHandlers}
                >
                    <Filter
                        isFilterOpen={true}
                        onCloseFilter={() => setIsFilterOpen(false)}
                        setParentFilter={setFilter}
                        filter={filter}
                    />
                </Animated.View>
            )}
            <View style={{ flex: 1, marginTop: 100 }}>
                <FlatList
                    style={styles.postsContainer}
                    data={selectedDatePosts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.postId.toString()}
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
        backgroundColor: 'transparent',
        zIndex: 999,
    },
});

export default CalendarView;
