import { Client } from "../Client.ts";
import { GuildTextChannel, DMChannel, GuildVoiceChannel, DMGroupChannel, GuildChannelCategory, GuildNewsChannel, GuildStoreChannel } from "../Classes.ts";

export enum Type {
	GUILD_TEXT_CHANNEL,
	DM_CHANNEL,
	GUILD_VOICE_CHANNEL,
	DM_GROUP_CHANNEL,
	GUILD_CHANNEL_CATEGORY,
	GUILD_NEWS_CHANNEL,
	GUILD_STORE_CHANNEL
}

/** Class representing a channel */
export class Channel {
	public id: string;
	public type: number;

	constructor(data: any, client: Client) {
		this.id = data.id;
		this.type = data.type;
	}

	static new(data: any, client: Client) {
		switch(data.type) {
			case Type.GUILD_TEXT_CHANNEL:
				return new GuildTextChannel(data, client);
				break;
			case Type.DM_CHANNEL:
				return new DMChannel(data, client);
				break;
			case Type.GUILD_VOICE_CHANNEL:
				return new GuildVoiceChannel(data, client);
				break;
			case Type.DM_GROUP_CHANNEL:
				return new DMGroupChannel(data, client);
				break;
			case Type.GUILD_CHANEL_CATEGORY:
				return new GuildChannelCategory(data, client);
				break;
			case Type.GUILD_NEWS_CHANNEL:
				return new GuildNewsChannel(data, client);
				break;
			case GUILD_STORE_CHANNEL:
				return new GuildStoreChannel(data, client);
				break;
		}
	}
}
