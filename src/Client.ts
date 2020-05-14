import { EventEmitter, red, bold } from "../deps.ts";

import { Permissions, Versions, Discord, Endpoints } from "./util/Constants.ts";
import { permToArray } from "./util/Permission.ts"
import Gateway from "./gateway/WebsocketHandler.ts";
import { fear } from "./util/Fear.ts";

import { Channel, Guild, GuildMember, DMChannel, Message, User, Role, Invite } from "./Classes.ts";
import { RequestHandler } from "./rest/RequestHandler.ts";

/**
 * Class representing the main client
 * @extends EventEmitter
 *
 *            import { Coward } from "https://deno.land/x/Client/mod.ts";
 *            const client = new Coward("TOKEN_GOES_HERE");
 *
 *            client.on("ready", () => {
 * 		            console.log("READY!");
 *            });
 *
 *            client.connect();
 */
export class Client extends EventEmitter {
	private gateway: Gateway;
	private requestHandler: RequestHandler;

	public guilds: Map<string, Guild> = new Map<string, Guild>();
	public users: Map<string, User> = new Map<string, User>();
	public dmChannels: Map<string, DMChannel> = new Map<string, DMChannel>();
	public channelGuildIDs: Map<string, string> = new Map<string, string>();

	/**
	 * Create a Client
	 *
	 *       const client = new Coward("TOKEN_HERE");
	 */
	public constructor(public token: string, public options: Options.clientConstructor = {}) {
		super();
		this.gateway = new Gateway(token, this);
		this.requestHandler = new RequestHandler(this);
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
			this.requestHandler.request( "POST", Endpoints.GUILD_CHANNELS(guildID), options )
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
			this.requestHandler.request( "PATCH", Endpoints.CHANNEL(channelID), options )
				.then((data: any) => { resolve(Channel.new(data, this)); })
				.catch((err: any) => { reject(err); });
		});
	}

	/**
	 * Delete a Channel
	 *
	 *       client.deleteChannel("CHANNEL_ID");
	 */
	deleteChannel(channelID: string): void {
		this.requestHandler.request( "DELETE", Endpoints.CHANNEL(channelID) );
	}

	/**
	 * Post a message in a channel
	 *
	 *       client.postMessage("CHANNEL_ID", "Message!");
	 */
	postMessage(channelID: string, content: string | Options.postMessage): Promise<Message> {
		if(typeof content === "string") { content = { content: content } }
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "POST", Endpoints.CHANNEL_MESSAGES(channelID), content )
				.then((data: any) => { resolve(new Message(data, this)); })
				.catch((err: any) => { reject(err); });
		});
	}

	/**
	 * Modify a message in a channel
	 *
	 *       client.modifyMessage("CHANNEL_ID", "MESSAGE_ID", "Edited message!");
	 */
	modifyMessage(channelID: string, messageID: string, content: string | Options.modifyMessage): Promise<Message> {
		if(typeof content === "string") { content = { content: content } }
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "PATCH", Endpoints.CHANNEL_MESSAGE(channelID, messageID), content )
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
		this.requestHandler.request( "DELETE", Endpoints.CHANNEL_MESSAGE(channelID, messageID) );
	}

	// TODO: bulkDeleteMessage(channelID: string, amount: number): void {}

	/**
	 * Put a reaction on a message.
	 *
	 *       client.putReaction("CHANNEL_ID", "MESSAGE_ID", "EMOJI");
	 */
	putReaction(channelID: string, messageID: string, emoji: string, userID?: string): Promise<void> {
		return this.requestHandler.request( "PUT", Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelID, messageID, encodeURI(emoji), userID || "@me"));
	}

	/**
	 * Delete a reaction on a message.
	 *
	 *       client.deleteReaction("CHANNEL_ID", "MESSAGE_ID", "EMOJI", "USER_ID");
	 */
	deleteReaction(channelID: string, messageID: string, emoji: string, userID?: string): Promise<void> {
		return this.requestHandler.request( "DELETE", Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelID, messageID, encodeURI(emoji), userID || "@me"));
	}

	/**
	 * Delete all reactions on a message.
	 *
	 *       client.deleteAllReactions("CHANNEL_ID", "MESSAGE_ID");
	 */
	deleteAllReactions(channelID: string, messageID: string): Promise<void> {
		return this.requestHandler.request( "DELETE", Endpoints.CHANNEL_MESSAGE_REACTIONS(channelID, messageID));
	}

	/**
	 * Delete all reactions with an emoji on a message.
	 *
	 *       client.deleteAllEmojiReactions("CHANNEL_ID", "MESSAGE_ID", "EMOJI");
	 */
	deleteAllEmojiReactions(channelID: string, messageID: string, emoji: string): Promise<void> {
		return this.requestHandler.request( "DELETE", Endpoints.CHANNEL_MESSAGE_REACTION(channelID, messageID, encodeURI(emoji)));
	}

	// TODO: putChannelPermissions ?

	// TODO: createChannelInvite ?

	/**
	 * Returns a list of Invite objects
	 *
	 *       client.getChannelInvites("CHANNEL_ID");
	 */
	getChannelInvites(channelID: string): Promise<Array<Invite>> {
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "GET", Endpoints.CHANNEL_INVITES(channelID))
				.then((data: any) => {
					const arrayInvites: Array<Invite> = [];
					data.forEach((invite: any) => {
						arrayInvites.push(new Invite(invite, this))
					});
					resolve(arrayInvites);
				})
				.catch((err: any) => { reject(err); })
		});
	}

	/**
	 * Start typing in a channel. Bots should usually not use this, however if a bot is responding to a command and expects the computation to take a few seconds, this may be used to let the user know that the bot is processing their message.
	 *
	 *       client.postTyping("CHANNEL_ID");
	 */
	postTyping(channelID: string): void {
		this.requestHandler.request( "POST", Endpoints.CHANNEL_TYPING(channelID) );
	}

	/**
	 * Pin a message in a channel.
	 *
	 *       client.putPin("CHANNEL_ID", "MESSAGE_ID");
	 */
	putPin(channelID: string, messageID: string): void {
		this.requestHandler.request( "PUT", Endpoints.CHANNEL_PIN(channelID, messageID) );
	}

	/**
	 * Delete a pinned message in a channel.
	 *
	 *       client.deletePin("CHANNEL_ID", "MESSAGE_ID");
	 */
	deletePin(channelID: string, messageID: string): void {
		this.requestHandler.request( "DELETE", Endpoints.CHANNEL_PIN(channelID, messageID) );
	}

	// TODO: Emoji (https://discord.com/developers/docs/resources/emoji)

	/**
	 * Modify a guild's settings.
	 *
	 *       client.modifyGuild("GUILD_ID", {name: "new-name"});
	 */
	modifyGuild(guildID: string, options: Options.modifyGuild): Promise<Guild> {
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "PATCH", Endpoints.GUILD(guildID) )
				.then((data: any) => { resolve(new Guild(data, this)); })
				.catch((err: any) => { reject(err); } );
		});
	}

	/**
	 * Delete a guild. (MUST be guild owner)
	 *
	 *       client.deleteGuild("GUILD_ID");
	 */
	deleteGuild(guildID: string): void {
		this.requestHandler.request( "DELETE", Endpoints.GUILD(guildID) );
	}

	/**
	 * Modify a member.
	 *
	 *       client.modifyMember("GUILD_ID", "USER_ID", {nick: "haha nickname"});
	 */
	modifyMember(guildID: string, userID: string, options: Options.modifyMember): Promise<GuildMember> {
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "PATCH", Endpoints.GUILD_MEMBER(guildID, userID), options )
				.then((data: any) => { resolve(new GuildMember(data, this)); })
				.catch((err: any) => { reject(err); });
		});
	}

	/**
	 * Add a role to a member.
	 *
	 *       client.putRole("GUILD_ID", "USER_ID", "ROLE_ID");
	 */
	putRole(guildID: string, userID: string, roleID: string): void {
		this.requestHandler.request( "PUT", Endpoints.GUILD_MEMBER_ROLE(guildID, userID, roleID) )
	}

	/**
	 * Remove a role from a member.
	 *
	 *       client.removeRole("GUILD_ID", "USER_ID", "ROLE_ID");
	 */
	removeRole(guildID: string, userID: string, roleID: string): void {
		this.requestHandler.request( "DELETE", Endpoints.GUILD_MEMBER_ROLE(guildID, userID, roleID) )
	}

	/**
	 * Kick/remove a member from a guild.
	 *
	 *       client.removeMember("GUILD_ID", "USER_ID");
	 */
	removeMember(guildID: string, userID: string): void {
		this.requestHandler.request( "DELETE", Endpoints.GUILD_MEMBER(guildID, userID) )
	}

	/**
	 * Put a ban in a server.
	 *
	 *       client.putBan("GUILD_ID", "USER_ID", {"delete-message-days": 2});
	 */
	putBan(guildID: string, userID: string, options: Options.putBan): void {
		this.requestHandler.request( "PUT", Endpoints.GUILD_BAN(guildID, userID), options );
	}

	/**
	 * Delete a ban in a server.
	 *
	 *       client.deleteBan("GUILD_ID", "USER_ID");
	 */
	deleteBan(guildID: string, userID: string): void {
		this.requestHandler.request( "DELETE", Endpoints.GUILD_BAN(guildID, userID) );
	}
}

/** Namespace for functions */
export namespace Options {
	export interface clientConstructor {

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
		file?: {name: string, file: File | Blob},
		embed?: any
	}

	export interface modifyMessage {
		content?: string,
		// TODO: file
		embed?: any
	}

	export interface modifyGuild {
		name?: string,
		region?: string,
		verification_level?: number,
		default_message_notifcations?: number,
		explicit_content_filter?: number,
		afk_channel_id?: string,
		afk_timeout?: number,
		// TODO: icon
		owner_id?: string,
		// TODO: splash
		// TODO: banner
		system_channel_id?: string,
		rules_channel_id?: string,
		public_updates_channel_id?: string,
		preferred_locale?: string
	}

	export interface modifyMember {
		nick?: string,
		//roles?: Array<string>
		mute?: boolean,
		deaf?: boolean,
		/** The channel to move the member to (if they are in a voice channel) */
		channel_id?: string
	}

	export interface putBan {
		/** Amount of days to delete messages for (between 1-7) */
		"delete-message-days"?: number
		reason?: string
	}
}
