import { useRouter } from 'next/router'
import React from 'react';
import useSWR from 'swr';
import PostCard from '../../components/PostCard';

export default function Sub() {

    const router = useRouter();

    const subName = router.query.sub;

    const { data: sub, error } = useSWR(subName ? `/subs/${subName}` : null);

    if (error) router.push('/');

    let postsMarkup: {};
    !sub ? 
    postsMarkup = <p className="text-lg text-center">Loading..</p>:
    sub.posts.length === 0 ? 
    postsMarkup = <p className="text-lg text-center">記事が関連付けされていません。</p>:
    postsMarkup = sub.posts.map(post => (<PostCard key={post.identifier} post={post} />))
    
    return (
        <div className="container flex pt-5">
            {sub && (
                <div className="w-160">
                    {postsMarkup}
                </div>
            )}
        </div>
    )
}
