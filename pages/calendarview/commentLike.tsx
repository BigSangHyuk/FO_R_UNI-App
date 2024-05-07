import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icons from 'react-native-vector-icons/Feather';
import Http from '../../address/backend_url';
import { getStorage } from '../../auth/asyncstorage';

const CommentLike = ({ comment }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.likeCount);

    const toggleLike = async () => {
        const method = isLiked ? 'DELETE' : 'POST';
        const url = `${Http}/comments/${isLiked ? 'unlike' : 'like'}/${comment.id}`;
        const accessToken = await getStorage('accessToken');
        const response = await fetch(url, {
            method: method,
            headers: {
                Accept: '*/*',
                Authorization: `Bearer YOUR_ACCESS_TOKEN`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            setIsLiked(!isLiked);
            setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
        } else {
            console.error('Failed to toggle like');
        }
    };

    return (
        <View style={styles.commentItem}>
            <Text>{comment.content}</Text>
            <TouchableOpacity onPress={toggleLike}>
                <Icons name={'thumbs-up'} size={15} color={isLiked ? 'red' : 'black'} />
                <Text>{likeCount}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    commentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
});

export default CommentLike;
