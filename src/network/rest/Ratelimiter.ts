/*import { Bucket } from "./Bucket.ts";

export class Ratelimiter {
    public global = false;
    public globalReset = 0;
    public rateLimitBuckets = new Map<string, Bucket>()

    public addQueue(func: Function, url: string, method: string) {
        let route = Bucket.routify(method, url)
        let bucket = this.rateLimitBuckets.get(route)
        if(!bucket) {
            bucket = new Bucket(this)
            this.rateLimitBuckets.set(route, bucket)
        }
        bucket.addQueue(func)
    }
}*/