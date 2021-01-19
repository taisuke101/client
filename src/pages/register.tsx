import { FormEvent, useState } from 'react';
import Head from 'next/head';
import Axios from 'axios';
import { useRouter } from 'next/router';

import InputGroup from '../components/InputGroup';
import AgreementCheckbox from '../components/AgreementCheckbox';
import Button from '../components/Button';
import Induction from '../components/Induction';
import { useAuthState } from '../context/auth';


export default function Home() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<any>({});
  
  const { authenticated } = useAuthState();

  const router = useRouter();
  if (authenticated) router.push('/');

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    if (!agreement) {
      setErrors({ ...errors, agreement: '利用規約に同意して下さい！'})
      return 
    }
    
    try {
      await Axios.post('/auth/register', {
        email, password, username
      });
      router.push('/login');
    } catch (err) {
      setErrors(err.response.data);
    };
  }

  return (
    <div className='flex bg-white'>
      <Head>
        <title>register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div 
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/tile.jpg')"}}
      />
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            続けるには、利用規約とプライバシーポリシーに同意して下さい。
          </p>
          <form onSubmit={submitForm}>
            <AgreementCheckbox 
              error={errors.agreement}
              setValue={setAgreement}
              className="mb-6"
              checked={agreement}
            />
            <InputGroup 
              className="mb-2"
              type="email"
              value={email}
              setValue={setEmail}
              placeholder="Eメール"
              error={errors.email}
            />
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
              Sign Up
            </Button>
          </form>
          <Induction 
            inductionSentence="すでに作成している場合は"
            path="/login"
            inductionTo="ログインページへ"
          />
        </div>
      </div>
    </div>

  )
}