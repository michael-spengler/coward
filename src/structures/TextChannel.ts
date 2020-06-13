import { Channel } from "./Channel.ts";
import { Options } from "../Client.ts";

/**
 * Class representing any text-based channel
 * @extends Channel
 */
export class TextChannel extends Channel {
    postMessage(content: string | Options.postMessage) {
        return this.client.postMessage(this.id, content)
    }

    modifyMessage(messageID: string, content: string | Options.modifyMessage) {
        return this.client.modifyMessage(this.id, messageID, content)
    }

    deleteMessage(messageID: string) {
        return this.client.deleteMessage(this.id, messageID)
    }
}