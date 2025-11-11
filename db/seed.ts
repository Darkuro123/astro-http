import { db, Clients } from 'astro:db';

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
	console.log('seed executed');
}
