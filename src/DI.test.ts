import { singleton, instance, context } from './DI';

describe("Dependency Injection", () => {
    it("should return instances", () => {
        const ctx = context({
            foo: instance('foo')
        })
        expect(ctx.foo).toBe('foo');
    });

    it("should return factory results", () => {
        var ct = 0;
        const ctx = context({
            foo: () => ct++
        })

        expect(ctx.foo).toBe(0);
        expect(ct).toBe(1);
        expect(ctx.foo).toBe(1);
        expect(ct).toBe(2);
        expect(ctx.foo).toBe(2);
        expect(ct).toBe(3);
    })

    it("should return singleton results", () => {
        var ct = 0;
        const ctx = context({
            foo: singleton(() => ct++)
        })

        expect(ctx.foo).toBe(0);
        expect(ct).toBe(1);
        expect(ctx.foo).toBe(0);
        expect(ct).toBe(1);
        expect(ctx.foo).toBe(0);
        expect(ct).toBe(1);
    })

    it("should do nice resolution", () => {
        const ctx = context({
            foo: instance("bar"),
            test: ({ foo }: { foo: string }) => foo
        })

        expect(ctx.foo).toBe('bar');
        expect(ctx.test).toBe('bar');
    })

    it("should do nice resolution2", () => {
        const ctx = context({
            foo: instance("bar"),
        })

        expect(ctx.foo).toBe('bar');
        expect(ctx.resolve(({ foo }: { foo: string }) => foo)).toBe('bar');
    })

    it("should do extension", () => {
        const ctx = context({
            foo: instance("bar"),
            test: ({ foo }: { foo: string }) => "test:" + foo
        })

        const ctx2 = ctx.extend({
            foo: instance("dork")
        })

        expect(ctx.test).toBe("test:bar");
        expect(ctx2.test).toBe("test:dork");
    })

    type Logger = { log: (message: string) => void };
    const testfactory = ({ log, tag }: { log: Logger, tag: string }) => (message: string) => {
        log.log(`${tag}: ${message}`);
    }

    it("should do scenario", () => {
        const fn = jest.fn();
        const ctx = context({
            log: instance({
                log: fn
            } as Logger),
            tag: instance("foobar")
        })
        const test = ctx.resolve(testfactory);

        test("testing");
        expect(fn.mock.calls.length).toBe(1);
        expect(fn.mock.calls[0][0]).toBe('foobar: testing');

        fn.mockReset();
        const test2 = testfactory(ctx);
        test("testing");
        expect(fn.mock.calls.length).toBe(1);
        expect(fn.mock.calls[0][0]).toBe('foobar: testing');
    })
})