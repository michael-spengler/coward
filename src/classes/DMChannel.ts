import { Client } from "../Client.ts";
import { Message } from "./Message.ts";
import { User } from "./User.ts";
import { Channel } from "./Channel.ts";

/**
 * Class representing a DM channel
 * @extends Channel
 */
export class DMChannel extends Channel {
  public recipients: Array<User>;
  public last_message_id: string; // TODO(fox-cat): contemplate message object here?

  constructor(data: object, client: Client) {
    super(object, client);

    let arr = [];
    for (let i in data.recipients) {
      arr[i] = new User(data.recipients[i], client);
    }
    this.recipients = arr;
    this.last_message_id = data.last_message_id;
  }
}
