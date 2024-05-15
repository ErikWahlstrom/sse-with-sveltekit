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

export const actions = {
    firstAction: async ({ request }) => {
        const data = await request.formData();
        const param1 = data.get('first');
        const param2 = data.get('second');
        const prom = new Promise((resolve, reject) => {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    if (i === 9) {
                        console.log('done');
                        resolve('done');
                    }
                }, i * 1000);
            }
        });
        await prom;
        return {
            status: 200,
            body: { message: "Params where: " + param1 + param2 }
        };
    },
    anotherAction: async (event) => {
        return {
            status: 200,
            body: { message: 'another action' }
        };
    }
} satisfies Actions;