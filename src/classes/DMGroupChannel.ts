import { Client } from "../Client.ts";
import { Message } from "./Message.ts";
import { User } from "./User.ts";
import { Channel } from "./Channel.ts";
import { DMChannel } from "./DMChannel.ts";

/**
 * Class representing a DM group channel
 * @extends DMChannel
 */
export class DMGroupChannel extends DMChannel {
  public name: string;
  public icon: string;
  public owner_id: string; // TODO(fox-cat): user object

  constructor(data: object, client: Client) {
    super(object, client);

    this.name = data.name || null;
    this.icon = data.icon || null;
    this.owner_id = data.owner_id;
  }
}
