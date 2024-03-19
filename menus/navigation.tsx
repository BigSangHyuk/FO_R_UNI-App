import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CalendarComponent from '../pages/calendar';
import Mypage from '../pages/mypage';

const Tab = createBottomTabNavigator();

function Navigation() {
    return (
        <NavigationContainer
            theme={{
                ...DefaultTheme,
                colors: {
                    ...DefaultTheme.colors,
                    background: 'white',
                },
            }}
        >
            <Tab.Navigator initialRouteName="Calendar">
                <Tab.Screen
                    name="Calendar"
                    component={CalendarComponent}
                    options={{
                        title: '달력',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => <Icon name="calendar" color={color} size={size} />,
                    }}
                />
                <Tab.Screen
                    name="Mypage"
                    component={Mypage}
                    options={{
                        title: '내 정보',
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => <Icon name="profile" color={color} size={size} />,
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;
