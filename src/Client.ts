import { EventEmitter } from "../deps.ts";

import { Versions, Discord, Endpoints } from "./util/Constants.ts";
import Gateway from "./gateway/WebsocketHandler.ts";

import { Guild, GuildMember, DMChannel, DMGroupChannel, Message, User, Role } from "./Classes.ts";

/**
 * Class representing the main client
 * @extends EventEmitter
 *
 *       import { Coward } from "https://deno.land/x/Client/mod.ts";
 *       const client = new Coward("TOKEN_GOES_HERE");
 *
 *       client.on("ready", () => {
 * 		 	console.log("READY!");
 *       })
 *
 *       client.connect();
 */
export class Client extends EventEmitter {
	private _userAgent: string =
	`DiscordBot (https://github.com/fox-cat/Client), ${Versions.THIS}`;
	private gateway: Gateway;

	private guilds: Map<string, Guild> = new Map<string, Guild>();
	private dmChannels: Map<string, DMChannel> = new Map<string, DMChannel>();
	private dmGroupChannels: Map<string, DMGroupChannel> = new Map<string, DMGroupChannel>();
	private users: Map<string, User> = new Map<string, User>();

	/** Create a Client */
	public constructor(private token: string) {
		super();
		this.gateway = new Gateway(token, this);
	}

	/** Connect to the Discord API */
	connect() {
		this.gateway.connect();
	}

	/** Post a Channel */
	postChannel(guildID:string, options: Options.postChannel): void {
		this.request( "POST", Endpoints.GUILD_CHANNELS(guildID), options )
	}

	/** Modify a Channel */
	modifyChannel(channelID: string, options: Options.modifyChannel): void {
		this.request( "PATCH", Endpoints.CHANNEL(channelID), options );
	} // TODO: Promise<Channel>

	/** Delete a Channel */
	deleteChannel(channelID: string): void {
		this.request( "DELETE", Endpoints.CHANNEL(channelID) );
	}

	/** Post a message in a channel */
	postMessage(channelID: string, content: string | Options.postMessage): Promise<Message> {
		if(typeof content === "string") { content = { content: content } }
		return new Promise(async (resolve, reject) => {
			this.request( "POST", Endpoints.CHANNEL_MESSAGES(channelID), content )
				.then((data: any) => { resolve(new Message(data, this)); })
				.catch((err: any) => { reject(err); });
		});
	}

	/** Modify a message in a channel */
	modifyMessage(channelID: string, messageID: string, content: string | Options.modifyMessage): Promise<Message> {
		if(typeof content === "string") { content = { content: content } }
		return new Promise(async (resolve, reject) => {
			this.request( "PATCH", Endpoints.CHANNEL_MESSAGE(channelID, messageID), content )
				.then((data: any) => { resolve(new Message(data, this)); })
				.catch((err: any) => { reject(err); })
		})
	}

	/** Delete a message in a channel */
	deleteMessage(channelID: string, messageID: string) {
		this.request( "DELETE", Endpoints.CHANNEL_MESSAGE(channelID, messageID) );
	}

	async request(method: string, url: string, data?: any) {
		if(!data) data == null;
		const response = await fetch(Discord.API + url, {
			method: method,
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bot " + this.token,
			},
			body: JSON.stringify(data),
		});
		return response.json();
	}
}

/** Namespace for functions */
export namespace Options {
	export interface postChannel {
		name: string,
		type: number,
		position?: number,
		//permission_overwrites?:
		topic?: string,
		nsfw?: boolean,
		bitrate?: number,
		user_limit?: number,
		rate_limit_per_user?: number,
		parent_id?: string
	}

	export interface modifyChannel {
		name?: string,
		type?: number,
		position?: number,
		topic?: string,
		nsfw?: boolean,
		rate_limit_per_user?: number,
		bitrate?: number,
		user_limit?: number,
		//permission_overwrites?: Array<>,
		parent_id?: string
    }

	export interface postMessage {
		content?: string,
		tts?: boolean,
		// TODO file:
		embed?: any
	}

	export interface modifyMessage {
		content?: string,
		// TODO: file
		embed?: any
	}
}
