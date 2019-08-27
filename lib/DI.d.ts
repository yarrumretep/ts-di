export interface Context {
    context: this;
    extend<T extends Prototype>(proto: T): Resolve<T> & this;
    resolve<T>(factory: (ctx: this) => T): T;
}
export declare type Factory<T> = (ctx: any) => T;
declare type Prototype = {
    [key: string]: Factory<any>;
};
declare type Resolve<P extends Prototype> = {
    [F in keyof P]: ReturnType<P[F]>;
};
export declare function singleton<T>(factory: Factory<T>): Factory<T>;
export declare function instance<T>(instance: T): Factory<T>;
export declare function context<P extends Prototype>(proto: P): Resolve<P> & Context;
export {};
//# sourceMappingURL=DI.d.ts.map