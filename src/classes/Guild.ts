import { Client } from "../Client.ts";
import {
	Channel,
	GuildChannel,
	GuildTextChannel,
	GuildVoiceChannel,
	GuildChannelCategory,
	GuildNewsChannel,
	GuildStoreChannel,
	GuildMember,
	GuildEmoji
} from "../Classes.ts";

type GuildChannelTypes = GuildTextChannel | GuildVoiceChannel | GuildChannelCategory | GuildNewsChannel | GuildStoreChannel

/** Class representing a guild */
export class Guild {
	// "| undefined" just to get rid of the "no initializer" error. this is a
	// bad way to do this i think, so uh
	// TODO: deal with this

	public id: string;
	public name: string;
	public ownerID: string;
	public region: string;

	/** A map of guild channels. */
	public channels: Map<string, GuildChannelTypes | undefined> = new Map<string, GuildChannelTypes | undefined>();
	/** A map of members */
	public members: Map<string, GuildMember> = new Map<string, GuildMember>();
	/** A map of emoji */
	public emojis: Map<string, GuildEmoji> = new Map<string, GuildEmoji>();

	constructor(data: any, client: Client) {
		this.id = data.id;
		this.name = data.name;
		this.ownerID = data.ownerID;
		this.region = data.region;

		if(data.channels) {
			for(const chan of data.channels) {
				this.channels.set(chan.id, GuildChannel.new(chan, client));
			}
		}

		if(data.members) {
			for(const mem of data.members) {
				this.members.set(mem.user.id, new GuildMember(mem, client));
			}
		}

		if(data.emojis) {
			for(const e of data.emojis) {
				this.emojis.set(e.id, new GuildEmoji(e, client));
			}
		}
	}
}
