import { Client } from "../Client.ts";
import { Guild } from "../Classes.ts";

/** Class representing a Role */
export class Role {
  public id: string;
  public name: string;
  public color: number;
  public hoist: boolean;
  public managed: boolean;
  public mentionable: boolean;
  public guild: Guild;

  constructor(data: any, client: Client, guild: Guild) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.hoist = data.hoist;
    this.managed = data.managed;
    this.mentionable = data.mentionable;
    this.guild = guild;
    this._client = client;
  }

  delete(reason?: string) {
    this._client.deleteRole(this.guild.id, this.id, reason);
  }

  setName(name: string) {
    let roleOptions = this.JSONify();

    roleOptions.name = name;

    this._client.modifyRole(this.guild.id, this.id, roleOptions);
  }

  setColor(color: number) {
    let roleOptions = this.JSONify();

    roleOptions.color = number;

    this._client.modifyRole(this.guild.id, this.id, roleOptions);
  }

  setHoist(hoisted: boolean) {
    let roleOptions = this.JSONify();

    roleOptions.hoist = hoisted;

    this._client.modifyRole(this.guild.id, this.id, roleOptions);
  }

  JSONify() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      hoist: this.hoist,
      managed: this.managed,
      mentionable: this.mentionable,
    };
  }
}
