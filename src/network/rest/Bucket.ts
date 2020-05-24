import { RequestHandler } from "./RequestHandler.ts";

export class Bucket {
    private queue: Array<{func: Function, callback: Function}> = [];
    
    public limit: number = 0;
    public remaining: number = 0;
    public reset: number = 0;
    public resetTimeout: any = null;

    constructor(public ratelimiter: RequestHandler) {}

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