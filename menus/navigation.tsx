import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/MaterialIcons';
import CalendarView from '../pages/calendarview/calendar';
import Mypage from '../pages/mypage';
import CalendarComponent from '../pages/calendarview/calendarcomponent';
import Setting from '../pages/setting';
import UnClassify from '../pages/unclassify';
import Scrap from '../pages/scrap';
import { StyleSheet, View } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

interface NavigationProps {
    handleLogOut: () => void;
}
const hideTabBarScreens = ['CalendarDetailPage'];

const Navigation: FC<NavigationProps> = ({ handleLogOut }) => {
    // Pre-defined component for setting, to prevent recreation on re-render
    const SettingScreen = () => <Setting handleLogOut={handleLogOut} />;

    return (
        <View style={styles.container}>
            <Tab.Navigator
                initialRouteName="Calendar"
                screenOptions={({ route }) => ({
                    tabBarStyle: {
                        display: getFocusedRouteNameFromRoute(route) === 'CalendarDetailPage' ? 'none' : 'flex',
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen
                    name="Mypage"
                    component={Mypage}
                    options={{
                        title: '내 정보',
                        tabBarIcon: ({ color, size }) => <Icons name="account-circle" color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Unclassify"
                    component={UnClassify}
                    options={{
                        title: '미분류글',
                        tabBarIcon: ({ color, size }) => <Icons name="list" color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Calendar"
                    component={CalendarComponent}
                    options={{
                        title: '달력',
                        tabBarIcon: ({ color, size }) => <Icons name="calendar-month" color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Scrap"
                    component={Scrap}
                    options={{
                        title: '스크랩한 글',
                        tabBarIcon: ({ color, size }) => <Icons name="post-add" color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Setting"
                    component={SettingScreen} // Use pre-defined component
                    options={{
                        title: '설정',
                        tabBarIcon: ({ color, size }) => <Icons name="settings" color={color} size={size} />,
                    }}
                />
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    linearGradient: {
        flex: 1,
    },
});

export default Navigation;
