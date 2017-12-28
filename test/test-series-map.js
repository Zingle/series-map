const expect = require("expect.js");
const SeriesMap = require("../series-map");

describe("SeriesMap", () => {
    var map;

    beforeEach(() => {
        map = new SeriesMap();
        map.set(["foo", "bar"], 42);
    });

    describe(".length", () => {
        it("should be 0", () => {
            expect(SeriesMap.length).to.be(0);
        });
    });

    describe("#get(array)", () => {
        it("should return value mapped to a series", () => {
            expect(map.get(["foo", "bar"])).to.be(42);
        });

        it("should return undefined for unmapped series", () => {
            expect(map.get(["foo"])).to.be(undefined);
        });

        it("should return undefined for non-array series", () => {
            expect(map.get("foo")).to.be(undefined);
            expect(map.get(Symbol())).to.be(undefined);
        });
    });

    describe("#set(array, *)", () => {
        it("should map series to value", () => {
            map.set(["foo", "bar"], 13);
            expect(map.get(["foo", "bar"])).to.be(13);
        });

        it("should error on non-array series", () => {
            expect(() => map.set("foo", 42)).to.throwError();
        });
    });

    describe("#has(array)", () => {
        it("should return true for mapped series", () => {
            expect(map.has(["foo", "bar"])).to.be(true);
        });

        it("should return false for unmapped series", () => {
            expect(map.has(["foo"])).to.be(false);
        });

        it("should return false for non-array series", () => {
            expect(map.has("foo")).to.be(false);
        });
    });

    describe("#delete(array)", () => {
        it("should unmap sequence", () => {
            map.delete(["foo", "bar"]);
            expect(map.has(["foo", "bar"])).to.be(false);
        });
    });

    describe("#clear()", () => {
        it("should unmap all sequences", () => {
            map.set(["foo"], 13);
            map.clear();
            expect(map.has(["foo", "bar"])).to.be(false);
            expect(map.has(["foo"])).to.be(false);
        });
    });

    describe("#@@iterator()", () => {
        beforeEach(() => {
            map = new SeriesMap();

            map.set([], 0);
            map.set([1], 1);
            map.set([1, 2], 2);
        });

        it("should iterate over series/value pairs", () => {
            var count = 0,
                values = [];

            for (let [series, value] of map) {
                expect(series.length).to.be(value);
                values.push(value);
                count++;
            }

            expect(count).to.be(3);
            expect(values).to.contain(0);
            expect(values).to.contain(1);
            expect(values).to.contain(2);
        });
    });
});
