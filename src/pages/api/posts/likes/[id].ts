import { db,  Post, eq } from 'astro:db';
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({params, request}) =>{
    const postId = params.id ?? ' ';
    const posts = await db.select().from(Post).where(
        eq(Post.id, postId)
    )
    if(posts.length === 0) {
        const post = {
            id: postId,
            title: 'Post not found',
            likes: 0
        }
        return new Response(JSON.stringify(post), {
            status: 200,
            headers: {
                'Content-Type':'application/json',
            }
        })
    }
    return new Response(JSON.stringify(posts.at(0)), {
        status: 200,
        headers: {
            'Content-Type':'application/json',
        }
    })
}

export const PUT: APIRoute = async ({params, request}) => {
    const postId = params.id ?? ' ';
    const posts = await db.select().from(Post).where(
        eq(Post.id, postId)
    );
    const {likes = 0} = await request.json();
    if(posts.length === 0){
        const newPosts = {
            id: postId,
            title: 'Post not Found',
            likes: 0
        };
        await db.insert(Post).values(newPosts);
        posts.push(newPosts);
    }
    const post = posts.at(0)!;
    post.likes = post.likes + likes;

    await db.update(Post).set(post).where(eq(Post.id, postId));
    
    return new Response('ok', {status: 200})
}