import { Client } from "../Client.ts";
import { Message } from "./Message.ts";
import { Channel } from "./Channel.ts";

/**
 * Class representing a channel in a guild
 * @extends Channel
 */
export class GuildChannel extends Channel {
  public name: string;
  public guild: string; // TODO(fox-cat): guild object
  public position: number;
  public nsfw: boolean;
  public parent_id: string; // TODO(fox-cat): channel category object ????
  //public permission_overwrites: Array<>; // TODO(fox-cat): this whole thing

  constructor(data: object, client: Client) {
    super(data, client);

    this.name = data.name;
    this.guild = data.guild_id;
    this.position = data.position;
    this.nsfw = data.nsfw;
    this.parent_id = parent_id || null;
    //this.permission_overwrites = data.permission_overwrites;
  }
}
