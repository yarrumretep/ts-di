"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function singleton(factory) {
    var instance;
    return function (ctx) {
        if (instance === undefined) {
            instance = factory(ctx);
        }
        return instance;
    };
}
exports.singleton = singleton;
function instance(instance) {
    return function () { return instance; };
}
exports.instance = instance;
function context(proto) {
    return new Proxy(proto, {
        get: function (target, name, receiver) {
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