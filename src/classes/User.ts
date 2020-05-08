import { Client } from "../Client.ts";

/** Class representing a user */
export class User {
  public id: string;
  public username: string;
  public discriminator: string;
  public bot: boolean;

  constructor(data: object, client: Client) {
    this.id = data.id;
    this.user = data.username;
    this.discriminator = data.discriminator;
    this.bot = data.bot || false;
  }
}
