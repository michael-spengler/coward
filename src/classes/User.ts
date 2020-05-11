import { Client } from "../Client.ts";

/** Class representing a user */
export class User {
	public id: string | undefined;
	public username: string | undefined;
	public discriminator: string | undefined;
	public bot: boolean | undefined;

	constructor(data: any, client: Client) {
		this.set(data, client);
	}

	set(d: any, client: Client) {
		this.id = d.id;
		this.username = d.username;
		this.discriminator = d.discriminator;
		this.bot = d.bot || false;
	}
}
