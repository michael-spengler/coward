import { Client, Options } from "../Client.ts"
import { Channel } from "./Channel.ts"
import { Guild } from "./Guild.ts"
import { GuildTextChannel } from "./GuildTextChannel.ts";
import { GuildVoiceChannel } from "./GuildVoiceChannel.ts";
import { GuildChannelCategory } from "./GuildChannelCategory.ts";
import { GuildNewsChannel } from "./GuildNewsChannel.ts";
import { GuildStoreChannel } from "./GuildStoreChannel.ts";

/**
 * Class representing a channel in a guild
 * @extends Channel
 */
export class GuildChannel extends Channel {
	public name: string;
	public position: number;
	public nsfw: boolean;
	public parentID: string; // TODO(fox-cat): channel category object ????
	//public permission_overwrites: Array<>; // TODO(fox-cat): this whole thing
	protected _guildID: any;

	constructor(data: any, client: Client) {
		super(data, client);

		this.name = data.name;
		this.position = data.position;
		this.nsfw = data.nsfw;
		this.parentID = data.parent_id || null;
		this._guildID = client.channelGuildIDs.get(this.id);
		//TODO: this.permission_overwrites = data.permission_overwrites;
	}

	get guild(): Guild | undefined {
		return this.client.guilds.get(this._guildID)
	}

	delete() {
		return this.client.deleteChannel(this.id)
	}

	modify(options: Options.modifyChannel) {
		return this.client.modifyChannel(this.id, options)
	}
 
	static from(data: any, client: Client) {
		switch(data.type) {
			case 0:
				return new GuildTextChannel(data, client);
				break;
			case 2:
				return new GuildVoiceChannel(data, client);
				break;
			case 4:
				return new GuildChannelCategory(data, client);
				break;
			case 5:
				return new GuildNewsChannel(data, client);
				break;
			case 6:
				return new GuildStoreChannel(data, client);
				break;
			default:
				return new GuildChannel(data, client);
				break;
		}
	}
}
