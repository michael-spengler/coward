import { Client } from "../Client.ts"

import { Guild } from "../Classes.ts"

/** Class representing a Role */
export class Role {
	public id: string
	public name: string
	public color: number
	public hoist: boolean
	public managed: boolean
	public mentionable: boolean

	private _client: Client
	private _guildID: any

	constructor(data: any, client: Client) {
		this.id = data.id
		this.name = data.name
		this.color = data.color
		this.hoist = data.hoist
		this.managed = data.managed
		this.mentionable = data.mentionable

		this._client = client
		this._guildID = client.roleGuildIDs.get(this.id)
	}

	get guild(): Guild | undefined {
		return this._client.guilds.get(this._guildID)
	}
}
