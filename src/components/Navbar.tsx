import Link from 'next/link';
import React, { FC, useEffect, useState } from 'react'
import Axios from 'axios';
import Image from 'next/image';

import { useAuthState, useAuthDispatch } from '../context/auth';
import { Sub } from '../types';

import Logo from '../images/logo.svg';
import { useRouter } from 'next/router';

const Navbar: FC = () => {
    const [name, setName] = useState('');
    const [subs, setSubs] = useState<Sub[]>([]);
    const [timer, setTimer] = useState(null);
    const { authenticated, loading} = useAuthState();
    const dispatch = useAuthDispatch();
    const router = useRouter();

    const logout = () => {
        Axios.get('/auth/logout')
            .then(() => {
                dispatch("LOGOUT");
                window.location.reload();
            })
            .catch((err) => console.log(err));
            
    }
    
    useEffect(() => {
        if (name.trim() === '') {
            setSubs([]);
            return
        }
        searchSubs()
    }, [name])

    const searchSubs = async () => {
        clearTimeout(timer);
        setTimer(setTimeout(async () => {
            try {
                const { data } = await Axios.get(`/subs/search/${name}`);
                setSubs(data);
                console.log(data);
            } catch (err) {
                console.log(err);
            }
        }, 250))
    }

    const goToSub = (subName: string) => {
        router.push(`/r/${subName}`);
        setName('');
    }

    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
            {/*  Logo and title */}
            <div className="flex items-center">
                <Link href="/">
                <a>
                    <Logo className="w-8 h-8 mr-2" />
                </a>
                </Link>
                <span className="text-2xl font-semibold">
                <Link href="/">Reddit</Link>
                </span>
            </div>
            {/*  Search Input */}
            <div className="relative flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
                <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
                <input 
                    type="text" 
                    className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none" 
                    placeholder="Search"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <div className="absolute left-0 right-0 bg-white" style={{ top: '100%' }}>
                    {subs?.map((sub) => (
                        <div 
                            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                            onClick={() => goToSub(sub.name)}
                        >
                            <Image 
                                className="rounded-full"
                                src={sub.imageUrl}
                                alt="sub" 
                                height={(8 * 16) / 4}
                                width={(8 * 16) / 4}
                            />
                            <div className="ml-4 text-sm">
                                <p className="font-medium">{sub.name}</p>
                                <p className="text-gray-600">{sub.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/*  Auth Buttons */}
            <div className="flex">
                {!loading && 
                    (authenticated 
                        ? (
                            <button 
                                className="w-32 py-1 mr-4 leading-5 hollow blue button"
                                onClick={logout}
                            >
                                ログアウト
                            </button>
                        )
                        : (
                            <>
                                <Link href="/login">
                                <a className="w-32 py-1 mr-4 leading-5 hollow blue button">
                                    ログイン
                                </a>
                                </Link>
                                <Link href="/register">
                                <a className="w-32 py-1 leading-5 blue button">
                                    新規登録
                                </a>
                                </Link>
                            </>
                        )
                    )
                }
            </div>
        </div>
    )
}

export default Navbar;
