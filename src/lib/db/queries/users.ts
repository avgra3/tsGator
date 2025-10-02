import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
	const userCheck = await getUserByName(name);
	// userCheck.forEach((value, index) => {
	// 	console.log(`- index[${index}] => value: ${value}`);
	// });
	if (userCheck.length > 0) {
		throw new Error(`ERROR: User "${name}" already exists!`);
	}
	const [result] = await db.insert(users)
		.values({ name: name })
		.returning();
	// console.log(`RESULT => ${result}`)
	return result;
}

export async function getUserByName(name: string) {
	const result = await db.select()
		.from(users)
		.where(eq(users.name, name));
	// console.log(`Currently ${result.length} users with name="${name}"!`);
	return result;
}

export async function getAllUsers() {
	const result = await db.select()
		.from(users)
	return result;
}

export async function deleteAllUsers() {
	await db.delete(users);
}
