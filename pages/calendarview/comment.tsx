import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';

const CommentsSection = () => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    const handleAddComment = () => {
        const newComment = {
            id: comments.length + 1,
            text: commentText,
            timestamp: new Date().toISOString(),
        };
        setComments([...comments, newComment]);
        setCommentText('');
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                        <Text style={styles.commentText}>{item.text}</Text>
                        <Text style={styles.timestamp}>{item.timestamp}</Text>
                    </View>
                )}
                style={styles.commentsList}
            />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputContainer}>
                <View style={styles.textInputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add a comment..."
                        value={commentText}
                        onChangeText={setCommentText}
                    />
                    <TouchableOpacity onPress={handleAddComment} style={styles.icon}>
                        <Icons name="send" size={25} color="#000" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#E0E0E0',
        flex: 1,
    },
    textInputContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        paddingRight: 10,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 20,
    },
    icon: {
        position: 'absolute',
        right: 10,
        alignSelf: 'center',
    },
    commentsList: {
        flex: 1,
    },
    commentItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    commentText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 12,
        color: 'gray',
    },
});

export default CommentsSection;
