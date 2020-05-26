import { RequestHandler } from "./RequestHandler.ts";

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

    public checkQueue(): void {
        if(this.ratelimiter.global) {
            this.resetTimeout = setTimeout(() => { this.setRemaining() }, this.ratelimiter.globalReset);
            return;
        }
        if(this.remaining === 0) {
            this.resetTimeout = setTimeout(() => { this.setRemaining() }, this.reset);
            return;
        }
        if(this.queue.length > 0 && this.remaining !== 0) {
            this.queue.splice(0, 1)[0].callback();
            return;
        }
    }

    private setRemaining() {
        this.remaining = this.limit,
        clearTimeout(this.resetTimeout),
        this.checkQueue()
    }
}