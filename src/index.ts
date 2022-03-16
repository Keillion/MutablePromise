type ResolveValue<T> = T | PromiseLike<T>;
type Resolve<T> = (value: ResolveValue<T>) => void;
type Reject = (reason?: any) => void;

class MutablePromise<T> extends Promise<T>{
    private _p: Promise<T>;
    private _s: string;
    get status(){ return this._s; }
    get innerPromise(){ return this._p; }
    set innerPromise(value: Promise<T>){
        this._p = value;
        (async()=>{
            try{
                const ret = await value;
                if(value === this._p){
                    this.resolve(ret);
                }
            }catch(reason){
                if(value === this._p){
                    this.reject(reason);
                }
            }
        })();
    }
    resolve: Resolve<T>
    reject: Reject;
    constructor(executor?: (resolve: Resolve<T>, reject: Reject) => void){
        const promise = new Promise<T>(executor || (()=>{}));
        let rs: Resolve<T>;
        let rj: Reject;
        const fn = (_rs: Resolve<T>, _rj: Reject)=>{ rs = _rs; rj = _rj; };
        super(fn);
        this._s = "pending";
        this.innerPromise = promise;
        this.resolve = (value: ResolveValue<T>)=>{
            if("pending" === this._s){
                this._s = "fulfilled";
                rs(value);
            }
        };
        this.reject = (reason?: any)=>{
            if("pending" === this._s){
                this._s = "rejected";
                rj(reason);
            }
        };
    }
}

export default MutablePromise;
export { Resolve, Reject };
