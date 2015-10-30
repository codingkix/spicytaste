/**
 * Merge objects to the first one
 * @param {Boolean|Object} deep if set true, deep merge will be done
 * @param {Object}  obj
 * @return {Object}
 */
var extend = function(deep) {
    'use strict';

    var toString = Object.prototype.toString;
    var obj = '[object Object]';

    // take first argument, if its not a boolean
    var args = arguments,
        i = deep === true ? 1 : 0,
        key,
        target = args[i];

    for (++i; i < args.length; ++i) {

        for (key in args[i]) {

            if (deep === true &&
                target[key] &&
                // if not doing this check you may end in
                // endless loop if using deep option
                toString.call(args[i][key]) === obj &&
                toString.call(target[key]) === obj) {

                extend(deep, target[key], args[i][key]);
            } else {
                target[key] = args[i][key];
            }
        }
    }

    return target;
};

module.exports = {
    extend: extend
};
