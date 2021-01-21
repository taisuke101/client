import React, { FormEvent, useState } from 'react';
import Head from 'next/head';
import Axios from 'axios';
import { useRouter } from 'next/router';

import InputGroup from '../components/InputGroup';
import Button from '../components/Button';
import Induction from '../components/Induction';
import { useAuthDispatch, useAuthState }from '../context/auth'

export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});

    const dispatch = useAuthDispatch();
    const { authenticated } = useAuthState();

    const router = useRouter();
    if (authenticated) router.push('/')

    const submitForm = async (event: FormEvent) => {
        event.preventDefault();

        try {
            const res = await Axios.post('/auth/login', {
            password, username
            });
            dispatch("LOGIN", res.data);
            router.back();
        } catch (err) {
            setErrors(err.response.data);
        };
    }

    return (
    <div className='flex bg-white'>
        <Head>
            <title>Login</title>
        </Head>
        <div 
            className="h-screen bg-center bg-cover w-36"
            style={{ backgroundImage: "url('/images/tile.jpg')"}}
        />
        <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
            <h1 className="mb-2 text-lg font-medium">Login</h1>
        <form onSubmit={submitForm}>
            <InputGroup 
                className="mb-2"
                type="text"
                value={username}
                setValue={setUsername}
                placeholder="ユーザー名"
                error={errors.username}
            />
            <InputGroup 
                className="mb-2"
                type="password"
                value={password}
                setValue={setPassword}
                placeholder="パスワード"
                error={errors.password}
            />
            <Button>
                Login
            </Button>
        </form>
        <Induction 
            inductionSentence="ユーザーを作成していない場合は"
            path="/register"
            inductionTo="新規登録ページへ"
        />
        </div>
    </div>
    </div>

    )
}