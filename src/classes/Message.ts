import { Client } from "../Client.ts";

/** Class representing a message */
export class Message {
	public id: string | undefined;
	public content: string | undefined;
	public channel: string | undefined; //TODO: Channel Object
	public author: string | undefined; //TODO: User Object
	public timestamp: string | undefined;

	constructor(data: any, client: Client) {
		this.set(data, client);
	}

	set(d: any, client: Client) {
		this.id = d.id;
		this.content = d.content;
		this.channel = d.channel_id;
		this.author = d.author.id;
		this.timestamp = d.timestamp;
	}
}
