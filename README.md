series-map
==========
The `series-map` package provides the `SeriesMap` class.  This class works much
like the standard `Map` class, except all the keys are arrays of values.  This
facilitates mapping a series of values to another corresponding value, *e.g.*,
mapping a series of arguments to a resulting value.

Usage
-----
```js
const SeriesMap = require("series-map");
const map = new SeriesMap();

map.set([13, 13], "apple");
map.set([10, 14], "banana");

assert(map.has([13, 13]) === true);
assert(map.get([13, 13]) === "apple");

assert(map.has([10, 14]) === true);
assert(map.get([10, 14]) === "banana");

assert(map.has([14, 16]) === false);
assert(map.get([14, 16]) === undefined);
```

Example - memoizing a function
------------------------------

```js
const SeriesMap = require("series-map");
const memo = new SeriesMap();

// assume fn is an expensive pure function
function fn(a, b, c) {
    // ... perform expensive calculations
}

// memofn memoizes the underlying fn function
function memofn(a, b, c) {
    const args = [a, b, c];

    if (!memo.has(args)) {
        memo.set(args, fn(a, b, c));
    }

    return memo.get(args);
}
```

API
---

### new SeriesMap([iterable])
Create a `SeriesMap`.  If `iterable` is passed, it should contain pairs of
`[series, value]` entries.

### SeriesMap.prototype.clear()
Remove all series/value pairs from the `SeriesMap` object.

### SeriesMap.prototype.delete(series)
Remove series from the `SeriesMap` object.

### SeriesMap.prototype.entries()
Return an iterator over `[series, value]` pairs mapped by `SeriesMap`.

### SeriesMap.prototype.forEach(function)
Iterate over `SeriesMap` entries and call function for each entry.

### SeriesMap.prototype.get(series)
Return the value associated with the `series` or `undefined` if there is none.

### SeriesMap.prototype.has(series)
Return true if the `series` has an associated value.

### SeriesMap.prototype.keys()
Return an iterator over keys mapped by `SeriesMap`.

### SeriesMap.prototype.set(series, value)
Set the value for the `series`in the `SeriesMap` object.

### SeriesMap.prototype.values()
Return an iterator over values mapped by `SeriesMap`.
