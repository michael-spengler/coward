import { Client } from "../../Client.ts"
import { Versions, Discord } from "../../util/Constants.ts";
import { Bucket } from "./Bucket.ts";

export class RequestHandler {
	private userAgent: string = `DiscordBot (https://github.com/fox-cat/coward), ${Versions.THIS}`;
	private rateLimitBuckets = new Map<string, Bucket>();
	public global = false;
	public globalReset = 0;

	constructor(private client: Client) {};

	public routify(method: string, url: string): string {
        let route = url
            .replace(/\/([a-z-]+)\/(?:[0-9]{17,19})/g, (match, p) => {
                return p === 'channels' || p === 'guilds' || p === 'webhooks' ? match : `/${p}/:id`;
            })
            .replace(/\/reactions\/[^/]+/g, '/reactions/:id')
            .replace(/^\/webhooks\/(\d+)\/[A-Za-z0-9-_]{64,}/, '/webhooks/$1/:token')
            .replace(/\?.*$/, '');
        
		if (method.toUpperCase() === 'DELETE' && route.endsWith('/messages/:id')) { // Delete Messsage endpoint has its own ratelimit
			route = method + route;
        }
        
		return route;
	}
	
	public applyHeadersToBucket(bucket: Bucket, headers: Headers) {
		if(headers.has("x-ratelimit-global")) {
			bucket.ratelimiter.global = true;
			bucket.ratelimiter.globalReset = +headers.get("retry-after")!;
		}

		if(headers.has("x-ratelimit-limit")) {
			bucket.limit = +headers.get("x-ratelimit-limit")!;	
		}

		if(headers.has("x-ratelimit-remaining")) {
			bucket.remaining = +headers.get("x-ratelimit-remaining")!;
		} else {
			bucket.remaining = 1;
		}

		if(headers.has("x-ratelimit-reset")) {
			bucket.reset = +headers.get("x-ratelimit-reset")!;
		}
	}

	public addQueue(func: Function, method: string, url: string) {
		const route = this.routify(method, url);
		let bucket = this.rateLimitBuckets.get(route);
		if(bucket == undefined) {
			bucket = new Bucket(this);
			this.rateLimitBuckets.set(route, bucket);
		}
		bucket.addQueue(func);
	}

	public async request(method: string, url: string, data?: any, attempts: number = 0): Promise<any> {
		let headers: {[k: string]: any} = {
			"User-Agent": this.userAgent,
			"Authorization": "Bot " + this.client.token,
			"X-Ratelimit-Precision": "millisecond",
		}

		let body: any;

		if(data !== undefined) {
			if(data.file) {
				let form = new FormData();

				form.append("file", data.file.file, data.file.name);
				console.log(data.file.file["Symbol"]);
				delete data.file;
				if(data !== undefined) {
					form.append("payload_json", data);
				}
				body = form;
			} else {
				body = JSON.stringify(data);
				headers["Content-Type"] = "application/json";
			}
		}

		return new Promise(async (resolve, reject) => {
			const req = async (bucket: Bucket) => {
				try {
					const response = await fetch(Discord.API + url, {
						method: method,
						headers: headers,
						body: body,
					});
	
					if(response.status == 204) return resolve();
					const data = await response.json();
					
					if(response.ok) {
						this.applyHeadersToBucket(bucket, response.headers);
						return resolve(data);				
					} else {
						if(attempts == 3) return reject("Failed after 3 attempts.")

						if(response.status == 429) {
							console.warn("Received a 429; :(");
							this.applyHeadersToBucket(bucket, response.headers);	
							return this.request(method, url, data, attempts++);
						}
						
						if(response.status == 502) {
							return this.request(method, url, data, attempts++);
						}
					}
				} catch(error) {
					reject(error)
				}
			}
			this.addQueue(async(bucket: Bucket) => {req(bucket)}, method, url);
		})
		
		/** switch(response.status) {
			case 400: case 401: case 403: case 404: case 405: case 429:
			case 502: case 500: case 503: case 504: case 507: case 508:
				const json = await response.json();
				if(json.code)
					{ throw new Error(response.status + ", " + json.code + ", " + json.message); }
				else
					{ throw new Error(response.status + ", " + response.statusText); }
				break;
			case 204:
				return null;
				break;
			default:
				return response.json();
				break;
		
		}*/
	}
}
