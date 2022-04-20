type ResolveValue<T> = T | PromiseLike<T>;
type Resolve<T> = (value: ResolveValue<T>) => void;
type Reject = (reason?: any) => void;
type Executor<T> = (resolve: Resolve<T>, reject: Reject) => void;

const isPromiseLike = (value:any) => (value && "object" === typeof value && "function" === typeof value.then);

class MutablePromise<T>{ //extends Promise<T>{

    private _s: string;
    get status(){ return this._s; }
    get isPending(){ return "pending" === this._s; }
    get isFulfilled(){ return "fulfilled" === this._s; }
    get isRejected(){ return "rejected" === this._s; }

    private _task: PromiseLike<T> | Executor<T> | null;
    get task(){ return this._task; }
    set task(value: PromiseLike<T> | Executor<T> | null){

        //if(!this.isPending){ return; }

        this._task = value;
        let p: PromiseLike<T>;
        if(isPromiseLike(value)){
            p = value as PromiseLike<T>;
        }else if("function" === typeof value){
            p = new Promise(value);
        }
        if(p){
            (async()=>{
                try{
                    const ret = await p;
                    // make sure task not change
                    if(value === this._task){
                        this.resolve(ret);
                    }
                }catch(reason){
                    // make sure task not change
                    if(value === this._task){
                        this.reject(reason);
                    }
                }
            })();
        }
    }
    get isEmpty(){ return null == this._task; }

    resolve: Resolve<T>
    reject: Reject;

    // walkaround babel which can not extend builtin class
    then: (onfulfilled?: (value: T) => any, onrejected?: (reason: any) => any) => Promise<any>;

    constructor(executor?: PromiseLike<T> | Executor<T> | null){
        let rs: Resolve<T>;
        let rj: Reject;
        const fn = (_rs: Resolve<T>, _rj: Reject)=>{ rs = _rs; rj = _rj; };
        // super(fn);

        // walkaround babel which can not extend builtin class
        this.then = (new Promise(fn).then);
        
        this._s = "pending";
        this.resolve = (value: ResolveValue<T>)=>{
            if(this.isPending){
                if(isPromiseLike(value)){
                    this.task = value as PromiseLike<T>;
                }else{
                    this._s = "fulfilled";
                    rs(value);
                }
            }
        };
        this.reject = (reason?: any)=>{
            if(this.isPending){
                this._s = "rejected";
                rj(reason);
            }
        };
        this.task = executor;
    }
}

export default MutablePromise;
export { Resolve, Reject, ResolveValue, Executor };
