import { Client } from "../Client.ts";
import { Channel } from "./Channel.ts";

/** Class representing a guild */
export class Guild {
  public id: string;
  public name: string;
  public ownerID: string;
  public region: string;

  //public channels: Map<GuildChannel>;

  constructor(data: any, client: Client) {
    this.id = data.id;
    this.name = data.name;
	this.ownerID = data.ownerID; // TODO: owner user object ??
	this.region = data.region;
  }
}
