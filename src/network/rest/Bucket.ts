import { RequestHandler } from "./RequestHandler.ts";

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class Bucket {
    private queue: Array<{func: Function, callback: Function}> = [];
    
    public limit: number = 5;
    public remaining: number = 1;
    public reset: number = 5000;
    public resetTimeout: any = null;

    constructor(public ratelimiter: RequestHandler) {}

    public addQueue(func: Function): Promise<void> {
        return new Promise((resolve, reject) => {
            let bucket = this;
            let callback = () => { return resolve(func(bucket)); }
            this.queue.push({ func, callback })
            this.checkQueue();
        })
    }

    public async checkQueue() {
        if(this.ratelimiter.global) {
            await pause(this.ratelimiter.globalReset);
            this.remaining = this.limit;
        }
        if(this.remaining === 0) {
            await pause(this.reset);
            this.remaining = this.limit;
        }
        if(this.queue.length > 0 && this.remaining !== 0) {
            this.queue.splice(0, 1)[0].callback();
        }
    }
}