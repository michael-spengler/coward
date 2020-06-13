import { Client, Options } from "../Client.ts"
import { Message } from "./Message.ts"
import { GuildChannel } from "./GuildChannel.ts"
import { TextChannel } from "./TextChannel.ts";
import { use } from "../../deps.ts";

export interface GuildTextChannel extends GuildChannel, TextChannel {}

/**
 * Class representing a text channel in a guild
 * @extends GuildChannel
 */
export class GuildTextChannel extends GuildChannel {
	@use( TextChannel ) this: any

	public rateLimitPerUser: number;
	public topic: string;
	
	public messages: Map<string, Message> = new Map<string, Message>();
	// TODO: deal with messages. possible message limit from client options?
	// contemplate. ^_^

	constructor(data: any, client: Client) {
		super(data, client);

		this.rateLimitPerUser = data.rate_limit_per_user
		this.topic = data.topic || null
	}
	
	delete() {
		return this.client.deleteChannel(this.id)
	}
}
