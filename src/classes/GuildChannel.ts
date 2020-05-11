import { Client } from "../Client.ts";
import {
	Message,
	Channel,
	GuildTextChannel,
	GuildVoiceChannel,
	GuildChannelCategory,
	GuildNewsChannel,
	GuildStoreChannel
} from "../Classes.ts";

/**
 * Class representing a channel in a guild
 * @extends Channel
 */
export class GuildChannel extends Channel {
	public name: string;
	public guild: string; // TODO(fox-cat): guild object
	public position: number;
	public nsfw: boolean;
	public parent_id: string; // TODO(fox-cat): channel category object ????
	//public permission_overwrites: Array<>; // TODO(fox-cat): this whole thing

	constructor(data: any, client: Client) {
		super(data, client);

		this.name = data.name;
		this.guild = data.guild_id;
		this.position = data.position;
		this.nsfw = data.nsfw;
		this.parent_id = data.parent_id || null;
		//this.permission_overwrites = data.permission_overwrites;
	}

	static new(data: any, client: Client) {
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
		}
	}
}
