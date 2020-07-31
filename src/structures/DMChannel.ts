import { Client } from "../Client.ts";
import { User } from "./User.ts";
import { TextChannelMixIn } from "./TextChannel.ts";
import { Channel } from "./Channel.ts";

/**
 * Class representing a DM channel
 * @extends Channel
 */
export class DMChannel extends TextChannelMixIn(Channel) {
  public recipients: Array<User>;

  constructor(data: any, client: Client) {
    super(data, client);

    let arr: Array<any> = [];
    for (let i in data.recipients) {
      arr[<any> i] = new User(data.recipients[i]);
    }
    this.recipients = arr;
  }
}
