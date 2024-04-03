import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/MaterialIcons';
import CalendarComponent from '../pages/calendar';
import Mypage from '../pages/mypage';
import Setting from '../pages/setting';
import UnClassify from '../pages/unclassify';
import Scrap from './scrap';
const Tab = createBottomTabNavigator();
interface NavigationProp {
    handleLogOut: () => void;
}
const Navigation: FC<NavigationProp> = ({ handleLogOut }) => {
    return (
        <Tab.Navigator initialRouteName="Calendar">
            <Tab.Screen
                name="Mypage"
                component={Mypage}
                options={{
                    title: '내 정보',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Icons name="account-circle" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Unclassify"
                component={UnClassify}
                options={{
                    title: '미분류글',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Icons name="list" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={CalendarComponent}
                options={{
                    title: '달력',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Icons name="calendar-month" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Scrap"
                component={Scrap}
                options={{
                    title: '스크랩한 글',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Icons name="post-add" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Setting"
                component={() => <Setting handleLogOut={handleLogOut} />}
                options={{
                    title: '설정',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Icons name="settings" color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    );
};

export default Navigation;
