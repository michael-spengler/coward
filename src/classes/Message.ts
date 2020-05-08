import { Client } from "../Client.ts";

/** Class representing a message */
export class Message {
	public id: string;
	public content: string;
	public channel: string; //TODO: Channel Object
	public author: string; //TODO: User Object
	public timestamp: string;

	constructor(data: object, client: Client) {
		this.id = data.id;
		this.content = data.content;
		this.channel = data.channel_id;
		this.author = data.author.id;
		this.timestamp = data.timestamp;
	}
}
