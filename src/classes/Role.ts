import { Client } from "../Client.ts";

export class Role {
	public id: string;
	public name: string;
	public color: number;
	public hoist: boolean;
	public managed: boolean;
	public mentionable: boolean;

	constructor(data, client) {
		this.id = data.id;
		this.name = data.name;
		this.color = data.color;
		this.hoist = data.hoist;
		this.managed = data.managed;
		this.mentionable = data.mentionable;
	}
}
