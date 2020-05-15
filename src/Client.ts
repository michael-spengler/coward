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

	/** Create a Client */
	public constructor(public token: string, public options: Options.clientConstructor = {}) {
		super();
		this.gateway = new Gateway(token, this);
		this.requestHandler = new RequestHandler(this);
	}

	/** Connect to the Discord API */
	connect() {
		this.gateway.connect();
	}

	postChannel(guildID: string, options: Options.postChannel): Promise<Channel> {
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "POST", Endpoints.GUILD_CHANNELS(guildID), options )
				.then((data: any) => { resolve(Channel.from(data, this)) })
				.catch((err: any) => { reject(err) })
		});
	}

	modifyChannel(channelID: string, options: Options.modifyChannel): Promise<Channel> {
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "PATCH", Endpoints.CHANNEL(channelID), options )
				.then((data: any) => { resolve(Channel.from(data, this)) })
				.catch((err: any) => { reject(err) })
		});
	}

	deleteChannel(channelID: string): Promise<void> {
		return this.requestHandler.request( "DELETE", Endpoints.CHANNEL(channelID) );
	}

	postMessage(channelID: string, content: string | Options.postMessage): Promise<Message> {
		if(typeof content === "string") { content = { content: content } }
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "POST", Endpoints.CHANNEL_MESSAGES(channelID), content )
				.then((data: any) => { resolve(new Message(data, this)) })
				.catch((err: any) => { reject(err) })
		})
	}

	modifyMessage(channelID: string, messageID: string, content: string | Options.modifyMessage): Promise<Message> {
		if(typeof content === "string") { content = { content: content } }
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "PATCH", Endpoints.CHANNEL_MESSAGE(channelID, messageID), content )
				.then((data: any) => { resolve(new Message(data, this)) })
				.catch((err: any) => { reject(err) })
		});
	}

	deleteMessage(channelID: string, messageID: string): Promise<void> {
		return this.requestHandler.request( "DELETE", Endpoints.CHANNEL_MESSAGE(channelID, messageID) );
	}

	// TODO: bulkDeleteMessage(channelID: string, amount: number): void {}

	putReaction(channelID: string, messageID: string, emoji: string, userID?: string): Promise<void> {
		return this.requestHandler.request( "PUT", Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelID, messageID, encodeURI(emoji), userID || "@me"));
	}

	deleteReaction(channelID: string, messageID: string, emoji: string, userID?: string): Promise<void> {
		return this.requestHandler.request( "DELETE", Endpoints.CHANNEL_MESSAGE_REACTION_USER(channelID, messageID, encodeURI(emoji), userID || "@me"));
	}

	deleteAllReactions(channelID: string, messageID: string): Promise<void> {
		return this.requestHandler.request( "DELETE", Endpoints.CHANNEL_MESSAGE_REACTIONS(channelID, messageID));
	}

	deleteAllEmojiReactions(channelID: string, messageID: string, emoji: string): Promise<void> {
		return this.requestHandler.request( "DELETE", Endpoints.CHANNEL_MESSAGE_REACTION(channelID, messageID, encodeURI(emoji)));
	}

	// TODO: putChannelPermissions ?

	// TODO: createChannelInvite ?

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

	/** Bots should usually not use this, however if a bot is responding to a command and expects the computation to take a few seconds, this may be used to let the user know that the bot is processing their message. */
	postTyping(channelID: string): void {
		this.requestHandler.request( "POST", Endpoints.CHANNEL_TYPING(channelID) );
	}

	putPin(channelID: string, messageID: string): void {
		this.requestHandler.request( "PUT", Endpoints.CHANNEL_PIN(channelID, messageID) );
	}

	deletePin(channelID: string, messageID: string): void {
		this.requestHandler.request( "DELETE", Endpoints.CHANNEL_PIN(channelID, messageID) );
	}

	// TODO: Emoji (https://discord.com/developers/docs/resources/emoji)

	modifyGuild(guildID: string, options: Options.modifyGuild): Promise<Guild> {
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "PATCH", Endpoints.GUILD(guildID) )
				.then((data: any) => { resolve(new Guild(data, this)); })
				.catch((err: any) => { reject(err); } );
		});
	}

	deleteGuild(guildID: string): void {
		this.requestHandler.request( "DELETE", Endpoints.GUILD(guildID) );
	}

	modifyMember(guildID: string, userID: string, options: Options.modifyMember): Promise<GuildMember> {
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "PATCH", Endpoints.GUILD_MEMBER(guildID, userID), options )
				.then((data: any) => { resolve(new GuildMember(data, this)); })
				.catch((err: any) => { reject(err); });
		});
	}

	putRole(guildID: string, userID: string, roleID: string): void {
		this.requestHandler.request( "PUT", Endpoints.GUILD_MEMBER_ROLE(guildID, userID, roleID) )
	}

	removeRole(guildID: string, userID: string, roleID: string): void {
		this.requestHandler.request( "DELETE", Endpoints.GUILD_MEMBER_ROLE(guildID, userID, roleID) )
	}

	removeMember(guildID: string, userID: string): void {
		this.requestHandler.request( "DELETE", Endpoints.GUILD_MEMBER(guildID, userID) )
	}

	putBan(guildID: string, userID: string, options: Options.putBan): void {
		this.requestHandler.request( "PUT", Endpoints.GUILD_BAN(guildID, userID), options );
	}

	deleteBan(guildID: string, userID: string): void {
		this.requestHandler.request( "DELETE", Endpoints.GUILD_BAN(guildID, userID) );
	}

	postRole(guildID: string, options: Options.postRole): Promise<Role> {
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "POST", Endpoints.GUILD_ROLES(guildID), options )
				.then((data: any) => { resolve(new Role(data, this)) })
				.catch((err: any) => { reject(err) })
		})
	}

	// TODO: modify role positions https://discord.com/developers/docs/resources/guild#modify-guild-role-positions

	modifyRole(guildID: string, roleID: string, options: Options.modifyRole): Promise<Role> {
		return new Promise(async (resolve, reject) => {
			this.requestHandler.request( "PATCH", Endpoints.GUILD_ROLE(guildID, roleID), options )
				.then((data: any) => { resolve(new Role(data, this)) })
				.catch((err: any) => { reject(err) })
		})
	}

	deleteRole(guildID: string, roleID: string): Promise<void> {
		return this.requestHandler.request( "DELETE", Endpoints.GUILD_ROLE(guildID, roleID) )
	}

	// TODO: prune https://discord.com/developers/docs/resources/guild#modify-guild-role-positions

	
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

	export interface postRole {
		name?: string,
		//permissions?: number,
		color?: number,
		hoist?: boolean,
		mentionable?: boolean
	}

	export interface modifyRole {
		name?: string,
		//permissions?: number,
		color?: number,
		hoist?: boolean,
		mentionable?: boolean
	}
}
