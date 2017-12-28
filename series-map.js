/**
 * Map a series of values to another distinct value.
 * @returns {SeriesMap}
 */
function SeriesMap() {
    const lengthMap = new Map();

    if (this.constructor !== SeriesMap) {
        throw new TypeError("Constructor SeriesMap requires 'new'");
    }

    return {
        /**
         * Return true if map contains a series.
         * @param {array} series
         * @returns {boolean}
         */
        has(series) {
            if (!(series instanceof Array)) return false;

            var map = lengthMap,
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
        get(series) {
            if (!(series instanceof Array)) return undefined;

            var map = lengthMap,
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
        set(series, value) {
            if (!(series instanceof Array)) {
                throw new TypeError("series must be an Array");
            }

            var map = lengthMap,
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
        delete(series) {
            if (!(series instanceof Array)) return;

            var keys = [series.length].concat(series),
                map = lengthMap,
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
        clear() {
            lengthMap.clear();
        }
    }
}

module.exports = SeriesMap;
