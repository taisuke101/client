import Head from 'next/head';
import { useRouter } from 'next/router'
import React, { ChangeEvent, createRef, useEffect, useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import classNames from 'classnames';
import Axios from 'axios';

import PostCard from '../../components/PostCard';
import Sidebar from '../../components/Sidebar';
import { Sub } from '../../types';
import { useAuthState }from '../../context/auth';

export default function SubPage() {
    //local state
    const [ownSub, setownSub] = useState(false);
    //global state
    const { authenticated, user } = useAuthState();
    //utils

    const router = useRouter();
    const fileInputRef = createRef<HTMLInputElement>();

    const subName = router.query.sub;

    const { data: sub, error, revalidate } = useSWR<Sub>(subName ? `/subs/${subName}` : null);

    const openFileInput = (type: string) => {
        if (!ownSub) return 
        fileInputRef.current.name = type;
        fileInputRef.current.click();
    }

    const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0];

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', fileInputRef.current.name);

        try {
            await Axios.post<Sub>(`/subs/${sub?.name}/image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data'},
            })

            revalidate();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (!sub) return 
        setownSub(authenticated && user?.username === sub.username);
    })

    if (error) router.push('/');

    let postsMarkup: {};
    !sub ? 
    postsMarkup = <p className="text-lg text-center">Loading..</p>:
    sub.posts.length === 0 ? 
    postsMarkup = <p className="text-lg text-center">記事が関連付けされていません。</p>:
    postsMarkup = sub.posts.map(post => (<PostCard key={post.identifier} post={post} />))
    
    return (
        <>
            <Head>
                <title>{sub?.title}</title>
            </Head>
                {sub && (
                    <>
                    <input type="file" hidden={true} ref={fileInputRef} onChange={uploadImage} />
                    {/*  sub info and images */}
                    <>
                    {/*  banner image */}
                    <div 
                        className={classNames("bg-blue-500", { "cursor-pointer": ownSub })}
                        onClick={() => openFileInput("banner")}
                    >
                        {sub.bannerUrl ? (
                            <div 
                                className="h-56 bg-blue-500"
                                style={{ 
                                    backgroundImage: `url(${sub.bannerUrl})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            ></div>) 
                            : (<div className="h-20 bg-blue-500"></div>)
                        }
                    </div>
                    {/* sub meta data */}
                    <div className="h-20 bg-white">
                        <div className="container relative flex">
                            <div className="absolute" style={{ top: -15 }}>
                                <Image
                                    src={sub.imageUrl}
                                    alt="Sub"
                                    className={classNames("rounded-full", { "cursor-pointer": ownSub })}
                                    onClick={() => openFileInput("image")}
                                    width={70}
                                    height={70}
                                />
                            </div>
                            <div className="pt-1 pl-24">
                                <div className="flex imtes-center">
                                    <h1 className="mb-1 text-3xl font-bold">
                                        {sub.title}
                                    </h1>
                                </div>
                                <p className="text-sm font-bold text-gray-500">
                                    /r/{sub.name}
                                </p>
                            </div>
                        </div>
                    </div>
                    </>
                    {/*  posts & sidebar */}
                    <div className="container flex pt-5">
                        <div className="w-160">{postsMarkup}</div>
                        <Sidebar sub={sub}/>
                    </div>
                    </>
                )}
        </>
    )
}
