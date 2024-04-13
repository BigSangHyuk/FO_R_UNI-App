import AsyncStorage from '@react-native-async-storage/async-storage';
import Http from '../address/backend_url';

export const getStorage = async (key: string) => {
    const result = await AsyncStorage.getItem(key);
    return result && JSON.parse(result);
};

export const setStorage = async (key: string, value: string) => {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const removeStorage = async (key: string) => {
    return await AsyncStorage.removeItem(key);
};

export const refreshAccessToken = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!userId || !refreshToken) throw new Error('No refresh token available');

        const res = await fetch(Http + '/refresh', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: Number(userId),
                refreshToken: refreshToken,
            }),
        });
        const data = await res.json();
        if (res.status === 200) {
            setStorage('accessToken', data.accessToken);
            console.log(data.accessToken);
            return data.accessToken;
        } else {
            throw new Error('Unable to refresh access token');
        }
    } catch (error) {
        console.error('An error occurred while refreshing the access token:', error);
        throw error;
    }
};
