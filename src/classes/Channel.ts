import { Client } from "../Client.ts";
import { Message } from "./Message.ts";

/** Class representing a channel */
export class Channel {
  public id: string;
  public type: number;

  constructor(data: object, client: Client) {
    this.id = data.id;
    this.type = data.type;
  }
}
