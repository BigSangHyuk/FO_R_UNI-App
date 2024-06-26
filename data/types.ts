export interface UserInfo {
    id: number;
    email: string;
    password: string;
    department: string;
    departmentSec?: string;
    nickName: string;
    image: string;
    roles: { name: string }[];
}
export interface UserComment {
    postId: number;
    deadline: string;
    title: string;
    category: string;
    count: number;
}
export interface UserLike {
    content: string;
    postId: number;
    commentId: number;
    userId: number;
    commentLike: number;
    count: number;
}

export interface UserEdit {
    department: string;
    nickName: string;
    image: string;
}

export interface UnClassified {
    postId: number;
    deadline: number;
    postedAt: number;
    title: string;
    category: string;
}

export interface Scrapped {
    postId: number;
    deadline: null;
    title: string;
    category: string;
}

export interface Posts {
    id: number;
    category: string;
    title: string;
    content: string;
    imageUrl: string[];
    views: number;
    postedAt: string;
    deadline: string;
    noticeUrl: string;
    reported: boolean;
    postReportCount: number;
    classified: boolean;
}

export interface CalendarPosts {
    postId: number;
    category: string;
    title: string;
    deadline: number;
}

export interface CommentData {
    postId: number;
    content: string;
    parentCommentId?: number;
}
