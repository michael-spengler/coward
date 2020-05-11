import { Client } from "../Client.ts";

/** Class representing a Role */
export class Role {
	public id: string | undefined;
	public name: string | undefined;
	public color: number | undefined;
	public hoist: boolean | undefined;
	public managed: boolean | undefined;
	public mentionable: boolean | undefined;

	constructor(data: any, client: Client) {
		this.set(data, client);
	}

	set(d: any, client: Client) {
		this.id = d.id;
		this.name = d.name;
		this.color = d.color;
		this.hoist = d.hoist;
		this.managed = d.managed;
		this.mentionable = d.mentionable;
	}
}
