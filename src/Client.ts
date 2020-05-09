import { EventEmitter } from "../deps.ts";

import { Versions, Discord, Endpoints } from "./util/Constants.ts";
import Gateway from "./gateway/WebsocketHandler.ts";

import { Guild, GuildMember, Message, User, Role } from "./Classes.ts";

/**
 * Class representing the main client
 * @extends EventEmitter
 *
 *       import { Coward } from "https://deno.land/x/coward/mod.ts";
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
	`DiscordBot (https://github.com/fox-cat/coward), ${Versions.THIS}`;
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

	/** Post a Channel */
	postChannel(guildID:string, options: Coward.postChannelOptions): void {
		this.request( "POST", Endpoints.GUILD_CHANNELS(guildID), options )
	}

	/** Modify a Channel */
	modifyChannel(channelID: string, options: Coward.modChannelOptions): void {
		this.request( "PATCH", Endpoints.CHANNEL(channelID), options );
	} // TODO: Promise<Channel>

	/** Delete a Channel */
	deleteChannel(channelID: string): void {
		this.request( "DELETE", Endpoints.CHANNEL(channelID) );
	}


	/** Post a message in a channel */
	postMessage(channelID: string, content: string): Promise<Message> {
		return new Promise(async (resolve, reject) => {
			this.request( "POST", Endpoints.CHANNEL_MESSAGES(channelID), { content: content, file: null, embed: {} })
			.then((data: any) => { resolve(new Message(data, this)); })
			.catch((err: any) => { reject(err); });
		});
	}

	private async request(method: string, url: string, data?: any) {
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

	public handle(message: any) {
		switch(message.t) {
			case "READY":
			/**
			 * Fired when the Client is ready
			 * @event Coward#ready
			 */
			this.emit("ready", null);
			break;
			case "CHANNEL_CREATE":
				/**
				 * Fired when a Channel is created.
				 * @event Coward#channelCreate
				 */
				this.emit("channelCreate", null); // TODO: Determine channel type and create channel from there.
				break;
			case "CHANNEL_UPDATE":
				/**
				 * Fired when a Channel is updated.
				 * @event Coward#channelUpdate
				 */
				this.emit("channelUpdate", null);
				break;
			case "CHANNEL_DELETE":
				/**
				 * Fired when a Channel is deleted.
				 * @event Coward#channelDelete
				 */
				this.emit("channelDelete", null);
				break;
			// TODO: CHANNEL_PINS_UPDATE
			case "GUILD_CREATE":
				/**
				 * Fired when
				 *  - The client is initally connecting.
				 *  - A guild becomes available to the client.
				 *  - The client joins a guild.
				 * @event Coward#guildCreate
				 */
				this.emit("guildCreate", new Guild(message.d, this));
				break;
			case "GUILD_DELETE":
				/**
				 * Fired when
				 *  - The client leaves or is removed from a guild.
				 *  - A guild becomes unavailable.
				 * @event Coward#guildDelete
				 */
				this.emit("guildDelete", new Guild(message.d, this));
				break;
			case "GUILD_BAN_ADD":
				/**
				 * Fired when a user is banned from the guild.
				 * @event Coward#guildBanAdd
				 */
				this.emit("guildBanAdd", message.d.guild_id, new User(message.d.user, this));
				break;
			case "GUILD_BAN_REMOVE":
				/**
				 * Fired when a user is unbanned from the guild.
				 * @event Coward#guildBanAdd
				 */
				this.emit("guildBanRemove", message.d.guild_id, new User(message.d.user, this));
				break;
			case "GUILD_EMOJIS_UPDATE":
				//TODO: GUILD_EMOJIS_UPDATE
				break;
			case "GUILD_INTEGRATIONS_UPDATE":
				//TODO: GUILD_INTEGRATIONS_UPDATE
				break;
			case "GUILD_MEMBER_ADD":
				/**
				 * Fired when a new user joins the guild.
				 * @event Coward#guildMemberAdd
				 */
				this.emit("guildMemberAdd", message.d.guild_id, new GuildMember(message.d, this));
				break;
			case "GUILD_MEMBER_REMOVE":
				/**
				 * Fired when a user leaves or is removed from the guild.
				 * @event Coward#guildMemberRemove
				 */
				this.emit("guildMemberRemove", message.d.guild_id, new User(message.d, this));
				break;
			case "GUILD_MEMBER_UPDATE":
				// TODO: https://discord.com/developers/docs/topics/gateway#guild-member-update
				break;
			case "GUILD_MEMBERS_CHUNK":
				// TODO: https://discord.com/developers/docs/topics/gateway#guild-members-chunk
				break;
			case "GUILD_ROLE_CREATE":
				/**
				 * Fired when a role is created in a guild.
				 * @event Coward#guildRoleCreate
				 */
				this.emit("guildRoleCreate", message.d.guild_id, new Role(message.d.role, this));
				break;
			case "GUILD_ROLE_UPDATE":
				/**
				 * Fired when a role is deleted in a guild.
				 * @event Coward#guildRoleUpdate
				 */
				this.emit("guildRoleUpdate", message.d.guild_id, new Role(message.d.role, this));
				break;
			case "GUILD_ROLE_DELETE":
				/**
				 * Fired when a role is deleted in a guild.
				 * @event Coward#guildRoleDelete
				 */
				this.emit("guildRoleDelete", message.d.guild_id, message.d.role_id);
				break;
			case "INVITE_CREATE":
				//TODO: https://discord.com/developers/docs/topics/gateway#invite-create
				break;
			case "INVITE_DELETE":
				//TODO: https://discord.com/developers/docs/topics/gateway#invite-delete
				break;
			case "MESSAGE_CREATE":
				/**
				 * Fired when a message is created
				 * @event Coward#messageCreate
				 */
				this.emit("messageCreate", new Message(message.d, this));
				break;
			case "MESSAGE_UPDATE":
				/**
				 * Fired when a message is updated
				 * @event Coward#messageUpdate
				 */
				this.emit("messageUpdate", new Message(message.d, this));
				break;
			case "MESSAGE_DELETE":
				/**
				 * Fired when a message is deleted
				 * @event Coward#messageDelete
				 */
				this.emit("messageDelete", message.d.id, message.d.channel_id); //TODO
				break;
			case "MESSAGE_DELETE_BULK":
				/**
				 * Fired when mesages are deleted in bulk.
				 * @event Coward#messageDeleteBulk
				 */
				this.emit("messageDeleteBulk", message.d.ids, message.d.channel_id);
				break;
			case "MESSAGE_REACTION_ADD":
				//TODO: https://discord.com/developers/docs/topics/gateway#message-reaction-add (and all other reactions)
				break;
			//TODO: All other ones lol
		}
	}
}

namespace Coward {
	export interface postChannelOptions {
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

	export interface modChannelOptions {
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
}
