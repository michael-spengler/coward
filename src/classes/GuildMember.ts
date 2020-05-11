import { Client } from "../Client.ts";
import { User } from "./User.ts";

/** Class representing a guild member */
export class GuildMember {
	public user: User | undefined;
	public nick: string | undefined;
	public roles: Array<String> | undefined; // TODO(fox-cat): role objects
	public joinedAt: string | undefined;
	public premiumSince: string | undefined;
	public deaf: boolean | undefined;
	public mute: boolean | undefined;

	constructor(data: any, client: Client) {
		this.set(data, client);
	}

	set(d: any, client: Client) {
		this.user = new User(d.user, client);
		this.nick = d.nick || null;
		this.roles = d.roles;
		this.joinedAt = d.joinedAt;
		this.premiumSince = d.premiumSince || null;
		this.deaf = d.deaf;
		this.mute = d.mute;
	}
}
