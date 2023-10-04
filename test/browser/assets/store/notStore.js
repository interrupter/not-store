var notStore = (function (exports) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math === Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || commonjsGlobal || Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
	});

	var functionBindNative = !fails(function () {
	  // eslint-disable-next-line es/no-function-prototype-bind -- safe
	  var test = (function () { /* empty */ }).bind();
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});

	var call = Function.prototype.call;

	var functionCall = functionBindNative ? call.bind(call) : function () {
	  return call.apply(call, arguments);
	};

	var $propertyIsEnumerable = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var FunctionPrototype = Function.prototype;
	var call$1 = FunctionPrototype.call;
	var uncurryThisWithBind = functionBindNative && FunctionPrototype.bind.bind(call$1, call$1);

	var functionUncurryThis = functionBindNative ? uncurryThisWithBind : function (fn) {
	  return function () {
	    return call$1.apply(fn, arguments);
	  };
	};

	var toString = functionUncurryThis({}.toString);
	var stringSlice = functionUncurryThis(''.slice);

	var classofRaw = function (it) {
	  return stringSlice(toString(it), 8, -1);
	};

	var $Object = Object;
	var split = functionUncurryThis(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !$Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) === 'String' ? split(it, '') : $Object(it);
	} : $Object;

	// we can't use just `it == null` since of `document.all` special case
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
	var isNullOrUndefined = function (it) {
	  return it === null || it === undefined;
	};

	var $TypeError = TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (isNullOrUndefined(it)) throw $TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var documentAll = typeof document == 'object' && document.all;

	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
	// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
	var IS_HTMLDDA = typeof documentAll == 'undefined' && documentAll !== undefined;

	var documentAll_1 = {
	  all: documentAll,
	  IS_HTMLDDA: IS_HTMLDDA
	};

	var documentAll$1 = documentAll_1.all;

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	var isCallable = documentAll_1.IS_HTMLDDA ? function (argument) {
	  return typeof argument == 'function' || argument === documentAll$1;
	} : function (argument) {
	  return typeof argument == 'function';
	};

	var documentAll$2 = documentAll_1.all;

	var isObject = documentAll_1.IS_HTMLDDA ? function (it) {
	  return typeof it == 'object' ? it !== null : isCallable(it) || it === documentAll$2;
	} : function (it) {
	  return typeof it == 'object' ? it !== null : isCallable(it);
	};

	var aFunction = function (argument) {
	  return isCallable(argument) ? argument : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global_1[namespace]) : global_1[namespace] && global_1[namespace][method];
	};

	var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

	var engineUserAgent = typeof navigator != 'undefined' && String(navigator.userAgent) || '';

	var process = global_1.process;
	var Deno$1 = global_1.Deno;
	var versions = process && process.versions || Deno$1 && Deno$1.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var engineV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */




	var $String = global_1.String;

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails(function () {
	  var symbol = Symbol('symbol detection');
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
	  // of course, fail.
	  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && engineV8Version && engineV8Version < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */


	var useSymbolAsUid = symbolConstructorDetection
	  && !Symbol.sham
	  && typeof Symbol.iterator == 'symbol';

	var $Object$1 = Object;

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn('Symbol');
	  return isCallable($Symbol) && objectIsPrototypeOf($Symbol.prototype, $Object$1(it));
	};

	var $String$1 = String;

	var tryToString = function (argument) {
	  try {
	    return $String$1(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var $TypeError$1 = TypeError;

	// `Assert: IsCallable(argument) is true`
	var aCallable = function (argument) {
	  if (isCallable(argument)) return argument;
	  throw $TypeError$1(tryToString(argument) + ' is not a function');
	};

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod = function (V, P) {
	  var func = V[P];
	  return isNullOrUndefined(func) ? undefined : aCallable(func);
	};

	var $TypeError$2 = TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
	  if (isCallable(fn = input.valueOf) && !isObject(val = functionCall(fn, input))) return val;
	  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
	  throw $TypeError$2("Can't convert object to primitive value");
	};

	var isPure = false;

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty = Object.defineProperty;

	var defineGlobalProperty = function (key, value) {
	  try {
	    defineProperty(global_1, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || defineGlobalProperty(SHARED, {});

	var sharedStore = store;

	var shared = createCommonjsModule(function (module) {



	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.32.2',
	  mode:  'global',
	  copyright: '© 2014-2023 Denis Pushkarev (zloirock.ru)',
	  license: 'https://github.com/zloirock/core-js/blob/v3.32.2/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});
	});

	var $Object$2 = Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return $Object$2(requireObjectCoercible(argument));
	};

	var hasOwnProperty = functionUncurryThis({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	// eslint-disable-next-line es/no-object-hasown -- safe
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject(it), key);
	};

	var id = 0;
	var postfix = Math.random();
	var toString$1 = functionUncurryThis(1.0.toString);

	var uid = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$1(++id + postfix, 36);
	};

	var Symbol$1 = global_1.Symbol;
	var WellKnownSymbolsStore = shared('wks');
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1['for'] || Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!hasOwnProperty_1(WellKnownSymbolsStore, name)) {
	    WellKnownSymbolsStore[name] = symbolConstructorDetection && hasOwnProperty_1(Symbol$1, name)
	      ? Symbol$1[name]
	      : createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var $TypeError$3 = TypeError;
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive = function (input, pref) {
	  if (!isObject(input) || isSymbol(input)) return input;
	  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = functionCall(exoticToPrim, input, pref);
	    if (!isObject(result) || isSymbol(result)) return result;
	    throw $TypeError$3("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thanks to IE8 for its funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a !== 7;
	});

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPropertyKey(P);
	  if (ie8DomDefine) try {
	    return $getOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (hasOwnProperty_1(O, P)) return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	// V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
	var v8PrototypeDefineBug = descriptors && fails(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype !== 42;
	});

	var $String$2 = String;
	var $TypeError$4 = TypeError;

	// `Assert: Type(argument) is Object`
	var anObject = function (argument) {
	  if (isObject(argument)) return argument;
	  throw $TypeError$4($String$2(argument) + ' is not an object');
	};

	var $TypeError$5 = TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE = 'configurable';
	var WRITABLE = 'writable';

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? v8PrototypeDefineBug ? function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor$1(O, P);
	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  } return $defineProperty(O, P, Attributes);
	} : $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw $TypeError$5('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var FunctionPrototype$1 = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

	var EXISTS$1 = hasOwnProperty_1(FunctionPrototype$1, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS$1 && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE$1 = EXISTS$1 && (!descriptors || (descriptors && getDescriptor(FunctionPrototype$1, 'name').configurable));

	var functionName = {
	  EXISTS: EXISTS$1,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE$1
	};

	var functionToString = functionUncurryThis(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable(sharedStore.inspectSource)) {
	  sharedStore.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var weakMapBasicDetection = isCallable(WeakMap) && /native code/.test(String(WeakMap));

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$1 = global_1.TypeError;
	var WeakMap$1 = global_1.WeakMap;
	var set, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError$1('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (weakMapBasicDetection || sharedStore.state) {
	  var store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
	  /* eslint-disable no-self-assign -- prototype methods protection */
	  store$1.get = store$1.get;
	  store$1.has = store$1.has;
	  store$1.set = store$1.set;
	  /* eslint-enable no-self-assign -- prototype methods protection */
	  set = function (it, metadata) {
	    if (store$1.has(it)) throw TypeError$1(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    store$1.set(it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return store$1.get(it) || {};
	  };
	  has = function (it) {
	    return store$1.has(it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    if (hasOwnProperty_1(it, STATE)) throw TypeError$1(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwnProperty_1(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var makeBuiltIn_1 = createCommonjsModule(function (module) {





	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;



	var enforceInternalState = internalState.enforce;
	var getInternalState = internalState.get;
	var $String = String;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty = Object.defineProperty;
	var stringSlice = functionUncurryThis(''.slice);
	var replace = functionUncurryThis(''.replace);
	var join = functionUncurryThis([].join);

	var CONFIGURABLE_LENGTH = descriptors && !fails(function () {
	  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
	});

	var TEMPLATE = String(String).split('String');

	var makeBuiltIn = module.exports = function (value, name, options) {
	  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
	    name = '[' + replace($String(name), /^Symbol\(([^)]*)\)/, '$1') + ']';
	  }
	  if (options && options.getter) name = 'get ' + name;
	  if (options && options.setter) name = 'set ' + name;
	  if (!hasOwnProperty_1(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
	    if (descriptors) defineProperty(value, 'name', { value: name, configurable: true });
	    else value.name = name;
	  }
	  if (CONFIGURABLE_LENGTH && options && hasOwnProperty_1(options, 'arity') && value.length !== options.arity) {
	    defineProperty(value, 'length', { value: options.arity });
	  }
	  try {
	    if (options && hasOwnProperty_1(options, 'constructor') && options.constructor) {
	      if (descriptors) defineProperty(value, 'prototype', { writable: false });
	    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
	    } else if (value.prototype) value.prototype = undefined;
	  } catch (error) { /* empty */ }
	  var state = enforceInternalState(value);
	  if (!hasOwnProperty_1(state, 'source')) {
	    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
	  } return value;
	};

	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	// eslint-disable-next-line no-extend-native -- required
	Function.prototype.toString = makeBuiltIn(function toString() {
	  return isCallable(this) && getInternalState(this).source || inspectSource(this);
	}, 'toString');
	});

	var defineBuiltIn = function (O, key, value, options) {
	  if (!options) options = {};
	  var simple = options.enumerable;
	  var name = options.name !== undefined ? options.name : key;
	  if (isCallable(value)) makeBuiltIn_1(value, name, options);
	  if (options.global) {
	    if (simple) O[key] = value;
	    else defineGlobalProperty(key, value);
	  } else {
	    try {
	      if (!options.unsafe) delete O[key];
	      else if (O[key]) simple = true;
	    } catch (error) { /* empty */ }
	    if (simple) O[key] = value;
	    else objectDefineProperty.f(O, key, {
	      value: value,
	      enumerable: false,
	      configurable: !options.nonConfigurable,
	      writable: !options.nonWritable
	    });
	  } return O;
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	// eslint-disable-next-line es/no-math-trunc -- safe
	var mathTrunc = Math.trunc || function trunc(x) {
	  var n = +x;
	  return (n > 0 ? floor : ceil)(n);
	};

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	var toIntegerOrInfinity = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return number !== number || number === 0 ? 0 : mathTrunc(number);
	};

	var max = Math.max;
	var min = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toIntegerOrInfinity(index);
	  return integer < 0 ? max(integer + length, 0) : min(integer, length);
	};

	var min$1 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min$1(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	var lengthOfArrayLike = function (obj) {
	  return toLength(obj.length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = lengthOfArrayLike(O);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el !== el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value !== value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var push = functionUncurryThis([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwnProperty_1(hiddenKeys, key) && hasOwnProperty_1(O, key) && push(result, key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwnProperty_1(O, key = names[i++])) {
	    ~indexOf(result, key) || push(result, key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	var concat = functionUncurryThis([].concat);

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source, exceptions) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwnProperty_1(target, key) && !(exceptions && hasOwnProperty_1(exceptions, key))) {
	      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	    }
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value === POLYFILL ? true
	    : value === NATIVE ? false
	    : isCallable(detection) ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target         - name of the target object
	  options.global         - target is the global object
	  options.stat           - export as static methods of target
	  options.proto          - export as prototype methods of target
	  options.real           - real prototype method for the `pure` version
	  options.forced         - export even if the native feature is available
	  options.bind           - bind methods to the target, required for the `pure` version
	  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
	  options.sham           - add a flag to not completely full polyfills
	  options.enumerable     - export as enumerable property
	  options.dontCallGetSet - prevent calling a getter on target
	  options.name           - the .name of the function if it does not match the key
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || defineGlobalProperty(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.dontCallGetSet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    defineBuiltIn(target, key, sourceProperty, options);
	  }
	};

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe
	var isArray = Array.isArray || function isArray(argument) {
	  return classofRaw(argument) === 'Array';
	};

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	var $Object$3 = Object;

	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = $Object$3(it), TO_STRING_TAG$1)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
	};

	var noop = function () { /* empty */ };
	var empty = [];
	var construct = getBuiltIn('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec = functionUncurryThis(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

	var isConstructorModern = function isConstructor(argument) {
	  if (!isCallable(argument)) return false;
	  try {
	    construct(noop, empty, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function isConstructor(argument) {
	  if (!isCallable(argument)) return false;
	  switch (classof(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction': return false;
	  }
	  try {
	    // we can't check .prototype since constructors produced by .bind haven't it
	    // `Function#toString` throws on some built-it function in some legacy engines
	    // (for example, `DOMQuad` and similar in FF41-)
	    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
	  } catch (error) {
	    return true;
	  }
	};

	isConstructorLegacy.sham = true;

	// `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor
	var isConstructor = !construct || fails(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call)
	    || !isConstructorModern(Object)
	    || !isConstructorModern(function () { called = true; })
	    || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var createProperty = function (object, key, value) {
	  var propertyKey = toPropertyKey(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var SPECIES = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var arraySlice = functionUncurryThis([].slice);

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

	var SPECIES$1 = wellKnownSymbol('species');
	var $Array = Array;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = lengthOfArrayLike(O);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (isConstructor(Constructor) && (Constructor === $Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$1];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === $Array || Constructor === undefined) {
	        return arraySlice(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? $Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var functionUncurryThisClause = function (fn) {
	  // Nashorn bug:
	  //   https://github.com/zloirock/core-js/issues/1128
	  //   https://github.com/zloirock/core-js/issues/1130
	  if (classofRaw(fn) === 'Function') return functionUncurryThis(fn);
	};

	var bind = functionUncurryThisClause(functionUncurryThisClause.bind);

	// optional / simple context binding
	var functionBindContext = function (fn, that) {
	  aCallable(fn);
	  return that === undefined ? fn : functionBindNative ? bind(fn, that) : function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var iteratorClose = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject(iterator);
	  try {
	    innerResult = getMethod(iterator, 'return');
	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }
	    innerResult = functionCall(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }
	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject(innerResult);
	  return value;
	};

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose(iterator, 'throw', error);
	  }
	};

	var iterators = {};

	var ITERATOR = wellKnownSymbol('iterator');
	var ArrayPrototype = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
	};

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR$1)
	    || getMethod(it, '@@iterator')
	    || iterators[classof(it)];
	};

	var $TypeError$6 = TypeError;

	var getIterator = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
	  if (aCallable(iteratorMethod)) return anObject(functionCall(iteratorMethod, argument));
	  throw $TypeError$6(tryToString(argument) + ' is not iterable');
	};

	var $Array$1 = Array;

	// `Array.from` method implementation
	// https://tc39.es/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var IS_CONSTRUCTOR = isConstructor(this);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod && !(this === $Array$1 && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = getIterator(O, iteratorMethod);
	    next = iterator.next;
	    result = IS_CONSTRUCTOR ? new this() : [];
	    for (;!(step = functionCall(next, iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = lengthOfArrayLike(O);
	    result = IS_CONSTRUCTOR ? new this(length) : $Array$1(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$2] = function () {
	    return this;
	  };
	  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  try {
	    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  } catch (error) { return false; } // workaround of old WebKit + `eval` bug
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$2] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  // eslint-disable-next-line es/no-array-from -- required for testing
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.es/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var $String$3 = String;

	var toString_1 = function (argument) {
	  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return $String$3(argument);
	};

	var charAt = functionUncurryThis(''.charAt);
	var charCodeAt = functionUncurryThis(''.charCodeAt);
	var stringSlice$1 = functionUncurryThis(''.slice);

	var createMethod$1 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString_1(requireObjectCoercible($this));
	    var position = toIntegerOrInfinity(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING
	          ? charAt(S, position)
	          : first
	        : CONVERT_TO_STRING
	          ? stringSlice$1(S, position, position + 2)
	          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$1(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$1(true)
	};

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	var f$5 = descriptors && !v8PrototypeDefineBug ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var props = toIndexedObject(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], props[key]);
	  return O;
	};

	var objectDefineProperties = {
		f: f$5
	};

	var html = getBuiltIn('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */








	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = typeof document != 'undefined'
	    ? document.domain && activeXDocument
	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	      : NullProtoObjectViaIFrame()
	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	// eslint-disable-next-line es/no-object-create -- safe
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties.f(result, Properties);
	};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var $Object$4 = Object;
	var ObjectPrototype = $Object$4.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	// eslint-disable-next-line es/no-object-getprototypeof -- safe
	var objectGetPrototypeOf = correctPrototypeGetter ? $Object$4.getPrototypeOf : function (O) {
	  var object = toObject(O);
	  if (hasOwnProperty_1(object, IE_PROTO$1)) return object[IE_PROTO$1];
	  var constructor = object.constructor;
	  if (isCallable(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  } return object instanceof $Object$4 ? ObjectPrototype : null;
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	/* eslint-disable es/no-array-prototype-keys -- safe */
	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype[ITERATOR$3].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

	// `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	if (!isCallable(IteratorPrototype[ITERATOR$3])) {
	  defineBuiltIn(IteratorPrototype, ITERATOR$3, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var defineProperty$1 = objectDefineProperty.f;



	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (target, TAG, STATIC) {
	  if (target && !STATIC) target = target.prototype;
	  if (target && !hasOwnProperty_1(target, TO_STRING_TAG$2)) {
	    defineProperty$1(target, TO_STRING_TAG$2, { configurable: true, value: TAG });
	  }
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis = function () { return this; };

	var iteratorCreateConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis;
	  return IteratorConstructor;
	};

	var functionUncurryThisAccessor = function (object, key, method) {
	  try {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    return functionUncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
	  } catch (error) { /* empty */ }
	};

	var $String$4 = String;
	var $TypeError$7 = TypeError;

	var aPossiblePrototype = function (argument) {
	  if (typeof argument == 'object' || isCallable(argument)) return argument;
	  throw $TypeError$7("Can't set " + $String$4(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */




	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = functionUncurryThisAccessor(Object.prototype, '__proto__', 'set');
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var PROPER_FUNCTION_NAME = functionName.PROPER;
	var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$4 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$1 = function () { return this; };

	var iteratorDefine = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  iteratorCreateConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];

	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    }

	    return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$4]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
	        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$4])) {
	          defineBuiltIn(CurrentIteratorPrototype, ITERATOR$4, returnThis$1);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
	  if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    if ( CONFIGURABLE_FUNCTION_NAME) {
	      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
	    } else {
	      INCORRECT_VALUES_NAME = true;
	      defaultIterator = function values() { return functionCall(nativeIterator, this); };
	    }
	  }

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  // define iterator
	  if ( IterablePrototype[ITERATOR$4] !== defaultIterator) {
	    defineBuiltIn(IterablePrototype, ITERATOR$4, defaultIterator, { name: DEFAULT });
	  }
	  iterators[NAME] = defaultIterator;

	  return methods;
	};

	// `CreateIterResultObject` abstract operation
	// https://tc39.es/ecma262/#sec-createiterresultobject
	var createIterResultObject = function (value, done) {
	  return { value: value, done: done };
	};

	var charAt$1 = stringMultibyte.charAt;





	var STRING_ITERATOR = 'String Iterator';
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
	iteratorDefine(String, 'String', function (iterated) {
	  setInternalState(this, {
	    type: STRING_ITERATOR,
	    string: toString_1(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return createIterResultObject(undefined, true);
	  point = charAt$1(string, index);
	  state.index += point.length;
	  return createIterResultObject(point, false);
	});

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.hasIndices) result += 'd';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.unicodeSets) result += 'v';
	  if (that.sticky) result += 'y';
	  return result;
	};

	// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	var $RegExp = global_1.RegExp;

	var UNSUPPORTED_Y = fails(function () {
	  var re = $RegExp('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') !== null;
	});

	// UC Browser bug
	// https://github.com/zloirock/core-js/issues/1008
	var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
	  return !$RegExp('a', 'y').sticky;
	});

	var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = $RegExp('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') !== null;
	});

	var regexpStickyHelpers = {
	  BROKEN_CARET: BROKEN_CARET,
	  MISSED_STICKY: MISSED_STICKY,
	  UNSUPPORTED_Y: UNSUPPORTED_Y
	};

	// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
	var $RegExp$1 = global_1.RegExp;

	var regexpUnsupportedDotAll = fails(function () {
	  var re = $RegExp$1('.', 's');
	  return !(re.dotAll && re.exec('\n') && re.flags === 's');
	});

	// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
	var $RegExp$2 = global_1.RegExp;

	var regexpUnsupportedNcg = fails(function () {
	  var re = $RegExp$2('(?<a>b)', 'g');
	  return re.exec('b').groups.a !== 'b' ||
	    'b'.replace(re, '$<a>c') !== 'bc';
	});

	/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
	/* eslint-disable regexp/no-useless-quantifier -- testing */







	var getInternalState$1 = internalState.get;



	var nativeReplace = shared('native-string-replace', String.prototype.replace);
	var nativeExec = RegExp.prototype.exec;
	var patchedExec = nativeExec;
	var charAt$2 = functionUncurryThis(''.charAt);
	var indexOf$1 = functionUncurryThis(''.indexOf);
	var replace = functionUncurryThis(''.replace);
	var stringSlice$2 = functionUncurryThis(''.slice);

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  functionCall(nativeExec, re1, 'a');
	  functionCall(nativeExec, re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || regexpUnsupportedDotAll || regexpUnsupportedNcg;

	if (PATCH) {
	  patchedExec = function exec(string) {
	    var re = this;
	    var state = getInternalState$1(re);
	    var str = toString_1(string);
	    var raw = state.raw;
	    var result, reCopy, lastIndex, match, i, object, group;

	    if (raw) {
	      raw.lastIndex = re.lastIndex;
	      result = functionCall(patchedExec, raw, str);
	      re.lastIndex = raw.lastIndex;
	      return result;
	    }

	    var groups = state.groups;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = functionCall(regexpFlags, re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = replace(flags, 'y', '');
	      if (indexOf$1(flags, 'g') === -1) {
	        flags += 'g';
	      }

	      strCopy = stringSlice$2(str, re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$2(str, re.lastIndex - 1) !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = functionCall(nativeExec, sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = stringSlice$2(match.input, charsAdded);
	        match[0] = stringSlice$2(match[0], charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
	      functionCall(nativeReplace, match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    if (match && groups) {
	      match.groups = object = objectCreate(null);
	      for (i = 0; i < groups.length; i++) {
	        group = groups[i];
	        object[group[0]] = match[group[1]];
	      }
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	// `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec
	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	var $Array$2 = Array;
	var max$2 = Math.max;

	var arraySliceSimple = function (O, start, end) {
	  var length = lengthOfArrayLike(O);
	  var k = toAbsoluteIndex(start, length);
	  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	  var result = $Array$2(max$2(fin - k, 0));
	  var n = 0;
	  for (; k < fin; k++, n++) createProperty(result, n, O[k]);
	  result.length = n;
	  return result;
	};

	/* eslint-disable es/no-object-getownpropertynames -- safe */


	var $getOwnPropertyNames = objectGetOwnPropertyNames.f;


	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return $getOwnPropertyNames(it);
	  } catch (error) {
	    return arraySliceSimple(windowNames);
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$6 = function getOwnPropertyNames(it) {
	  return windowNames && classofRaw(it) === 'Window'
	    ? getWindowNames(it)
	    : $getOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$6
	};

	var defineBuiltInAccessor = function (target, name, descriptor) {
	  if (descriptor.get) makeBuiltIn_1(descriptor.get, name, { getter: true });
	  if (descriptor.set) makeBuiltIn_1(descriptor.set, name, { setter: true });
	  return objectDefineProperty.f(target, name, descriptor);
	};

	var f$7 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$7
	};

	var path = global_1;

	var defineProperty$2 = objectDefineProperty.f;

	var wellKnownSymbolDefine = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!hasOwnProperty_1(Symbol, NAME)) defineProperty$2(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	var symbolDefineToPrimitive = function () {
	  var Symbol = getBuiltIn('Symbol');
	  var SymbolPrototype = Symbol && Symbol.prototype;
	  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
	  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
	    // `Symbol.prototype[@@toPrimitive]` method
	    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	    // eslint-disable-next-line no-unused-vars -- required for .length
	    defineBuiltIn(SymbolPrototype, TO_PRIMITIVE, function (hint) {
	      return functionCall(valueOf, this);
	    }, { arity: 1 });
	  }
	};

	var SPECIES$2 = wellKnownSymbol('species');
	var $Array$3 = Array;

	// a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesConstructor = function (originalArray) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (isConstructor(C) && (C === $Array$3 || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES$2];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? $Array$3 : C;
	};

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};

	var push$1 = functionUncurryThis([].push);

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
	var createMethod$2 = function (TYPE) {
	  var IS_MAP = TYPE === 1;
	  var IS_FILTER = TYPE === 2;
	  var IS_SOME = TYPE === 3;
	  var IS_EVERY = TYPE === 4;
	  var IS_FIND_INDEX = TYPE === 6;
	  var IS_FILTER_REJECT = TYPE === 7;
	  var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that);
	    var length = lengthOfArrayLike(self);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push$1(target, value);      // filter
	        } else switch (TYPE) {
	          case 4: return false;             // every
	          case 7: push$1(target, value);      // filterReject
	        }
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$2(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$2(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$2(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$2(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$2(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$2(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$2(6),
	  // `Array.prototype.filterReject` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterReject: createMethod$2(7)
	};

	var $forEach = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';

	var setInternalState$1 = internalState.set;
	var getInternalState$2 = internalState.getterFor(SYMBOL);

	var ObjectPrototype$1 = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var SymbolPrototype = $Symbol && $Symbol[PROTOTYPE$1];
	var TypeError$2 = global_1.TypeError;
	var QObject = global_1.QObject;
	var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty = objectDefineProperty.f;
	var nativeGetOwnPropertyNames = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable = objectPropertyIsEnumerable.f;
	var push$2 = functionUncurryThis([].push);

	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var WellKnownSymbolsStore$1 = shared('wks');

	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty({}, 'a', {
	    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
	  })).a !== 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype$1, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
	  nativeDefineProperty(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
	    nativeDefineProperty(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate(SymbolPrototype);
	  setInternalState$1(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var $defineProperty$1 = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype$1) $defineProperty$1(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPropertyKey(P);
	  anObject(Attributes);
	  if (hasOwnProperty_1(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!hasOwnProperty_1(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (hasOwnProperty_1(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!descriptors || functionCall($propertyIsEnumerable$1, properties, key)) $defineProperty$1(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable$1 = function propertyIsEnumerable(V) {
	  var P = toPropertyKey(V);
	  var enumerable = functionCall(nativePropertyIsEnumerable, this, P);
	  if (this === ObjectPrototype$1 && hasOwnProperty_1(AllSymbols, P) && !hasOwnProperty_1(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !hasOwnProperty_1(this, P) || !hasOwnProperty_1(AllSymbols, P) || hasOwnProperty_1(this, HIDDEN) && this[HIDDEN][P]
	    ? enumerable : true;
	};

	var $getOwnPropertyDescriptor$2 = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPropertyKey(P);
	  if (it === ObjectPrototype$1 && hasOwnProperty_1(AllSymbols, key) && !hasOwnProperty_1(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
	  if (descriptor && hasOwnProperty_1(AllSymbols, key) && !(hasOwnProperty_1(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames$1 = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!hasOwnProperty_1(AllSymbols, key) && !hasOwnProperty_1(hiddenKeys, key)) push$2(result, key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function (O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
	  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (hasOwnProperty_1(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwnProperty_1(ObjectPrototype$1, key))) {
	      push$2(result, AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.es/ecma262/#sec-symbol-constructor
	if (!symbolConstructorDetection) {
	  $Symbol = function Symbol() {
	    if (objectIsPrototypeOf(SymbolPrototype, this)) throw TypeError$2('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : toString_1(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype$1) functionCall(setter, ObjectPrototypeSymbols, value);
	      if (hasOwnProperty_1(this, HIDDEN) && hasOwnProperty_1(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  SymbolPrototype = $Symbol[PROTOTYPE$1];

	  defineBuiltIn(SymbolPrototype, 'toString', function toString() {
	    return getInternalState$2(this).tag;
	  });

	  defineBuiltIn($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid(description), description);
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable$1;
	  objectDefineProperty.f = $defineProperty$1;
	  objectDefineProperties.f = $defineProperties;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor$2;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames$1;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  wellKnownSymbolWrapped.f = function (name) {
	    return wrap(wellKnownSymbol(name), name);
	  };

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    defineBuiltInAccessor(SymbolPrototype, 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState$2(this).description;
	      }
	    });
	    {
	      defineBuiltIn(ObjectPrototype$1, 'propertyIsEnumerable', $propertyIsEnumerable$1, { unsafe: true });
	    }
	  }
	}

	_export({ global: true, constructor: true, wrap: true, forced: !symbolConstructorDetection, sham: !symbolConstructorDetection }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
	  wellKnownSymbolDefine(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !symbolConstructorDetection }, {
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !symbolConstructorDetection, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.es/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.es/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty$1,
	  // `Object.defineProperties` method
	  // https://tc39.es/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor$2
	});

	_export({ target: 'Object', stat: true, forced: !symbolConstructorDetection }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames$1
	});

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	symbolDefineToPrimitive();

	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;

	/* eslint-disable es/no-symbol -- safe */
	var symbolRegistryDetection = symbolConstructorDetection && !!Symbol['for'] && !!Symbol.keyFor;

	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');

	// `Symbol.for` method
	// https://tc39.es/ecma262/#sec-symbol.for
	_export({ target: 'Symbol', stat: true, forced: !symbolRegistryDetection }, {
	  'for': function (key) {
	    var string = toString_1(key);
	    if (hasOwnProperty_1(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = getBuiltIn('Symbol')(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  }
	});

	var SymbolToStringRegistry$1 = shared('symbol-to-string-registry');

	// `Symbol.keyFor` method
	// https://tc39.es/ecma262/#sec-symbol.keyfor
	_export({ target: 'Symbol', stat: true, forced: !symbolRegistryDetection }, {
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(tryToString(sym) + ' is not a symbol');
	    if (hasOwnProperty_1(SymbolToStringRegistry$1, sym)) return SymbolToStringRegistry$1[sym];
	  }
	});

	var FunctionPrototype$2 = Function.prototype;
	var apply = FunctionPrototype$2.apply;
	var call$2 = FunctionPrototype$2.call;

	// eslint-disable-next-line es/no-reflect -- safe
	var functionApply = typeof Reflect == 'object' && Reflect.apply || (functionBindNative ? call$2.bind(apply) : function () {
	  return call$2.apply(apply, arguments);
	});

	var push$3 = functionUncurryThis([].push);

	var getJsonReplacerFunction = function (replacer) {
	  if (isCallable(replacer)) return replacer;
	  if (!isArray(replacer)) return;
	  var rawLength = replacer.length;
	  var keys = [];
	  for (var i = 0; i < rawLength; i++) {
	    var element = replacer[i];
	    if (typeof element == 'string') push$3(keys, element);
	    else if (typeof element == 'number' || classofRaw(element) === 'Number' || classofRaw(element) === 'String') push$3(keys, toString_1(element));
	  }
	  var keysLength = keys.length;
	  var root = true;
	  return function (key, value) {
	    if (root) {
	      root = false;
	      return value;
	    }
	    if (isArray(this)) return value;
	    for (var j = 0; j < keysLength; j++) if (keys[j] === key) return value;
	  };
	};

	var $String$5 = String;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var exec$1 = functionUncurryThis(/./.exec);
	var charAt$3 = functionUncurryThis(''.charAt);
	var charCodeAt$1 = functionUncurryThis(''.charCodeAt);
	var replace$1 = functionUncurryThis(''.replace);
	var numberToString = functionUncurryThis(1.0.toString);

	var tester = /[\uD800-\uDFFF]/g;
	var low = /^[\uD800-\uDBFF]$/;
	var hi = /^[\uDC00-\uDFFF]$/;

	var WRONG_SYMBOLS_CONVERSION = !symbolConstructorDetection || fails(function () {
	  var symbol = getBuiltIn('Symbol')('stringify detection');
	  // MS Edge converts symbol values to JSON as {}
	  return $stringify([symbol]) !== '[null]'
	    // WebKit converts symbol values to JSON as null
	    || $stringify({ a: symbol }) !== '{}'
	    // V8 throws on boxed symbols
	    || $stringify(Object(symbol)) !== '{}';
	});

	// https://github.com/tc39/proposal-well-formed-stringify
	var ILL_FORMED_UNICODE = fails(function () {
	  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
	    || $stringify('\uDEAD') !== '"\\udead"';
	});

	var stringifyWithSymbolsFix = function (it, replacer) {
	  var args = arraySlice(arguments);
	  var $replacer = getJsonReplacerFunction(replacer);
	  if (!isCallable($replacer) && (it === undefined || isSymbol(it))) return; // IE8 returns string on undefined
	  args[1] = function (key, value) {
	    // some old implementations (like WebKit) could pass numbers as keys
	    if (isCallable($replacer)) value = functionCall($replacer, this, $String$5(key), value);
	    if (!isSymbol(value)) return value;
	  };
	  return functionApply($stringify, null, args);
	};

	var fixIllFormed = function (match, offset, string) {
	  var prev = charAt$3(string, offset - 1);
	  var next = charAt$3(string, offset + 1);
	  if ((exec$1(low, match) && !exec$1(hi, next)) || (exec$1(hi, match) && !exec$1(low, prev))) {
	    return '\\u' + numberToString(charCodeAt$1(match, 0), 16);
	  } return match;
	};

	if ($stringify) {
	  // `JSON.stringify` method
	  // https://tc39.es/ecma262/#sec-json.stringify
	  _export({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
	    // eslint-disable-next-line no-unused-vars -- required for `.length`
	    stringify: function stringify(it, replacer, space) {
	      var args = arraySlice(arguments);
	      var result = functionApply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
	      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace$1(result, tester, fixIllFormed) : result;
	    }
	  });
	}

	// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	var FORCED = !symbolConstructorDetection || fails(function () { objectGetOwnPropertySymbols.f(1); });

	// `Object.getOwnPropertySymbols` method
	// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
	_export({ target: 'Object', stat: true, forced: FORCED }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    var $getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject(it)) : [];
	  }
	});

	var NativeSymbol = global_1.Symbol;
	var SymbolPrototype$1 = NativeSymbol && NativeSymbol.prototype;

	if (descriptors && isCallable(NativeSymbol) && (!('description' in SymbolPrototype$1) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString_1(arguments[0]);
	    var result = objectIsPrototypeOf(SymbolPrototype$1, this)
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };

	  copyConstructorProperties(SymbolWrapper, NativeSymbol);
	  SymbolWrapper.prototype = SymbolPrototype$1;
	  SymbolPrototype$1.constructor = SymbolWrapper;

	  var NATIVE_SYMBOL = String(NativeSymbol('description detection')) === 'Symbol(description detection)';
	  var thisSymbolValue = functionUncurryThis(SymbolPrototype$1.valueOf);
	  var symbolDescriptiveString = functionUncurryThis(SymbolPrototype$1.toString);
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  var replace$2 = functionUncurryThis(''.replace);
	  var stringSlice$3 = functionUncurryThis(''.slice);

	  defineBuiltInAccessor(SymbolPrototype$1, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = thisSymbolValue(this);
	      if (hasOwnProperty_1(EmptyStringDescriptionStore, symbol)) return '';
	      var string = symbolDescriptiveString(symbol);
	      var desc = NATIVE_SYMBOL ? stringSlice$3(string, 7, -1) : replace$2(string, regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  _export({ global: true, constructor: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	// `Symbol.iterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.iterator
	wellKnownSymbolDefine('iterator');

	var defineProperty$3 = objectDefineProperty.f;

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype$1 = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype$1[UNSCOPABLES] === undefined) {
	  defineProperty$3(ArrayPrototype$1, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype$1[UNSCOPABLES][key] = true;
	};

	var defineProperty$4 = objectDefineProperty.f;





	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$2 = internalState.set;
	var getInternalState$3 = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator
	var es_array_iterator = iteratorDefine(Array, 'Array', function (iterated, kind) {
	  setInternalState$2(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$3(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return createIterResultObject(undefined, true);
	  }
	  switch (kind) {
	    case 'keys': return createIterResultObject(index, false);
	    case 'values': return createIterResultObject(target[index], false);
	  } return createIterResultObject([index, target[index]], false);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject
	var values = iterators.Arguments = iterators.Array;

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	// V8 ~ Chrome 45- bug
	if ( descriptors && values.name !== 'values') try {
	  defineProperty$4(values, 'name', { value: 'values' });
	} catch (error) { /* empty */ }

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`


	var classList = documentCreateElement('span').classList;
	var DOMTokenListPrototype = classList && classList.constructor && classList.constructor.prototype;

	var domTokenListPrototype = DOMTokenListPrototype === Object.prototype ? undefined : DOMTokenListPrototype;

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
	  if (CollectionPrototype) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype[ITERATOR$5] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype, ITERATOR$5, ArrayValues);
	    } catch (error) {
	      CollectionPrototype[ITERATOR$5] = ArrayValues;
	    }
	    if (!CollectionPrototype[TO_STRING_TAG$3]) {
	      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$3, COLLECTION_NAME);
	    }
	    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
	        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
	      }
	    }
	  }
	};

	for (var COLLECTION_NAME in domIterables) {
	  handlePrototype(global_1[COLLECTION_NAME] && global_1[COLLECTION_NAME].prototype, COLLECTION_NAME);
	}

	handlePrototype(domTokenListPrototype, 'DOMTokenList');

	var asyncToGenerator = createCommonjsModule(function (module) {
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
	  try {
	    var info = gen[key](arg);
	    var value = info.value;
	  } catch (error) {
	    reject(error);
	    return;
	  }
	  if (info.done) {
	    resolve(value);
	  } else {
	    Promise.resolve(value).then(_next, _throw);
	  }
	}
	function _asyncToGenerator(fn) {
	  return function () {
	    var self = this,
	      args = arguments;
	    return new Promise(function (resolve, reject) {
	      var gen = fn.apply(self, args);
	      function _next(value) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
	      }
	      function _throw(err) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
	      }
	      _next(undefined);
	    });
	  };
	}
	module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _asyncToGenerator = unwrapExports(asyncToGenerator);

	var arrayLikeToArray = createCommonjsModule(function (module) {
	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;
	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	  return arr2;
	}
	module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(arrayLikeToArray);

	var arrayWithoutHoles = createCommonjsModule(function (module) {
	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return arrayLikeToArray(arr);
	}
	module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(arrayWithoutHoles);

	var iterableToArray = createCommonjsModule(function (module) {
	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
	}
	module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(iterableToArray);

	var unsupportedIterableToArray = createCommonjsModule(function (module) {
	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
	}
	module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(unsupportedIterableToArray);

	var nonIterableSpread = createCommonjsModule(function (module) {
	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(nonIterableSpread);

	var toConsumableArray = createCommonjsModule(function (module) {
	function _toConsumableArray(arr) {
	  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
	}
	module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _toConsumableArray = unwrapExports(toConsumableArray);

	var classCallCheck = createCommonjsModule(function (module) {
	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}
	module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _classCallCheck = unwrapExports(classCallCheck);

	var _typeof_1 = createCommonjsModule(function (module) {
	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
	    return typeof obj;
	  } : function (obj) {
	    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
	}
	module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(_typeof_1);

	var toPrimitive$1 = createCommonjsModule(function (module) {
	var _typeof = _typeof_1["default"];
	function _toPrimitive(input, hint) {
	  if (_typeof(input) !== "object" || input === null) return input;
	  var prim = input[Symbol.toPrimitive];
	  if (prim !== undefined) {
	    var res = prim.call(input, hint || "default");
	    if (_typeof(res) !== "object") return res;
	    throw new TypeError("@@toPrimitive must return a primitive value.");
	  }
	  return (hint === "string" ? String : Number)(input);
	}
	module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(toPrimitive$1);

	var toPropertyKey$1 = createCommonjsModule(function (module) {
	var _typeof = _typeof_1["default"];

	function _toPropertyKey(arg) {
	  var key = toPrimitive$1(arg, "string");
	  return _typeof(key) === "symbol" ? key : String(key);
	}
	module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(toPropertyKey$1);

	var createClass = createCommonjsModule(function (module) {
	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, toPropertyKey$1(descriptor.key), descriptor);
	  }
	}
	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  Object.defineProperty(Constructor, "prototype", {
	    writable: false
	  });
	  return Constructor;
	}
	module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	var _createClass = unwrapExports(createClass);

	var regeneratorRuntime$1 = createCommonjsModule(function (module) {
	var _typeof = _typeof_1["default"];
	function _regeneratorRuntime() {
	  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
	    return exports;
	  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
	  var exports = {},
	    Op = Object.prototype,
	    hasOwn = Op.hasOwnProperty,
	    defineProperty = Object.defineProperty || function (obj, key, desc) {
	      obj[key] = desc.value;
	    },
	    $Symbol = "function" == typeof Symbol ? Symbol : {},
	    iteratorSymbol = $Symbol.iterator || "@@iterator",
	    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
	    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	  function define(obj, key, value) {
	    return Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: !0,
	      configurable: !0,
	      writable: !0
	    }), obj[key];
	  }
	  try {
	    define({}, "");
	  } catch (err) {
	    define = function define(obj, key, value) {
	      return obj[key] = value;
	    };
	  }
	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
	      generator = Object.create(protoGenerator.prototype),
	      context = new Context(tryLocsList || []);
	    return defineProperty(generator, "_invoke", {
	      value: makeInvokeMethod(innerFn, self, context)
	    }), generator;
	  }
	  function tryCatch(fn, obj, arg) {
	    try {
	      return {
	        type: "normal",
	        arg: fn.call(obj, arg)
	      };
	    } catch (err) {
	      return {
	        type: "throw",
	        arg: err
	      };
	    }
	  }
	  exports.wrap = wrap;
	  var ContinueSentinel = {};
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}
	  var IteratorPrototype = {};
	  define(IteratorPrototype, iteratorSymbol, function () {
	    return this;
	  });
	  var getProto = Object.getPrototypeOf,
	    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function (method) {
	      define(prototype, method, function (arg) {
	        return this._invoke(method, arg);
	      });
	    });
	  }
	  function AsyncIterator(generator, PromiseImpl) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if ("throw" !== record.type) {
	        var result = record.arg,
	          value = result.value;
	        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
	          invoke("next", value, resolve, reject);
	        }, function (err) {
	          invoke("throw", err, resolve, reject);
	        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
	          result.value = unwrapped, resolve(result);
	        }, function (error) {
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	      reject(record.arg);
	    }
	    var previousPromise;
	    defineProperty(this, "_invoke", {
	      value: function value(method, arg) {
	        function callInvokeWithMethodAndArg() {
	          return new PromiseImpl(function (resolve, reject) {
	            invoke(method, arg, resolve, reject);
	          });
	        }
	        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
	      }
	    });
	  }
	  function makeInvokeMethod(innerFn, self, context) {
	    var state = "suspendedStart";
	    return function (method, arg) {
	      if ("executing" === state) throw new Error("Generator is already running");
	      if ("completed" === state) {
	        if ("throw" === method) throw arg;
	        return doneResult();
	      }
	      for (context.method = method, context.arg = arg;;) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }
	        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
	          if ("suspendedStart" === state) throw state = "completed", context.arg;
	          context.dispatchException(context.arg);
	        } else "return" === context.method && context.abrupt("return", context.arg);
	        state = "executing";
	        var record = tryCatch(innerFn, self, context);
	        if ("normal" === record.type) {
	          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
	          return {
	            value: record.arg,
	            done: context.done
	          };
	        }
	        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
	      }
	    };
	  }
	  function maybeInvokeDelegate(delegate, context) {
	    var methodName = context.method,
	      method = delegate.iterator[methodName];
	    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
	    var record = tryCatch(method, delegate.iterator, context.arg);
	    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
	    var info = record.arg;
	    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
	  }
	  function pushTryEntry(locs) {
	    var entry = {
	      tryLoc: locs[0]
	    };
	    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
	  }
	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal", delete record.arg, entry.completion = record;
	  }
	  function Context(tryLocsList) {
	    this.tryEntries = [{
	      tryLoc: "root"
	    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
	  }
	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) return iteratorMethod.call(iterable);
	      if ("function" == typeof iterable.next) return iterable;
	      if (!isNaN(iterable.length)) {
	        var i = -1,
	          next = function next() {
	            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
	            return next.value = undefined, next.done = !0, next;
	          };
	        return next.next = next;
	      }
	    }
	    return {
	      next: doneResult
	    };
	  }
	  function doneResult() {
	    return {
	      value: undefined,
	      done: !0
	    };
	  }
	  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
	    value: GeneratorFunctionPrototype,
	    configurable: !0
	  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
	    value: GeneratorFunction,
	    configurable: !0
	  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
	    var ctor = "function" == typeof genFun && genFun.constructor;
	    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
	  }, exports.mark = function (genFun) {
	    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
	  }, exports.awrap = function (arg) {
	    return {
	      __await: arg
	    };
	  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
	    return this;
	  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	    void 0 === PromiseImpl && (PromiseImpl = Promise);
	    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
	    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
	      return result.done ? result.value : iter.next();
	    });
	  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
	    return this;
	  }), define(Gp, "toString", function () {
	    return "[object Generator]";
	  }), exports.keys = function (val) {
	    var object = Object(val),
	      keys = [];
	    for (var key in object) keys.push(key);
	    return keys.reverse(), function next() {
	      for (; keys.length;) {
	        var key = keys.pop();
	        if (key in object) return next.value = key, next.done = !1, next;
	      }
	      return next.done = !0, next;
	    };
	  }, exports.values = values, Context.prototype = {
	    constructor: Context,
	    reset: function reset(skipTempReset) {
	      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
	    },
	    stop: function stop() {
	      this.done = !0;
	      var rootRecord = this.tryEntries[0].completion;
	      if ("throw" === rootRecord.type) throw rootRecord.arg;
	      return this.rval;
	    },
	    dispatchException: function dispatchException(exception) {
	      if (this.done) throw exception;
	      var context = this;
	      function handle(loc, caught) {
	        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
	      }
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i],
	          record = entry.completion;
	        if ("root" === entry.tryLoc) return handle("end");
	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc"),
	            hasFinally = hasOwn.call(entry, "finallyLoc");
	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
	            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
	          } else {
	            if (!hasFinally) throw new Error("try statement without catch or finally");
	            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
	          }
	        }
	      }
	    },
	    abrupt: function abrupt(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }
	      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
	      var record = finallyEntry ? finallyEntry.completion : {};
	      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
	    },
	    complete: function complete(record, afterLoc) {
	      if ("throw" === record.type) throw record.arg;
	      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
	    },
	    finish: function finish(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
	      }
	    },
	    "catch": function _catch(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if ("throw" === record.type) {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }
	      throw new Error("illegal catch attempt");
	    },
	    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
	      return this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
	    }
	  }, exports;
	}
	module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(regeneratorRuntime$1);

	// TODO(Babel 8): Remove this file.

	var runtime = regeneratorRuntime$1();
	var regenerator = runtime;

	// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
	try {
	  regeneratorRuntime = runtime;
	} catch (accidentalStrictMode) {
	  if (typeof globalThis === "object") {
	    globalThis.regeneratorRuntime = runtime;
	  } else {
	    Function("r", "regeneratorRuntime = r")(runtime);
	  }
	}

	// eslint-disable-next-line es/no-object-assign -- safe
	var $assign = Object.assign;
	// eslint-disable-next-line es/no-object-defineproperty -- required for testing
	var defineProperty$5 = Object.defineProperty;
	var concat$1 = functionUncurryThis([].concat);

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	var objectAssign = !$assign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && $assign({ b: 1 }, $assign(defineProperty$5({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$5(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line es/no-symbol -- safe
	  var symbol = Symbol('assign detection');
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return $assign({}, A)[symbol] !== 7 || objectKeys($assign({}, B)).join('') !== alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? concat$1(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || functionCall(propertyIsEnumerable, S, key)) T[key] = S[key];
	    }
	  } return T;
	} : $assign;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	// eslint-disable-next-line es/no-object-assign -- required for testing
	_export({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	var $TypeError$8 = TypeError;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

	// Safari < 13 does not throw an error in this case
	var SILENT_ON_NON_WRITABLE_LENGTH_SET = descriptors && !function () {
	  // makes no sense without proper strict mode support
	  if (this !== undefined) return true;
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty([], 'length', { writable: false }).length = 1;
	  } catch (error) {
	    return error instanceof TypeError;
	  }
	}();

	var arraySetLength = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
	  if (isArray(O) && !getOwnPropertyDescriptor$2(O, 'length').writable) {
	    throw $TypeError$8('Cannot set read only .length');
	  } return O.length = length;
	} : function (O, length) {
	  return O.length = length;
	};

	var $TypeError$9 = TypeError;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

	var doesNotExceedSafeInteger = function (it) {
	  if (it > MAX_SAFE_INTEGER) throw $TypeError$9('Maximum allowed index exceeded');
	  return it;
	};

	var $TypeError$a = TypeError;

	var deletePropertyOrThrow = function (O, P) {
	  if (!delete O[P]) throw $TypeError$a('Cannot delete property ' + tryToString(P) + ' of ' + tryToString(O));
	};

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('splice');

	var max$3 = Math.max;
	var min$2 = Math.min;

	// `Array.prototype.splice` method
	// https://tc39.es/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject(this);
	    var len = lengthOfArrayLike(O);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$2(max$3(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
	    }
	    doesNotExceedSafeInteger(len + insertCount - actualDeleteCount);
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else deletePropertyOrThrow(O, to);
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) deletePropertyOrThrow(O, k - 1);
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else deletePropertyOrThrow(O, to);
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    arraySetLength(O, len - actualDeleteCount + insertCount);
	    return A;
	  }
	});

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !arrayMethodHasSpeciesSupport('concat');

	// `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, arity: 1, forced: FORCED$1 }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike(E);
	        doesNotExceedSafeInteger(n + len);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        doesNotExceedSafeInteger(n + 1);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	// `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  defineBuiltIn(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	var engineIsNode = classofRaw(global_1.process) === 'process';

	var SPECIES$3 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);

	  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
	    defineBuiltInAccessor(Constructor, SPECIES$3, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var $TypeError$b = TypeError;

	var anInstance = function (it, Prototype) {
	  if (objectIsPrototypeOf(Prototype, it)) return it;
	  throw $TypeError$b('Incorrect invocation');
	};

	var $TypeError$c = TypeError;

	// `Assert: IsConstructor(argument) is true`
	var aConstructor = function (argument) {
	  if (isConstructor(argument)) return argument;
	  throw $TypeError$c(tryToString(argument) + ' is not a constructor');
	};

	var SPECIES$4 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES$4]) ? defaultConstructor : aConstructor(S);
	};

	var $TypeError$d = TypeError;

	var validateArgumentsLength = function (passed, required) {
	  if (passed < required) throw $TypeError$d('Not enough arguments');
	  return passed;
	};

	// eslint-disable-next-line redos/no-vulnerable -- safe
	var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(engineUserAgent);

	var set$1 = global_1.setImmediate;
	var clear = global_1.clearImmediate;
	var process$1 = global_1.process;
	var Dispatch = global_1.Dispatch;
	var Function$1 = global_1.Function;
	var MessageChannel = global_1.MessageChannel;
	var String$1 = global_1.String;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var $location, defer, channel, port;

	fails(function () {
	  // Deno throws a ReferenceError on `location` access without `--location` flag
	  $location = global_1.location;
	});

	var run = function (id) {
	  if (hasOwnProperty_1(queue, id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var eventListener = function (event) {
	  run(event.data);
	};

	var globalPostMessageDefer = function (id) {
	  // old engines have not location.origin
	  global_1.postMessage(String$1(id), $location.protocol + '//' + $location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set$1 || !clear) {
	  set$1 = function setImmediate(handler) {
	    validateArgumentsLength(arguments.length, 1);
	    var fn = isCallable(handler) ? handler : Function$1(handler);
	    var args = arraySlice(arguments, 1);
	    queue[++counter] = function () {
	      functionApply(fn, undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (engineIsNode) {
	    defer = function (id) {
	      process$1.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel && !engineIsIos) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = eventListener;
	    defer = functionBindContext(port.postMessage, port);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (
	    global_1.addEventListener &&
	    isCallable(global_1.postMessage) &&
	    !global_1.importScripts &&
	    $location && $location.protocol !== 'file:' &&
	    !fails(globalPostMessageDefer)
	  ) {
	    defer = globalPostMessageDefer;
	    global_1.addEventListener('message', eventListener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
	    defer = function (id) {
	      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task = {
	  set: set$1,
	  clear: clear
	};

	var Queue = function () {
	  this.head = null;
	  this.tail = null;
	};

	Queue.prototype = {
	  add: function (item) {
	    var entry = { item: item, next: null };
	    var tail = this.tail;
	    if (tail) tail.next = entry;
	    else this.head = entry;
	    this.tail = entry;
	  },
	  get: function () {
	    var entry = this.head;
	    if (entry) {
	      var next = this.head = entry.next;
	      if (next === null) this.tail = null;
	      return entry.item;
	    }
	  }
	};

	var queue$1 = Queue;

	var engineIsIosPebble = /ipad|iphone|ipod/i.test(engineUserAgent) && typeof Pebble != 'undefined';

	var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(engineUserAgent);

	var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
	var macrotask = task.set;






	var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
	var document$2 = global_1.document;
	var process$2 = global_1.process;
	var Promise$1 = global_1.Promise;
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$3(global_1, 'queueMicrotask');
	var microtask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
	var notify, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!microtask) {
	  var queue$2 = new queue$1();

	  var flush = function () {
	    var parent, fn;
	    if (engineIsNode && (parent = process$2.domain)) parent.exit();
	    while (fn = queue$2.get()) try {
	      fn();
	    } catch (error) {
	      if (queue$2.head) notify();
	      throw error;
	    }
	    if (parent) parent.enter();
	  };

	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
	  if (!engineIsIos && !engineIsNode && !engineIsWebosWebkit && MutationObserver && document$2) {
	    toggle = true;
	    node = document$2.createTextNode('');
	    new MutationObserver(flush).observe(node, { characterData: true });
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (!engineIsIosPebble && Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    // workaround of WebKit ~ iOS Safari 10.1 bug
	    promise.constructor = Promise$1;
	    then = functionBindContext(promise.then, promise);
	    notify = function () {
	      then(flush);
	    };
	  // Node.js without promises
	  } else if (engineIsNode) {
	    notify = function () {
	      process$2.nextTick(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessage
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    // `webpack` dev server bug on IE global methods - use bind(fn, global)
	    macrotask = functionBindContext(macrotask, global_1);
	    notify = function () {
	      macrotask(flush);
	    };
	  }

	  microtask = function (fn) {
	    if (!queue$2.head) notify();
	    queue$2.add(fn);
	  };
	}

	var microtask_1 = microtask;

	var hostReportErrors = function (a, b) {
	  try {
	    // eslint-disable-next-line no-console -- safe
	    arguments.length === 1 ? console.error(a) : console.error(a, b);
	  } catch (error) { /* empty */ }
	};

	var perform = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var promiseNativeConstructor = global_1.Promise;

	/* global Deno -- Deno case */
	var engineIsDeno = typeof Deno == 'object' && Deno && typeof Deno.version == 'object';

	var engineIsBrowser = !engineIsDeno && !engineIsNode
	  && typeof window == 'object'
	  && typeof document == 'object';

	var NativePromisePrototype = promiseNativeConstructor && promiseNativeConstructor.prototype;
	var SPECIES$5 = wellKnownSymbol('species');
	var SUBCLASSING = false;
	var NATIVE_PROMISE_REJECTION_EVENT = isCallable(global_1.PromiseRejectionEvent);

	var FORCED_PROMISE_CONSTRUCTOR = isForced_1('Promise', function () {
	  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(promiseNativeConstructor);
	  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(promiseNativeConstructor);
	  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	  // We can't detect it synchronously, so just check versions
	  if (!GLOBAL_CORE_JS_PROMISE && engineV8Version === 66) return true;
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (!engineV8Version || engineV8Version < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
	    // Detect correctness of subclassing with @@species support
	    var promise = new promiseNativeConstructor(function (resolve) { resolve(1); });
	    var FakePromise = function (exec) {
	      exec(function () { /* empty */ }, function () { /* empty */ });
	    };
	    var constructor = promise.constructor = {};
	    constructor[SPECIES$5] = FakePromise;
	    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
	    if (!SUBCLASSING) return true;
	  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	  } return !GLOBAL_CORE_JS_PROMISE && (engineIsBrowser || engineIsDeno) && !NATIVE_PROMISE_REJECTION_EVENT;
	});

	var promiseConstructorDetection = {
	  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR,
	  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT,
	  SUBCLASSING: SUBCLASSING
	};

	var $TypeError$e = TypeError;

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw $TypeError$e('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aCallable(resolve);
	  this.reject = aCallable(reject);
	};

	// `NewPromiseCapability` abstract operation
	// https://tc39.es/ecma262/#sec-newpromisecapability
	var f$8 = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability = {
		f: f$8
	};

	var task$1 = task.set;









	var PROMISE = 'Promise';
	var FORCED_PROMISE_CONSTRUCTOR$1 = promiseConstructorDetection.CONSTRUCTOR;
	var NATIVE_PROMISE_REJECTION_EVENT$1 = promiseConstructorDetection.REJECTION_EVENT;
	var NATIVE_PROMISE_SUBCLASSING = promiseConstructorDetection.SUBCLASSING;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var setInternalState$3 = internalState.set;
	var NativePromisePrototype$1 = promiseNativeConstructor && promiseNativeConstructor.prototype;
	var PromiseConstructor = promiseNativeConstructor;
	var PromisePrototype = NativePromisePrototype$1;
	var TypeError$3 = global_1.TypeError;
	var document$3 = global_1.document;
	var process$3 = global_1.process;
	var newPromiseCapability$1 = newPromiseCapability.f;
	var newGenericPromiseCapability = newPromiseCapability$1;

	var DISPATCH_EVENT = !!(document$3 && document$3.createEvent && global_1.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;

	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && isCallable(then = it.then) ? then : false;
	};

	var callReaction = function (reaction, state) {
	  var value = state.value;
	  var ok = state.state === FULFILLED;
	  var handler = ok ? reaction.ok : reaction.fail;
	  var resolve = reaction.resolve;
	  var reject = reaction.reject;
	  var domain = reaction.domain;
	  var result, then, exited;
	  try {
	    if (handler) {
	      if (!ok) {
	        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
	        state.rejection = HANDLED;
	      }
	      if (handler === true) result = value;
	      else {
	        if (domain) domain.enter();
	        result = handler(value); // can throw
	        if (domain) {
	          domain.exit();
	          exited = true;
	        }
	      }
	      if (result === reaction.promise) {
	        reject(TypeError$3('Promise-chain cycle'));
	      } else if (then = isThenable(result)) {
	        functionCall(then, result, resolve, reject);
	      } else resolve(result);
	    } else reject(value);
	  } catch (error) {
	    if (domain && !exited) domain.exit();
	    reject(error);
	  }
	};

	var notify$1 = function (state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  microtask_1(function () {
	    var reactions = state.reactions;
	    var reaction;
	    while (reaction = reactions.get()) {
	      callReaction(reaction, state);
	    }
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$3.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global_1.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (!NATIVE_PROMISE_REJECTION_EVENT$1 && (handler = global_1['on' + name])) handler(event);
	  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (state) {
	  functionCall(task$1, global_1, function () {
	    var promise = state.facade;
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform(function () {
	        if (engineIsNode) {
	          process$3.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = engineIsNode || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (state) {
	  functionCall(task$1, global_1, function () {
	    var promise = state.facade;
	    if (engineIsNode) {
	      process$3.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind$1 = function (fn, state, unwrap) {
	  return function (value) {
	    fn(state, value, unwrap);
	  };
	};

	var internalReject = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify$1(state, true);
	};

	var internalResolve = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (state.facade === value) throw TypeError$3("Promise can't be resolved itself");
	    var then = isThenable(value);
	    if (then) {
	      microtask_1(function () {
	        var wrapper = { done: false };
	        try {
	          functionCall(then, value,
	            bind$1(internalResolve, wrapper, state),
	            bind$1(internalReject, wrapper, state)
	          );
	        } catch (error) {
	          internalReject(wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify$1(state, false);
	    }
	  } catch (error) {
	    internalReject({ done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED_PROMISE_CONSTRUCTOR$1) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromisePrototype);
	    aCallable(executor);
	    functionCall(Internal, this);
	    var state = getInternalPromiseState(this);
	    try {
	      executor(bind$1(internalResolve, state), bind$1(internalReject, state));
	    } catch (error) {
	      internalReject(state, error);
	    }
	  };

	  PromisePrototype = PromiseConstructor.prototype;

	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  Internal = function Promise(executor) {
	    setInternalState$3(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: new queue$1(),
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };

	  // `Promise.prototype.then` method
	  // https://tc39.es/ecma262/#sec-promise.prototype.then
	  Internal.prototype = defineBuiltIn(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
	    var state = getInternalPromiseState(this);
	    var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
	    state.parent = true;
	    reaction.ok = isCallable(onFulfilled) ? onFulfilled : true;
	    reaction.fail = isCallable(onRejected) && onRejected;
	    reaction.domain = engineIsNode ? process$3.domain : undefined;
	    if (state.state === PENDING) state.reactions.add(reaction);
	    else microtask_1(function () {
	      callReaction(reaction, state);
	    });
	    return reaction.promise;
	  });

	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalPromiseState(promise);
	    this.promise = promise;
	    this.resolve = bind$1(internalResolve, state);
	    this.reject = bind$1(internalReject, state);
	  };

	  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if ( isCallable(promiseNativeConstructor) && NativePromisePrototype$1 !== Object.prototype) {
	    nativeThen = NativePromisePrototype$1.then;

	    if (!NATIVE_PROMISE_SUBCLASSING) {
	      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
	      defineBuiltIn(NativePromisePrototype$1, 'then', function then(onFulfilled, onRejected) {
	        var that = this;
	        return new PromiseConstructor(function (resolve, reject) {
	          functionCall(nativeThen, that, resolve, reject);
	        }).then(onFulfilled, onRejected);
	      // https://github.com/zloirock/core-js/issues/640
	      }, { unsafe: true });
	    }

	    // make `.constructor === Promise` work for native promise-based APIs
	    try {
	      delete NativePromisePrototype$1.constructor;
	    } catch (error) { /* empty */ }

	    // make `instanceof Promise` work for native promise-based APIs
	    if (objectSetPrototypeOf) {
	      objectSetPrototypeOf(NativePromisePrototype$1, PromisePrototype);
	    }
	  }
	}

	_export({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR$1 }, {
	  Promise: PromiseConstructor
	});

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	var $TypeError$f = TypeError;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var ResultPrototype = Result.prototype;

	var iterate = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_RECORD = !!(options && options.IS_RECORD);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = functionBindContext(unboundFunction, that);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose(iterator, 'normal', condition);
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    } return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_RECORD) {
	    iterator = iterable.iterator;
	  } else if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (!iterFn) throw $TypeError$f(tryToString(iterable) + ' is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && objectIsPrototypeOf(ResultPrototype, result)) return result;
	      } return new Result(false);
	    }
	    iterator = getIterator(iterable, iterFn);
	  }

	  next = IS_RECORD ? iterable.next : iterator.next;
	  while (!(step = functionCall(next, iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose(iterator, 'throw', error);
	    }
	    if (typeof result == 'object' && result && objectIsPrototypeOf(ResultPrototype, result)) return result;
	  } return new Result(false);
	};

	var FORCED_PROMISE_CONSTRUCTOR$2 = promiseConstructorDetection.CONSTRUCTOR;

	var promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR$2 || !checkCorrectnessOfIteration(function (iterable) {
	  promiseNativeConstructor.all(iterable).then(undefined, function () { /* empty */ });
	});

	// `Promise.all` method
	// https://tc39.es/ecma262/#sec-promise.all
	_export({ target: 'Promise', stat: true, forced: promiseStaticsIncorrectIteration }, {
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aCallable(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        remaining++;
	        functionCall($promiseResolve, C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var FORCED_PROMISE_CONSTRUCTOR$3 = promiseConstructorDetection.CONSTRUCTOR;





	var NativePromisePrototype$2 = promiseNativeConstructor && promiseNativeConstructor.prototype;

	// `Promise.prototype.catch` method
	// https://tc39.es/ecma262/#sec-promise.prototype.catch
	_export({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR$3, real: true }, {
	  'catch': function (onRejected) {
	    return this.then(undefined, onRejected);
	  }
	});

	// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
	if ( isCallable(promiseNativeConstructor)) {
	  var method = getBuiltIn('Promise').prototype['catch'];
	  if (NativePromisePrototype$2['catch'] !== method) {
	    defineBuiltIn(NativePromisePrototype$2, 'catch', method, { unsafe: true });
	  }
	}

	// `Promise.race` method
	// https://tc39.es/ecma262/#sec-promise.race
	_export({ target: 'Promise', stat: true, forced: promiseStaticsIncorrectIteration }, {
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability.f(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aCallable(C.resolve);
	      iterate(iterable, function (promise) {
	        functionCall($promiseResolve, C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var FORCED_PROMISE_CONSTRUCTOR$4 = promiseConstructorDetection.CONSTRUCTOR;

	// `Promise.reject` method
	// https://tc39.es/ecma262/#sec-promise.reject
	_export({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR$4 }, {
	  reject: function reject(r) {
	    var capability = newPromiseCapability.f(this);
	    functionCall(capability.reject, undefined, r);
	    return capability.promise;
	  }
	});

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var FORCED_PROMISE_CONSTRUCTOR$5 = promiseConstructorDetection.CONSTRUCTOR;


	var PromiseConstructorWrapper = getBuiltIn('Promise');

	// `Promise.resolve` method
	// https://tc39.es/ecma262/#sec-promise.resolve
	_export({ target: 'Promise', stat: true, forced:  FORCED_PROMISE_CONSTRUCTOR$5 }, {
	  resolve: function resolve(x) {
	    return promiseResolve( this, x);
	  }
	});

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call -- required for testing
	    method.call(null, argument || function () { return 1; }, 1);
	  });
	};

	var $forEach$1 = arrayIteration.forEach;


	var STRICT_METHOD = arrayMethodIsStrict('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	var arrayForEach = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	// eslint-disable-next-line es/no-array-prototype-foreach -- safe
	} : [].forEach;

	var handlePrototype$1 = function (CollectionPrototype) {
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	};

	for (var COLLECTION_NAME$1 in domIterables) {
	  if (domIterables[COLLECTION_NAME$1]) {
	    handlePrototype$1(global_1[COLLECTION_NAME$1] && global_1[COLLECTION_NAME$1].prototype);
	  }
	}

	handlePrototype$1(domTokenListPrototype);

	var FUNCTION_NAME_EXISTS = functionName.EXISTS;



	var FunctionPrototype$3 = Function.prototype;
	var functionToString$1 = functionUncurryThis(FunctionPrototype$3.toString);
	var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
	var regExpExec = functionUncurryThis(nameRE.exec);
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name
	if (descriptors && !FUNCTION_NAME_EXISTS) {
	  defineBuiltInAccessor(FunctionPrototype$3, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return regExpExec(nameRE, functionToString$1(this))[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	function noop$1() { }
	function run$1(fn) {
	    return fn();
	}
	function blank_object() {
	    return Object.create(null);
	}
	function run_all(fns) {
	    fns.forEach(run$1);
	}
	function is_function(thing) {
	    return typeof thing === 'function';
	}
	function safe_not_equal(a, b) {
	    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}
	let src_url_equal_anchor;
	function src_url_equal(element_src, url) {
	    if (!src_url_equal_anchor) {
	        src_url_equal_anchor = document.createElement('a');
	    }
	    src_url_equal_anchor.href = url;
	    return element_src === src_url_equal_anchor.href;
	}
	function is_empty(obj) {
	    return Object.keys(obj).length === 0;
	}
	function append(target, node) {
	    target.appendChild(node);
	}
	function insert(target, node, anchor) {
	    target.insertBefore(node, anchor || null);
	}
	function detach(node) {
	    if (node.parentNode) {
	        node.parentNode.removeChild(node);
	    }
	}
	function destroy_each(iterations, detaching) {
	    for (let i = 0; i < iterations.length; i += 1) {
	        if (iterations[i])
	            iterations[i].d(detaching);
	    }
	}
	function element(name) {
	    return document.createElement(name);
	}
	function text(data) {
	    return document.createTextNode(data);
	}
	function space() {
	    return text(' ');
	}
	function empty$1() {
	    return text('');
	}
	function listen(node, event, handler, options) {
	    node.addEventListener(event, handler, options);
	    return () => node.removeEventListener(event, handler, options);
	}
	function attr(node, attribute, value) {
	    if (value == null)
	        node.removeAttribute(attribute);
	    else if (node.getAttribute(attribute) !== value)
	        node.setAttribute(attribute, value);
	}
	function children(element) {
	    return Array.from(element.childNodes);
	}
	function set_data(text, data) {
	    data = '' + data;
	    if (text.data === data)
	        return;
	    text.data = data;
	}
	function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
	    const e = document.createEvent('CustomEvent');
	    e.initCustomEvent(type, bubbles, cancelable, detail);
	    return e;
	}

	let current_component;
	function set_current_component(component) {
	    current_component = component;
	}
	function get_current_component() {
	    if (!current_component)
	        throw new Error('Function called outside component initialization');
	    return current_component;
	}
	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs#run-time-svelte-onmount
	 */
	function onMount(fn) {
	    get_current_component().$$.on_mount.push(fn);
	}
	/**
	 * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
	 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
	 *
	 * Component events created with `createEventDispatcher` create a
	 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
	 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
	 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
	 * property and can contain any type of data.
	 *
	 * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
	 */
	function createEventDispatcher() {
	    const component = get_current_component();
	    return (type, detail, { cancelable = false } = {}) => {
	        const callbacks = component.$$.callbacks[type];
	        if (callbacks) {
	            // TODO are there situations where events could be dispatched
	            // in a server (non-DOM) environment?
	            const event = custom_event(type, detail, { cancelable });
	            callbacks.slice().forEach(fn => {
	                fn.call(component, event);
	            });
	            return !event.defaultPrevented;
	        }
	        return true;
	    };
	}
	// TODO figure out if we still want to support
	// shorthand events, or if we want to implement
	// a real bubbling mechanism
	function bubble(component, event) {
	    const callbacks = component.$$.callbacks[event.type];
	    if (callbacks) {
	        // @ts-ignore
	        callbacks.slice().forEach(fn => fn.call(this, event));
	    }
	}

	const dirty_components = [];
	const binding_callbacks = [];
	let render_callbacks = [];
	const flush_callbacks = [];
	const resolved_promise = /* @__PURE__ */ Promise.resolve();
	let update_scheduled = false;
	function schedule_update() {
	    if (!update_scheduled) {
	        update_scheduled = true;
	        resolved_promise.then(flush$1);
	    }
	}
	function add_render_callback(fn) {
	    render_callbacks.push(fn);
	}
	function add_flush_callback(fn) {
	    flush_callbacks.push(fn);
	}
	// flush() calls callbacks in this order:
	// 1. All beforeUpdate callbacks, in order: parents before children
	// 2. All bind:this callbacks, in reverse order: children before parents.
	// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
	//    for afterUpdates called during the initial onMount, which are called in
	//    reverse order: children before parents.
	// Since callbacks might update component values, which could trigger another
	// call to flush(), the following steps guard against this:
	// 1. During beforeUpdate, any updated components will be added to the
	//    dirty_components array and will cause a reentrant call to flush(). Because
	//    the flush index is kept outside the function, the reentrant call will pick
	//    up where the earlier call left off and go through all dirty components. The
	//    current_component value is saved and restored so that the reentrant call will
	//    not interfere with the "parent" flush() call.
	// 2. bind:this callbacks cannot trigger new flush() calls.
	// 3. During afterUpdate, any updated components will NOT have their afterUpdate
	//    callback called a second time; the seen_callbacks set, outside the flush()
	//    function, guarantees this behavior.
	const seen_callbacks = new Set();
	let flushidx = 0; // Do *not* move this inside the flush() function
	function flush$1() {
	    // Do not reenter flush while dirty components are updated, as this can
	    // result in an infinite loop. Instead, let the inner flush handle it.
	    // Reentrancy is ok afterwards for bindings etc.
	    if (flushidx !== 0) {
	        return;
	    }
	    const saved_component = current_component;
	    do {
	        // first, call beforeUpdate functions
	        // and update components
	        try {
	            while (flushidx < dirty_components.length) {
	                const component = dirty_components[flushidx];
	                flushidx++;
	                set_current_component(component);
	                update(component.$$);
	            }
	        }
	        catch (e) {
	            // reset dirty state to not end up in a deadlocked state and then rethrow
	            dirty_components.length = 0;
	            flushidx = 0;
	            throw e;
	        }
	        set_current_component(null);
	        dirty_components.length = 0;
	        flushidx = 0;
	        while (binding_callbacks.length)
	            binding_callbacks.pop()();
	        // then, once components are updated, call
	        // afterUpdate functions. This may cause
	        // subsequent updates...
	        for (let i = 0; i < render_callbacks.length; i += 1) {
	            const callback = render_callbacks[i];
	            if (!seen_callbacks.has(callback)) {
	                // ...so guard against infinite loops
	                seen_callbacks.add(callback);
	                callback();
	            }
	        }
	        render_callbacks.length = 0;
	    } while (dirty_components.length);
	    while (flush_callbacks.length) {
	        flush_callbacks.pop()();
	    }
	    update_scheduled = false;
	    seen_callbacks.clear();
	    set_current_component(saved_component);
	}
	function update($$) {
	    if ($$.fragment !== null) {
	        $$.update();
	        run_all($$.before_update);
	        const dirty = $$.dirty;
	        $$.dirty = [-1];
	        $$.fragment && $$.fragment.p($$.ctx, dirty);
	        $$.after_update.forEach(add_render_callback);
	    }
	}
	/**
	 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
	 */
	function flush_render_callbacks(fns) {
	    const filtered = [];
	    const targets = [];
	    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
	    targets.forEach((c) => c());
	    render_callbacks = filtered;
	}
	const outroing = new Set();
	let outros;
	function group_outros() {
	    outros = {
	        r: 0,
	        c: [],
	        p: outros // parent group
	    };
	}
	function check_outros() {
	    if (!outros.r) {
	        run_all(outros.c);
	    }
	    outros = outros.p;
	}
	function transition_in(block, local) {
	    if (block && block.i) {
	        outroing.delete(block);
	        block.i(local);
	    }
	}
	function transition_out(block, local, detach, callback) {
	    if (block && block.o) {
	        if (outroing.has(block))
	            return;
	        outroing.add(block);
	        outros.c.push(() => {
	            outroing.delete(block);
	            if (callback) {
	                if (detach)
	                    block.d(1);
	                callback();
	            }
	        });
	        block.o(local);
	    }
	    else if (callback) {
	        callback();
	    }
	}
	function outro_and_destroy_block(block, lookup) {
	    transition_out(block, 1, 1, () => {
	        lookup.delete(block.key);
	    });
	}
	function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
	    let o = old_blocks.length;
	    let n = list.length;
	    let i = o;
	    const old_indexes = {};
	    while (i--)
	        old_indexes[old_blocks[i].key] = i;
	    const new_blocks = [];
	    const new_lookup = new Map();
	    const deltas = new Map();
	    const updates = [];
	    i = n;
	    while (i--) {
	        const child_ctx = get_context(ctx, list, i);
	        const key = get_key(child_ctx);
	        let block = lookup.get(key);
	        if (!block) {
	            block = create_each_block(key, child_ctx);
	            block.c();
	        }
	        else if (dynamic) {
	            // defer updates until all the DOM shuffling is done
	            updates.push(() => block.p(child_ctx, dirty));
	        }
	        new_lookup.set(key, new_blocks[i] = block);
	        if (key in old_indexes)
	            deltas.set(key, Math.abs(i - old_indexes[key]));
	    }
	    const will_move = new Set();
	    const did_move = new Set();
	    function insert(block) {
	        transition_in(block, 1);
	        block.m(node, next);
	        lookup.set(block.key, block);
	        next = block.first;
	        n--;
	    }
	    while (o && n) {
	        const new_block = new_blocks[n - 1];
	        const old_block = old_blocks[o - 1];
	        const new_key = new_block.key;
	        const old_key = old_block.key;
	        if (new_block === old_block) {
	            // do nothing
	            next = new_block.first;
	            o--;
	            n--;
	        }
	        else if (!new_lookup.has(old_key)) {
	            // remove old block
	            destroy(old_block, lookup);
	            o--;
	        }
	        else if (!lookup.has(new_key) || will_move.has(new_key)) {
	            insert(new_block);
	        }
	        else if (did_move.has(old_key)) {
	            o--;
	        }
	        else if (deltas.get(new_key) > deltas.get(old_key)) {
	            did_move.add(new_key);
	            insert(new_block);
	        }
	        else {
	            will_move.add(old_key);
	            o--;
	        }
	    }
	    while (o--) {
	        const old_block = old_blocks[o];
	        if (!new_lookup.has(old_block.key))
	            destroy(old_block, lookup);
	    }
	    while (n)
	        insert(new_blocks[n - 1]);
	    run_all(updates);
	    return new_blocks;
	}

	function bind$2(component, name, callback) {
	    const index = component.$$.props[name];
	    if (index !== undefined) {
	        component.$$.bound[index] = callback;
	        callback(component.$$.ctx[index]);
	    }
	}
	function create_component(block) {
	    block && block.c();
	}
	function mount_component(component, target, anchor, customElement) {
	    const { fragment, after_update } = component.$$;
	    fragment && fragment.m(target, anchor);
	    if (!customElement) {
	        // onMount happens before the initial afterUpdate
	        add_render_callback(() => {
	            const new_on_destroy = component.$$.on_mount.map(run$1).filter(is_function);
	            // if the component was destroyed immediately
	            // it will update the `$$.on_destroy` reference to `null`.
	            // the destructured on_destroy may still reference to the old array
	            if (component.$$.on_destroy) {
	                component.$$.on_destroy.push(...new_on_destroy);
	            }
	            else {
	                // Edge case - component was destroyed immediately,
	                // most likely as a result of a binding initialising
	                run_all(new_on_destroy);
	            }
	            component.$$.on_mount = [];
	        });
	    }
	    after_update.forEach(add_render_callback);
	}
	function destroy_component(component, detaching) {
	    const $$ = component.$$;
	    if ($$.fragment !== null) {
	        flush_render_callbacks($$.after_update);
	        run_all($$.on_destroy);
	        $$.fragment && $$.fragment.d(detaching);
	        // TODO null out other refs, including component.$$ (but need to
	        // preserve final state?)
	        $$.on_destroy = $$.fragment = null;
	        $$.ctx = [];
	    }
	}
	function make_dirty(component, i) {
	    if (component.$$.dirty[0] === -1) {
	        dirty_components.push(component);
	        schedule_update();
	        component.$$.dirty.fill(0);
	    }
	    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
	}
	function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
	    const parent_component = current_component;
	    set_current_component(component);
	    const $$ = component.$$ = {
	        fragment: null,
	        ctx: [],
	        // state
	        props,
	        update: noop$1,
	        not_equal,
	        bound: blank_object(),
	        // lifecycle
	        on_mount: [],
	        on_destroy: [],
	        on_disconnect: [],
	        before_update: [],
	        after_update: [],
	        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
	        // everything else
	        callbacks: blank_object(),
	        dirty,
	        skip_bound: false,
	        root: options.target || parent_component.$$.root
	    };
	    append_styles && append_styles($$.root);
	    let ready = false;
	    $$.ctx = instance
	        ? instance(component, options.props || {}, (i, ret, ...rest) => {
	            const value = rest.length ? rest[0] : ret;
	            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
	                if (!$$.skip_bound && $$.bound[i])
	                    $$.bound[i](value);
	                if (ready)
	                    make_dirty(component, i);
	            }
	            return ret;
	        })
	        : [];
	    $$.update();
	    ready = true;
	    run_all($$.before_update);
	    // `false` as a special case of no DOM component
	    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	    if (options.target) {
	        if (options.hydrate) {
	            const nodes = children(options.target);
	            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            $$.fragment && $$.fragment.l(nodes);
	            nodes.forEach(detach);
	        }
	        else {
	            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            $$.fragment && $$.fragment.c();
	        }
	        if (options.intro)
	            transition_in(component.$$.fragment);
	        mount_component(component, options.target, options.anchor, options.customElement);
	        flush$1();
	    }
	    set_current_component(parent_component);
	}
	/**
	 * Base class for Svelte components. Used when dev=false.
	 */
	class SvelteComponent {
	    $destroy() {
	        destroy_component(this, 1);
	        this.$destroy = noop$1;
	    }
	    $on(type, callback) {
	        if (!is_function(callback)) {
	            return noop$1;
	        }
	        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
	        callbacks.push(callback);
	        return () => {
	            const index = callbacks.indexOf(callback);
	            if (index !== -1)
	                callbacks.splice(index, 1);
	        };
	    }
	    $set($$props) {
	        if (this.$$set && !is_empty($$props)) {
	            this.$$.skip_bound = true;
	            this.$$set($$props);
	            this.$$.skip_bound = false;
	        }
	    }
	}

	/* src/standalone/confirm.svelte generated by Svelte v3.59.2 */

	function create_fragment(ctx) {
		let div2;
		let div0;
		let t0;
		let div1;
		let header;
		let p0;
		let t1;
		let t2;
		let button0;
		let t3;
		let section;
		let p1;
		let t4;
		let t5;
		let label_1;
		let input;
		let t6;
		let t7;
		let t8;
		let footer;
		let button1;
		let t9_value = /*label*/ ctx[3].approve + "";
		let t9;
		let t10;
		let button2;
		let t11_value = /*label*/ ctx[3].disapprove + "";
		let t11;
		let mounted;
		let dispose;

		return {
			c() {
				div2 = element("div");
				div0 = element("div");
				t0 = space();
				div1 = element("div");
				header = element("header");
				p0 = element("p");
				t1 = text(/*title*/ ctx[0]);
				t2 = space();
				button0 = element("button");
				t3 = space();
				section = element("section");
				p1 = element("p");
				t4 = text(/*text*/ ctx[1]);
				t5 = space();
				label_1 = element("label");
				input = element("input");
				t6 = space();
				t7 = text(/*approval*/ ctx[2]);
				t8 = space();
				footer = element("footer");
				button1 = element("button");
				t9 = text(t9_value);
				t10 = space();
				button2 = element("button");
				t11 = text(t11_value);
				attr(div0, "class", "modal-background");
				attr(p0, "class", "modal-card-title");
				attr(button0, "class", "delete");
				attr(button0, "aria-label", "close");
				attr(header, "class", "modal-card-head");
				attr(input, "type", "checkbox");
				attr(input, "class", "confirm-approval");
				attr(label_1, "class", "checkbox");
				attr(section, "class", "modal-card-body");
				attr(button1, "class", "button is-success confirm-approve");
				button1.disabled = /*disabled*/ ctx[5];
				attr(button2, "class", "button confirm-disapprove");
				attr(footer, "class", "modal-card-foot");
				attr(div1, "class", "modal-card");
				attr(div2, "class", "modal is-active");
			},
			m(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div0);
				append(div2, t0);
				append(div2, div1);
				append(div1, header);
				append(header, p0);
				append(p0, t1);
				append(header, t2);
				append(header, button0);
				append(div1, t3);
				append(div1, section);
				append(section, p1);
				append(p1, t4);
				append(section, t5);
				append(section, label_1);
				append(label_1, input);
				input.checked = /*approved*/ ctx[4];
				append(label_1, t6);
				append(label_1, t7);
				append(div1, t8);
				append(div1, footer);
				append(footer, button1);
				append(button1, t9);
				append(footer, t10);
				append(footer, button2);
				append(button2, t11);

				if (!mounted) {
					dispose = [
						listen(button0, "click", /*disapprove*/ ctx[6]),
						listen(input, "change", /*input_change_handler*/ ctx[10]),
						listen(button1, "click", /*approve*/ ctx[7]),
						listen(button2, "click", /*disapprove*/ ctx[6])
					];

					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (dirty & /*title*/ 1) set_data(t1, /*title*/ ctx[0]);
				if (dirty & /*text*/ 2) set_data(t4, /*text*/ ctx[1]);

				if (dirty & /*approved*/ 16) {
					input.checked = /*approved*/ ctx[4];
				}

				if (dirty & /*approval*/ 4) set_data(t7, /*approval*/ ctx[2]);
				if (dirty & /*label*/ 8 && t9_value !== (t9_value = /*label*/ ctx[3].approve + "")) set_data(t9, t9_value);

				if (dirty & /*disabled*/ 32) {
					button1.disabled = /*disabled*/ ctx[5];
				}

				if (dirty & /*label*/ 8 && t11_value !== (t11_value = /*label*/ ctx[3].disapprove + "")) set_data(t11, t11_value);
			},
			i: noop$1,
			o: noop$1,
			d(detaching) {
				if (detaching) detach(div2);
				mounted = false;
				run_all(dispose);
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let disabled;
		let approved = false;
		let { title = 'title' } = $$props;
		let { text = 'text' } = $$props;
		let { approval = 'approval' } = $$props;

		let { resolve = () => {
			
		} } = $$props;

		let { reject = () => {
			
		} } = $$props;

		let { label = { approve: 'Да', disapprove: 'Нет' } } = $$props;

		function disapprove() {
			reject();
		}

		function approve() {
			resolve();
		}

		function input_change_handler() {
			approved = this.checked;
			$$invalidate(4, approved);
		}

		$$self.$$set = $$props => {
			if ('title' in $$props) $$invalidate(0, title = $$props.title);
			if ('text' in $$props) $$invalidate(1, text = $$props.text);
			if ('approval' in $$props) $$invalidate(2, approval = $$props.approval);
			if ('resolve' in $$props) $$invalidate(8, resolve = $$props.resolve);
			if ('reject' in $$props) $$invalidate(9, reject = $$props.reject);
			if ('label' in $$props) $$invalidate(3, label = $$props.label);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*approved*/ 16) {
				 $$invalidate(5, disabled = !approved);
			}
		};

		return [
			title,
			text,
			approval,
			label,
			approved,
			disabled,
			disapprove,
			approve,
			resolve,
			reject,
			input_change_handler
		];
	}

	class Confirm extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance, create_fragment, safe_not_equal, {
				title: 0,
				text: 1,
				approval: 2,
				resolve: 8,
				reject: 9,
				label: 3
			});
		}
	}

	var Confirmation = /*#__PURE__*/function () {
	  function Confirmation() {
	    _classCallCheck(this, Confirmation);
	  }
	  _createClass(Confirmation, null, [{
	    key: "ask",
	    value: function ask(_ref) {
	      var title = _ref.title,
	        text = _ref.text,
	        approval = _ref.approval;
	      return new Promise(function (res, rej) {
	        var comp = new Confirm({
	          target: document.body,
	          props: {
	            title: title,
	            text: text,
	            approval: approval,
	            reject: function reject() {
	              comp.$destroy();
	              rej();
	            },
	            resolve: function resolve() {
	              comp.$destroy();
	              res();
	            }
	          }
	        });
	      });
	    }
	  }]);
	  return Confirmation;
	}();

	const subscriber_queue = [];
	/**
	 * Create a `Writable` store that allows both updating and reading by subscription.
	 * @param {*=}value initial value
	 * @param {StartStopNotifier=} start
	 */
	function writable(value, start = noop$1) {
	    let stop;
	    const subscribers = new Set();
	    function set(new_value) {
	        if (safe_not_equal(value, new_value)) {
	            value = new_value;
	            if (stop) { // store is ready
	                const run_queue = !subscriber_queue.length;
	                for (const subscriber of subscribers) {
	                    subscriber[1]();
	                    subscriber_queue.push(subscriber, value);
	                }
	                if (run_queue) {
	                    for (let i = 0; i < subscriber_queue.length; i += 2) {
	                        subscriber_queue[i][0](subscriber_queue[i + 1]);
	                    }
	                    subscriber_queue.length = 0;
	                }
	            }
	        }
	    }
	    function update(fn) {
	        set(fn(value));
	    }
	    function subscribe(run, invalidate = noop$1) {
	        const subscriber = [run, invalidate];
	        subscribers.add(subscriber);
	        if (subscribers.size === 1) {
	            stop = start(set) || noop$1;
	        }
	        run(value);
	        return () => {
	            subscribers.delete(subscriber);
	            if (subscribers.size === 0 && stop) {
	                stop();
	                stop = null;
	            }
	        };
	    }
	    return { set, update, subscribe };
	}

	var ALL = {};
	function exist(key) {
	  return Object.hasOwn(ALL, key);
	}
	function get$1(key) {
	  var createIfNotExists = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	  if (exist(key)) {
	    return ALL[key];
	  } else {
	    if (createIfNotExists) {
	      return create(key);
	    } else {
	      return false;
	    }
	  }
	}
	function create(key) {
	  if (!exist(key)) {
	    ALL[key] = {
	      files: writable([]),
	      selected: writable([]),
	      uploads: writable([])
	    };
	  }
	  return ALL[key];
	}

	var file_stores = /*#__PURE__*/Object.freeze({
		__proto__: null,
		create: create,
		get: get$1
	});

	/* src/standalone/file.svelte generated by Svelte v3.59.2 */

	function create_if_block_2(ctx) {
		let progress_1;
		let t0;
		let t1;

		return {
			c() {
				progress_1 = element("progress");
				t0 = text(/*progress*/ ctx[0]);
				t1 = text("%");
				attr(progress_1, "class", "progress is-link");
				progress_1.value = /*progress*/ ctx[0];
				attr(progress_1, "max", "100");
			},
			m(target, anchor) {
				insert(target, progress_1, anchor);
				append(progress_1, t0);
				append(progress_1, t1);
			},
			p(ctx, dirty) {
				if (dirty & /*progress*/ 1) set_data(t0, /*progress*/ ctx[0]);

				if (dirty & /*progress*/ 1) {
					progress_1.value = /*progress*/ ctx[0];
				}
			},
			d(detaching) {
				if (detaching) detach(progress_1);
			}
		};
	}

	// (81:4) {#if data.path}
	function create_if_block(ctx) {
		let figure;
		let t0;
		let img;
		let img_src_value;
		let img_alt_value;
		let t1;
		let div1;
		let div0;
		let t2_value = /*data*/ ctx[3].name + "";
		let t2;
		let if_block = !/*hideDeleteButton*/ ctx[2] && create_if_block_1(ctx);

		return {
			c() {
				figure = element("figure");
				if (if_block) if_block.c();
				t0 = space();
				img = element("img");
				t1 = space();
				div1 = element("div");
				div0 = element("div");
				t2 = text(t2_value);
				attr(img, "draggable", "true");
				if (!src_url_equal(img.src, img_src_value = /*getImageThumb*/ ctx[7](/*data*/ ctx[3]))) attr(img, "src", img_src_value);
				attr(img, "alt", img_alt_value = /*data*/ ctx[3].name);
				attr(img, "crossorigin", "anonymous");
				attr(img, "class", "svelte-zezlqo");
				attr(div0, "class", "text svelte-zezlqo");
				attr(div1, "draggable", "true");
				attr(div1, "class", "middle svelte-zezlqo");
				attr(figure, "class", "image is-4by3 svelte-zezlqo");
			},
			m(target, anchor) {
				insert(target, figure, anchor);
				if (if_block) if_block.m(figure, null);
				append(figure, t0);
				append(figure, img);
				append(figure, t1);
				append(figure, div1);
				append(div1, div0);
				append(div0, t2);
			},
			p(ctx, dirty) {
				if (!/*hideDeleteButton*/ ctx[2]) {
					if (if_block) {
						if_block.p(ctx, dirty);
					} else {
						if_block = create_if_block_1(ctx);
						if_block.c();
						if_block.m(figure, t0);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (dirty & /*data*/ 8 && !src_url_equal(img.src, img_src_value = /*getImageThumb*/ ctx[7](/*data*/ ctx[3]))) {
					attr(img, "src", img_src_value);
				}

				if (dirty & /*data*/ 8 && img_alt_value !== (img_alt_value = /*data*/ ctx[3].name)) {
					attr(img, "alt", img_alt_value);
				}

				if (dirty & /*data*/ 8 && t2_value !== (t2_value = /*data*/ ctx[3].name + "")) set_data(t2, t2_value);
			},
			d(detaching) {
				if (detaching) detach(figure);
				if (if_block) if_block.d();
			}
		};
	}

	// (83:12) {#if !hideDeleteButton}
	function create_if_block_1(ctx) {
		let button;
		let mounted;
		let dispose;

		return {
			c() {
				button = element("button");
				attr(button, "class", "delete svelte-zezlqo");
			},
			m(target, anchor) {
				insert(target, button, anchor);

				if (!mounted) {
					dispose = listen(button, "click", /*remove*/ ctx[6]);
					mounted = true;
				}
			},
			p: noop$1,
			d(detaching) {
				if (detaching) detach(button);
				mounted = false;
				dispose();
			}
		};
	}

	function create_fragment$1(ctx) {
		let div;
		let t;
		let div_class_value;
		let div_data_uuid_value;
		let mounted;
		let dispose;
		let if_block0 = /*notUploaded*/ ctx[1] && create_if_block_2(ctx);
		let if_block1 = /*data*/ ctx[3].path && create_if_block(ctx);

		return {
			c() {
				div = element("div");
				if (if_block0) if_block0.c();
				t = space();
				if (if_block1) if_block1.c();
				attr(div, "class", div_class_value = "column file-tile is-one-quarter-desktop is-half-mobile " + /*ifSelected*/ ctx[4] + " svelte-zezlqo");
				attr(div, "data-uuid", div_data_uuid_value = /*data*/ ctx[3].uuid);
			},
			m(target, anchor) {
				insert(target, div, anchor);
				if (if_block0) if_block0.m(div, null);
				append(div, t);
				if (if_block1) if_block1.m(div, null);

				if (!mounted) {
					dispose = listen(div, "click", /*onClick*/ ctx[5]);
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (/*notUploaded*/ ctx[1]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);
					} else {
						if_block0 = create_if_block_2(ctx);
						if_block0.c();
						if_block0.m(div, t);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (/*data*/ ctx[3].path) {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block(ctx);
						if_block1.c();
						if_block1.m(div, null);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}

				if (dirty & /*ifSelected*/ 16 && div_class_value !== (div_class_value = "column file-tile is-one-quarter-desktop is-half-mobile " + /*ifSelected*/ ctx[4] + " svelte-zezlqo")) {
					attr(div, "class", div_class_value);
				}

				if (dirty & /*data*/ 8 && div_data_uuid_value !== (div_data_uuid_value = /*data*/ ctx[3].uuid)) {
					attr(div, "data-uuid", div_data_uuid_value);
				}
			},
			i: noop$1,
			o: noop$1,
			d(detaching) {
				if (detaching) detach(div);
				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				mounted = false;
				dispose();
			}
		};
	}

	function instance$1($$self, $$props, $$invalidate) {
		let ifSelected;
		const dispatch = createEventDispatcher();
		let { progress = 0 } = $$props;
		let { selected = false } = $$props;
		let { notUploaded = false } = $$props;
		let { selectMany = false } = $$props;
		let { hideDeleteButton = false } = $$props;
		let { bucketId } = $$props;

		let { data = {
			name: "default.file.name",
			size: 1000,
			preview: false
		} } = $$props;

		onMount(() => {
			get$1(bucketId).selected.subscribe(value => {
				if (value.indexOf(data.uuid) > -1) {
					$$invalidate(8, selected = true);
				} else {
					$$invalidate(8, selected = false);
				}
			});
		});

		function onClick() {
			get$1(bucketId).selected.update(value => {
				if (value.indexOf(data.uuid) > -1) {
					value.splice(value.indexOf(data.uuid), 1);
				} else {
					if (selectMany) {
						value.push(data.uuid);
					} else {
						value.splice(0, value.length, data.uuid);
					}

					dispatch("selected");
				}

				return value;
			});
		}

		function remove() {
			Confirmation.ask({
				title: `Удаление файла (${data.name}) `,
				text: "Файл будет удалён без возможнеости восстановления!",
				approval: "Удалить файл?"
			}).then(() => {
				dispatch("remove", data);
			}).catch(() => {
				
			});
		}

		function getImageThumb(img) {
			return data.info?.thumbs?.small?.cloud?.Location || data.info?.cloud?.Location;
		}

		$$self.$$set = $$props => {
			if ('progress' in $$props) $$invalidate(0, progress = $$props.progress);
			if ('selected' in $$props) $$invalidate(8, selected = $$props.selected);
			if ('notUploaded' in $$props) $$invalidate(1, notUploaded = $$props.notUploaded);
			if ('selectMany' in $$props) $$invalidate(9, selectMany = $$props.selectMany);
			if ('hideDeleteButton' in $$props) $$invalidate(2, hideDeleteButton = $$props.hideDeleteButton);
			if ('bucketId' in $$props) $$invalidate(10, bucketId = $$props.bucketId);
			if ('data' in $$props) $$invalidate(3, data = $$props.data);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*selected*/ 256) {
				 $$invalidate(4, ifSelected = selected ? "selected" : "");
			}
		};

		return [
			progress,
			notUploaded,
			hideDeleteButton,
			data,
			ifSelected,
			onClick,
			remove,
			getImageThumb,
			selected,
			selectMany,
			bucketId
		];
	}

	class File extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$1, create_fragment$1, safe_not_equal, {
				progress: 0,
				selected: 8,
				notUploaded: 1,
				selectMany: 9,
				hideDeleteButton: 2,
				bucketId: 10,
				data: 3
			});
		}
	}

	/* src/standalone/storage.svelte generated by Svelte v3.59.2 */

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[24] = list[i];
		child_ctx[25] = list;
		child_ctx[26] = i;
		return child_ctx;
	}

	function get_each_context_1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[24] = list[i];
		child_ctx[27] = list;
		child_ctx[28] = i;
		return child_ctx;
	}

	// (126:0) {#if !popup && show}
	function create_if_block_1$1(ctx) {
		let div1;
		let div0;
		let current;
		let each_value_1 = /*files*/ ctx[0];
		let each_blocks = [];

		for (let i = 0; i < each_value_1.length; i += 1) {
			each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		return {
			c() {
				div1 = element("div");
				div0 = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr(div0, "class", "file-list columns is-mobile is-multiline svelte-oq452y");
				attr(div1, "class", "file-list-wrapper svelte-oq452y");
			},
			m(target, anchor) {
				insert(target, div1, anchor);
				append(div1, div0);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div0, null);
					}
				}

				/*div1_binding*/ ctx[19](div1);
				current = true;
			},
			p(ctx, dirty) {
				if (dirty & /*elementSize, id, selectMany, files, removeFile*/ 4141) {
					each_value_1 = /*files*/ ctx[0];
					let i;

					for (i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1(ctx, each_value_1, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block_1(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(div0, null);
						}
					}

					group_outros();

					for (i = each_value_1.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}
			},
			i(local) {
				if (current) return;

				for (let i = 0; i < each_value_1.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d(detaching) {
				if (detaching) detach(div1);
				destroy_each(each_blocks, detaching);
				/*div1_binding*/ ctx[19](null);
			}
		};
	}

	// (129:1) {#each files as file, index}
	function create_each_block_1(ctx) {
		let notfileitem;
		let updating_data;
		let current;

		function notfileitem_data_binding(value) {
			/*notfileitem_data_binding*/ ctx[17](value, /*file*/ ctx[24], /*each_value_1*/ ctx[27], /*index*/ ctx[28]);
		}

		let notfileitem_props = {
			elementSize: /*elementSize*/ ctx[5],
			bucketId: /*id*/ ctx[2],
			selectMany: /*selectMany*/ ctx[3]
		};

		if (/*file*/ ctx[24] !== void 0) {
			notfileitem_props.data = /*file*/ ctx[24];
		}

		notfileitem = new File({ props: notfileitem_props });
		binding_callbacks.push(() => bind$2(notfileitem, 'data', notfileitem_data_binding));
		notfileitem.$on("remove", /*removeFile*/ ctx[12]);
		notfileitem.$on("selected", /*selected_handler*/ ctx[18]);

		return {
			c() {
				create_component(notfileitem.$$.fragment);
			},
			m(target, anchor) {
				mount_component(notfileitem, target, anchor);
				current = true;
			},
			p(new_ctx, dirty) {
				ctx = new_ctx;
				const notfileitem_changes = {};
				if (dirty & /*elementSize*/ 32) notfileitem_changes.elementSize = /*elementSize*/ ctx[5];
				if (dirty & /*id*/ 4) notfileitem_changes.bucketId = /*id*/ ctx[2];
				if (dirty & /*selectMany*/ 8) notfileitem_changes.selectMany = /*selectMany*/ ctx[3];

				if (!updating_data && dirty & /*files*/ 1) {
					updating_data = true;
					notfileitem_changes.data = /*file*/ ctx[24];
					add_flush_callback(() => updating_data = false);
				}

				notfileitem.$set(notfileitem_changes);
			},
			i(local) {
				if (current) return;
				transition_in(notfileitem.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(notfileitem.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(notfileitem, detaching);
			}
		};
	}

	// (136:0) {#if popup && show}
	function create_if_block$1(ctx) {
		let div3;
		let div0;
		let t0;
		let div2;
		let header;
		let p;
		let t2;
		let button0;
		let t3;
		let section;
		let div1;
		let each_blocks = [];
		let each_1_lookup = new Map();
		let t4;
		let footer;
		let button1;
		let t6;
		let button2;
		let t8;
		let button3;
		let current;
		let mounted;
		let dispose;
		let each_value = /*files*/ ctx[0];
		const get_key = ctx => /*file*/ ctx[24].id;

		for (let i = 0; i < each_value.length; i += 1) {
			let child_ctx = get_each_context(ctx, each_value, i);
			let key = get_key(child_ctx);
			each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
		}

		return {
			c() {
				div3 = element("div");
				div0 = element("div");
				t0 = space();
				div2 = element("div");
				header = element("header");
				p = element("p");
				p.textContent = "Выберите файл";
				t2 = space();
				button0 = element("button");
				t3 = space();
				section = element("section");
				div1 = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				t4 = space();
				footer = element("footer");
				button1 = element("button");
				button1.textContent = "Выбрать";
				t6 = space();
				button2 = element("button");
				button2.textContent = "Удалить";
				t8 = space();
				button3 = element("button");
				button3.textContent = "Закрыть";
				attr(div0, "class", "modal-background");
				attr(p, "class", "modal-card-title");
				attr(button0, "class", "delete");
				attr(button0, "aria-label", "close");
				attr(header, "class", "modal-card-head");
				attr(div1, "class", "file-list columns is-multiline svelte-oq452y");
				attr(section, "class", "modal-card-body");
				attr(button1, "class", "button is-success");
				attr(button2, "class", "button is-danger");
				attr(button3, "class", "button");
				attr(footer, "class", "modal-card-foot");
				attr(div2, "class", "modal-card");
				attr(div3, "class", "modal is-active");
			},
			m(target, anchor) {
				insert(target, div3, anchor);
				append(div3, div0);
				append(div3, t0);
				append(div3, div2);
				append(div2, header);
				append(header, p);
				append(header, t2);
				append(header, button0);
				append(div2, t3);
				append(div2, section);
				append(section, div1);

				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(div1, null);
					}
				}

				append(div2, t4);
				append(div2, footer);
				append(footer, button1);
				append(footer, t6);
				append(footer, button2);
				append(footer, t8);
				append(footer, button3);
				/*div3_binding*/ ctx[22](div3);
				current = true;

				if (!mounted) {
					dispose = [
						listen(button0, "click", /*closePopup*/ ctx[8]),
						listen(button1, "click", /*resolvePopup*/ ctx[10]),
						listen(button2, "click", /*removeSelected*/ ctx[11]),
						listen(button3, "click", /*rejectPopup*/ ctx[9])
					];

					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (dirty & /*id, selectMany, files, removeFile*/ 4109) {
					each_value = /*files*/ ctx[0];
					group_outros();
					each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div1, outro_and_destroy_block, create_each_block, null, get_each_context);
					check_outros();
				}
			},
			i(local) {
				if (current) return;

				for (let i = 0; i < each_value.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o(local) {
				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d(detaching) {
				if (detaching) detach(div3);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].d();
				}

				/*div3_binding*/ ctx[22](null);
				mounted = false;
				run_all(dispose);
			}
		};
	}

	// (146:4) {#each files as file(file.id)}
	function create_each_block(key_1, ctx) {
		let first;
		let notfileitem;
		let updating_data;
		let current;

		function notfileitem_data_binding_1(value) {
			/*notfileitem_data_binding_1*/ ctx[20](value, /*file*/ ctx[24], /*each_value*/ ctx[25], /*file_index*/ ctx[26]);
		}

		let notfileitem_props = {
			bucketId: /*id*/ ctx[2],
			selectMany: /*selectMany*/ ctx[3]
		};

		if (/*file*/ ctx[24] !== void 0) {
			notfileitem_props.data = /*file*/ ctx[24];
		}

		notfileitem = new File({ props: notfileitem_props });
		binding_callbacks.push(() => bind$2(notfileitem, 'data', notfileitem_data_binding_1));
		notfileitem.$on("remove", /*removeFile*/ ctx[12]);
		notfileitem.$on("selected", /*selected_handler_1*/ ctx[21]);

		return {
			key: key_1,
			first: null,
			c() {
				first = empty$1();
				create_component(notfileitem.$$.fragment);
				this.first = first;
			},
			m(target, anchor) {
				insert(target, first, anchor);
				mount_component(notfileitem, target, anchor);
				current = true;
			},
			p(new_ctx, dirty) {
				ctx = new_ctx;
				const notfileitem_changes = {};
				if (dirty & /*id*/ 4) notfileitem_changes.bucketId = /*id*/ ctx[2];
				if (dirty & /*selectMany*/ 8) notfileitem_changes.selectMany = /*selectMany*/ ctx[3];

				if (!updating_data && dirty & /*files*/ 1) {
					updating_data = true;
					notfileitem_changes.data = /*file*/ ctx[24];
					add_flush_callback(() => updating_data = false);
				}

				notfileitem.$set(notfileitem_changes);
			},
			i(local) {
				if (current) return;
				transition_in(notfileitem.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(notfileitem.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) detach(first);
				destroy_component(notfileitem, detaching);
			}
		};
	}

	function create_fragment$2(ctx) {
		let t;
		let if_block1_anchor;
		let current;
		let if_block0 = !/*popup*/ ctx[4] && /*show*/ ctx[1] && create_if_block_1$1(ctx);
		let if_block1 = /*popup*/ ctx[4] && /*show*/ ctx[1] && create_if_block$1(ctx);

		return {
			c() {
				if (if_block0) if_block0.c();
				t = space();
				if (if_block1) if_block1.c();
				if_block1_anchor = empty$1();
			},
			m(target, anchor) {
				if (if_block0) if_block0.m(target, anchor);
				insert(target, t, anchor);
				if (if_block1) if_block1.m(target, anchor);
				insert(target, if_block1_anchor, anchor);
				current = true;
			},
			p(ctx, [dirty]) {
				if (!/*popup*/ ctx[4] && /*show*/ ctx[1]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);

						if (dirty & /*popup, show*/ 18) {
							transition_in(if_block0, 1);
						}
					} else {
						if_block0 = create_if_block_1$1(ctx);
						if_block0.c();
						transition_in(if_block0, 1);
						if_block0.m(t.parentNode, t);
					}
				} else if (if_block0) {
					group_outros();

					transition_out(if_block0, 1, 1, () => {
						if_block0 = null;
					});

					check_outros();
				}

				if (/*popup*/ ctx[4] && /*show*/ ctx[1]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);

						if (dirty & /*popup, show*/ 18) {
							transition_in(if_block1, 1);
						}
					} else {
						if_block1 = create_if_block$1(ctx);
						if_block1.c();
						transition_in(if_block1, 1);
						if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
					}
				} else if (if_block1) {
					group_outros();

					transition_out(if_block1, 1, 1, () => {
						if_block1 = null;
					});

					check_outros();
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block0);
				transition_in(if_block1);
				current = true;
			},
			o(local) {
				transition_out(if_block0);
				transition_out(if_block1);
				current = false;
			},
			d(detaching) {
				if (if_block0) if_block0.d(detaching);
				if (detaching) detach(t);
				if (if_block1) if_block1.d(detaching);
				if (detaching) detach(if_block1_anchor);
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		let inlineList = null;
		let modalList = null;
		const dispatch = createEventDispatcher();
		let { files = [] } = $$props;
		let { selected = [] } = $$props;
		let { id } = $$props;
		let { selectMany } = $$props;
		let { popup = false } = $$props;
		let { show = false } = $$props;
		let { elementSize = 3 } = $$props;
		let { onReject } = $$props;
		let { onResolve } = $$props;

		/*
		function getListContainer() {
			if (modalList) {
				return modalList.querySelectorAll('.file-list');
			} else if (inlineList) {
				return inlineList.querySelectorAll('.file-list');
			} else {
				return false;
			}
		}
	*/
		onMount(() => {
			get$1(id).files.subscribe(value => {
				files.forEach((file, id) => {
					file.id = id;
				});

				$$invalidate(0, files = value);
			});

			get$1(id).selected.subscribe(value => {
				$$invalidate(13, selected = value);
			});
		});

		function updateFiles(newFiles) {
			get$1(id).update(oldFiles => {
				oldFiles.splice(0, oldFiles.length, ...newFiles);
				return oldFiles;
			});
		}

		function closePopup() {
			$$invalidate(1, show = false);
		}

		function rejectPopup() {
			closePopup();

			if (onReject) {
				onReject();
				$$invalidate(14, onReject = null);
			} else {
				dispatch('reject');
			}
		}

		function resolvePopup() {
			closePopup();

			if (selected.length) {
				let images = files.filter(file => {
					return selected.indexOf(file.uuid) > -1;
				});

				if (onResolve) {
					onResolve(images);
					$$invalidate(15, onResolve = null);
				} else {
					dispatch('resolve', { selected: images });
				}
			} else {
				if (onResolve) {
					onResolve([]);
					$$invalidate(15, onResolve = null);
				} else {
					dispatch('resolve', { selected: [] });
				}
			}
		}

		function removeSelected() {
			Confirmation.ask({
				title: `Удаление файлов (${selected.length}) `,
				text: 'Файлы будут удалены без возможнеости восстановления!',
				approval: 'Удалить файлы?'
			}).then(() => {
				console.log('remove approved');
				dispatch('remove', { selected });
			}).catch(() => {
				console.log('remove disapprove');
			});
		}

		function removeFile(ev) {
			console.log('removeFile', ev);
			dispatch('remove', { selected: [ev.detail.uuid] });
		}

		function notfileitem_data_binding(value, file, each_value_1, index) {
			each_value_1[index] = value;
			$$invalidate(0, files);
		}

		function selected_handler(event) {
			bubble.call(this, $$self, event);
		}

		function div1_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				inlineList = $$value;
				$$invalidate(6, inlineList);
			});
		}

		function notfileitem_data_binding_1(value, file, each_value, file_index) {
			each_value[file_index] = value;
			$$invalidate(0, files);
		}

		function selected_handler_1(event) {
			bubble.call(this, $$self, event);
		}

		function div3_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				modalList = $$value;
				$$invalidate(7, modalList);
			});
		}

		$$self.$$set = $$props => {
			if ('files' in $$props) $$invalidate(0, files = $$props.files);
			if ('selected' in $$props) $$invalidate(13, selected = $$props.selected);
			if ('id' in $$props) $$invalidate(2, id = $$props.id);
			if ('selectMany' in $$props) $$invalidate(3, selectMany = $$props.selectMany);
			if ('popup' in $$props) $$invalidate(4, popup = $$props.popup);
			if ('show' in $$props) $$invalidate(1, show = $$props.show);
			if ('elementSize' in $$props) $$invalidate(5, elementSize = $$props.elementSize);
			if ('onReject' in $$props) $$invalidate(14, onReject = $$props.onReject);
			if ('onResolve' in $$props) $$invalidate(15, onResolve = $$props.onResolve);
		};

		return [
			files,
			show,
			id,
			selectMany,
			popup,
			elementSize,
			inlineList,
			modalList,
			closePopup,
			rejectPopup,
			resolvePopup,
			removeSelected,
			removeFile,
			selected,
			onReject,
			onResolve,
			updateFiles,
			notfileitem_data_binding,
			selected_handler,
			div1_binding,
			notfileitem_data_binding_1,
			selected_handler_1,
			div3_binding
		];
	}

	class Storage extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$2, create_fragment$2, safe_not_equal, {
				files: 0,
				selected: 13,
				id: 2,
				selectMany: 3,
				popup: 4,
				show: 1,
				elementSize: 5,
				onReject: 14,
				onResolve: 15,
				updateFiles: 16
			});
		}

		get updateFiles() {
			return this.$$.ctx[16];
		}
	}

	/* src/standalone/file.upload.svelte generated by Svelte v3.59.2 */

	function create_if_block_1$2(ctx) {
		let progress;

		return {
			c() {
				progress = element("progress");
				attr(progress, "class", "progress is-link");
			},
			m(target, anchor) {
				insert(target, progress, anchor);
			},
			d(detaching) {
				if (detaching) detach(progress);
			}
		};
	}

	// (16:1) {#if data.preview}
	function create_if_block$2(ctx) {
		let figure;
		let img;
		let img_alt_value;
		let img_src_value;

		return {
			c() {
				figure = element("figure");
				img = element("img");
				attr(img, "alt", img_alt_value = /*data*/ ctx[1].name);
				if (!src_url_equal(img.src, img_src_value = /*data*/ ctx[1].preview)) attr(img, "src", img_src_value);
				attr(img, "class", "svelte-1d8gg06");
				attr(figure, "class", "image is-4by3 svelte-1d8gg06");
			},
			m(target, anchor) {
				insert(target, figure, anchor);
				append(figure, img);
			},
			p(ctx, dirty) {
				if (dirty & /*data*/ 2 && img_alt_value !== (img_alt_value = /*data*/ ctx[1].name)) {
					attr(img, "alt", img_alt_value);
				}

				if (dirty & /*data*/ 2 && !src_url_equal(img.src, img_src_value = /*data*/ ctx[1].preview)) {
					attr(img, "src", img_src_value);
				}
			},
			d(detaching) {
				if (detaching) detach(figure);
			}
		};
	}

	function create_fragment$3(ctx) {
		let div;
		let t;
		let div_data_id_value;
		let if_block0 = !/*uploaded*/ ctx[0] && create_if_block_1$2();
		let if_block1 = /*data*/ ctx[1].preview && create_if_block$2(ctx);

		return {
			c() {
				div = element("div");
				if (if_block0) if_block0.c();
				t = space();
				if (if_block1) if_block1.c();
				attr(div, "class", "tile file is-3 is-child svelte-1d8gg06");
				attr(div, "data-id", div_data_id_value = /*data*/ ctx[1].id);
			},
			m(target, anchor) {
				insert(target, div, anchor);
				if (if_block0) if_block0.m(div, null);
				append(div, t);
				if (if_block1) if_block1.m(div, null);
			},
			p(ctx, [dirty]) {
				if (!/*uploaded*/ ctx[0]) {
					if (if_block0) ; else {
						if_block0 = create_if_block_1$2();
						if_block0.c();
						if_block0.m(div, t);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (/*data*/ ctx[1].preview) {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block$2(ctx);
						if_block1.c();
						if_block1.m(div, null);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}

				if (dirty & /*data*/ 2 && div_data_id_value !== (div_data_id_value = /*data*/ ctx[1].id)) {
					attr(div, "data-id", div_data_id_value);
				}
			},
			i: noop$1,
			o: noop$1,
			d(detaching) {
				if (detaching) detach(div);
				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
			}
		};
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { uploaded = false } = $$props;

		let { data = {
			name: 'default.file.name',
			size: 1000,
			preview: false
		} } = $$props;

		$$self.$$set = $$props => {
			if ('uploaded' in $$props) $$invalidate(0, uploaded = $$props.uploaded);
			if ('data' in $$props) $$invalidate(1, data = $$props.data);
		};

		return [uploaded, data];
	}

	class File_upload extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$3, create_fragment$3, safe_not_equal, { uploaded: 0, data: 1 });
		}
	}

	/* src/standalone/upload.svelte generated by Svelte v3.59.2 */

	function get_each_context$1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[11] = list[i];
		return child_ctx;
	}

	// (64:0) {#if show}
	function create_if_block$3(ctx) {
		let div;
		let label;
		let form;
		let input;
		let t0;
		let t1;
		let current_block_type_index;
		let if_block;
		let if_block_anchor;
		let current;
		let mounted;
		let dispose;
		const if_block_creators = [create_if_block_1$3, create_else_block];
		const if_blocks = [];

		function select_block_type(ctx, dirty) {
			if (/*uploads*/ ctx[0].length === 0) return 0;
			return 1;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		return {
			c() {
				div = element("div");
				label = element("label");
				form = element("form");
				input = element("input");
				t0 = text("\n                Выберите изображения для загрузки");
				t1 = space();
				if_block.c();
				if_block_anchor = empty$1();
				attr(input, "class", "file-input");
				attr(input, "type", "file");
				attr(input, "name", "file");
				attr(input, "accept", "image/*");
				input.multiple = "true";
				attr(form, "action", "./");
				attr(form, "class", "svelte-112twgk");
				attr(label, "for", "file");
				attr(label, "class", "svelte-112twgk");
				attr(div, "class", "box has-background-light is-size-4-desktop is-size-5-mobile dropzone svelte-112twgk");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				append(div, label);
				append(label, form);
				append(form, input);
				append(form, t0);
				/*div_binding*/ ctx[7](div);
				insert(target, t1, anchor);
				if_blocks[current_block_type_index].m(target, anchor);
				insert(target, if_block_anchor, anchor);
				current = true;

				if (!mounted) {
					dispose = listen(input, "change", /*onChange*/ ctx[5]);
					mounted = true;
				}
			},
			p(ctx, dirty) {
				let previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);

				if (current_block_type_index === previous_block_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				} else {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					} else {
						if_block.p(ctx, dirty);
					}

					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if (detaching) detach(div);
				/*div_binding*/ ctx[7](null);
				if (detaching) detach(t1);
				if_blocks[current_block_type_index].d(detaching);
				if (detaching) detach(if_block_anchor);
				mounted = false;
				dispose();
			}
		};
	}

	// (87:4) {:else}
	function create_else_block(ctx) {
		let div;
		let div_class_value;
		let current;
		let if_block = /*uploads*/ ctx[0].length > 0 && create_if_block_2$1(ctx);

		return {
			c() {
				div = element("div");
				if (if_block) if_block.c();
				attr(div, "class", div_class_value = "previews " + (/*short*/ ctx[3] ? 'short' : 'long') + " svelte-112twgk");
			},
			m(target, anchor) {
				insert(target, div, anchor);
				if (if_block) if_block.m(div, null);
				current = true;
			},
			p(ctx, dirty) {
				if (/*uploads*/ ctx[0].length > 0) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*uploads*/ 1) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block_2$1(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(div, null);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}

				if (!current || dirty & /*short*/ 8 && div_class_value !== (div_class_value = "previews " + (/*short*/ ctx[3] ? 'short' : 'long') + " svelte-112twgk")) {
					attr(div, "class", div_class_value);
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if (detaching) detach(div);
				if (if_block) if_block.d();
			}
		};
	}

	// (83:4) {#if uploads.length === 0}
	function create_if_block_1$3(ctx) {
		let div;

		return {
			c() {
				div = element("div");
				div.innerHTML = `<h2 class="subtitle">Нет загружаемых файлов</h2>`;
				attr(div, "class", "previews has-text-centered svelte-112twgk");
			},
			m(target, anchor) {
				insert(target, div, anchor);
			},
			p: noop$1,
			i: noop$1,
			o: noop$1,
			d(detaching) {
				if (detaching) detach(div);
			}
		};
	}

	// (89:12) {#if uploads.length > 0}
	function create_if_block_2$1(ctx) {
		let each_1_anchor;
		let current;
		let each_value = /*uploads*/ ctx[0];
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		return {
			c() {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty$1();
			},
			m(target, anchor) {
				for (let i = 0; i < each_blocks.length; i += 1) {
					if (each_blocks[i]) {
						each_blocks[i].m(target, anchor);
					}
				}

				insert(target, each_1_anchor, anchor);
				current = true;
			},
			p(ctx, dirty) {
				if (dirty & /*id, uploads*/ 5) {
					each_value = /*uploads*/ ctx[0];
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context$1(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block$1(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					group_outros();

					for (i = each_value.length; i < each_blocks.length; i += 1) {
						out(i);
					}

					check_outros();
				}
			},
			i(local) {
				if (current) return;

				for (let i = 0; i < each_value.length; i += 1) {
					transition_in(each_blocks[i]);
				}

				current = true;
			},
			o(local) {
				each_blocks = each_blocks.filter(Boolean);

				for (let i = 0; i < each_blocks.length; i += 1) {
					transition_out(each_blocks[i]);
				}

				current = false;
			},
			d(detaching) {
				destroy_each(each_blocks, detaching);
				if (detaching) detach(each_1_anchor);
			}
		};
	}

	// (90:16) {#each uploads as upload}
	function create_each_block$1(ctx) {
		let notfileupload;
		let current;

		notfileupload = new File_upload({
				props: {
					bucketId: /*id*/ ctx[2],
					data: /*upload*/ ctx[11]
				}
			});

		return {
			c() {
				create_component(notfileupload.$$.fragment);
			},
			m(target, anchor) {
				mount_component(notfileupload, target, anchor);
				current = true;
			},
			p(ctx, dirty) {
				const notfileupload_changes = {};
				if (dirty & /*id*/ 4) notfileupload_changes.bucketId = /*id*/ ctx[2];
				if (dirty & /*uploads*/ 1) notfileupload_changes.data = /*upload*/ ctx[11];
				notfileupload.$set(notfileupload_changes);
			},
			i(local) {
				if (current) return;
				transition_in(notfileupload.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(notfileupload.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(notfileupload, detaching);
			}
		};
	}

	function create_fragment$4(ctx) {
		let if_block_anchor;
		let current;
		let if_block = /*show*/ ctx[1] && create_if_block$3(ctx);

		return {
			c() {
				if (if_block) if_block.c();
				if_block_anchor = empty$1();
			},
			m(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
				current = true;
			},
			p(ctx, [dirty]) {
				if (/*show*/ ctx[1]) {
					if (if_block) {
						if_block.p(ctx, dirty);

						if (dirty & /*show*/ 2) {
							transition_in(if_block, 1);
						}
					} else {
						if_block = create_if_block$3(ctx);
						if_block.c();
						transition_in(if_block, 1);
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					group_outros();

					transition_out(if_block, 1, 1, () => {
						if_block = null;
					});

					check_outros();
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block);
				current = true;
			},
			o(local) {
				transition_out(if_block);
				current = false;
			},
			d(detaching) {
				if (if_block) if_block.d(detaching);
				if (detaching) detach(if_block_anchor);
			}
		};
	}

	function instance$4($$self, $$props, $$invalidate) {
		const dispatch = createEventDispatcher();
		let dropzone;
		let { id } = $$props;
		let { uploads = [] } = $$props;
		let { show = false } = $$props;
		let { short = false } = $$props;

		onMount(() => {
			get$1(id, true).uploads.subscribe(value => {
				$$invalidate(0, uploads = value);
			});

			if (dropzone) {
				initDropzone();
			}
		});

		function initDropzone() {
			dropzone.addEventListener("dragenter", function (e) {
				e.preventDefault();
				e.stopPropagation();
				dropzone.classList.add("has-background-white");
			});

			dropzone.addEventListener("dragleave", function (e) {
				e.preventDefault();
				e.stopPropagation();
				dropzone.classList.remove("has-background-white");
			});

			// DROP TO UPLOAD FILE
			dropzone.addEventListener("dragover", function (e) {
				e.preventDefault();
				e.stopPropagation();
			});

			dropzone.addEventListener("drop", function (e) {
				e.preventDefault();
				e.stopPropagation();
				dropzone.classList.remove("has-background-white");
				dispatch("filesAdded", e.dataTransfer.files);
			});
		}

		function closePopup() {
			$$invalidate(1, show = false);
		}

		function resolvePopup() {
			closePopup();
			dispatch("resolve");
		}

		function onChange(ev) {
			dispatch("filesAdded", ev.target.files);
		}

		function div_binding($$value) {
			binding_callbacks[$$value ? 'unshift' : 'push'](() => {
				dropzone = $$value;
				$$invalidate(4, dropzone);
			});
		}

		$$self.$$set = $$props => {
			if ('id' in $$props) $$invalidate(2, id = $$props.id);
			if ('uploads' in $$props) $$invalidate(0, uploads = $$props.uploads);
			if ('show' in $$props) $$invalidate(1, show = $$props.show);
			if ('short' in $$props) $$invalidate(3, short = $$props.short);
		};

		return [uploads, show, id, short, dropzone, onChange, resolvePopup, div_binding];
	}

	class Upload extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$4, create_fragment$4, safe_not_equal, {
				id: 2,
				uploads: 0,
				show: 1,
				short: 3,
				resolvePopup: 6
			});
		}

		get resolvePopup() {
			return this.$$.ctx[6];
		}
	}

	/* src/standalone/complex.svelte generated by Svelte v3.59.2 */

	function create_if_block_1$4(ctx) {
		let div3;
		let div0;
		let t0;
		let div2;
		let t1;
		let section;
		let div1;
		let uploadercomponent;
		let updating_id;
		let t2;
		let storagecomponent;
		let updating_id_1;
		let updating_selectMany;
		let t3;
		let current;
		let mounted;
		let dispose;
		let if_block0 = !/*short*/ ctx[3] && create_if_block_3(ctx);

		function uploadercomponent_id_binding(value) {
			/*uploadercomponent_id_binding*/ ctx[18](value);
		}

		let uploadercomponent_props = { popup: false, show: true, short: true };

		if (/*id*/ ctx[0] !== void 0) {
			uploadercomponent_props.id = /*id*/ ctx[0];
		}

		uploadercomponent = new Upload({ props: uploadercomponent_props });
		binding_callbacks.push(() => bind$2(uploadercomponent, 'id', uploadercomponent_id_binding));
		uploadercomponent.$on("filesAdded", /*onChange*/ ctx[10]);

		function storagecomponent_id_binding(value) {
			/*storagecomponent_id_binding*/ ctx[19](value);
		}

		function storagecomponent_selectMany_binding(value) {
			/*storagecomponent_selectMany_binding*/ ctx[20](value);
		}

		let storagecomponent_props = { popup: false, show: true };

		if (/*id*/ ctx[0] !== void 0) {
			storagecomponent_props.id = /*id*/ ctx[0];
		}

		if (/*selectMany*/ ctx[1] !== void 0) {
			storagecomponent_props.selectMany = /*selectMany*/ ctx[1];
		}

		storagecomponent = new Storage({ props: storagecomponent_props });
		binding_callbacks.push(() => bind$2(storagecomponent, 'id', storagecomponent_id_binding));
		binding_callbacks.push(() => bind$2(storagecomponent, 'selectMany', storagecomponent_selectMany_binding));
		storagecomponent.$on("remove", /*removeFile*/ ctx[12]);
		storagecomponent.$on("selected", /*onSelected*/ ctx[9]);
		let if_block1 = !/*short*/ ctx[3] && create_if_block_2$2(ctx);

		return {
			c() {
				div3 = element("div");
				div0 = element("div");
				t0 = space();
				div2 = element("div");
				if (if_block0) if_block0.c();
				t1 = space();
				section = element("section");
				div1 = element("div");
				create_component(uploadercomponent.$$.fragment);
				t2 = space();
				create_component(storagecomponent.$$.fragment);
				t3 = space();
				if (if_block1) if_block1.c();
				attr(div0, "class", "modal-background");
				attr(div1, "class", "container");
				attr(section, "class", "modal-card-body");
				attr(div2, "class", "modal-card box is-rounded");
				attr(div3, "class", "modal is-active");
			},
			m(target, anchor) {
				insert(target, div3, anchor);
				append(div3, div0);
				append(div3, t0);
				append(div3, div2);
				if (if_block0) if_block0.m(div2, null);
				append(div2, t1);
				append(div2, section);
				append(section, div1);
				mount_component(uploadercomponent, div1, null);
				append(div1, t2);
				mount_component(storagecomponent, div1, null);
				append(div2, t3);
				if (if_block1) if_block1.m(div2, null);
				current = true;

				if (!mounted) {
					dispose = listen(div0, "click", /*rejectPopup*/ ctx[8]);
					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (!/*short*/ ctx[3]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);
					} else {
						if_block0 = create_if_block_3(ctx);
						if_block0.c();
						if_block0.m(div2, t1);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				const uploadercomponent_changes = {};

				if (!updating_id && dirty & /*id*/ 1) {
					updating_id = true;
					uploadercomponent_changes.id = /*id*/ ctx[0];
					add_flush_callback(() => updating_id = false);
				}

				uploadercomponent.$set(uploadercomponent_changes);
				const storagecomponent_changes = {};

				if (!updating_id_1 && dirty & /*id*/ 1) {
					updating_id_1 = true;
					storagecomponent_changes.id = /*id*/ ctx[0];
					add_flush_callback(() => updating_id_1 = false);
				}

				if (!updating_selectMany && dirty & /*selectMany*/ 2) {
					updating_selectMany = true;
					storagecomponent_changes.selectMany = /*selectMany*/ ctx[1];
					add_flush_callback(() => updating_selectMany = false);
				}

				storagecomponent.$set(storagecomponent_changes);

				if (!/*short*/ ctx[3]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block_2$2(ctx);
						if_block1.c();
						if_block1.m(div2, null);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}
			},
			i(local) {
				if (current) return;
				transition_in(uploadercomponent.$$.fragment, local);
				transition_in(storagecomponent.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(uploadercomponent.$$.fragment, local);
				transition_out(storagecomponent.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				if (detaching) detach(div3);
				if (if_block0) if_block0.d();
				destroy_component(uploadercomponent);
				destroy_component(storagecomponent);
				if (if_block1) if_block1.d();
				mounted = false;
				dispose();
			}
		};
	}

	// (115:2) {#if !short }
	function create_if_block_3(ctx) {
		let header;
		let p;
		let t1;
		let button;
		let mounted;
		let dispose;

		return {
			c() {
				header = element("header");
				p = element("p");
				p.textContent = "Добавьте файлы для загрузки";
				t1 = space();
				button = element("button");
				attr(p, "class", "modal-card-title");
				attr(button, "class", "delete");
				attr(button, "aria-label", "close");
				attr(header, "class", "modal-card-head");
			},
			m(target, anchor) {
				insert(target, header, anchor);
				append(header, p);
				append(header, t1);
				append(header, button);

				if (!mounted) {
					dispose = listen(button, "click", /*closePopup*/ ctx[6]);
					mounted = true;
				}
			},
			p: noop$1,
			d(detaching) {
				if (detaching) detach(header);
				mounted = false;
				dispose();
			}
		};
	}

	// (127:2) {#if !short }
	function create_if_block_2$2(ctx) {
		let footer;
		let button0;
		let t1;
		let button1;
		let t3;
		let button2;
		let mounted;
		let dispose;

		return {
			c() {
				footer = element("footer");
				button0 = element("button");
				button0.textContent = "Выбрать";
				t1 = space();
				button1 = element("button");
				button1.textContent = "Удалить";
				t3 = space();
				button2 = element("button");
				button2.textContent = "Закрыть";
				attr(button0, "class", "button is-success");
				attr(button1, "class", "button is-danger");
				attr(button2, "class", "button");
				attr(footer, "class", "modal-card-foot");
			},
			m(target, anchor) {
				insert(target, footer, anchor);
				append(footer, button0);
				append(footer, t1);
				append(footer, button1);
				append(footer, t3);
				append(footer, button2);

				if (!mounted) {
					dispose = [
						listen(button0, "click", /*resolvePopup*/ ctx[7]),
						listen(button1, "click", /*removeSelected*/ ctx[11]),
						listen(button2, "click", /*rejectPopup*/ ctx[8])
					];

					mounted = true;
				}
			},
			p: noop$1,
			d(detaching) {
				if (detaching) detach(footer);
				mounted = false;
				run_all(dispose);
			}
		};
	}

	// (138:0) {#if !popup && show}
	function create_if_block$4(ctx) {
		let uploadercomponent;
		let t;
		let storagecomponent;
		let current;

		uploadercomponent = new Upload({
				props: {
					popup: false,
					show: true,
					id: /*id*/ ctx[0]
				}
			});

		uploadercomponent.$on("filesAdded", /*onChange*/ ctx[10]);

		storagecomponent = new Storage({
				props: {
					popup: false,
					elementSize: /*elementSize*/ ctx[5],
					show: true,
					id: /*id*/ ctx[0],
					selectMany: false
				}
			});

		storagecomponent.$on("remove", /*removeFile*/ ctx[12]);

		return {
			c() {
				create_component(uploadercomponent.$$.fragment);
				t = space();
				create_component(storagecomponent.$$.fragment);
			},
			m(target, anchor) {
				mount_component(uploadercomponent, target, anchor);
				insert(target, t, anchor);
				mount_component(storagecomponent, target, anchor);
				current = true;
			},
			p(ctx, dirty) {
				const uploadercomponent_changes = {};
				if (dirty & /*id*/ 1) uploadercomponent_changes.id = /*id*/ ctx[0];
				uploadercomponent.$set(uploadercomponent_changes);
				const storagecomponent_changes = {};
				if (dirty & /*elementSize*/ 32) storagecomponent_changes.elementSize = /*elementSize*/ ctx[5];
				if (dirty & /*id*/ 1) storagecomponent_changes.id = /*id*/ ctx[0];
				storagecomponent.$set(storagecomponent_changes);
			},
			i(local) {
				if (current) return;
				transition_in(uploadercomponent.$$.fragment, local);
				transition_in(storagecomponent.$$.fragment, local);
				current = true;
			},
			o(local) {
				transition_out(uploadercomponent.$$.fragment, local);
				transition_out(storagecomponent.$$.fragment, local);
				current = false;
			},
			d(detaching) {
				destroy_component(uploadercomponent, detaching);
				if (detaching) detach(t);
				destroy_component(storagecomponent, detaching);
			}
		};
	}

	function create_fragment$5(ctx) {
		let t;
		let if_block1_anchor;
		let current;
		let if_block0 = /*popup*/ ctx[4] && /*show*/ ctx[2] && create_if_block_1$4(ctx);
		let if_block1 = !/*popup*/ ctx[4] && /*show*/ ctx[2] && create_if_block$4(ctx);

		return {
			c() {
				if (if_block0) if_block0.c();
				t = space();
				if (if_block1) if_block1.c();
				if_block1_anchor = empty$1();
			},
			m(target, anchor) {
				if (if_block0) if_block0.m(target, anchor);
				insert(target, t, anchor);
				if (if_block1) if_block1.m(target, anchor);
				insert(target, if_block1_anchor, anchor);
				current = true;
			},
			p(ctx, [dirty]) {
				if (/*popup*/ ctx[4] && /*show*/ ctx[2]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);

						if (dirty & /*popup, show*/ 20) {
							transition_in(if_block0, 1);
						}
					} else {
						if_block0 = create_if_block_1$4(ctx);
						if_block0.c();
						transition_in(if_block0, 1);
						if_block0.m(t.parentNode, t);
					}
				} else if (if_block0) {
					group_outros();

					transition_out(if_block0, 1, 1, () => {
						if_block0 = null;
					});

					check_outros();
				}

				if (!/*popup*/ ctx[4] && /*show*/ ctx[2]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);

						if (dirty & /*popup, show*/ 20) {
							transition_in(if_block1, 1);
						}
					} else {
						if_block1 = create_if_block$4(ctx);
						if_block1.c();
						transition_in(if_block1, 1);
						if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
					}
				} else if (if_block1) {
					group_outros();

					transition_out(if_block1, 1, 1, () => {
						if_block1 = null;
					});

					check_outros();
				}
			},
			i(local) {
				if (current) return;
				transition_in(if_block0);
				transition_in(if_block1);
				current = true;
			},
			o(local) {
				transition_out(if_block0);
				transition_out(if_block1);
				current = false;
			},
			d(detaching) {
				if (if_block0) if_block0.d(detaching);
				if (detaching) detach(t);
				if (if_block1) if_block1.d(detaching);
				if (detaching) detach(if_block1_anchor);
			}
		};
	}

	function instance$5($$self, $$props, $$invalidate) {
		const dispatch = createEventDispatcher();

		onMount(() => {
			get$1(id).files.subscribe(value => {
				$$invalidate(13, files = value);
			});

			get$1(id).selected.subscribe(value => {
				$$invalidate(14, selected = value);
			});
		});

		let { id } = $$props;
		let { files = [] } = $$props;
		let { selected = [] } = $$props;
		let { selectMany } = $$props;
		let { selectOnClick } = $$props;
		let { short = false } = $$props;
		let { show = true } = $$props;
		let { popup = true } = $$props;
		let { elementSize = 3 } = $$props;
		let { onReject } = $$props;
		let { onResolve } = $$props;

		function closePopup() {
			$$invalidate(2, show = false);
		}

		function resolvePopup() {
			closePopup();

			if (selected.length) {
				let images = files.filter(file => {
					return selected.indexOf(file.uuid) > -1;
				});

				if (onResolve) {
					onResolve(images);
					$$invalidate(16, onResolve = null);
				} else {
					dispatch('resolve', { selected: images });
				}
			} else {
				if (onResolve) {
					onResolve([]);
					$$invalidate(16, onResolve = null);
				} else {
					dispatch('resolve', { selected: [] });
				}
			}
		}

		function rejectPopup() {
			closePopup();

			if (onReject) {
				onReject();
				$$invalidate(15, onReject = null);
			} else {
				dispatch('reject');
			}
		}

		function onSelected() {
			if (selectOnClick) {
				resolvePopup();
			}
		}

		function onChange(ev) {
			dispatch('filesAdded', ev.detail);
		}

		function removeSelected() {
			Confirmation.ask({
				title: `Удаление файлов (${selected.length}) `,
				text: 'Файлы будут удалены без возможнеости восстановления!',
				approval: 'Удалить файлы?'
			}).then(() => {
				dispatch('remove', { selected });
			}).catch(() => {
				
			}); //console.error('remove disapproved');
		}

		function removeFile(ev) {
			dispatch('remove', { selected: ev.detail.selected });
		}

		function uploadercomponent_id_binding(value) {
			id = value;
			$$invalidate(0, id);
		}

		function storagecomponent_id_binding(value) {
			id = value;
			$$invalidate(0, id);
		}

		function storagecomponent_selectMany_binding(value) {
			selectMany = value;
			$$invalidate(1, selectMany);
		}

		$$self.$$set = $$props => {
			if ('id' in $$props) $$invalidate(0, id = $$props.id);
			if ('files' in $$props) $$invalidate(13, files = $$props.files);
			if ('selected' in $$props) $$invalidate(14, selected = $$props.selected);
			if ('selectMany' in $$props) $$invalidate(1, selectMany = $$props.selectMany);
			if ('selectOnClick' in $$props) $$invalidate(17, selectOnClick = $$props.selectOnClick);
			if ('short' in $$props) $$invalidate(3, short = $$props.short);
			if ('show' in $$props) $$invalidate(2, show = $$props.show);
			if ('popup' in $$props) $$invalidate(4, popup = $$props.popup);
			if ('elementSize' in $$props) $$invalidate(5, elementSize = $$props.elementSize);
			if ('onReject' in $$props) $$invalidate(15, onReject = $$props.onReject);
			if ('onResolve' in $$props) $$invalidate(16, onResolve = $$props.onResolve);
		};

		return [
			id,
			selectMany,
			show,
			short,
			popup,
			elementSize,
			closePopup,
			resolvePopup,
			rejectPopup,
			onSelected,
			onChange,
			removeSelected,
			removeFile,
			files,
			selected,
			onReject,
			onResolve,
			selectOnClick,
			uploadercomponent_id_binding,
			storagecomponent_id_binding,
			storagecomponent_selectMany_binding
		];
	}

	class Complex extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$5, create_fragment$5, safe_not_equal, {
				id: 0,
				files: 13,
				selected: 14,
				selectMany: 1,
				selectOnClick: 17,
				short: 3,
				show: 2,
				popup: 4,
				elementSize: 5,
				onReject: 15,
				onResolve: 16
			});
		}
	}

	var safeListItemFields = ["_id", "fielID", "name", "extension", "store", "info", "size"];
	var file_manifest = {
	  model: "file",
	  url: "/api/:modelName",
	  fields: {},
	  actions: {
	    create: {
	      method: "PUT",
	      isArray: false,
	      data: ["record"],
	      postFix: "/:store?",
	      rules: [{
	        auth: true,
	        root: true
	      }, {
	        auth: true,
	        root: false
	      }, {
	        auth: false
	      }]
	    },
	    list: {
	      method: "GET",
	      isArray: true,
	      data: ["pager", "sorter", "filter", "search"],
	      fields: safeListItemFields,
	      rules: [{
	        auth: true,
	        root: true
	      }, {
	        auth: true,
	        root: false,
	        return: ["createdAt", "updatedAt", "size", "uuid", "extension", "fileID", "userId", "userIp", "sesison", "info", "store", "name", "path", "_id"]
	      }, {
	        auth: false,
	        return: ["createdAt", "updatedAt", "size", "uuid", "extension", "fileID", "info", "store", "name", "path", "_id"]
	      }]
	    },
	    listAndCount: {
	      method: "get",
	      data: ["pager", "sorter", "filter", "search"],
	      fields: safeListItemFields,
	      rules: [{
	        auth: true,
	        root: true
	      }, {
	        auth: true,
	        role: "root"
	      }],
	      postFix: "/:actionName"
	    },
	    get: {
	      method: "GET",
	      isArray: false,
	      postFix: "/:record[_id]",
	      data: ["filter", "record"],
	      fields: safeListItemFields,
	      rules: [{
	        auth: true,
	        root: true
	      }, {
	        auth: true,
	        root: false
	      }, {
	        auth: false,
	        root: false
	      }]
	    },
	    getRaw: {
	      method: "GET",
	      isArray: false,
	      postFix: "/:record[_id]",
	      data: ["filter", "record"],
	      fields: safeListItemFields,
	      rules: [{
	        auth: true,
	        root: true
	      }, {
	        auth: true,
	        root: false
	      }, {
	        auth: false,
	        root: false
	      }]
	    },
	    delete: {
	      method: "DELETE",
	      postFix: "/:record[_id]",
	      isArray: false,
	      rules: [{
	        auth: true,
	        root: true
	      }, {
	        auth: true,
	        root: false
	      }, {
	        auth: false,
	        root: false
	      }]
	    }
	  }
	};

	var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points








	var SPECIES$6 = wellKnownSymbol('species');
	var RegExpPrototype = RegExp.prototype;

	var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) !== 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$6] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () {
	      execCalled = true;
	      return null;
	    };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    FORCED
	  ) {
	    var uncurriedNativeRegExpMethod = functionUncurryThisClause(/./[SYMBOL]);
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      var uncurriedNativeMethod = functionUncurryThisClause(nativeMethod);
	      var $exec = regexp.exec;
	      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
	        }
	        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
	      }
	      return { done: false };
	    });

	    defineBuiltIn(String.prototype, KEY, methods[0]);
	    defineBuiltIn(RegExpPrototype, SYMBOL, methods[1]);
	  }

	  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
	};

	var charAt$4 = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt$4(S, index).length : 1);
	};

	var floor$1 = Math.floor;
	var charAt$5 = functionUncurryThis(''.charAt);
	var replace$3 = functionUncurryThis(''.replace);
	var stringSlice$4 = functionUncurryThis(''.slice);
	// eslint-disable-next-line redos/no-vulnerable -- safe
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

	// `GetSubstitution` abstract operation
	// https://tc39.es/ecma262/#sec-getsubstitution
	var getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
	  var tailPos = position + matched.length;
	  var m = captures.length;
	  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	  if (namedCaptures !== undefined) {
	    namedCaptures = toObject(namedCaptures);
	    symbols = SUBSTITUTION_SYMBOLS;
	  }
	  return replace$3(replacement, symbols, function (match, ch) {
	    var capture;
	    switch (charAt$5(ch, 0)) {
	      case '$': return '$';
	      case '&': return matched;
	      case '`': return stringSlice$4(str, 0, position);
	      case "'": return stringSlice$4(str, tailPos);
	      case '<':
	        capture = namedCaptures[stringSlice$4(ch, 1, -1)];
	        break;
	      default: // \d\d?
	        var n = +ch;
	        if (n === 0) return match;
	        if (n > m) {
	          var f = floor$1(n / 10);
	          if (f === 0) return match;
	          if (f <= m) return captures[f - 1] === undefined ? charAt$5(ch, 1) : captures[f - 1] + charAt$5(ch, 1);
	          return match;
	        }
	        capture = captures[n - 1];
	    }
	    return capture === undefined ? '' : capture;
	  });
	};

	var $TypeError$g = TypeError;

	// `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (isCallable(exec)) {
	    var result = functionCall(exec, R, S);
	    if (result !== null) anObject(result);
	    return result;
	  }
	  if (classofRaw(R) === 'RegExp') return functionCall(regexpExec, R, S);
	  throw $TypeError$g('RegExp#exec called on incompatible receiver');
	};

	var REPLACE = wellKnownSymbol('replace');
	var max$4 = Math.max;
	var min$3 = Math.min;
	var concat$2 = functionUncurryThis([].concat);
	var push$4 = functionUncurryThis([].push);
	var stringIndexOf = functionUncurryThis(''.indexOf);
	var stringSlice$5 = functionUncurryThis(''.slice);

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
	  return ''.replace(re, '$<a>') !== '7';
	});

	// @@replace logic
	fixRegexpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.es/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible(this);
	      var replacer = isNullOrUndefined(searchValue) ? undefined : getMethod(searchValue, REPLACE);
	      return replacer
	        ? functionCall(replacer, searchValue, O, replaceValue)
	        : functionCall(nativeReplace, toString_1(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
	    function (string, replaceValue) {
	      var rx = anObject(this);
	      var S = toString_1(string);

	      if (
	        typeof replaceValue == 'string' &&
	        stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
	        stringIndexOf(replaceValue, '$<') === -1
	      ) {
	        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
	        if (res.done) return res.value;
	      }

	      var functionalReplace = isCallable(replaceValue);
	      if (!functionalReplace) replaceValue = toString_1(replaceValue);

	      var global = rx.global;
	      var fullUnicode;
	      if (global) {
	        fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }

	      var results = [];
	      var result;
	      while (true) {
	        result = regexpExecAbstract(rx, S);
	        if (result === null) break;

	        push$4(results, result);
	        if (!global) break;

	        var matchStr = toString_1(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = toString_1(result[0]);
	        var position = max$4(min$3(toIntegerOrInfinity(result.index), S.length), 0);
	        var captures = [];
	        var replacement;
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) push$4(captures, maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = concat$2([matched], captures, position, S);
	          if (namedCaptures !== undefined) push$4(replacerArgs, namedCaptures);
	          replacement = toString_1(functionApply(replaceValue, undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += stringSlice$5(S, nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }

	      return accumulatedResult + stringSlice$5(S, nextSourcePosition);
	    }
	  ];
	}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    isCallable(NewTarget = dummy.constructor) &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	// `thisNumberValue` abstract operation
	// https://tc39.es/ecma262/#sec-thisnumbervalue
	var thisNumberValue = functionUncurryThis(1.0.valueOf);

	// a string of all valid unicode whitespaces
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
	  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var replace$4 = functionUncurryThis(''.replace);
	var ltrim = RegExp('^[' + whitespaces + ']+');
	var rtrim = RegExp('(^|[^' + whitespaces + '])[' + whitespaces + ']+$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$3 = function (TYPE) {
	  return function ($this) {
	    var string = toString_1(requireObjectCoercible($this));
	    if (TYPE & 1) string = replace$4(string, ltrim, '');
	    if (TYPE & 2) string = replace$4(string, rtrim, '$1');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$3(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimend
	  end: createMethod$3(2),
	  // `String.prototype.trim` method
	  // https://tc39.es/ecma262/#sec-string.prototype.trim
	  trim: createMethod$3(3)
	};

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$4 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$6 = objectDefineProperty.f;

	var trim = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global_1[NUMBER];
	var PureNumberNamespace = path[NUMBER];
	var NumberPrototype = NativeNumber.prototype;
	var TypeError$4 = global_1.TypeError;
	var stringSlice$6 = functionUncurryThis(''.slice);
	var charCodeAt$2 = functionUncurryThis(''.charCodeAt);

	// `ToNumeric` abstract operation
	// https://tc39.es/ecma262/#sec-tonumeric
	var toNumeric = function (value) {
	  var primValue = toPrimitive(value, 'number');
	  return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
	};

	// `ToNumber` abstract operation
	// https://tc39.es/ecma262/#sec-tonumber
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, 'number');
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (isSymbol(it)) throw TypeError$4('Cannot convert a Symbol value to a number');
	  if (typeof it == 'string' && it.length > 2) {
	    it = trim(it);
	    first = charCodeAt$2(it, 0);
	    if (first === 43 || first === 45) {
	      third = charCodeAt$2(it, 2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (charCodeAt$2(it, 1)) {
	        // fast equal of /^0b[01]+$/i
	        case 66:
	        case 98:
	          radix = 2;
	          maxCode = 49;
	          break;
	        // fast equal of /^0o[0-7]+$/i
	        case 79:
	        case 111:
	          radix = 8;
	          maxCode = 55;
	          break;
	        default:
	          return +it;
	      }
	      digits = stringSlice$6(it, 2);
	      length = digits.length;
	      for (index = 0; index < length; index++) {
	        code = charCodeAt$2(digits, index);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	var FORCED$2 = isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'));

	var calledWithNew = function (dummy) {
	  // includes check on 1..constructor(foo) case
	  return objectIsPrototypeOf(NumberPrototype, dummy) && fails(function () { thisNumberValue(dummy); });
	};

	// `Number` constructor
	// https://tc39.es/ecma262/#sec-number-constructor
	var NumberWrapper = function Number(value) {
	  var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
	  return calledWithNew(this) ? inheritIfRequired(Object(n), this, NumberWrapper) : n;
	};

	NumberWrapper.prototype = NumberPrototype;
	if (FORCED$2 && !isPure) NumberPrototype.constructor = NumberWrapper;

	_export({ global: true, constructor: true, wrap: true, forced: FORCED$2 }, {
	  Number: NumberWrapper
	});

	// Use `internal/copy-constructor-properties` helper in `core-js@4`
	var copyConstructorProperties$1 = function (target, source) {
	  for (var keys = descriptors ? getOwnPropertyNames(source) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
	    // ESNext
	    'fromString,range'
	  ).split(','), j = 0, key; keys.length > j; j++) {
	    if (hasOwnProperty_1(source, key = keys[j]) && !hasOwnProperty_1(target, key)) {
	      defineProperty$6(target, key, getOwnPropertyDescriptor$4(source, key));
	    }
	  }
	};
	if (FORCED$2 || isPure) copyConstructorProperties$1(path[NUMBER], NativeNumber);

	/*
		:property.sub1.func().funcProp
		 = return funcProp of function result of sub1 property of property of object
		:{::helperVal}.sub
		 = return sub property of object property with name retrieved from helperVal property of helpers object
		:{::helperFunc()}.sub
		= return sub property of object property with name retrieved from helperVal function result of helpers object.
		if helpersFunx return 'car' then source path becomes :car.sub

	*/

	const SUB_PATH_START = "{",
	    SUB_PATH_END = "}",
	    PATH_SPLIT = ".",
	    PATH_START_OBJECT = ":",
	    PATH_START_HELPERS = "::",
	    FUNCTION_MARKER = "()",
	    MAX_DEEP = 10;

	/**
	 * Set of tools to use notPath property access notation
	 * : is for item
	 * :: is for helpers
	 * {} subpath
	 * . path splitter
	 * () function and should be executed with params (item, helper | undefined)
	 * sub-paths will be parsed and replaced by results in source path
	 */
	class notPath {
	    static get SUB_PATH_START() {
	        return SUB_PATH_START;
	    }
	    static get SUB_PATH_END() {
	        return SUB_PATH_END;
	    }
	    static get PATH_SPLIT() {
	        return PATH_SPLIT;
	    }
	    static get PATH_START_OBJECT() {
	        return PATH_START_OBJECT;
	    }
	    static get PATH_START_HELPERS() {
	        return PATH_START_HELPERS;
	    }
	    static get FUNCTION_MARKER() {
	        return FUNCTION_MARKER;
	    }
	    static get MAX_DEEP() {
	        return MAX_DEEP;
	    }

	    /*
			input ':{::helperVal}.sub'
			return ::helperVal
		*/

	    /**
	     * Returns first subpath in path
	     * if subpath not closed will return it anyway
	     * @param {string} path path in string notation
	     * @return {string|null} subpath or null if no sub path were found
	     */
	    static findNextSubPath(path) {
	        let subPath = "",
	            find = false;
	        for (let i = 0; i < path.length; i++) {
	            if (path[i] === SUB_PATH_START) {
	                find = true;
	                subPath = "";
	            } else {
	                if (path[i] === SUB_PATH_END && find) {
	                    return subPath;
	                } else {
	                    subPath += path[i];
	                }
	            }
	        }
	        return find ? subPath : null;
	    }

	    /**
	     * Replace sub-path in parent path by parsed version
	     * @param {string} path path to process
	     * @param {string} sub sub path to replace
	     * @param {string} parsed parsed sub path
	     * @return {string} parsed path
	     */

	    static replaceSubPath(path, sub, parsed) {
	        let subf = SUB_PATH_START + sub + SUB_PATH_END,
	            i = 0;
	        while (path.indexOf(subf) > -1 && i < MAX_DEEP) {
	            path = path.replace(subf, parsed);
	            i++;
	        }
	        return path;
	    }

	    /**
	     * Parses path while there any sub-paths
	     * @param {string} path raw unparsed path
	     * @param {object} item data
	     * @param {object} helpers helpers
	     * @return {string} parsed path
	     */
	    static parseSubs(path, item, helpers) {
	        let subPath = this.findNextSubPath(path),
	            subPathParsed,
	            i = 0;
	        while (subPath) {
	            subPathParsed = this.getValueByPath(
	                subPath.indexOf(PATH_START_HELPERS) > -1 ? helpers : item,
	                subPath,
	                item,
	                helpers
	            );
	            path = this.replaceSubPath(path, subPath, subPathParsed);
	            i++;
	            if (i > MAX_DEEP) {
	                break;
	            }
	            subPath = this.findNextSubPath(path);
	        }
	        return path;
	    }

	    /**
	     * Get property value
	     * @param {string} path path to property
	     * @param {object} item item object
	     * @param {object} helpers helpers object
	     */

	    static get(path, item, helpers) {
	        switch (path) {
	            case PATH_START_OBJECT:
	                return item;
	            case PATH_START_HELPERS:
	                return helpers;
	        }
	        path = this.parseSubs(path, item, helpers);
	        return this.getValueByPath(
	            path.indexOf(PATH_START_HELPERS) > -1 ? helpers : item,
	            path,
	            item,
	            helpers
	        );
	    }

	    /**
	     * Set property value
	     * @param {string}  path path to property
	     * @param {object}  item item object
	     * @param {object}  helpers         helpers object if 4 arguments or attrValue if only 3 provided
	     * @param {any}     [attrValue]     value we want to assign
	     */

	    static set(path, item, helpers, attrValue) {
	        if (arguments.length === 3) {
	            attrValue = helpers;
	            helpers = undefined;
	        }
	        let subPath = this.findNextSubPath(path),
	            subPathParsed,
	            i = 0;
	        while (subPath) {
	            subPathParsed = this.getValueByPath(
	                subPath.indexOf(PATH_START_HELPERS) > -1 ? helpers : item,
	                subPath,
	                item,
	                helpers
	            );
	            path = this.replaceSubPath(path, subPath, subPathParsed);
	            if (i > MAX_DEEP) {
	                break;
	            }
	            subPath = this.findNextSubPath(path);
	            i++;
	        }
	        this.setValueByPath(item, path, attrValue);
	        if (
	            item.isRecord &&
	            this.normilizePath(path).length > 1 &&
	            item.__isActive
	        ) {
	            item.trigger("change", item, path, attrValue);
	        }
	    }

	    /**
	     * Set target property to null
	     * @param {string} path path to property
	     * @param {object} item item object
	     * @param {object} helpers helpers object
	     */

	    static unset(path, item, helpers) {
	        this.set(path, item, helpers, null);
	    }

	    /**
	     * Parses step key, transforms it to end-form
	     * @param {string} step not parsed step key
	     * @param {object} item item object
	     * @param {object} helper helpers object
	     * @return {string|number} parsed step key
	     */

	    static parsePathStep(step, item, helper) {
	        let rStep = null;
	        if (step.indexOf(PATH_START_HELPERS) === 0 && helper) {
	            rStep = step.replace(PATH_START_HELPERS, "");
	            if (rStep.indexOf(FUNCTION_MARKER) === rStep.length - 2) {
	                rStep = rStep.replace(FUNCTION_MARKER, "");
	                if (Object.prototype.hasOwnProperty.call(helper, rStep)) {
	                    return helper[rStep](item, undefined);
	                }
	            } else {
	                return helper[rStep];
	            }
	        } else {
	            if (step.indexOf(PATH_START_OBJECT) === 0 && item) {
	                rStep = step.replace(PATH_START_OBJECT, "");
	                if (rStep.indexOf(FUNCTION_MARKER) === rStep.length - 2) {
	                    rStep = rStep.replace(FUNCTION_MARKER, "");
	                    if (Object.prototype.hasOwnProperty.call(item, rStep)) {
	                        return item[rStep](item, undefined);
	                    }
	                } else {
	                    return item[rStep];
	                }
	            }
	        }
	        return step;
	    }

	    //::fieldName.result
	    //{}
	    //{fieldName: 'targetRecordField'}
	    ////['targetRecordField', 'result']
	    /**
	     * Transforms path with sub paths to path without
	     * @param {string|array} path path to target property
	     * @param {object} item item object
	     * @param {object} helper helper object
	     * @return {array} parsed path
	     **/
	    static parsePath(path, item, helper) {
	        if (!Array.isArray(path)) {
	            path = path.split(PATH_SPLIT);
	        }
	        for (var i = 0; i < path.length; i++) {
	            path[i] = this.parsePathStep(path[i], item, helper);
	        }
	        return path;
	    }

	    /**
	     * Transforms path from string notation to array of keys
	     * @param {string|array} path  input path, if array does nothing
	     * @return {array} path in array notation
	     */

	    static normilizePath(path) {
	        if (Array.isArray(path)) {
	            return path;
	        } else {
	            while (path.indexOf(PATH_START_OBJECT) > -1) {
	                path = path.replace(PATH_START_OBJECT, "");
	            }
	            return path.split(PATH_SPLIT);
	        }
	    }

	    /*
			small = ["todo"],
			big = ["todo", "length"]
			return true;

		*/

	    /**
	     * Identifies if first path includes second, compared from start,
	     * no floating start position inside ['join', 'me'], ['me']
	     * will result in false
	     * @param {array} big where we will search
	     * @param {array} small what we will search
	     * @return {boolean} if we succeed
	     */

	    static ifFullSubPath(big, small) {
	        if (big.length < small.length) {
	            return false;
	        }
	        for (let t = 0; t < small.length; t++) {
	            if (small[t] !== big[t]) {
	                return false;
	            }
	        }
	        return true;
	    }

	    /**
	     * Getter through third object
	     * Path is parsed, no event triggering for notRecord
	     * @param {object} object object to be used as getter
	     * @param {string|array} attrPath path to property
	     * @param {object} item supporting data
	     * @param {helpers} object  supporting helpers
	     */

	    static getValueByPath(object, attrPath, item, helpers) {
	        attrPath = this.normilizePath(attrPath);
	        let attrName = attrPath.shift(),
	            isFunction = attrName.indexOf(FUNCTION_MARKER) > -1;
	        if (isFunction) {
	            attrName = attrName.replace(FUNCTION_MARKER, "");
	        }
	        if (
	            (typeof object === "object" || typeof object === "function") &&
	            typeof object !== "undefined" &&
	            object !== null &&
	            typeof object[attrName] !== "undefined" &&
	            object[attrName] !== null
	        ) {
	            let newObj = isFunction
	                ? object[attrName]({
	                      item,
	                      helpers,
	                  })
	                : object[attrName];
	            if (attrPath.length > 0) {
	                return this.getValueByPath(newObj, attrPath, item, helpers);
	            } else {
	                return newObj;
	            }
	        } else {
	            return undefined;
	        }
	    }

	    /**
	     * Setter through third object
	     * Path is parsed, no event triggering for notRecord
	     * @param {object} object object to be modified
	     * @param {string|array} attrPath path to property
	     * @param {any} attrValue  value to assign
	     */

	    static setValueByPath(object, attrPath, attrValue) {
	        attrPath = this.normilizePath(attrPath);
	        let attrName = attrPath.shift();
	        if (attrPath.length > 0) {
	            if (!Object.prototype.hasOwnProperty.call(object, attrName)) {
	                object[attrName] = {};
	            }
	            this.setValueByPath(object[attrName], attrPath, attrValue);
	        } else {
	            object[attrName] = attrValue;
	        }
	    }

	    /**
	     * Joins passed in strings with PATH_SPLIT
	     * @param {string} arguments path to be glued
	     * @return {string} composite path
	     */

	    static join() {
	        let args = Array.prototype.slice.call(arguments);
	        return args.join(PATH_SPLIT);
	    }
	}

	var src = notPath;

	var notPath$1 = src;

	function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
	function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
	function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
	var OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY = ["_id", "id", "ID"],
	  DEFAULT_FILTER = {},
	  DEFAULT_SEARCH = "",
	  DEFAULT_RETURN = {},
	  DEFAULT_PAGE_NUMBER = 1,
	  DEFAULT_PAGE_SIZE = 10,
	  DEFAULT_ACTION_PREFIX = "$";
	function capitalizeFirstLetter(string) {
	  return string.charAt(0).toUpperCase() + string.slice(1);
	}
	var netInterface = /*#__PURE__*/function () {
	  function netInterface(manifest, options) {
	    _classCallCheck(this, netInterface);
	    this.options = options;
	    this.manifest = manifest;
	    this.working = {};
	    this.initActions();
	    return this;
	  }
	  _createClass(netInterface, [{
	    key: "initActions",
	    value: function initActions() {
	      if (this.getActionsCount() > 0) {
	        var actions = this.getActions();
	        for (var actionName in actions) {
	          this.initAction(actionName, actions[actionName]);
	        }
	      }
	    }
	  }, {
	    key: "initAction",
	    value: function initAction(actionName) {
	      var _this = this;
	      if (!Object.prototype.hasOwnProperty.call(this, [DEFAULT_ACTION_PREFIX + actionName])) {
	        this[DEFAULT_ACTION_PREFIX + actionName] = function (opts, headers) {
	          var fileUpload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	          var files = arguments.length > 3 ? arguments[3] : undefined;
	          return _this.request(_this, actionName, opts, headers, fileUpload, files);
	        };
	      }
	    }
	  }, {
	    key: "request",
	    value: function request(record, actionName, params) {
	      var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	      var fileUpload = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
	      var files = arguments.length > 5 ? arguments[5] : undefined;
	      var compositeData = Object.assign({}, record, params);
	      var actionData = this.getActionData(actionName),
	        requestParams = this.collectRequestData(actionData),
	        requestParamsEncoded = this.encodeRequest(requestParams),
	        //id = this.getID(compositeData, actionData, actionName),
	        apiServerURL = this.getServerURL(),
	        url = this.getURL(compositeData, actionData, actionName),
	        opts = {};
	      if (fileUpload) {
	        url = this.getURL(params, actionData, actionName);
	        console.log("request url for file upload", url);
	        var fd = new FormData();
	        fd.append("file", files);
	        opts.body = fd;
	      } else {
	        if (["OPTIONS", "GET"].indexOf(actionData.method.toUpperCase()) === -1) {
	          opts = {
	            body: record
	          };
	        }
	      }
	      opts.method = actionData.method.toUpperCase();
	      if (headers) {
	        opts.headers = headers;
	      }
	      return fetch(apiServerURL + url + requestParamsEncoded, opts).then(function (response) {
	        return response.json();
	      });
	    }
	  }, {
	    key: "getModelName",
	    value: function getModelName() {
	      return this && this.manifest ? this.manifest.model : null;
	    }
	  }, {
	    key: "getActionData",
	    value: function getActionData(actionName) {
	      return this.getActions() && this.getActions()[actionName] ? this.getActions()[actionName] : null;
	    }
	  }, {
	    key: "getActionsCount",
	    value: function getActionsCount() {
	      return this.getActions() ? Object.keys(this.getActions()).length : 0;
	    }
	  }, {
	    key: "getActions",
	    value: function getActions() {
	      return this.manifest && this.manifest.actions ? this.manifest.actions : {};
	    }
	  }, {
	    key: "parseParams",
	    value: function parseParams(start, end, line, record) {
	      var fieldName = "";
	      var len = start.length;
	      while (line.indexOf(start) > -1) {
	        var ind = line.indexOf(start);
	        var startSlice = ind + len;
	        var endSlice = line.indexOf(end);
	        fieldName = line.slice(startSlice, endSlice);
	        if (fieldName == "") break;
	        console.log(start + fieldName + end, notPath$1.get(fieldName, record));
	        line = line.replace(start + fieldName + end, notPath$1.get(fieldName, record));
	      }
	      return line;
	    }
	  }, {
	    key: "parseLine",
	    value: function parseLine(line, record, actionName) {
	      line = line.replace(":modelName", this.manifest.model);
	      line = line.replace(":actionName", actionName);
	      line = this.parseParams(":record[", "]", line, record);
	      line = this.parseParams(":", "?", line, record);
	      return line;
	    }
	  }, {
	    key: "getURL",
	    value: function getURL(record, actionData, actionName) {
	      var line = this.parseLine(this.manifest.url, record, actionName) + (Object.prototype.hasOwnProperty.call(actionData, "postFix") ? this.parseLine(actionData.postFix, record, actionName) : "");
	      return line;
	    }
	  }, {
	    key: "getServerURL",
	    value: function getServerURL() {
	      return this.options.server;
	    }
	  }, {
	    key: "encodeRequest",
	    value: function encodeRequest(data) {
	      var p = "?";
	      for (var t in data) {
	        if (typeof data[t] !== "undefined" && data[t] !== null) {
	          p += encodeURIComponent(t) + "=" + encodeURIComponent(data[t].constructor === Object ? JSON.stringify(data[t]) : data[t]) + "&";
	        }
	      }
	      //for test purpose only, special test server needed
	      if (this.options.test) {
	        p += "&test=1";
	        if (this.options.test.session) {
	          p += "&session=" + this.options.test.session;
	        }
	        if (this.options.test.session) {
	          p += "&role=" + this.options.test.role;
	        }
	      }
	      return p;
	    }
	  }, {
	    key: "collectRequestData",
	    value: function collectRequestData(actionData) {
	      var requestData = {};
	      if (Object.prototype.hasOwnProperty.call(actionData, "data") && Array.isArray(actionData.data)) {
	        for (var i = 0; i < actionData.data.length; i++) {
	          var dataProviderName = "get" + capitalizeFirstLetter(actionData.data[i]);
	          if (this[dataProviderName] && typeof this[dataProviderName] === "function") {
	            var data = this[dataProviderName](),
	              res = {};
	            if (["pager", "sorter", "filter", "search", "return"].indexOf(actionData.data[i]) > -1) {
	              res[actionData.data[i]] = data;
	            } else {
	              res = data;
	            }
	            requestData = Object.assign(requestData, res);
	          }
	        }
	      }
	      return requestData;
	    }
	  }, {
	    key: "getID",
	    value: function getID(record, actionData) {
	      var resultId,
	        list = OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY,
	        prefixes = ["", this.manifest.model];
	      if (Object.prototype.hasOwnProperty.call(actionData, "index") && actionData.index) {
	        list = [actionData.index].concat(OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY);
	      }
	      for (var _i = 0, _prefixes = prefixes; _i < _prefixes.length; _i++) {
	        var pre = _prefixes[_i];
	        var _iterator = _createForOfIteratorHelper(list),
	          _step;
	        try {
	          for (_iterator.s(); !(_step = _iterator.n()).done;) {
	            var t = _step.value;
	            if (Object.prototype.hasOwnProperty.call(record, pre + t)) {
	              resultId = record[pre + t];
	              break;
	            }
	          }
	        } catch (err) {
	          _iterator.e(err);
	        } finally {
	          _iterator.f();
	        }
	      }
	      return resultId;
	    }
	  }, {
	    key: "setFindBy",
	    value: function setFindBy(key, value) {
	      var obj = {};
	      obj[key] = value;
	      return this.setFilter(obj);
	    }
	  }, {
	    key: "setFilter",
	    value: function setFilter() {
	      var filterData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_FILTER;
	      notPath$1.set("filter", this.working, filterData);
	      return this;
	    }
	  }, {
	    key: "resetFilter",
	    value: function resetFilter() {
	      return this.setFilter();
	    }
	  }, {
	    key: "getFilter",
	    value: function getFilter() {
	      return notPath$1.get("filter", this.working);
	    }
	  }, {
	    key: "setSearch",
	    value: function setSearch() {
	      var searchData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_SEARCH;
	      notPath$1.set("search", this.working, searchData);
	      return this;
	    }
	  }, {
	    key: "resetSearch",
	    value: function resetSearch() {
	      return this.setSearch();
	    }
	  }, {
	    key: "getSearch",
	    value: function getSearch() {
	      return notPath$1.get("search", this.working);
	    }
	  }, {
	    key: "setSorter",
	    value: function setSorter(sorterData) {
	      notPath$1.set("sorter", this.working, sorterData);
	      return this;
	    }
	  }, {
	    key: "resetSorter",
	    value: function resetSorter() {
	      return this.setSorter({});
	    }
	  }, {
	    key: "getSorter",
	    value: function getSorter() {
	      return notPath$1.get("sorter", this.working);
	    }
	  }, {
	    key: "setReturn",
	    value: function setReturn() {
	      var returnData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_RETURN;
	      notPath$1.set("return", this.working, returnData);
	      return this;
	    }
	  }, {
	    key: "resetReturn",
	    value: function resetReturn() {
	      return this.setReturn({});
	    }
	  }, {
	    key: "getReturn",
	    value: function getReturn() {
	      return notPath$1.get("return", this.working);
	    }
	  }, {
	    key: "setPageNumber",
	    value: function setPageNumber(pageNumber) {
	      notPath$1.set("pager.page", this.working, pageNumber);
	      return this;
	    }
	  }, {
	    key: "setPageSize",
	    value: function setPageSize(pageSize) {
	      notPath$1.set("pager.size", this.working, pageSize);
	      return this;
	    }
	  }, {
	    key: "setPager",
	    value: function setPager() {
	      var pageSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_PAGE_SIZE;
	      var pageNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_PAGE_NUMBER;
	      if (pageSize.constructor === Number) {
	        notPath$1.set("pager", this.working, {
	          size: pageSize,
	          page: pageNumber
	        });
	      } else if (pageSize.constructor === Object) {
	        notPath$1.set("pager", this.working, {
	          size: pageSize.size || DEFAULT_PAGE_SIZE,
	          page: pageSize.page || DEFAULT_PAGE_NUMBER
	        });
	      }
	      return this;
	    }
	  }, {
	    key: "resetPager",
	    value: function resetPager() {
	      return this.setPager();
	    }
	  }, {
	    key: "getPager",
	    value: function getPager() {
	      return notPath$1.get("pager", this.working);
	    }
	  }]);
	  return netInterface;
	}();

	function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
	function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }
	function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
	var DEFAULT_OPTS = {
	  store: "client",
	  server: "",
	  selectMany: false,
	  preview: {
	    width: 100,
	    height: 100
	  }
	};
	var notStore = /*#__PURE__*/function () {
	  function notStore(options) {
	    _classCallCheck(this, notStore);
	    this.options = Object.assign({}, DEFAULT_OPTS, options);
	    this.ui = {};
	    this.init();
	  }
	  _createClass(notStore, [{
	    key: "init",
	    value: function init() {
	      this.generateID();
	      this.createStore();
	      if (this.options.complex && this.options.complex.popup) {
	        this.renderComplex();
	        this.loadFilesData().catch(console.error);
	      } else {
	        if (this.options.storageEl) {
	          this.renderStorage();
	          this.loadFilesData().catch(console.error);
	        }
	        if (this.options.uploadEl) {
	          this.renderUpload();
	        }
	      }
	      if (this.options.preload) {
	        this.loadFilesData().catch(console.error);
	      }
	    }
	  }, {
	    key: "generateID",
	    value: function generateID() {
	      if (!this.options.id) {
	        this.options.id = Math.random();
	      }
	    }
	  }, {
	    key: "createStore",
	    value: function createStore() {
	      var _this = this;
	      this.storage = create(this.options.id);
	      this.storage.files.subscribe(function (files) {
	        _this.files = files;
	      });
	      this.storage.selected.subscribe(function (selected) {
	        _this.selected = selected;
	      });
	      this.storage.uploads.subscribe(function (selected) {
	        _this.uploads = selected;
	      });
	    }
	  }, {
	    key: "renderComplex",
	    value: function renderComplex() {
	      this.ui.complex = new Complex({
	        target: this.options.complexEl,
	        props: {
	          files: this.files,
	          id: this.options.id,
	          selectMany: this.options.selectMany,
	          selectOnClick: this.options.selectOnClick,
	          show: this.options.complex && this.options.complex.show,
	          popup: this.options.complex && this.options.complex.popup,
	          short: this.options.complex && this.options.complex.short
	        }
	      });
	      this.ui.complex.$on("remove", this.removeFiles.bind(this));
	      this.ui.complex.$on("filesAdded", this.onUploads.bind(this));
	    }
	  }, {
	    key: "renderStorage",
	    value: function renderStorage() {
	      var _this$options, _this$options$storage, _this$options2, _this$options2$storag;
	      this.ui.storage = new Storage({
	        target: this.options.storageEl,
	        props: {
	          files: this.files,
	          id: this.options.id,
	          selectMany: this.options.selectMany,
	          popup: (_this$options = this.options) === null || _this$options === void 0 ? void 0 : (_this$options$storage = _this$options.storage) === null || _this$options$storage === void 0 ? void 0 : _this$options$storage.popup,
	          show: (_this$options2 = this.options) === null || _this$options2 === void 0 ? void 0 : (_this$options2$storag = _this$options2.storage) === null || _this$options2$storag === void 0 ? void 0 : _this$options2$storag.show,
	          selectOnClick: this.options.selectOnClick
	        }
	      });
	      this.ui.storage.$on("remove", this.removeFiles.bind(this));
	    }
	  }, {
	    key: "renderUpload",
	    value: function renderUpload() {
	      var _this$options3, _this$options3$upload, _this$options4, _this$options4$upload, _this$options5, _this$options5$upload;
	      this.ui.upload = new Upload({
	        target: this.options.uploadEl,
	        props: {
	          id: this.options.id,
	          popup: (_this$options3 = this.options) === null || _this$options3 === void 0 ? void 0 : (_this$options3$upload = _this$options3.upload) === null || _this$options3$upload === void 0 ? void 0 : _this$options3$upload.popup,
	          show: (_this$options4 = this.options) === null || _this$options4 === void 0 ? void 0 : (_this$options4$upload = _this$options4.upload) === null || _this$options4$upload === void 0 ? void 0 : _this$options4$upload.show,
	          short: (_this$options5 = this.options) === null || _this$options5 === void 0 ? void 0 : (_this$options5$upload = _this$options5.upload) === null || _this$options5$upload === void 0 ? void 0 : _this$options5$upload.short
	        }
	      });
	      this.ui.upload.$on("filesAdded", this.onUploads.bind(this));
	      this.ui.upload.$on("remove", this.removeUpload.bind(this));
	    }
	  }, {
	    key: "loadFilesData",
	    value: function loadFilesData() {
	      var _this2 = this;
	      var reqOpts = {
	        store: this.options.store,
	        session: this.options.session
	      };
	      var req = this.getInterface().setFilter(reqOpts).setSorter({
	        fileID: -1
	      }).$list({});
	      return req.then(function (_ref) {
	        var status = _ref.status,
	          result = _ref.result;
	        if (status === "ok") {
	          _this2.storage.files.update(function (value) {
	            value.splice.apply(value, [0, value.length].concat(_toConsumableArray(result)));
	            return value;
	          });
	          return result;
	        } else {
	          return [];
	        }
	      }).catch(function (err) {
	        console.error(err, "Список загруженных файлов не доступен!");
	      });
	    }
	  }, {
	    key: "getInfo",
	    value: function getInfo(_id) {
	      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "get";
	      var reqOpts = {
	        store: this.options.store,
	        session: this.options.session
	      };
	      var req = this.getInterface().setFilter(reqOpts)["$" + action]({
	        _id: _id
	      });
	      return req.catch(function (err) {
	        console.error(err, "Информация о файле не доступна!");
	      });
	    }
	  }, {
	    key: "useGlobalInterface",
	    value: function useGlobalInterface() {
	      return this.options.useGlobalInterface && this.nrFile;
	    }
	  }, {
	    key: "getInterface",
	    value: function getInterface() {
	      return new netInterface(file_manifest, this.options);
	    }
	  }, {
	    key: "show",
	    value: function show() {
	      var _this3 = this;
	      return new Promise(function (resolve, reject) {
	        if (_this3.ui.storage) {
	          _this3.ui.storage.$set({
	            show: true,
	            onResolve: resolve,
	            onReject: reject
	          });
	        } else if (_this3.ui.complex) {
	          _this3.ui.complex.$set({
	            show: true,
	            onResolve: resolve,
	            onReject: reject
	          });
	        }
	      });
	    }
	  }, {
	    key: "removeFiles",
	    value: function () {
	      var _removeFiles = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(ev) {
	        var uuids, reqOpts, toRemove, _iterator, _step, uuid, file, result;
	        return regenerator.wrap(function _callee$(_context) {
	          while (1) switch (_context.prev = _context.next) {
	            case 0:
	              uuids = ev.detail.selected;
	              reqOpts = {
	                store: this.options.store,
	                session: this.options.session
	              };
	              toRemove = [];
	              _iterator = _createForOfIteratorHelper$1(uuids);
	              _context.prev = 4;
	              _iterator.s();
	            case 6:
	              if ((_step = _iterator.n()).done) {
	                _context.next = 22;
	                break;
	              }
	              uuid = _step.value;
	              file = this.findFileByUUID(uuid);
	              if (!file) {
	                _context.next = 20;
	                break;
	              }
	              _context.prev = 10;
	              _context.next = 13;
	              return this.getInterface().setFilter(reqOpts).$delete({
	                _id: file._id
	              });
	            case 13:
	              result = _context.sent;
	              if (this.isGood(result)) {
	                toRemove.push(file);
	              }
	              _context.next = 20;
	              break;
	            case 17:
	              _context.prev = 17;
	              _context.t0 = _context["catch"](10);
	              console.error(_context.t0);
	            case 20:
	              _context.next = 6;
	              break;
	            case 22:
	              _context.next = 27;
	              break;
	            case 24:
	              _context.prev = 24;
	              _context.t1 = _context["catch"](4);
	              _iterator.e(_context.t1);
	            case 27:
	              _context.prev = 27;
	              _iterator.f();
	              return _context.finish(27);
	            case 30:
	              toRemove.forEach(this.removeFromStore.bind(this));
	              this.resetSelected();
	            case 32:
	            case "end":
	              return _context.stop();
	          }
	        }, _callee, this, [[4, 24, 27, 30], [10, 17]]);
	      }));
	      function removeFiles(_x) {
	        return _removeFiles.apply(this, arguments);
	      }
	      return removeFiles;
	    }()
	  }, {
	    key: "findFileByUUID",
	    value: function findFileByUUID(uuid) {
	      var res = false;
	      this.files.forEach(function (file) {
	        if (file.uuid === uuid) {
	          res = file;
	        }
	      });
	      return res;
	    }
	  }, {
	    key: "isGood",
	    value: function isGood(res) {
	      return res.status && res.status === "ok";
	    }
	  }, {
	    key: "removeFromStore",
	    value: function removeFromStore(file) {
	      this.storage.files.update(function (list) {
	        var indx = list.indexOf(file);
	        if (indx > -1) {
	          list.splice(indx, 1);
	        }
	        return list;
	      });
	    }
	  }, {
	    key: "resetSelected",
	    value: function resetSelected() {
	      this.storage.selected.update(function (val) {
	        val.splice(0, val.length);
	        return val;
	      });
	    }
	  }, {
	    key: "onUploads",
	    value: function () {
	      var _onUploads = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(data) {
	        var files, _iterator2, _step2, file, preview, upload;
	        return regenerator.wrap(function _callee2$(_context2) {
	          while (1) switch (_context2.prev = _context2.next) {
	            case 0:
	              files = data.detail;
	              _iterator2 = _createForOfIteratorHelper$1(files);
	              _context2.prev = 2;
	              _iterator2.s();
	            case 4:
	              if ((_step2 = _iterator2.n()).done) {
	                _context2.next = 14;
	                break;
	              }
	              file = _step2.value;
	              _context2.next = 8;
	              return this.preloadFilePreview(file);
	            case 8:
	              preview = _context2.sent;
	              file.id = "fid_" + Math.random();
	              upload = {
	                id: file.id,
	                name: file.name,
	                size: file.size,
	                type: file.type,
	                file: file,
	                preview: preview
	              };
	              this.addToUploads(upload);
	            case 12:
	              _context2.next = 4;
	              break;
	            case 14:
	              _context2.next = 19;
	              break;
	            case 16:
	              _context2.prev = 16;
	              _context2.t0 = _context2["catch"](2);
	              _iterator2.e(_context2.t0);
	            case 19:
	              _context2.prev = 19;
	              _iterator2.f();
	              return _context2.finish(19);
	            case 22:
	            case "end":
	              return _context2.stop();
	          }
	        }, _callee2, this, [[2, 16, 19, 22]]);
	      }));
	      function onUploads(_x2) {
	        return _onUploads.apply(this, arguments);
	      }
	      return onUploads;
	    }()
	  }, {
	    key: "preloadFilePreview",
	    value: function preloadFilePreview(file) {
	      var _this4 = this;
	      return new Promise(function (res, rej) {
	        try {
	          var reader = new FileReader();
	          reader.onload = function (e) {
	            var cnvs = document.createElement("canvas");
	            cnvs.width = _this4.options.preview.width;
	            cnvs.height = _this4.options.preview.height;
	            var ctx = cnvs.getContext("2d"),
	              img = new Image();
	            img.onload = function () {
	              ctx.drawImage(img, 0, 0, _this4.options.preview.width, _this4.options.preview.height); // Or at whatever offset you like
	              res(cnvs.toDataURL("image/png"));
	            };
	            img.src = e.target.result;
	          };
	          reader.onerror = rej;
	          // Read in the image file as a data URL.
	          reader.readAsDataURL(file);
	        } catch (e) {
	          rej(e);
	        }
	      });
	    }
	  }, {
	    key: "addToUploads",
	    value: function addToUploads(upload) {
	      this.uploadFile(upload).catch(console.error);
	      this.storage.uploads.update(function (val) {
	        val.push(upload);
	        return val;
	      });
	    }
	  }, {
	    key: "removeUpload",
	    value: function removeUpload() {
	      //let ids = ev.detail.selected;
	    }
	  }, {
	    key: "uploadFile",
	    value: function uploadFile(upload) {
	      var _this5 = this;
	      var reqOpts = {
	        store: this.options.store,
	        session: this.options.session
	      };
	      return this.getInterface().setFilter(reqOpts).$create(reqOpts, false, true, upload.file).then(function (data) {
	        if (data.status === "ok") {
	          _this5.uploadFinished(upload);
	        }
	      });
	    }
	  }, {
	    key: "uploadFinished",
	    value: function uploadFinished(upload) {
	      this.storage.uploads.update(function (val) {
	        var toRemove;
	        val.forEach(function (item) {
	          if (item.id === upload.id) {
	            upload.uploaded = true;
	            toRemove = upload;
	          }
	        });
	        if (toRemove) {
	          val.splice(val.indexOf(toRemove), 1);
	        }
	        return val;
	      });
	      this.loadFilesData().catch(console.error);
	    }
	  }]);
	  return notStore;
	}();

	exports.ComplexComponent = Complex;
	exports.FileStores = file_stores;
	exports.StorageComponent = Storage;
	exports.UploadComponent = Upload;
	exports.notStore = notStore;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

}({}));
