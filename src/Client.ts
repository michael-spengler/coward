import { EventEmitter } from "../deps.ts";

import { Versions, Discord, Endpoints } from "./util/Constants.ts";
import Gateway from "./gateway/WebsocketHandler.ts";

import { Message } from "./Classes.ts";

/**
 * Class representing the main client
 * @extends EventEmitter
 *
 *       import { Coward } from "https://deno.land/x/coward/mod.ts";
 *       const client = new Coward("TOKEN_GOES_HERE");
 *
 *       client.on("ready", () => {
 * 		 	console.log("READY!");
 *       })
 *
 *       client.connect();
 */
export class Client extends EventEmitter {
  private _userAgent: string =
    `DiscordBot (https://github.com/fox-cat/criket), ${Versions.THIS}`;
  private gateway: Gateway;

  /** Create a Client */
  public constructor(private token: string) {
    super();
    this.gateway = new Gateway(token, this);
  }

  /** Connect to the Discord API */
  connect() {
    this.gateway.connect();
  }

  /** Post a message in a channel */
  postMessage(channelID: string, content: string): Promise<Message> {
    return new Promise(async (resolve, reject) => {
      this.postData(
        Discord.API + Endpoints.CHANNEL_MESSAGES(channelID),
        { content: content, file: null, embed: {} },
      )
        .then((data: any) => { resolve(new Message(data, this)); })
        .catch((err: any) => { reject(err); });
    });
  }

  private async postData(url: string, data: any) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bot " + this.token,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async handle(message: any) {
	  switch(message.t) {
		  case "READY":
		  	/**
			 * Fired when the Client is ready
			 * @event Coward#ready
			 */
	        this.emit("ready", null);
	        break;
	      case "MESSAGE_CREATE":
		  	/**
			 * Fired when a message is created
			 * @event Coward#messageCreate
			 */
	        this.emit("messageCreate", new Message(message.d, this));
	        break;
	  }
  }
}
