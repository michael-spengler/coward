import { Client } from "../Client.ts"
import { GuildChannel } from "./GuildChannel.ts"
import { TextChannel } from "./TextChannel.ts"

import { use } from "../../deps.ts"

/**
 * Class representing a news channel in a guild
 * @extends GuildChannel
 */
export class GuildNewsChannel extends GuildChannel {
	@use( TextChannel ) this: any // TODO: stop using decorators as they are currently expiremental...

	public topic: string
	public lastMessageID: string // TODO(fox-cat): contemplate message object here?

	constructor(data: any, protected client: Client) {
		super(data, client)

		this.topic = data.topic || null
		this.lastMessageID = data.last_message_id || null
	}
}
