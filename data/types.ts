export interface UserInfo {
    id: number;
    email: string;
    password: string;
    departmentType: string;
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
    departmentType: string;
    nickName: string;
    image: string;
}
