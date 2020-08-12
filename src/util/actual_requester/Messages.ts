import { Endpoints } from "../../util/Constants.ts";

import { Message } from "../../structures/Message.ts";
import type { Messages } from "../../structures/Handlers.ts";
import type { CreateMessage, ModifyMessage } from "../../structures/Options.ts";
import type { RequestHandler } from "../../network/rest/RequestHandler.ts";
import type { Database } from "../Database.ts";

export class MessagesRequester implements Messages {
  constructor(
    private readonly requestHandler: RequestHandler,
    private readonly database: Database,
  ) {}

  /**
	 * Post a typing indicator for a specified channel.
	 * Bots should usually not use this, however if a bot is responding to a command and expects the computation to take a few seconds, this may be used to let the user know that the bot is processing their message.
	 */
  async postTypingIndicator(channelID: string): Promise<void> {
    await this.requestHandler.request(
      "POST",
      Endpoints.CHANNEL_TYPING(channelID),
    );
  }

  /** Post a message in a channel. Requires the `SEND_MESSAGES` permission.*/
  async createMessage(
    channelID: string,
    content: string | Readonly<CreateMessage>,
  ): Promise<Message> {
    if (typeof content === "string") content = { content: content };
    const data = await this.requestHandler.request(
      "POST",
      Endpoints.CHANNEL_MESSAGES(channelID),
      content,
    );
    return new Message(data, this.database);
  }

  /** Modify a message. Must be authored by you. */
  async modifyMessage(
    /** Channel the message is in */
    channelID: string,
    /** Message to modify */
    messageID: string,
    content: string | Readonly<ModifyMessage>,
  ): Promise<Message> {
    if (typeof content === "string") content = { content: content };
    const data = await this.requestHandler.request(
      "PATCH",
      Endpoints.CHANNEL_MESSAGE(channelID, messageID),
      content,
    );
    return new Message(data, this.database);
  }

  /** Delete a message in a channel. Requires the `MANAGE_MESSAGES` permission. */
  async deleteMessage(
    /** Channel the message is in */
    channelID: string,
    /** The message to delete */
    messageID: string,
  ): Promise<void> {
    await this.requestHandler.request(
      "DELETE",
      Endpoints.CHANNEL_MESSAGE(channelID, messageID),
    );
  }

  // TODO: bulkDeleteMessage(channelID: string, amount: number): void {}
}
