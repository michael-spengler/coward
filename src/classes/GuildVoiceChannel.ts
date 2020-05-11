import { Client } from "../Client.ts";
import { Message } from "./Message.ts";
import { Channel } from "./Channel.ts";
import { GuildChannel } from "./GuildChannel.ts";

/**
 * Class representing a voice channel in a guild
 * @extends GuildChannel
 */
export class GuildVoiceChannel extends GuildChannel {
	public bitrate: number;
	public user_limit: number;

	constructor(data: any, client: Client) {
		super(data, client);

		this.bitrate = data.bitrate;
		this.user_limit = data.user_limit;
	}
}
