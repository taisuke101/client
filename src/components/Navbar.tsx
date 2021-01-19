import Link from 'next/link';
import React, { FC } from 'react'
import Axios from 'axios';

import { useAuthState, useAuthDispatch } from '../context/auth';

import Logo from '../images/logo.svg';

const Navbar: FC = () => {
    const { authenticated, loading} = useAuthState();
    const dispatch = useAuthDispatch();

    const logout = () => {
        Axios.get('/auth/logout')
            .then(() => {
                dispatch("LOGOUT");
                window.location.reload();
            })
            .catch((err) => console.log(err));
            
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
            <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
                <i className="pl-4 pr-3 text-gray-500 fas fa-search"></i>
                <input type="text" className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none" placeholder="Search"/>
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
