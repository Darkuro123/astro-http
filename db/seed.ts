import { getCollection } from 'astro:content';
import { db, Clients, Post } from 'astro:db';

// https://astro.build/db/seed
export default async function seed() {
	// TODO

	await db.insert(Clients).values([
		{id: 1, name:"carmila", age:38, isActivate: true},
		{id: 2, name:"bram", age:37, isActivate: true},
		{id: 3, name:"mary", age:35, isActivate: true},
		{id: 4, name:"sade", age:25, isActivate: true},
		{id: 5, name:"sisifo", age:12, isActivate: true},
		
	  ]);

	  const posts = await getCollection('blog');
	  await db.insert(Post).values(
		posts.map(p => ({
			id: p.id,
			title: p.data.title,
			likes: Math.round(Math.random() * 100),
		}))
	  )

	console.log('seed executed');
}
