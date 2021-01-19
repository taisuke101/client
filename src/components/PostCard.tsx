import Link from 'next/link';
import React, { FC } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Axios from 'axios';
import classNames from 'classnames';

import { Post } from '../types';

dayjs.extend(relativeTime);

const ActionButton = ({ children }) => {
    return <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200" >
        { children }
    </div>
}

interface PostCardProps {
    post: Post
}

const PostCard: FC<PostCardProps> = ({ post: { identifier, slug, title, body, subName, createdAt, voteScore, userVote, commentCount, url, username} }) => {

    const vote = async(value: number) => {
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
        <div key={identifier} className="flex mb-4 bg-white rounded">
            {/* Vote section */}
            <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
                {/*  upvote */}
                <div 
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                    onClick={() => vote(1)}
                >
                    <i className={classNames("icon-arrow-up", {
                        "text-red-500": userVote === 1
                    })}></i>
                </div>
                <p className="text-xs font-bold">{ voteScore }</p>
                {/*  downvote */}
                <div 
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                    onClick={() => vote(-1)}
                >
                    <i className={classNames("icon-arrow-down", {
                        "text-blue-600": userVote === -1
                    })}></i>
                </div>
            </div>
            {/*  Post Data section */}
            <div className="w-full p-2">
                <div className="flex items-center">
                    <Link href={`/r/${subName}`}>
                        <img 
                        src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                        className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                        />
                    </Link>
                    <Link href={`/r/${subName}`}>
                        <a className="text-xs font-bold cursor-pointer hover:underline">
                            /r/{subName}
                        </a>
                    </Link>
                    <div className="flex text-xs text-gray-500">
                        <div className="mx-1">•</div>
                        Posted by
                        <Link href={`/u/${username}`}>
                            <a className="mx-1 hover:underline">
                            /u/{username}
                            </a>
                        </Link>
                        <Link href={`/r/${subName}/${identifier}/${slug}`}>
                            <a className="mx-1 hover:underline">
                            {dayjs(createdAt).fromNow()}
                            </a>
                        </Link>
                    </div>
                </div>
                <Link href={url}>
                <a className="my-1 text-lg font-medium">{title}</a>
                </Link>
                {
                body && <p className="my-1 text-sm">{body}</p>
                }
                <div className="flex">
                <Link href={url}>
                    <a>
                    <ActionButton>
                        <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                        <span className="font-bold">{commentCount}</span>
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
    )
}

export default PostCard;
