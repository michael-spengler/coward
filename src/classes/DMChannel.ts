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

	constructor(data: any, client: Client) {
		super(data, client);

		// reading over this again. was going to do something in here but
		// WTF kinda code did i think this was reasonable wtf ???
		// TODO: deal with this shit. why did i create an entire new array
		// for ?!?!?!?
		let arr: Array<any> = [];
		for (let i in data.recipients) {
			arr[<any>i] = new User(data.recipients[i], client);
		}
		this.recipients = arr;
		this.last_message_id = data.last_message_id;
	}
}
