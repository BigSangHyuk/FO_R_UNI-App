import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { Header } from 'react-native-elements';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

const CalendarDetailPage = ({ route }) => {
    const navigation = useNavigation();
    const post = route.params.post.detail; // 수정된 데이터 접근

    console.log(post);
    if (!post) {
        return <Text>정보를 불러올 수 없습니다.</Text>;
    }

    const openURL = () => {
        Linking.openURL(post.noticeUrl).catch((err) => console.error("Couldn't load page", err));
    };

    // 괄호를 포함하는 제목 분리 로직
    const titleParts = post.title.match(/(\[.*?\]|\(.*?\))?(.*)/) || ['', '', ''];
    const firstLine = titleParts[1] || '';
    const secondLine = titleParts[2].trim();

    return (
        <View style={styles.container}>
            <Header
                containerStyle={styles.headerContainer}
                barStyle="default"
                centerComponent={{
                    text: '상세 보기',
                    style: styles.headerTitle,
                }}
                leftComponent={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icons name="arrow-back-ios" size={25} style={styles.backIcon} />
                    </TouchableOpacity>
                }
            />
            <ScrollView style={styles.detailContainer} contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.ftitle}>{firstLine}</Text>
                <Text style={styles.stitle}>{secondLine}</Text>
                {post.imageUrl && post.imageUrl.length > 0 && (
                    <Image source={{ uri: post.imageUrl[0] }} style={styles.image} />
                )}
                <Text style={styles.content}>{post.content}</Text>
                <Text>등록일: {post.postedAt}</Text>
                <Text>마감일: {post.deadline}</Text>
                <TouchableOpacity style={styles.linkStyle} onPress={openURL}>
                    <Text style={styles.linkText}>원문 보기</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
        marginTop: 20,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerTitle: {
        color: '#1B1B1B',
        fontSize: 34,
        fontWeight: 'bold',
    },
    backIcon: {
        color: '#BDBDBD',
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    detailContainer: {
        padding: 20,
    },
    ftitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    stitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    linkStyle: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#E8F5E9',
        borderRadius: 5,
    },
    linkText: {
        color: '#2196F3',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default CalendarDetailPage;
