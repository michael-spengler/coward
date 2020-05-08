import { Client } from "../Client.ts";
import { Channel } from "./Channel.ts";

/** Class representing a guild */
export class Guild {
  public id: string;
  public name: string;
  public ownerID: string;
  public region: string;

  //public channels: Map<GuildChannel>;

  constructor(data: object, client: Client) {
    this.id = data.id;
    this.user = data.username;
    this.discriminator = data.discriminator;
    this.bot = data.bot || false;
  }
}
