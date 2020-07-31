import { Channel } from "./Channel.ts";
import { Options } from "../Client.ts";

/**
 * Mix-in representing any text-based channel
 */
export function TextChannelMixIn<T extends new (...args: any[]) => Channel>(
  Base: T,
) {
  return class extends Base {
    createMessage(content: string | Options.createMessage) {
      return this.client.createMessage(this.id, content);
    }

    modifyMessage(messageID: string, content: string | Options.modifyMessage) {
      return this.client.modifyMessage(this.id, messageID, content);
    }

    deleteMessage(messageID: string) {
      return this.client.deleteMessage(this.id, messageID);
    }
  };
}
