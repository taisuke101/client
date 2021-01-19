export interface Post {
    identifier: string;
    title: string;   
    body?: string;
    slug: string;
    username: string;
    subName: string;
    createdAt: string;
    updatedAt: string;   
    // Virtual fields
    url: string;
    voteScore?: number;
    commentCount?: number;
    userVote?: number;
}

export interface User {
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}