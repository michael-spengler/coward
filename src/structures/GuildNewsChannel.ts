import { Client } from "../Client.ts";
import { GuildChannel } from "./GuildChannel.ts";
import { TextChannelMixIn } from "./TextChannel.ts";

/**
 * Class representing a news channel in a guild
 * @extends GuildChannel
 */
export class GuildNewsChannel extends TextChannelMixIn(GuildChannel) {
  public topic: string;
  public lastMessageID: string; // TODO(fox-cat): contemplate message object here?

  constructor(data: any, protected client: Client) {
    super(data, client);

    this.topic = data.topic || null;
    this.lastMessageID = data.last_message_id || null;
  }
}
