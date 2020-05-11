import { Client } from "../Client.ts";
import {
	Channel,
	GuildChannel,
	GuildTextChannel,
	GuildVoiceChannel,
	GuildChannelCategory,
	GuildNewsChannel,
	GuildStoreChannel,
	GuildMember
} from "../Classes.ts";

type GuildChannelTypes = GuildTextChannel | GuildVoiceChannel | GuildChannelCategory | GuildNewsChannel | GuildStoreChannel

/** Class representing a guild */
export class Guild {
	// "| undefined" just to get rid of the "no initializer" error. this is a
	// bad way to do this i think, so uh
	// TODO: deal with this

	public id: string | undefined;
	public name: string | undefined;
	public ownerID: string | undefined;
	public region: string | undefined;

	public channels: Map<string, GuildChannelTypes | undefined> = new Map<string, GuildChannelTypes | undefined>();
	public members: Map<string, GuildMember> = new Map<string, GuildMember>();

	constructor(data: any, client: Client) {
		this.set(data, client);
	}

	set(d: any, client: Client) {
		if(d.id) this.id = d.id;
		if(d.name) this.name = d.name;
		if(d.ownerID) this.ownerID = d.ownerID;
		if(d.region) this.region = d.region;

		if(d.channels) {
			for(const chan of d.channels) {
				this.channels.set(chan.id, GuildChannel.new(chan, client));
			}
		}

		if(d.members) {
			for(const mem of d.members) {
				this.members.set(mem.id, new GuildMember(mem, client));
			}
		}
	}
}
