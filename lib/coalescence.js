'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

require('core-js/fn/object/entries'); //polyfill for Object.entries method

/**
 * Combines sources together into one object which is returned after deep merging has completed.
 * The last source param overrides the previous (i.e. defaults should be passed first)
 * @param sources - rest param for all sources which should be coalesced/merged together.
 * @returns {{}} - an object with all properties from the passed in sources.
 */
var coalescence = function coalescence() {
    for (var _len = arguments.length, sources = Array(_len), _key = 0; _key < _len; _key++) {
        sources[_key] = arguments[_key];
    }

    if (!sources || !(sources.length > 0)) {
        return;
    }
    var result = {};

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = sources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var source = _step.value;

            deepMerge(result, source);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return result;
};

/**
 * Iterates over each source property and copies it to the target.
 * If the source property value is an object, each property of the value will be copied to the target property
 * @param target - source properties are copied into this object.
 * @param source - all properties will be copied from this into target. function context for get/set/function will be maintained.
 * @returns {*|{}}
 */
var deepMerge = function deepMerge(target, source) {
    if (!source) {
        return;
    } //Object.entries throws error if source is undefined
    target = target || {};

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Object.entries(source)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _ref3 = _step2.value;

            var _ref2 = _slicedToArray(_ref3, 2);

            var key = _ref2[0];
            var value = _ref2[1];

            //get the property descriptor and clone it, so we can modify the value without any side affects.
            var sourcePropertyDescriptorForKeyClone = Object.getOwnPropertyDescriptor(source, key);
            var mergedValue = void 0;
            switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
                case 'object':
                    if (typeof value[Symbol.iterator] === 'function') {
                        mergedValue = cloneIterable(value);
                    } else {
                        mergedValue = deepMerge(target[key], value);
                    }
                    break;
                default:
                    mergedValue = value;
                    break;
            }

            //set the value of the descriptor so that the original value is not passed into Object.defineProperty (if so then it will have the value passed in)
            //Avoid TypeError: Invalid property.  A property cannot both have accessors and be writable or have a value, #<Object>
            if (typeof sourcePropertyDescriptorForKeyClone.get === "undefined") {
                sourcePropertyDescriptorForKeyClone.value = mergedValue;
            }

            Object.defineProperty(target, key, sourcePropertyDescriptorForKeyClone);
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return target;
};

var clone = function clone(objectToClone) {
    return deepMerge(undefined, objectToClone);
};

var cloneIterable = function cloneIterable(arrayToClone) {
    return arrayToClone.map(clone);
};

module.exports = coalescence;
//# sourceMappingURL=coalescence.js.map