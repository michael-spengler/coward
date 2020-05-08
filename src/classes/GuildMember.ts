import { Client } from "../Client.ts";
import { User } from "./User.ts"

/** Class representing a guild member */
export class GuildMember {
	public user: User;
	public string: nick;
	public roles: Array<String>; // TODO(fox-cat): role objects
	public string: joinedAt;
	public string: premiumSince;
	public boolean: deaf;
	public boolean: mute;

	constructor(data, client) {
		this.user = new User(data.user);
		this.nick = data.nick || null;
		this.roles = data.roles;
		this.joinedAt = data.joinedAt;
		this.premiumSince = data.premiumSince || null;
		this.deaf = data.deaf;
		this.mute = data.mute;
	}
}
