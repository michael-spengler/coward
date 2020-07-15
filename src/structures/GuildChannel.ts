import { Client, Options } from "../Client.ts"
import { Channel } from "./Channel.ts"
import { Guild } from "./Guild.ts"

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
}
