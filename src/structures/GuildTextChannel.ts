import { Client } from "../Client.ts";
import { Message } from "./Message.ts";
import { GuildChannel } from "./GuildChannel.ts";
import { TextChannelMixIn } from "./TextChannel.ts";

/**
 * Class representing a text channel in a guild
 * @extends GuildChannel
 */
export class GuildTextChannel extends TextChannelMixIn(GuildChannel) {
  public rateLimitPerUser: number;
  public topic: string;

  public messages: Map<string, Message> = new Map<string, Message>();
  // TODO: deal with messages. possible message limit from client options?
  // contemplate. ^_^

  constructor(data: any, protected client: Client) {
    super(data, client);

    this.rateLimitPerUser = data.rate_limit_per_user;
    this.topic = data.topic || null;
  }
}
