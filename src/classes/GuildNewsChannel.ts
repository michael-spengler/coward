import { Client } from "../Client.ts";
import { Message } from "./Message.ts";
import { Channel } from "./Channel.ts";
import { GuildChannel } from "./GuildChannel.ts";

/**
 * Class representing a news channel in a guild
 * @extends GuildChannel
 */
export class GuildNewsChannel extends GuildChannel {
	public topic: string;
	public last_message_id: string; // TODO(fox-cat): contemplate message object here?

	constructor(data: object, client: Client) {
		super(data, client);

		this.topic = data.topic || null;
		this.last_message_id = data.last_message_id || null;
	}
}
