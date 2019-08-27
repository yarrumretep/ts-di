"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var singletonId = 0;
function singleton(factory) {
    var id = singletonId++;
    return function (ctx) {
        var registry = ctx.__singletons;
        if (registry[id] === undefined) {
            registry[id] = factory(ctx);
        }
        return registry[id];
    };
}
exports.singleton = singleton;
function instance(instance) {
    return function () { return instance; };
}
exports.instance = instance;
function context(proto) {
    var __singletons = {};
    return new Proxy(proto, {
        get: function (target, name, receiver) {
            if (name === '__singletons') {
                return __singletons;
            }
            if (name === 'context') {
                return receiver;
            }
            if (name === 'extend') {
                return function (proto2) { return context(Object.assign({}, proto, proto2)); };
            }
            if (name === 'resolve') {
                return function (factory) { return factory(receiver); };
            }
            if (typeof name === 'string') {
                var factory = target[name];
                if (!factory || typeof factory !== 'function') {
                    throw new Error("No factory for: " + name);
                }
                return factory(receiver);
            }
        }
    });
}
exports.context = context;
//# sourceMappingURL=DI.js.map