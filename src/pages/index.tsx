import Head from 'next/head'
import { useEffect, useState } from 'react';
import Axios from 'axios';
import useSWR from 'swr';

import PostCard from '../components/PostCard';
import { Post } from '../types';

export default function Home() {
  const { data: posts } = useSWR('/posts');

  // const [posts, setPosts] = useState<Post[]>([]);

  // useEffect(() => {
  //   Axios.get('/posts')
  //   .then(res => setPosts(res.data))
  //   .catch(err => console.log(err));
  // }, [])

  return (
    <>
      <Head>
        <title>reddit: the fron page of the internet</title>
      </Head>
      <div className="container flex pt-4">
        {/* posts feed */}
        <div className="w-160">
          {posts?.map((post: Post) => (
              <PostCard post={post} key={post.identifier} />
          ))}
        </div>
        {/*  sidebar */}
      </div>
    </>
  )
}

// ↓ SSRをしたい時はデータの取得を下記のようにやると良い
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     const res = await Axios.get('/posts')

//     return { props: { posts: res.data }}
//   } catch (err) {
//     return { props: { error: 'エラーが発生しました！'}}
//   }
// }
