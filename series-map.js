const roots = new WeakMap();

/**
 * Map a series of values to another distinct value.
 * @constructor
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
 * Constructor.
 */
SeriesMap.prototype.constructor = SeriesMap;

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
 * Iterate over mapped series/value pairs.
 * @param {function} callback
 * @param {*} [thisArg]
 */
SeriesMap.prototype.forEach = function(callback, thisArg) {
    for (let [series, value] of this) {
        callback.call(thisArg, value, series, this);
    }
};

/**
 * Return iterator of `[series, value]` pairs.
 * @returns {Iterator}
 */
SeriesMap.prototype.entries = function*() {
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
};

/**
 * Return iterator over the series keys.
 * @returns {Iterator}
 */
SeriesMap.prototype.keys = function*() {
    for (let [k,v] of this.entries()) yield k;
}

/**
 * Return iterator over the series values.
 * @returns {Iterator}
 */
SeriesMap.prototype.values = function*() {
    for (let [k,v] of this.entries()) yield v;
}

/**
* Alias for .entries().
* @returns {Iterator}
*/
SeriesMap.prototype[Symbol.iterator] = SeriesMap.prototype.entries;

module.exports = SeriesMap;
