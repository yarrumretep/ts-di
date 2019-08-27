"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DI_1 = require("./DI");
describe("Dependency Injection", function () {
    it("should return instances", function () {
        var ctx = DI_1.context({
            foo: DI_1.instance('foo')
        });
        expect(ctx.foo).toBe('foo');
    });
    it("should return factory results", function () {
        var ct = 0;
        var ctx = DI_1.context({
            foo: function () { return ct++; }
        });
        expect(ctx.foo).toBe(0);
        expect(ct).toBe(1);
        expect(ctx.foo).toBe(1);
        expect(ct).toBe(2);
        expect(ctx.foo).toBe(2);
        expect(ct).toBe(3);
    });
    it("should return singleton results", function () {
        var ct = 0;
        var ctx = DI_1.context({
            foo: DI_1.singleton(function () { return ct++; })
        });
        expect(ctx.foo).toBe(0);
        expect(ct).toBe(1);
        expect(ctx.foo).toBe(0);
        expect(ct).toBe(1);
        expect(ctx.foo).toBe(0);
        expect(ct).toBe(1);
    });
    it("should do nice resolution", function () {
        var ctx = DI_1.context({
            foo: DI_1.instance("bar"),
            test: function (_a) {
                var foo = _a.foo;
                return foo;
            }
        });
        expect(ctx.foo).toBe('bar');
        expect(ctx.test).toBe('bar');
    });
    it("should do nice resolution2", function () {
        var ctx = DI_1.context({
            foo: DI_1.instance("bar"),
        });
        expect(ctx.foo).toBe('bar');
        expect(ctx.resolve(function (_a) {
            var foo = _a.foo;
            return foo;
        })).toBe('bar');
    });
    it("should do extension", function () {
        var ctx = DI_1.context({
            foo: DI_1.instance("bar"),
            test: function (_a) {
                var foo = _a.foo;
                return "test:" + foo;
            }
        });
        var ctx2 = ctx.extend({
            foo: DI_1.instance("dork")
        });
        expect(ctx.test).toBe("test:bar");
        expect(ctx2.test).toBe("test:dork");
    });
    it('should isolate singletons', function () {
        var ctx = DI_1.context({
            foo: DI_1.instance("bar"),
            test: DI_1.singleton(function (_a) {
                var foo = _a.foo;
                return "test:" + foo;
            })
        });
        var ctx2 = ctx.extend({
            foo: DI_1.instance("dork")
        });
        expect(ctx.test).toBe("test:bar");
        expect(ctx2.test).toBe("test:dork");
    });
    var testfactory = function (_a) {
        var log = _a.log, tag = _a.tag;
        return function (message) {
            log.log(tag + ": " + message);
        };
    };
    it("should do scenario", function () {
        var fn = jest.fn();
        var ctx = DI_1.context({
            log: DI_1.instance({
                log: fn
            }),
            tag: DI_1.instance("foobar")
        });
        var test = ctx.resolve(testfactory);
        test("testing");
        expect(fn.mock.calls.length).toBe(1);
        expect(fn.mock.calls[0][0]).toBe('foobar: testing');
        fn.mockReset();
        var test2 = testfactory(ctx);
        test("testing");
        expect(fn.mock.calls.length).toBe(1);
        expect(fn.mock.calls[0][0]).toBe('foobar: testing');
    });
});
//# sourceMappingURL=DI.test.js.map