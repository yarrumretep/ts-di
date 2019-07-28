
export interface Context {
    context: this
    extend<T>(proto: T): T & this
    resolve<T>(factory: (ctx: this) => T): T
}

export type Factory<T> = (ctx: any) => T;
type Prototype = { [key: string]: Factory<any> };
type Resolve<P extends Prototype> = {
    [F in keyof P]: ReturnType<P[F]>
};

let singletonId = 0;
export function singleton<T>(factory: Factory<T>): Factory<T> {
    const id = singletonId++;
    return (ctx: Context) => {
        const registry = (ctx as any).__singletons;
        if (registry[id] === undefined) {
            registry[id] = factory(ctx);
        }
        return registry[id];
    };
}

export function instance<T>(instance: T): Factory<T> {
    return () => instance;
}

export function context<P extends Prototype>(proto: P): Resolve<P> & Context {
    const __singletons = {};
    return new Proxy(proto, {
        get: function (target, name, receiver) {
            if (name === '__singletons') {
                return __singletons;
            }
            if (name === 'context') {
                return receiver;
            }
            if (name === 'extend') {
                return (proto2: Prototype) => context(Object.assign({}, proto, proto2))
            }
            if (name === 'resolve') {
                return (factory: (ctx: any) => any) => factory(receiver);
            }
            if (typeof name === 'string') {
                var factory = target[name];
                if (!factory || typeof factory !== 'function') {
                    throw new Error("No factory for: " + name);
                }
                return factory(receiver);
            }
        }
    }) as (Resolve<P> & Context);
}

