import EventEmitter from "https://deno.land/std/node/events.ts";

import { Versions, Discord, Endpoints } from "./util/Constants.ts";
import Gateway from "./gateway/WebsocketHandler.ts";

import { Message } from "./classes/Message.ts";

/**
 * Class representing the main client
 * @extends EventEmitter
 *
 *       import { Coward } from "../coward/mod.ts";
 *       const client = new Coward("TOKEN_GOES_HERE");
 */
export class Client extends EventEmitter {
	private _userAgent: string = `DiscordBot (https://github.com/fox-cat/criket), ${Versions.THIS}`
	private gateway: Gateway;

	/** Create a Client */
	public constructor(private token: string) {
		super();
		this.gateway = new Gateway(token, this);
	}

	/** Connect to the Discord API */
	connect() {
		this.gateway.connect();
	}

	/** Create a message in a channel */
	createMessage(channelID: string, content: string): Promise<Message> {
		return new Promise(async (resolve, reject) => {
			this.postData(Discord.API + Endpoints.CHANNEL_MESSAGES(channelID), { content: content, file: null, embed: {} })
				.then((data: any) => {
					resolve(new Message(data, this))
				})
				.catch((err: any) => {
					reject(err);
				})
		})
	}

	private async postData(url: string, data: any) {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": 'Bot ' + this.token
			},
			body: JSON.stringify(data)
		});
		return response.json();
	}
}
