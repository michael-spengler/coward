import { Client } from "../Client.ts"
import { GuildChannel } from "./GuildChannel.ts"

/**
 * Class representing a news channel in a guild
 * @extends GuildChannel
 */
export class GuildNewsChannel extends GuildChannel {
	public topic: string
	public lastMessageID: string // TODO(fox-cat): contemplate message object here?
	protected _client: Client

	constructor(data: any, client: Client) {
		super(data, client)

		this._client = client
		this.topic = data.topic || null
		this.lastMessageID = data.last_message_id || null
	}

	send(content: string) {
		this._client.postMessage(this.id, content)
	}

	delete() {
		this._client.deleteChannel(this.id)
	}
}
