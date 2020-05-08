// Rewritten from Criket - Possibly remove dependancy for EventEmitter ?
import EventEmitter from 'https://deno.land/std/node/events.ts';

import { Versions, Discord, Endpoints } from './util/Constants.ts'
import Gateway from './gateway/WebsocketHandler.ts'

/** Class representing the main Client. */
export default class Client extends EventEmitter {
	private _userAgent: string = `DiscordBot (https://github.com/fox-cat/criket), ${Versions.THIS}`
	private gateway: Gateway;

	public constructor(private token: string) {
		super();
		this.gateway = new Gateway(token, this);
	}

	connect() {
		this.gateway.connect();
	}
}
