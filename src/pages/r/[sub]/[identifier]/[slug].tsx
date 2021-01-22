import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import Axios from 'axios';
import classNames from 'classnames';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Post } from '../../../../types';
import Sidebar from '../../../../components/Sidebar';
import ActionButton from '../../../../components/ActionButton';
import { useAuthState } from '../../../../context/auth';

dayjs.extend(relativeTime);

const PostPage = () => {
    //localState
    //GlobalState
    const { authenticated } = useAuthState();
    //Utils
    const router = useRouter();
    const { identifier, sub, slug } = router.query;
    const { data: post, error } = useSWR<Post>((identifier && slug) ? `/posts/${identifier}/${slug}` : null);
    if (error) router.push('/');

    const vote = async(value: number) => {
        // ログインしていない場合はログインページに遷移
        if (!authenticated) router.push('/login');
        // 投票している場合はリセットする
        if (value === post.userVote) value = 0;
        
        try {
            const res = await Axios.post("/misc/vote", {
                identifier,
                slug,
                value
            })
            console.log(res.data);
            
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Head>
                <title>{post?.title}</title>
            </Head>
            <Link href={`/r/${sub}`} >
                <a>
                    <div className="flex items-center w-full h-20 p-8 bg-blue-500">
                        <div className="container flex">
                            { post && (
                                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                                    <Image
                                        src={post.sub.imageUrl}
                                        height={8 * 16 /2}
                                        width={8 * 16 /2} />
                                </div>
                            )}
                            <p className="text-xl font-semibold text-white">/r/{sub}</p>
                        </div>
                    </div>
                </a>
            </Link>
            <div className="container flex pt-5">
                {/* post */}
                <div className="w-160">
                    <div className="bg-white rounded">
                        {post && (
                            <div className="flex">
                            {/* Vote section */}
                                <div className="w-10 py-3 text-center rounded-l">
                                    {/*  upvote */}
                                    <div 
                                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                                        onClick={() => vote(1)}
                                    >
                                        <i className={classNames("icon-arrow-up", {
                                            "text-red-500": post.userVote === 1
                                        })}></i>
                                    </div>
                                    <p className="text-xs font-bold">{ post.voteScore }</p>
                                    {/*  downvote */}
                                    <div 
                                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                                        onClick={() => vote(-1)}
                                    >
                                        <i className={classNames("icon-arrow-down", {
                                            "text-blue-600": post.userVote === -1
                                        })}></i>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <div className="flex items-center">
                                        <p className="flex text-xs text-gray-500">
                                            Posted by
                                            <Link href={`/u/${post.username}`}>
                                                <a className="mx-1 hover:underline">
                                                /u/{post.username}
                                                </a>
                                            </Link>
                                            <Link href={`/r/${post.subName}/${identifier}/${slug}`}>
                                                <a className="mx-1 hover:underline">
                                                {dayjs(post.createdAt).fromNow()}
                                                </a>
                                            </Link>
                                        </p>
                                    </div>
                                    {/* Post title */}
                                    <h1 className="my-1 text-xl font-medium ">{post?.title}</h1>
                                    {/* Post body */}
                                    <p className="my-3 text-sm">{post.body}</p>
                                    {/* Action button */}
                                    <div className="flex">
                                        <Link href={post.url}>
                                            <a>
                                            <ActionButton>
                                                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                                                <span className="font-bold">{post.commentCount}</span>
                                            </ActionButton>
                                            </a>
                                        </Link>
                                        <ActionButton>
                                            <i className="mr-1 fas fa-share fa-xs"></i>
                                            <span className="font-bold">Share</span>
                                        </ActionButton>
                                        <ActionButton>
                                            <i className="mr-1 fas fa-bookmark fa-xs"></i>
                                            <span className="font-bold">Save</span>
                                        </ActionButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* sidebar */}
                {post && <Sidebar sub={post.sub} />}
            </div>
        </>
    )
}

export default PostPage;
;