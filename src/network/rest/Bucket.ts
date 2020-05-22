import { Ratelimiter } from "./Ratelimiter.ts";

export class Bucket {
    private queue: Array<{func: Function, callback: Function}> = [];
    
    private limit: number = 0;
    private remaining: number = 0;
    private reset: number = 0;
    private resetTimeout: any = null;

    constructor(private ratelimiter: Ratelimiter) {}

    public static routify(method: string, url: string): string {
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

    public addQueue(func: Function): Promise<void> {
        return new Promise((resolve, reject) => {
            let bucket = this;
            let callback = () => {
                return resolve(func(bucket))
            }
            this.queue.push({
                func, callback
            })
        })
    }

    public checkQueue(): void {
        if(this.ratelimiter.global) {
            this.resetTimeout = setTimeout(() => {
                this.remaining = this.limit,
                clearTimeout(this.resetTimeout),
                this.checkQueue()
            }, this.ratelimiter.globalReset);
            return;
        }
        if(this.remaining === 0) {
            this.resetTimeout = setTimeout(() => {
                this.remaining = this.limit,
                clearTimeout(this.resetTimeout),
                this.checkQueue()
            }, this.reset);
            return;
        }
    }
}