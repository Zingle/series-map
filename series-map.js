const roots = new WeakMap();

/**
 * Map a series of values to another distinct value.
 * @returns {SeriesMap}
 */
function SeriesMap() {
    if (this.constructor !== SeriesMap) {
        throw new TypeError("Constructor SeriesMap requires 'new'");
    }

    roots.set(this, new Map());
    return this;
}

/**
 * Class for derived objects.
 */
SeriesMap[Symbol.species] = SeriesMap;

/**
 * Return true if map contains a series.
 * @param {array} series
 * @returns {boolean}
 */
SeriesMap.prototype.has = function(series) {
    if (!(series instanceof Array)) return false;

    var map = roots.get(this),
        keys = [series.length].concat(series),
        i;

    for (i = 0; i < keys.length; i++) {
        if (!map.has(keys[i])) return false;
        map = map.get(keys[i]);
    }

    return true;
},

/**
 * Return the value mapped to a series.
 * @param {array} series
 * @returns {*}
 */
SeriesMap.prototype.get = function(series) {
    if (!(series instanceof Array)) return undefined;

    var map = roots.get(this),
        keys = [series.length].concat(series),
        i;

    for (i = 0; i < keys.length; i++) {
        if (!map.has(keys[i])) return undefined;
        map = map.get(keys[i]);
    }

    return map;
},

/**
 * Map a series to a value.
 * @param {array} series
 * @param {*} value
 */
SeriesMap.prototype.set = function(series, value) {
    if (!(series instanceof Array)) {
        throw new TypeError("series must be an Array");
    }

    var map = roots.get(this),
        keys = [series.length].concat(series),
        i;

    for (i = 0; i < keys.length - 1; i++) {
        if (!map.has(keys[i])) map.set(keys[i], new Map());
        map = map.get(keys[i]);
    }

    map.set(keys[keys.length-1], value);
},

/**
 * Delete series mapped value.
 * @param {array} series
 */
SeriesMap.prototype.delete = function(series) {
    if (!(series instanceof Array)) return;

    var keys = [series.length].concat(series),
        map = roots.get(this),
        maps = [],
        i

    for (i = 0; i < keys.length; i++) {
        if (!map.has(keys[i])) return;
        maps.push(map);
        map = map.get(keys[i]);
    }

    for (i = keys.length - 1; i >= 0; i--) {
        map = maps[i];
        map.delete(keys[i]);
        if (map.size) return;
    }
},

/**
 * Clear mapped values.
 */
SeriesMap.prototype.clear = function() {
    roots.get(this).clear();
}

/**
 * Return iterator of `[series, value]` pairs.
 * @returns {Iterator}
 */
SeriesMap.prototype[Symbol.iterator] = function*() {
    const root = roots.get(this);

    for (let length of root.keys()) {
        yield* iterate(length, root.get(length));
    }

    function* iterate(length, value, series = []) {
        if (series.length !== length) for (let [k,v] of value.entries()) {
            yield* iterate(length, v, series.concat(k));
        } else {
            yield [series, value];
        }
    }
}

module.exports = SeriesMap;
