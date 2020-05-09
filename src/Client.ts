import { EventEmitter } from "../deps.ts";

import { Versions, Discord, Endpoints } from "./util/Constants.ts";
import Gateway from "./gateway/WebsocketHandler.ts";

import { Channel, Guild, GuildMember, DMChannel, DMGroupChannel, Message, User, Role } from "./Classes.ts";

/**
 * Class representing the main client
 * @extends EventEmitter
 *
 *           import { Coward } from "https://deno.land/x/Client/mod.ts";
 *           const client = new Coward("TOKEN_GOES_HERE");
 *
 *           client.on("ready", () => {
 * 		           console.log("READY!");
 *           });
 *
 *           client.connect();
 */
export class Client extends EventEmitter {
	private _userAgent: string =
	`DiscordBot (https://github.com/fox-cat/Client), ${Versions.THIS}`;
	private gateway: Gateway;

	// TODO: Store guilds and etc. in here

	/**
	 * Create a Client
	 *
	 *       const client = new Coward("TOKEN_HERE");
	 */
	public constructor(private token: string) {
		super();
		this.gateway = new Gateway(token, this);
	}

	/** Connect to the Discord API */
	connect() {
		this.gateway.connect();
	}

	/**
	 * Post a Channel
	 *
	 *       client.postChannel("GUILD_ID", {name: "new-channel", type: 0});
	 */
	postChannel(guildID: string, options: Options.postChannel): Promise<Channel> {
		return new Promise(async (resolve, reject) => {
			this.request( "POST", Endpoints.GUILD_CHANNELS(guildID), options )
				.then((data: any) => { resolve(Channel.new(data, this)); })
				.catch((err: any) => { reject(err); });
		});
	}

	/**
	 * Modify a Channel
	 *
	 *       client.modifyChannel("CHANNEL_ID", {name: "new-name"});
	 */
	modifyChannel(channelID: string, options: Options.modifyChannel): Promise<Channel> {
		return new Promise(async (resolve, reject) => {
			this.request( "PATCH", Endpoints.CHANNEL(channelID), options )
				.then((data: any) => { resolve(Channel.new(data, this)); })
				.catch((err: any) => { reject(err); })
		});
	}

	/**
	 * Delete a Channel
	 *
	 *       client.deleteChannel("CHANNEL_ID");
	 */
	deleteChannel(channelID: string): void {
		this.request( "DELETE", Endpoints.CHANNEL(channelID) );
	}

	/**
	 * Post a message in a channel
	 *
	 *       client.postMessage("CHANNEL_ID", "Message!");
	 */
	postMessage(channelID: string, content: string | Options.postMessage): Promise<Message> {
		if(typeof content === "string") { content = { content: content } }
		return new Promise(async (resolve, reject) => {
			this.request( "POST", Endpoints.CHANNEL_MESSAGES(channelID), content )
				.then((data: any) => { resolve(new Message(data, this)); })
				.catch((err: any) => { reject(err); });
		});
	}

	/**
	 * Modify a message in a channel
	 *
	 *       client.modifyChannel("CHANNEL_ID", "MESSAGE_ID", "Edited message!");
	 */
	modifyMessage(channelID: string, messageID: string, content: string | Options.modifyMessage): Promise<Message> {
		if(typeof content === "string") { content = { content: content } }
		return new Promise(async (resolve, reject) => {
			this.request( "PATCH", Endpoints.CHANNEL_MESSAGE(channelID, messageID), content )
				.then((data: any) => { resolve(new Message(data, this)); })
				.catch((err: any) => { reject(err); })
		})
	}

	/**
	 * Delete a message in a channel
	 *
	 *       client.deleteMessage("CHANNEL_ID", "MESSAGE_ID");
	 */
	deleteMessage(channelID: string, messageID: string): void {
		this.request( "DELETE", Endpoints.CHANNEL_MESSAGE(channelID, messageID) );
	}

	/**
	 * Put a reaction on a message.
	 *
	 *       client.putReaction("CHANNEL_ID", "MESSAGE_ID", "EMOJI");
	 */
	putReaction(channelID: string, messageID: string, emoji: string, userID?: string): void {
		this.request( "PUT", Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelID, messageID, emoji, userID || "@me") );
	}

	/**
	 * Delete a reaction on a message.
	 *
	 *       client.deleteReaction("CHANNEL_ID", "MESSAGE_ID", "EMOJI", "USER_ID");
	 */
	deleteReaction(channelID: string, messageID: string, emoji: string, userID?: string): void {
		if(!userID) { userID = "@me"; }
		this.request( "DELETE", Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelID, messageID, emoji, userID) );
	}

	/**
	 * Delete all reactions on a message.
	 *
	 *       client.deleteAllReactions("CHANNEL_ID", "MESSAGE_ID");
	 */
	deleteAllReactions(channelID: string, messageID: string): void {
		this.request( "DELETE", Endpoints.CHANNEL_MESSAGE_REACTIONS(channelID, messageID) );
	}

	/**
	 * Delete all reactions with an emoji on a message.
	 *
	 *       client.deleteAllEmojiReactions("CHANNEL_ID", "MESSAGE_ID", "EMOJI");
	 */
	deleteAllEmojiReactions(channelID: string, messageID: string, emoji: string): void {
		this.request( "DELETE", Endpoints.CHANNEL_MESSAGE_REACTION(channelID, messageID, emoji) );
	}

	private async request(method: string, url: string, data?: any) {
		let json: {[k: string]: any} = {
			method: method,
			headers: {
				"User-Agent": this._userAgent,
				"Accept-Encoding": "gzip,deflate",
				"Content-Type": "application/json",
				"Authorization": "Bot " + this.token
			}
		}
		if(data !== undefined) json.body = JSON.stringify(data);
		const response = await fetch(Discord.API + url, json);
		return response.json();
	}
}

/** Namespace for functions */
export namespace Options {
	export interface client {

	}

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
