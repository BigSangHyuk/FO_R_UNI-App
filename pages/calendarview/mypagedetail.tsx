import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Http from '../../address/backend_url';

const MypageDetailPage = ({ route }) => {
    const navigation = useNavigation();
    const { postId } = route.params;
    const [postData, setPostData] = useState(null);

    useEffect(() => {
        const fetchPostData = async () => {
            const response = await fetch(`${Http}/posts/${postId}`);
            const data = await response.json();
            if (response.ok) {
                setPostData(data);
            } else {
                console.error('Failed to fetch post data');
            }
        };

        fetchPostData();
    }, [postId]);

    if (!postData) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{postData.title}</Text>
            <Text>{postData.content}</Text>
        </ScrollView>
    );
};

export default MypageDetailPage;
