import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export const load: PageServerLoad = async ({ params }) => {
    const post = await fetch(`https://jsonplaceholder.typicode.com/posts/${Math.floor(Math.random() * 10) + 1}`)

    const initData = await post.json();
    console.log(initData)
    return {
        post: initData as Post
    };
};