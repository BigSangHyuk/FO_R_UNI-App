import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';

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
            <KeyboardAvoidingView behavior="padding" style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                />
                <TouchableOpacity style={styles.button} onPress={handleAddComment}>
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderColor: '#E0E0E0',
    },
    input: {
        flex: 1,
        borderColor: 'transparent',
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#007AFF',
        borderRadius: 20,
        marginLeft: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
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
    },
});

export default CommentsSection;
