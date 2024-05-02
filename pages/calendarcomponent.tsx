import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CalendarView from './calendar';
import CalendarDetailPage from './calendardetail';

const Stack = createNativeStackNavigator();

const CalendarComponent = () => {
    return (
        <Stack.Navigator initialRouteName="CalendarView">
            <Stack.Screen name="CalendarView" component={CalendarView} options={{ headerShown: false }} />
            <Stack.Screen name="CalendarDetailPage" component={CalendarDetailPage} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default CalendarComponent;
