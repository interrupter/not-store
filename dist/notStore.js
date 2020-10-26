var notStore = (function (exports) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

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

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
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

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
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
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
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
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

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
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return nativeGetOwnPropertyNames(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$5 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$5
	};

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var f$6 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$6
	};

	var defineProperty = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	var defineProperty$1 = objectDefineProperty.f;



	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
	    defineProperty$1(it, TO_STRING_TAG, { configurable: true, value: TAG });
	  }
	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
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
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var $forEach = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(SYMBOL);
	var ObjectPrototype = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty$1 = objectDefineProperty.f;
	var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore$1 = shared('wks');
	var QObject = global_1.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
	  nativeDefineProperty$1(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
	    nativeDefineProperty$1(ObjectPrototype, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return Object(it) instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPrimitive(P, true);
	  anObject(Attributes);
	  if (has(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty$1(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPrimitive(V, true);
	  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
	  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPrimitive(P, true);
	  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
	  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
	      result.push(AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.github.io/ecma262/#sec-symbol-constructor
	if (!nativeSymbol) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState(this).tag;
	  });

	  redefine($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid(description), description);
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
	  objectDefineProperty.f = $defineProperty;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  wellKnownSymbolWrapped.f = function (name) {
	    return wrap(wellKnownSymbol(name), name);
	  };

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState(this).description;
	      }
	    });
	    {
	      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
	    }
	  }
	}

	_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
	  defineWellKnownSymbol(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
	  // `Symbol.for` method
	  // https://tc39.github.io/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = String(key);
	    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
	    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  },
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.github.io/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return objectGetOwnPropertySymbols.f(toObject(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.github.io/ecma262/#sec-json.stringify
	if ($stringify) {
	  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
	    var symbol = $Symbol();
	    // MS Edge converts symbol values to JSON as {}
	    return $stringify([symbol]) != '[null]'
	      // WebKit converts symbol values to JSON as null
	      || $stringify({ a: symbol }) != '{}'
	      // V8 throws on boxed symbols
	      || $stringify(Object(symbol)) != '{}';
	  });

	  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
	    // eslint-disable-next-line no-unused-vars
	    stringify: function stringify(it, replacer, space) {
	      var args = [it];
	      var index = 1;
	      var $replacer;
	      while (arguments.length > index) args.push(arguments[index++]);
	      $replacer = replacer;
	      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	      if (!isArray(replacer)) replacer = function (key, value) {
	        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	        if (!isSymbol(value)) return value;
	      };
	      args[1] = replacer;
	      return $stringify.apply(null, args);
	    }
	  });
	}

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
	  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
	}
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;

	var defineProperty$2 = objectDefineProperty.f;


	var NativeSymbol = global_1.Symbol;

	if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var result = this instanceof SymbolWrapper
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };
	  copyConstructorProperties(SymbolWrapper, NativeSymbol);
	  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
	  symbolPrototype.constructor = SymbolWrapper;

	  var symbolToString = symbolPrototype.toString;
	  var native = String(NativeSymbol('test')) == 'Symbol(test)';
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  defineProperty$2(symbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = isObject(this) ? this.valueOf() : this;
	      var string = symbolToString.call(symbol);
	      if (has(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  _export({ global: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	// `Symbol.iterator` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol('iterator');

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var defineProperty$3 = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty$3(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $forEach$1 = arrayIteration.forEach;



	var STRICT_METHOD = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var iterators = {};

	var ITERATOR = wellKnownSymbol('iterator');
	var ArrayPrototype = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
	};

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG$1] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

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
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1]
	    || it['@@iterator']
	    || iterators[classof(it)];
	};

	// `Array.from` method implementation
	// https://tc39.github.io/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var C = typeof this == 'function' ? this : Array;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = iteratorMethod.call(O);
	    next = iterator.next;
	    result = new C();
	    for (;!(step = next.call(iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = toLength(O.length);
	    result = new C(length);
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
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
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
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var $indexOf = arrayIncludes.indexOf;



	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD$1 = arrayMethodIsStrict('indexOf');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$1 || !USES_TO_LENGTH$1 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype$1 = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype$1, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype$1[UNSCOPABLES][key] = true;
	};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype$1 = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype$1 : null;
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	var returnThis = function () { return this; };

	// `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype == undefined) IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if ( !has(IteratorPrototype, ITERATOR$3)) {
	  createNonEnumerableProperty(IteratorPrototype, ITERATOR$3, returnThis);
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$4 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$2 = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$4]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
	          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;
	    defaultIterator = function values() { return nativeIterator.call(this); };
	  }

	  // define iterator
	  if ( IterablePrototype[ITERATOR$4] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
	  }
	  iterators[NAME] = defaultIterator;

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$1 = internalState.set;
	var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.github.io/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState$1(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$1(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
	iterators.Arguments = iterators.Array;

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$2 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$2 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$2];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH$3 = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

	var max$2 = Math.max;
	var min$2 = Math.min;
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$3 }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject(this);
	    var len = toLength(O.length);
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
	      actualDeleteCount = min$2(max$2(toInteger(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
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
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var defineProperty$4 = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty$4(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var nativeAssign = Object.assign;
	var defineProperty$5 = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	var objectAssign = !nativeAssign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$5({}, 'a', {
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
	  // eslint-disable-next-line no-undef
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : nativeAssign;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	var nativePromiseConstructor = global_1.Promise;

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var SPECIES$3 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
	    defineProperty(Constructor, SPECIES$3, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var anInstance = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  } return it;
	};

	var iterate_1 = createCommonjsModule(function (module) {
	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
	  var boundFunction = functionBindContext(fn, that, AS_ENTRIES ? 2 : 1);
	  var iterator, iterFn, index, length, result, next, step;

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = toLength(iterable.length); length > index; index++) {
	        result = AS_ENTRIES
	          ? boundFunction(anObject(step = iterable[index])[0], step[1])
	          : boundFunction(iterable[index]);
	        if (result && result instanceof Result) return result;
	      } return new Result(false);
	    }
	    iterator = iterFn.call(iterable);
	  }

	  next = iterator.next;
	  while (!(step = next.call(iterator)).done) {
	    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
	    if (typeof result == 'object' && result && result instanceof Result) return result;
	  } return new Result(false);
	};

	iterate.stop = function (result) {
	  return new Result(true, result);
	};
	});

	var SPECIES$4 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

	var location = global_1.location;
	var set$1 = global_1.setImmediate;
	var clear = global_1.clearImmediate;
	var process$1 = global_1.process;
	var MessageChannel = global_1.MessageChannel;
	var Dispatch = global_1.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;

	var run = function (id) {
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
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

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global_1.postMessage(id + '', location.protocol + '//' + location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set$1 || !clear) {
	  set$1 = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (classofRaw(process$1) == 'process') {
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
	    channel.port1.onmessage = listener;
	    defer = functionBindContext(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (
	    global_1.addEventListener &&
	    typeof postMessage == 'function' &&
	    !global_1.importScripts &&
	    !fails(post) &&
	    location.protocol !== 'file:'
	  ) {
	    defer = post;
	    global_1.addEventListener('message', listener, false);
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

	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;

	var macrotask = task.set;


	var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
	var process$2 = global_1.process;
	var Promise$1 = global_1.Promise;
	var IS_NODE = classofRaw(process$2) == 'process';
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last, notify, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (IS_NODE && (parent = process$2.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) notify();
	        else last = undefined;
	        throw error;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // Node.js
	  if (IS_NODE) {
	    notify = function () {
	      process$2.nextTick(flush);
	    };
	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  } else if (MutationObserver && !engineIsIos) {
	    toggle = true;
	    node = document.createTextNode('');
	    new MutationObserver(flush).observe(node, { characterData: true });
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    then = promise.then;
	    notify = function () {
	      then.call(promise, flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global_1, flush);
	    };
	  }
	}

	var microtask = queueMicrotask || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last) last.next = task;
	  if (!head) {
	    head = task;
	    notify();
	  } last = task;
	};

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction$1(resolve);
	  this.reject = aFunction$1(reject);
	};

	// 25.4.1.5 NewPromiseCapability(C)
	var f$7 = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability = {
		f: f$7
	};

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var hostReportErrors = function (a, b) {
	  var console = global_1.console;
	  if (console && console.error) {
	    arguments.length === 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var task$1 = task.set;










	var SPECIES$5 = wellKnownSymbol('species');
	var PROMISE = 'Promise';
	var getInternalState$2 = internalState.get;
	var setInternalState$2 = internalState.set;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var PromiseConstructor = nativePromiseConstructor;
	var TypeError$1 = global_1.TypeError;
	var document$2 = global_1.document;
	var process$3 = global_1.process;
	var $fetch = getBuiltIn('fetch');
	var newPromiseCapability$1 = newPromiseCapability.f;
	var newGenericPromiseCapability = newPromiseCapability$1;
	var IS_NODE$1 = classofRaw(process$3) == 'process';
	var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	var FORCED$1 = isForced_1(PROMISE, function () {
	  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
	  if (!GLOBAL_CORE_JS_PROMISE) {
	    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	    // We can't detect it synchronously, so just check versions
	    if (engineV8Version === 66) return true;
	    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    if (!IS_NODE$1 && typeof PromiseRejectionEvent != 'function') return true;
	  }
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
	  // Detect correctness of subclassing with @@species support
	  var promise = PromiseConstructor.resolve(1);
	  var FakePromise = function (exec) {
	    exec(function () { /* empty */ }, function () { /* empty */ });
	  };
	  var constructor = promise.constructor = {};
	  constructor[SPECIES$5] = FakePromise;
	  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
	});

	var INCORRECT_ITERATION$1 = FORCED$1 || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
	});

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};

	var notify$1 = function (promise, state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  var chain = state.reactions;
	  microtask(function () {
	    var value = state.value;
	    var ok = state.state == FULFILLED;
	    var index = 0;
	    // variable length - can't use forEach
	    while (chain.length > index) {
	      var reaction = chain[index++];
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
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
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (error) {
	        if (domain && !exited) domain.exit();
	        reject(error);
	      }
	    }
	    state.reactions = [];
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(promise, state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$2.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global_1.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (handler = global_1['on' + name]) handler(event);
	  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform(function () {
	        if (IS_NODE$1) {
	          process$3.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    if (IS_NODE$1) {
	      process$3.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind = function (fn, promise, state, unwrap) {
	  return function (value) {
	    fn(promise, state, value, unwrap);
	  };
	};

	var internalReject = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify$1(promise, state, true);
	};

	var internalResolve = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
	    var then = isThenable(value);
	    if (then) {
	      microtask(function () {
	        var wrapper = { done: false };
	        try {
	          then.call(value,
	            bind(internalResolve, promise, wrapper, state),
	            bind(internalReject, promise, wrapper, state)
	          );
	        } catch (error) {
	          internalReject(promise, wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify$1(promise, state, false);
	    }
	  } catch (error) {
	    internalReject(promise, { done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED$1) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromiseConstructor, PROMISE);
	    aFunction$1(executor);
	    Internal.call(this);
	    var state = getInternalState$2(this);
	    try {
	      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
	    } catch (error) {
	      internalReject(this, state, error);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    setInternalState$2(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };
	  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = IS_NODE$1 ? process$3.domain : undefined;
	      state.parent = true;
	      state.reactions.push(reaction);
	      if (state.state != PENDING) notify$1(this, state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalState$2(promise);
	    this.promise = promise;
	    this.resolve = bind(internalResolve, promise, state);
	    this.reject = bind(internalReject, promise, state);
	  };
	  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if ( typeof nativePromiseConstructor == 'function') {
	    nativeThen = nativePromiseConstructor.prototype.then;

	    // wrap native Promise#then for native async functions
	    redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
	      var that = this;
	      return new PromiseConstructor(function (resolve, reject) {
	        nativeThen.call(that, resolve, reject);
	      }).then(onFulfilled, onRejected);
	    // https://github.com/zloirock/core-js/issues/640
	    }, { unsafe: true });

	    // wrap fetch result
	    if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
	      // eslint-disable-next-line no-unused-vars
	      fetch: function fetch(input /* , init */) {
	        return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
	      }
	    });
	  }
	}

	_export({ global: true, wrap: true, forced: FORCED$1 }, {
	  Promise: PromiseConstructor
	});

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	PromiseWrapper = getBuiltIn(PROMISE);

	// statics
	_export({ target: PROMISE, stat: true, forced: FORCED$1 }, {
	  // `Promise.reject` method
	  // https://tc39.github.io/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability$1(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});

	_export({ target: PROMISE, stat: true, forced:  FORCED$1 }, {
	  // `Promise.resolve` method
	  // https://tc39.github.io/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve( this, x);
	  }
	});

	_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION$1 }, {
	  // `Promise.all` method
	  // https://tc39.github.io/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate_1(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        $promiseResolve.call(C, promise).then(function (value) {
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
	  },
	  // `Promise.race` method
	  // https://tc39.github.io/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      iterate_1(iterable, function (promise) {
	        $promiseResolve.call(C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var TO_STRING = 'toString';
	var RegExpPrototype = RegExp.prototype;
	var nativeToString = RegExpPrototype[TO_STRING];

	var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = nativeToString.name != TO_STRING;

	// `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$2 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$2(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$2(true)
	};

	var charAt = stringMultibyte.charAt;



	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$3 = internalState.set;
	var getInternalState$3 = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState$3(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$3(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

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

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	for (var COLLECTION_NAME$1 in domIterables) {
	  var Collection$1 = global_1[COLLECTION_NAME$1];
	  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
	  if (CollectionPrototype$1) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype$1[ITERATOR$5] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$5, ArrayValues);
	    } catch (error) {
	      CollectionPrototype$1[ITERATOR$5] = ArrayValues;
	    }
	    if (!CollectionPrototype$1[TO_STRING_TAG$3]) {
	      createNonEnumerableProperty(CollectionPrototype$1, TO_STRING_TAG$3, COLLECTION_NAME$1);
	    }
	    if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
	        createNonEnumerableProperty(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
	      }
	    }
	  }
	}

	var runtime_1 = createCommonjsModule(function (module) {
	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	var runtime = (function (exports) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  function define(obj, key, value) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	    return obj[key];
	  }
	  try {
	    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
	    define({}, "");
	  } catch (err) {
	    define = function(obj, key, value) {
	      return obj[key] = value;
	    };
	  }

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  exports.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunction.displayName = define(
	    GeneratorFunctionPrototype,
	    toStringTagSymbol,
	    "GeneratorFunction"
	  );

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      define(prototype, method, function(arg) {
	        return this._invoke(method, arg);
	      });
	    });
	  }

	  exports.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  exports.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      define(genFun, toStringTagSymbol, "GeneratorFunction");
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  exports.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator, PromiseImpl) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return PromiseImpl.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return PromiseImpl.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration.
	          result.value = unwrapped;
	          resolve(result);
	        }, function(error) {
	          // If a rejected Promise was yielded, throw the rejection back
	          // into the async generator function so it can be handled there.
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new PromiseImpl(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };
	  exports.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	    if (PromiseImpl === void 0) PromiseImpl = Promise;

	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList),
	      PromiseImpl
	    );

	    return exports.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        // Note: ["return"] must be used for ES3 parsing compatibility.
	        if (delegate.iterator["return"]) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined$1;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  define(Gp, toStringTagSymbol, "Generator");

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  exports.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined$1;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  exports.values = values;

	  function doneResult() {
	    return { value: undefined$1, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined$1;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined$1;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined$1;
	      }

	      return ContinueSentinel;
	    }
	  };

	  // Regardless of whether this script is executing as a CommonJS module
	  // or not, return the runtime object so that we can declare the variable
	  // regeneratorRuntime in the outer scope, which allows this module to be
	  // injected easily by `bin/regenerator --include-runtime script.js`.
	  return exports;

	}(
	  // If this script is executing as a CommonJS module, use module.exports
	  // as the regeneratorRuntime namespace. Otherwise create a new empty
	  // object. Either way, the resulting object will be used to initialize
	  // the regeneratorRuntime variable at the top of this file.
	   module.exports 
	));

	try {
	  regeneratorRuntime = runtime;
	} catch (accidentalStrictMode) {
	  // This module should not be running in strict mode, so the above
	  // assignment should always work unless something is misconfigured. Just
	  // in case runtime.js accidentally runs in strict mode, we can escape
	  // strict mode using a global Function call. This could conceivably fail
	  // if a Content Security Policy forbids using Function, but in that case
	  // the proper solution is to fix the accidental strict mode problem. If
	  // you've misconfigured your bundler to force strict mode and applied a
	  // CSP to forbid Function, and you're not willing to fix either of those
	  // problems, please detail your unique predicament in a GitHub issue.
	  Function("r", "regeneratorRuntime = r")(runtime);
	}
	});

	var regenerator = runtime_1;

	var runtime = createCommonjsModule(function (module) {
	/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */

	!(function(global) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime =  module.exports ;

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] =
	    GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  runtime.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return Promise.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration. If the Promise is rejected, however, the
	          // result for this iteration will be rejected with the same
	          // reason. Note that rejections of yielded Promises are not
	          // thrown back into the generator function, as is the case
	          // when an awaited Promise is rejected. This difference in
	          // behavior between yield and await is important, because it
	          // allows the consumer to decide what to do with the yielded
	          // rejection (swallow it and continue, manually .throw it back
	          // into the generator, abandon iteration, whatever). With
	          // await, by contrast, there is no opportunity to examine the
	          // rejection reason outside the generator function, so the
	          // only option is to throw it from the await expression, and
	          // let the generator function handle the exception.
	          result.value = unwrapped;
	          resolve(result);
	        }, reject);
	      }
	    }

	    if (typeof global.process === "object" && global.process.domain) {
	      invoke = global.process.domain.bind(invoke);
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };
	  runtime.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );

	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        if (delegate.iterator.return) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined$1;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[toStringTagSymbol] = "Generator";

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined$1;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined$1, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined$1;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined$1;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined$1;
	      }

	      return ContinueSentinel;
	    }
	  };
	})(
	  // Among the various tricks for obtaining a reference to the global
	  // object, this seems to be the most reliable technique that does not
	  // use indirect eval (which violates Content Security Policy).
	  typeof commonjsGlobal === "object" ? commonjsGlobal :
	  typeof window === "object" ? window :
	  typeof self === "object" ? self : commonjsGlobal
	);
	});

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

	var asyncToGenerator = _asyncToGenerator;

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) {
	    arr2[i] = arr[i];
	  }

	  return arr2;
	}

	var arrayLikeToArray = _arrayLikeToArray;

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return arrayLikeToArray(arr);
	}

	var arrayWithoutHoles = _arrayWithoutHoles;

	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
	}

	var iterableToArray = _iterableToArray;

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
	}

	var unsupportedIterableToArray = _unsupportedIterableToArray;

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	var nonIterableSpread = _nonIterableSpread;

	function _toConsumableArray(arr) {
	  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
	}

	var toConsumableArray = _toConsumableArray;

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	var classCallCheck = _classCallCheck;

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	var createClass = _createClass;

	function noop() { }
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
	function is_empty(obj) {
	    return Object.keys(obj).length === 0;
	}
	function null_to_empty(value) {
	    return value == null ? '' : value;
	}

	function append(target, node) {
	    target.appendChild(node);
	}
	function insert(target, node, anchor) {
	    target.insertBefore(node, anchor || null);
	}
	function detach(node) {
	    node.parentNode.removeChild(node);
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
	function empty() {
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
	    if (text.wholeText !== data)
	        text.data = data;
	}
	function custom_event(type, detail) {
	    const e = document.createEvent('CustomEvent');
	    e.initCustomEvent(type, false, false, detail);
	    return e;
	}

	let current_component;
	function set_current_component(component) {
	    current_component = component;
	}
	function get_current_component() {
	    if (!current_component)
	        throw new Error(`Function called outside component initialization`);
	    return current_component;
	}
	function onMount(fn) {
	    get_current_component().$$.on_mount.push(fn);
	}
	function createEventDispatcher() {
	    const component = get_current_component();
	    return (type, detail) => {
	        const callbacks = component.$$.callbacks[type];
	        if (callbacks) {
	            // TODO are there situations where events could be dispatched
	            // in a server (non-DOM) environment?
	            const event = custom_event(type, detail);
	            callbacks.slice().forEach(fn => {
	                fn.call(component, event);
	            });
	        }
	    };
	}

	const dirty_components = [];
	const binding_callbacks = [];
	const render_callbacks = [];
	const flush_callbacks = [];
	const resolved_promise = Promise.resolve();
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
	let flushing = false;
	const seen_callbacks = new Set();
	function flush$1() {
	    if (flushing)
	        return;
	    flushing = true;
	    do {
	        // first, call beforeUpdate functions
	        // and update components
	        for (let i = 0; i < dirty_components.length; i += 1) {
	            const component = dirty_components[i];
	            set_current_component(component);
	            update(component.$$);
	        }
	        set_current_component(null);
	        dirty_components.length = 0;
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
	    flushing = false;
	    seen_callbacks.clear();
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
	            block.p(child_ctx, dirty);
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
	    return new_blocks;
	}

	function bind$1(component, name, callback) {
	    const index = component.$$.props[name];
	    if (index !== undefined) {
	        component.$$.bound[index] = callback;
	        callback(component.$$.ctx[index]);
	    }
	}
	function create_component(block) {
	    block && block.c();
	}
	function mount_component(component, target, anchor) {
	    const { fragment, on_mount, on_destroy, after_update } = component.$$;
	    fragment && fragment.m(target, anchor);
	    // onMount happens before the initial afterUpdate
	    add_render_callback(() => {
	        const new_on_destroy = on_mount.map(run$1).filter(is_function);
	        if (on_destroy) {
	            on_destroy.push(...new_on_destroy);
	        }
	        else {
	            // Edge case - component was destroyed immediately,
	            // most likely as a result of a binding initialising
	            run_all(new_on_destroy);
	        }
	        component.$$.on_mount = [];
	    });
	    after_update.forEach(add_render_callback);
	}
	function destroy_component(component, detaching) {
	    const $$ = component.$$;
	    if ($$.fragment !== null) {
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
	function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
	    const parent_component = current_component;
	    set_current_component(component);
	    const prop_values = options.props || {};
	    const $$ = component.$$ = {
	        fragment: null,
	        ctx: null,
	        // state
	        props,
	        update: noop,
	        not_equal,
	        bound: blank_object(),
	        // lifecycle
	        on_mount: [],
	        on_destroy: [],
	        before_update: [],
	        after_update: [],
	        context: new Map(parent_component ? parent_component.$$.context : []),
	        // everything else
	        callbacks: blank_object(),
	        dirty,
	        skip_bound: false
	    };
	    let ready = false;
	    $$.ctx = instance
	        ? instance(component, prop_values, (i, ret, ...rest) => {
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
	        mount_component(component, options.target, options.anchor);
	        flush$1();
	    }
	    set_current_component(parent_component);
	}
	class SvelteComponent {
	    $destroy() {
	        destroy_component(this, 1);
	        this.$destroy = noop;
	    }
	    $on(type, callback) {
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

	/* src/standalone/confirm.svelte generated by Svelte v3.29.0 */

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
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) detach(div2);
				mounted = false;
				run_all(dispose);
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let approved = false;
		let { title = "title" } = $$props;
		let { text = "text" } = $$props;
		let { approval = "approval" } = $$props;

		let { resolve = () => {
			
		} } = $$props;

		let { reject = () => {
			
		} } = $$props;

		let { label = { approve: "Да", disapprove: "Нет" } } = $$props;

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
			if ("title" in $$props) $$invalidate(0, title = $$props.title);
			if ("text" in $$props) $$invalidate(1, text = $$props.text);
			if ("approval" in $$props) $$invalidate(2, approval = $$props.approval);
			if ("resolve" in $$props) $$invalidate(8, resolve = $$props.resolve);
			if ("reject" in $$props) $$invalidate(9, reject = $$props.reject);
			if ("label" in $$props) $$invalidate(3, label = $$props.label);
		};

		let disabled;

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
	    classCallCheck(this, Confirmation);
	  }

	  createClass(Confirmation, null, [{
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
	 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
	 */
	function writable(value, start = noop) {
	    let stop;
	    const subscribers = [];
	    function set(new_value) {
	        if (safe_not_equal(value, new_value)) {
	            value = new_value;
	            if (stop) { // store is ready
	                const run_queue = !subscriber_queue.length;
	                for (let i = 0; i < subscribers.length; i += 1) {
	                    const s = subscribers[i];
	                    s[1]();
	                    subscriber_queue.push(s, value);
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
	    function subscribe(run, invalidate = noop) {
	        const subscriber = [run, invalidate];
	        subscribers.push(subscriber);
	        if (subscribers.length === 1) {
	            stop = start(set) || noop;
	        }
	        run(value);
	        return () => {
	            const index = subscribers.indexOf(subscriber);
	            if (index !== -1) {
	                subscribers.splice(index, 1);
	            }
	            if (subscribers.length === 0) {
	                stop();
	                stop = null;
	            }
	        };
	    }
	    return { set, update, subscribe };
	}

	var ALL = {};

	function exist(key) {
	  return Object.prototype.hasOwnProperty.call(ALL, key);
	}

	function get$1(key) {
	  if (exist(key)) {
	    return ALL[key];
	  } else {
	    return false;
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

	var $filter = arrayIteration.filter;



	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('filter');
	// Edge 14- issue
	var USES_TO_LENGTH$4 = arrayMethodUsesToLength('filter');

	// `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$4 }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;


	var FAILS_ON_PRIMITIVES = fails(function () { nativeGetOwnPropertyDescriptor$2(1); });
	var FORCED$2 = !descriptors || FAILS_ON_PRIMITIVES;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	_export({ target: 'Object', stat: true, forced: FORCED$2, sham: !descriptors }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
	    return nativeGetOwnPropertyDescriptor$2(toIndexedObject(it), key);
	  }
	});

	// `Object.getOwnPropertyDescriptors` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	_export({ target: 'Object', stat: true, sham: !descriptors }, {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
	    var O = toIndexedObject(object);
	    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	    var keys = ownKeys(O);
	    var result = {};
	    var index = 0;
	    var key, descriptor;
	    while (keys.length > index) {
	      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
	      if (descriptor !== undefined) createProperty(result, key, descriptor);
	    }
	    return result;
	  }
	});

	var FAILS_ON_PRIMITIVES$1 = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1 }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	var defineProperty$6 = _defineProperty;

	function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { defineProperty$6(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	var _canceled = Symbol('canceled');
	/**
	 * All events fired by draggable inherit this class. You can call `cancel()` to
	 * cancel a specific event or you can check if an event has been canceled by
	 * calling `canceled()`.
	 * @abstract
	 * @class AbstractEvent
	 * @module AbstractEvent
	 */


	var AbstractEvent = /*#__PURE__*/function () {
	  /**
	   * Event type
	   * @static
	   * @abstract
	   * @property type
	   * @type {String}
	   */

	  /**
	   * Event cancelable
	   * @static
	   * @abstract
	   * @property cancelable
	   * @type {Boolean}
	   */

	  /**
	   * AbstractEvent constructor.
	   * @constructs AbstractEvent
	   * @param {object} data - Event data
	   */
	  function AbstractEvent(data) {
	    classCallCheck(this, AbstractEvent);

	    this[_canceled] = false;
	    this.data = data;
	  }
	  /**
	   * Read-only type
	   * @abstract
	   * @return {String}
	   */


	  createClass(AbstractEvent, [{
	    key: "cancel",

	    /**
	     * Cancels the event instance
	     * @abstract
	     */
	    value: function cancel() {
	      this[_canceled] = true;
	    }
	    /**
	     * Check if event has been canceled
	     * @abstract
	     * @return {Boolean}
	     */

	  }, {
	    key: "canceled",
	    value: function canceled() {
	      return Boolean(this[_canceled]);
	    }
	    /**
	     * Returns new event instance with existing event data.
	     * This method allows for overriding of event data.
	     * @param {Object} data
	     * @return {AbstractEvent}
	     */

	  }, {
	    key: "clone",
	    value: function clone(data) {
	      return new this.constructor(_objectSpread(_objectSpread({}, this.data), data));
	    }
	  }, {
	    key: "type",
	    get: function get() {
	      return this.constructor.type;
	    }
	    /**
	     * Read-only cancelable
	     * @abstract
	     * @return {Boolean}
	     */

	  }, {
	    key: "cancelable",
	    get: function get() {
	      return this.constructor.cancelable;
	    }
	  }]);

	  return AbstractEvent;
	}();

	defineProperty$6(AbstractEvent, "type", 'event');

	defineProperty$6(AbstractEvent, "cancelable", false);

	/**
	 * All draggable plugins inherit from this class.
	 * @abstract
	 * @class AbstractPlugin
	 * @module AbstractPlugin
	 */
	var AbstractPlugin = /*#__PURE__*/function () {
	  /**
	   * AbstractPlugin constructor.
	   * @constructs AbstractPlugin
	   * @param {Draggable} draggable - Draggable instance
	   */
	  function AbstractPlugin(draggable) {
	    classCallCheck(this, AbstractPlugin);

	    /**
	     * Draggable instance
	     * @property draggable
	     * @type {Draggable}
	     */
	    this.draggable = draggable;
	  }
	  /**
	   * Override to add listeners
	   * @abstract
	   */


	  createClass(AbstractPlugin, [{
	    key: "attach",
	    value: function attach() {
	      throw new Error('Not Implemented');
	    }
	    /**
	     * Override to remove listeners
	     * @abstract
	     */

	  }, {
	    key: "detach",
	    value: function detach() {
	      throw new Error('Not Implemented');
	    }
	  }]);

	  return AbstractPlugin;
	}();

	var $includes = arrayIncludes.includes;



	var USES_TO_LENGTH$5 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true, forced: !USES_TO_LENGTH$5 }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  } return it;
	};

	var MATCH$1 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) { /* empty */ }
	  } return false;
	};

	// `String.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~String(requireObjectCoercible(this))
	      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { defineProperty$6(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	/**
	 * Base sensor class. Extend from this class to create a new or custom sensor
	 * @class Sensor
	 * @module Sensor
	 */
	var Sensor = /*#__PURE__*/function () {
	  /**
	   * Sensor constructor.
	   * @constructs Sensor
	   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
	   * @param {Object} options - Options
	   */
	  function Sensor() {
	    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    classCallCheck(this, Sensor);

	    /**
	     * Current containers
	     * @property containers
	     * @type {HTMLElement[]}
	     */
	    this.containers = toConsumableArray(containers);
	    /**
	     * Current options
	     * @property options
	     * @type {Object}
	     */

	    this.options = _objectSpread$1({}, options);
	    /**
	     * Current drag state
	     * @property dragging
	     * @type {Boolean}
	     */

	    this.dragging = false;
	    /**
	     * Current container
	     * @property currentContainer
	     * @type {HTMLElement}
	     */

	    this.currentContainer = null;
	    /**
	     * The event of the initial sensor down
	     * @property startEvent
	     * @type {Event}
	     */

	    this.startEvent = null;
	  }
	  /**
	   * Attaches sensors event listeners to the DOM
	   * @return {Sensor}
	   */


	  createClass(Sensor, [{
	    key: "attach",
	    value: function attach() {
	      return this;
	    }
	    /**
	     * Detaches sensors event listeners to the DOM
	     * @return {Sensor}
	     */

	  }, {
	    key: "detach",
	    value: function detach() {
	      return this;
	    }
	    /**
	     * Adds container to this sensor instance
	     * @param {...HTMLElement} containers - Containers you want to add to this sensor
	     * @example draggable.addContainer(document.body)
	     */

	  }, {
	    key: "addContainer",
	    value: function addContainer() {
	      for (var _len = arguments.length, containers = new Array(_len), _key = 0; _key < _len; _key++) {
	        containers[_key] = arguments[_key];
	      }

	      this.containers = [].concat(toConsumableArray(this.containers), containers);
	    }
	    /**
	     * Removes container from this sensor instance
	     * @param {...HTMLElement} containers - Containers you want to remove from this sensor
	     * @example draggable.removeContainer(document.body)
	     */

	  }, {
	    key: "removeContainer",
	    value: function removeContainer() {
	      for (var _len2 = arguments.length, containers = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        containers[_key2] = arguments[_key2];
	      }

	      this.containers = this.containers.filter(function (container) {
	        return !containers.includes(container);
	      });
	    }
	    /**
	     * Triggers event on target element
	     * @param {HTMLElement} element - Element to trigger event on
	     * @param {SensorEvent} sensorEvent - Sensor event to trigger
	     */

	  }, {
	    key: "trigger",
	    value: function trigger(element, sensorEvent) {
	      var event = document.createEvent('Event');
	      event.detail = sensorEvent;
	      event.initEvent(sensorEvent.type, true, true);
	      element.dispatchEvent(event);
	      this.lastEvent = sensorEvent;
	      return sensorEvent;
	    }
	  }]);

	  return Sensor;
	}();

	var slice = [].slice;
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!(argsLength in factories)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    // eslint-disable-next-line no-new-func
	    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	var functionBind = Function.bind || function bind(that /* , ...args */) {
	  var fn = aFunction$1(this);
	  var partArgs = slice.call(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = partArgs.concat(slice.call(arguments));
	    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
	  };
	  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
	  return boundFunction;
	};

	var nativeConstruct = getBuiltIn('Reflect', 'construct');

	// `Reflect.construct` method
	// https://tc39.github.io/ecma262/#sec-reflect.construct
	// MS Edge supports only 2 arguments and argumentsList argument is optional
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	var NEW_TARGET_BUG = fails(function () {
	  function F() { /* empty */ }
	  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
	});
	var ARGS_BUG = !fails(function () {
	  nativeConstruct(function () { /* empty */ });
	});
	var FORCED$3 = NEW_TARGET_BUG || ARGS_BUG;

	_export({ target: 'Reflect', stat: true, forced: FORCED$3, sham: FORCED$3 }, {
	  construct: function construct(Target, args /* , newTarget */) {
	    aFunction$1(Target);
	    anObject(args);
	    var newTarget = arguments.length < 3 ? Target : aFunction$1(arguments[2]);
	    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
	    if (Target == newTarget) {
	      // w/o altered newTarget, optimization for 0-4 arguments
	      switch (args.length) {
	        case 0: return new Target();
	        case 1: return new Target(args[0]);
	        case 2: return new Target(args[0], args[1]);
	        case 3: return new Target(args[0], args[1], args[2]);
	        case 4: return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      $args.push.apply($args, args);
	      return new (functionBind.apply(Target, $args))();
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto = newTarget.prototype;
	    var instance = objectCreate(isObject(proto) ? proto : Object.prototype);
	    var result = Function.apply.call(Target, instance, args);
	    return isObject(result) ? result : instance;
	  }
	});

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	var assertThisInitialized = _assertThisInitialized;

	var setPrototypeOf = createCommonjsModule(function (module) {
	function _setPrototypeOf(o, p) {
	  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	module.exports = _setPrototypeOf;
	});

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) setPrototypeOf(subClass, superClass);
	}

	var inherits = _inherits;

	var _typeof_1 = createCommonjsModule(function (module) {
	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    module.exports = _typeof = function _typeof(obj) {
	      return typeof obj;
	    };
	  } else {
	    module.exports = _typeof = function _typeof(obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	module.exports = _typeof;
	});

	function _possibleConstructorReturn(self, call) {
	  if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
	    return call;
	  }

	  return assertThisInitialized(self);
	}

	var possibleConstructorReturn = _possibleConstructorReturn;

	var getPrototypeOf = createCommonjsModule(function (module) {
	function _getPrototypeOf(o) {
	  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	module.exports = _getPrototypeOf;
	});

	var matchFunction = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;
	/**
	 * Get the closest parent element of a given element that matches the given
	 * selector string or matching function
	 *
	 * @param {Element} element The child element to find a parent of
	 * @param {String|Function} selector The string or function to use to match
	 *     the parent element
	 * @return {Element|null}
	 */

	function closest(element, value) {
	  if (!element) {
	    return null;
	  }

	  var selector = value;
	  var callback = value;
	  var nodeList = value;
	  var singleElement = value;
	  var isSelector = Boolean(typeof value === 'string');
	  var isFunction = Boolean(typeof value === 'function');
	  var isNodeList = Boolean(value instanceof NodeList || value instanceof Array);
	  var isElement = Boolean(value instanceof HTMLElement);

	  function conditionFn(currentElement) {
	    if (!currentElement) {
	      return currentElement;
	    } else if (isSelector) {
	      return matchFunction.call(currentElement, selector);
	    } else if (isNodeList) {
	      return toConsumableArray(nodeList).includes(currentElement);
	    } else if (isElement) {
	      return singleElement === currentElement;
	    } else if (isFunction) {
	      return callback(currentElement);
	    } else {
	      return null;
	    }
	  }

	  var current = element;

	  do {
	    current = current.correspondingUseElement || current.correspondingElement || current;

	    if (conditionFn(current)) {
	      return current;
	    }

	    current = current.parentNode;
	  } while (current && current !== document.body && current !== document);

	  if (isSelector) {
	    var res = document.body.querySelector(selector);

	    if (res) {
	      return res;
	    }
	  }

	  return null;
	}

	/**
	 * Returns the distance between two points
	 * @param  {Number} x1 The X position of the first point
	 * @param  {Number} y1 The Y position of the first point
	 * @param  {Number} x2 The X position of the second point
	 * @param  {Number} y2 The Y position of the second point
	 * @return {Number}
	 */
	function distance(x1, y1, x2, y2) {
	  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}

	/**
	 * Returns the first touch event found in touches or changedTouches of a touch events.
	 * @param {TouchEvent} event a touch event
	 * @return {Touch} a touch object
	 */
	function touchCoords() {
	  var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	  var touches = event.touches,
	      changedTouches = event.changedTouches;
	  return touches && touches[0] || changedTouches && changedTouches[0];
	}

	function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	/**
	 * Base sensor event
	 * @class SensorEvent
	 * @module SensorEvent
	 * @extends AbstractEvent
	 */

	var SensorEvent = /*#__PURE__*/function (_AbstractEvent) {
	  inherits(SensorEvent, _AbstractEvent);

	  var _super = _createSuper(SensorEvent);

	  function SensorEvent() {
	    classCallCheck(this, SensorEvent);

	    return _super.apply(this, arguments);
	  }

	  createClass(SensorEvent, [{
	    key: "originalEvent",

	    /**
	     * Original browser event that triggered a sensor
	     * @property originalEvent
	     * @type {Event}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.originalEvent;
	    }
	    /**
	     * Normalized clientX for both touch and mouse events
	     * @property clientX
	     * @type {Number}
	     * @readonly
	     */

	  }, {
	    key: "clientX",
	    get: function get() {
	      return this.data.clientX;
	    }
	    /**
	     * Normalized clientY for both touch and mouse events
	     * @property clientY
	     * @type {Number}
	     * @readonly
	     */

	  }, {
	    key: "clientY",
	    get: function get() {
	      return this.data.clientY;
	    }
	    /**
	     * Normalized target for both touch and mouse events
	     * Returns the element that is behind cursor or touch pointer
	     * @property target
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "target",
	    get: function get() {
	      return this.data.target;
	    }
	    /**
	     * Container that initiated the sensor
	     * @property container
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "container",
	    get: function get() {
	      return this.data.container;
	    }
	    /**
	     * Trackpad pressure
	     * @property pressure
	     * @type {Number}
	     * @readonly
	     */

	  }, {
	    key: "pressure",
	    get: function get() {
	      return this.data.pressure;
	    }
	  }]);

	  return SensorEvent;
	}(AbstractEvent);
	/**
	 * Drag start sensor event
	 * @class DragStartSensorEvent
	 * @module DragStartSensorEvent
	 * @extends SensorEvent
	 */

	var DragStartSensorEvent = /*#__PURE__*/function (_SensorEvent) {
	  inherits(DragStartSensorEvent, _SensorEvent);

	  var _super2 = _createSuper(DragStartSensorEvent);

	  function DragStartSensorEvent() {
	    classCallCheck(this, DragStartSensorEvent);

	    return _super2.apply(this, arguments);
	  }

	  return DragStartSensorEvent;
	}(SensorEvent);
	/**
	 * Drag move sensor event
	 * @class DragMoveSensorEvent
	 * @module DragMoveSensorEvent
	 * @extends SensorEvent
	 */

	defineProperty$6(DragStartSensorEvent, "type", 'drag:start');

	var DragMoveSensorEvent = /*#__PURE__*/function (_SensorEvent2) {
	  inherits(DragMoveSensorEvent, _SensorEvent2);

	  var _super3 = _createSuper(DragMoveSensorEvent);

	  function DragMoveSensorEvent() {
	    classCallCheck(this, DragMoveSensorEvent);

	    return _super3.apply(this, arguments);
	  }

	  return DragMoveSensorEvent;
	}(SensorEvent);
	/**
	 * Drag stop sensor event
	 * @class DragStopSensorEvent
	 * @module DragStopSensorEvent
	 * @extends SensorEvent
	 */

	defineProperty$6(DragMoveSensorEvent, "type", 'drag:move');

	var DragStopSensorEvent = /*#__PURE__*/function (_SensorEvent3) {
	  inherits(DragStopSensorEvent, _SensorEvent3);

	  var _super4 = _createSuper(DragStopSensorEvent);

	  function DragStopSensorEvent() {
	    classCallCheck(this, DragStopSensorEvent);

	    return _super4.apply(this, arguments);
	  }

	  return DragStopSensorEvent;
	}(SensorEvent);
	/**
	 * Drag pressure sensor event
	 * @class DragPressureSensorEvent
	 * @module DragPressureSensorEvent
	 * @extends SensorEvent
	 */

	defineProperty$6(DragStopSensorEvent, "type", 'drag:stop');

	var DragPressureSensorEvent = /*#__PURE__*/function (_SensorEvent4) {
	  inherits(DragPressureSensorEvent, _SensorEvent4);

	  var _super5 = _createSuper(DragPressureSensorEvent);

	  function DragPressureSensorEvent() {
	    classCallCheck(this, DragPressureSensorEvent);

	    return _super5.apply(this, arguments);
	  }

	  return DragPressureSensorEvent;
	}(SensorEvent);

	defineProperty$6(DragPressureSensorEvent, "type", 'drag:pressure');

	function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	var onContextMenuWhileDragging = Symbol('onContextMenuWhileDragging');
	var onMouseDown = Symbol('onMouseDown');
	var onMouseMove = Symbol('onMouseMove');
	var onMouseUp = Symbol('onMouseUp');
	var startDrag = Symbol('startDrag');
	var onDistanceChange = Symbol('onDistanceChange');
	/**
	 * This sensor picks up native browser mouse events and dictates drag operations
	 * @class MouseSensor
	 * @module MouseSensor
	 * @extends Sensor
	 */

	var MouseSensor = /*#__PURE__*/function (_Sensor) {
	  inherits(MouseSensor, _Sensor);

	  var _super = _createSuper$1(MouseSensor);

	  /**
	   * MouseSensor constructor.
	   * @constructs MouseSensor
	   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
	   * @param {Object} options - Options
	   */
	  function MouseSensor() {
	    var _this;

	    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    classCallCheck(this, MouseSensor);

	    _this = _super.call(this, containers, options);
	    /**
	     * Mouse down timer which will end up triggering the drag start operation
	     * @property mouseDownTimeout
	     * @type {Number}
	     */

	    _this.mouseDownTimeout = null;
	    /**
	     * Save pageX coordinates for delay drag
	     * @property {Numbre} pageX
	     * @private
	     */

	    _this.pageX = null;
	    /**
	     * Save pageY coordinates for delay drag
	     * @property {Numbre} pageY
	     * @private
	     */

	    _this.pageY = null;
	    _this[onContextMenuWhileDragging] = _this[onContextMenuWhileDragging].bind(assertThisInitialized(_this));
	    _this[onMouseDown] = _this[onMouseDown].bind(assertThisInitialized(_this));
	    _this[onMouseMove] = _this[onMouseMove].bind(assertThisInitialized(_this));
	    _this[onMouseUp] = _this[onMouseUp].bind(assertThisInitialized(_this));
	    _this[startDrag] = _this[startDrag].bind(assertThisInitialized(_this));
	    _this[onDistanceChange] = _this[onDistanceChange].bind(assertThisInitialized(_this));
	    return _this;
	  }
	  /**
	   * Attaches sensors event listeners to the DOM
	   */


	  createClass(MouseSensor, [{
	    key: "attach",
	    value: function attach() {
	      document.addEventListener('mousedown', this[onMouseDown], true);
	    }
	    /**
	     * Detaches sensors event listeners to the DOM
	     */

	  }, {
	    key: "detach",
	    value: function detach() {
	      document.removeEventListener('mousedown', this[onMouseDown], true);
	    }
	    /**
	     * Mouse down handler
	     * @private
	     * @param {Event} event - Mouse down event
	     */

	  }, {
	    key: onMouseDown,
	    value: function value(event) {
	      var _this2 = this;

	      if (event.button !== 0 || event.ctrlKey || event.metaKey) {
	        return;
	      }

	      var container = closest(event.target, this.containers);

	      if (!container) {
	        return;
	      }

	      var _this$options$delay = this.options.delay,
	          delay = _this$options$delay === void 0 ? 0 : _this$options$delay;
	      var pageX = event.pageX,
	          pageY = event.pageY;
	      Object.assign(this, {
	        pageX: pageX,
	        pageY: pageY
	      });
	      this.onMouseDownAt = Date.now();
	      this.startEvent = event;
	      this.currentContainer = container;
	      document.addEventListener('mouseup', this[onMouseUp]);
	      document.addEventListener('dragstart', preventNativeDragStart);
	      document.addEventListener('mousemove', this[onDistanceChange]);
	      this.mouseDownTimeout = window.setTimeout(function () {
	        _this2[onDistanceChange]({
	          pageX: _this2.pageX,
	          pageY: _this2.pageY
	        });
	      }, delay);
	    }
	    /**
	     * Start the drag
	     * @private
	     */

	  }, {
	    key: startDrag,
	    value: function value() {
	      var startEvent = this.startEvent;
	      var container = this.currentContainer;
	      var dragStartEvent = new DragStartSensorEvent({
	        clientX: startEvent.clientX,
	        clientY: startEvent.clientY,
	        target: startEvent.target,
	        container: container,
	        originalEvent: startEvent
	      });
	      this.trigger(this.currentContainer, dragStartEvent);
	      this.dragging = !dragStartEvent.canceled();

	      if (this.dragging) {
	        document.addEventListener('contextmenu', this[onContextMenuWhileDragging], true);
	        document.addEventListener('mousemove', this[onMouseMove]);
	      }
	    }
	    /**
	     * Detect change in distance, starting drag when both
	     * delay and distance requirements are met
	     * @private
	     * @param {Event} event - Mouse move event
	     */

	  }, {
	    key: onDistanceChange,
	    value: function value(event) {
	      var pageX = event.pageX,
	          pageY = event.pageY;
	      var _this$options = this.options,
	          delay = _this$options.delay,
	          distance$1 = _this$options.distance;
	      var startEvent = this.startEvent;
	      Object.assign(this, {
	        pageX: pageX,
	        pageY: pageY
	      });

	      if (!this.currentContainer) {
	        return;
	      }

	      var timeElapsed = Date.now() - this.onMouseDownAt;
	      var distanceTravelled = distance(startEvent.pageX, startEvent.pageY, pageX, pageY) || 0;

	      if (timeElapsed >= delay && distanceTravelled >= distance$1) {
	        window.clearTimeout(this.mouseDownTimeout);
	        document.removeEventListener('mousemove', this[onDistanceChange]);
	        this[startDrag]();
	      }
	    }
	    /**
	     * Mouse move handler
	     * @private
	     * @param {Event} event - Mouse move event
	     */

	  }, {
	    key: onMouseMove,
	    value: function value(event) {
	      if (!this.dragging) {
	        return;
	      }

	      var target = document.elementFromPoint(event.clientX, event.clientY);
	      var dragMoveEvent = new DragMoveSensorEvent({
	        clientX: event.clientX,
	        clientY: event.clientY,
	        target: target,
	        container: this.currentContainer,
	        originalEvent: event
	      });
	      this.trigger(this.currentContainer, dragMoveEvent);
	    }
	    /**
	     * Mouse up handler
	     * @private
	     * @param {Event} event - Mouse up event
	     */

	  }, {
	    key: onMouseUp,
	    value: function value(event) {
	      clearTimeout(this.mouseDownTimeout);

	      if (event.button !== 0) {
	        return;
	      }

	      document.removeEventListener('mouseup', this[onMouseUp]);
	      document.removeEventListener('dragstart', preventNativeDragStart);
	      document.removeEventListener('mousemove', this[onDistanceChange]);

	      if (!this.dragging) {
	        return;
	      }

	      var target = document.elementFromPoint(event.clientX, event.clientY);
	      var dragStopEvent = new DragStopSensorEvent({
	        clientX: event.clientX,
	        clientY: event.clientY,
	        target: target,
	        container: this.currentContainer,
	        originalEvent: event
	      });
	      this.trigger(this.currentContainer, dragStopEvent);
	      document.removeEventListener('contextmenu', this[onContextMenuWhileDragging], true);
	      document.removeEventListener('mousemove', this[onMouseMove]);
	      this.currentContainer = null;
	      this.dragging = false;
	      this.startEvent = null;
	    }
	    /**
	     * Context menu handler
	     * @private
	     * @param {Event} event - Context menu event
	     */

	  }, {
	    key: onContextMenuWhileDragging,
	    value: function value(event) {
	      event.preventDefault();
	    }
	  }]);

	  return MouseSensor;
	}(Sensor);

	function preventNativeDragStart(event) {
	  event.preventDefault();
	}

	function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	var onTouchStart = Symbol('onTouchStart');
	var onTouchEnd = Symbol('onTouchEnd');
	var onTouchMove = Symbol('onTouchMove');
	var startDrag$1 = Symbol('startDrag');
	var onDistanceChange$1 = Symbol('onDistanceChange');
	/**
	 * Prevents scrolling when set to true
	 * @var {Boolean} preventScrolling
	 */

	var preventScrolling = false; // WebKit requires cancelable `touchmove` events to be added as early as possible

	window.addEventListener('touchmove', function (event) {
	  if (!preventScrolling) {
	    return;
	  } // Prevent scrolling


	  event.preventDefault();
	}, {
	  passive: false
	});
	/**
	 * This sensor picks up native browser touch events and dictates drag operations
	 * @class TouchSensor
	 * @module TouchSensor
	 * @extends Sensor
	 */

	var TouchSensor = /*#__PURE__*/function (_Sensor) {
	  inherits(TouchSensor, _Sensor);

	  var _super = _createSuper$2(TouchSensor);

	  /**
	   * TouchSensor constructor.
	   * @constructs TouchSensor
	   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
	   * @param {Object} options - Options
	   */
	  function TouchSensor() {
	    var _this;

	    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    classCallCheck(this, TouchSensor);

	    _this = _super.call(this, containers, options);
	    /**
	     * Closest scrollable container so accidental scroll can cancel long touch
	     * @property currentScrollableParent
	     * @type {HTMLElement}
	     */

	    _this.currentScrollableParent = null;
	    /**
	     * TimeoutID for managing delay
	     * @property tapTimeout
	     * @type {Number}
	     */

	    _this.tapTimeout = null;
	    /**
	     * touchMoved indicates if touch has moved during tapTimeout
	     * @property touchMoved
	     * @type {Boolean}
	     */

	    _this.touchMoved = false;
	    /**
	     * Save pageX coordinates for delay drag
	     * @property {Numbre} pageX
	     * @private
	     */

	    _this.pageX = null;
	    /**
	     * Save pageY coordinates for delay drag
	     * @property {Numbre} pageY
	     * @private
	     */

	    _this.pageY = null;
	    _this[onTouchStart] = _this[onTouchStart].bind(assertThisInitialized(_this));
	    _this[onTouchEnd] = _this[onTouchEnd].bind(assertThisInitialized(_this));
	    _this[onTouchMove] = _this[onTouchMove].bind(assertThisInitialized(_this));
	    _this[startDrag$1] = _this[startDrag$1].bind(assertThisInitialized(_this));
	    _this[onDistanceChange$1] = _this[onDistanceChange$1].bind(assertThisInitialized(_this));
	    return _this;
	  }
	  /**
	   * Attaches sensors event listeners to the DOM
	   */


	  createClass(TouchSensor, [{
	    key: "attach",
	    value: function attach() {
	      document.addEventListener('touchstart', this[onTouchStart]);
	    }
	    /**
	     * Detaches sensors event listeners to the DOM
	     */

	  }, {
	    key: "detach",
	    value: function detach() {
	      document.removeEventListener('touchstart', this[onTouchStart]);
	    }
	    /**
	     * Touch start handler
	     * @private
	     * @param {Event} event - Touch start event
	     */

	  }, {
	    key: onTouchStart,
	    value: function value(event) {
	      var _this2 = this;

	      var container = closest(event.target, this.containers);

	      if (!container) {
	        return;
	      }

	      var _this$options = this.options,
	          _this$options$distanc = _this$options.distance,
	          distance = _this$options$distanc === void 0 ? 0 : _this$options$distanc,
	          _this$options$delay = _this$options.delay,
	          delay = _this$options$delay === void 0 ? 0 : _this$options$delay;

	      var _touchCoords = touchCoords(event),
	          pageX = _touchCoords.pageX,
	          pageY = _touchCoords.pageY;

	      Object.assign(this, {
	        pageX: pageX,
	        pageY: pageY
	      });
	      this.onTouchStartAt = Date.now();
	      this.startEvent = event;
	      this.currentContainer = container;
	      document.addEventListener('touchend', this[onTouchEnd]);
	      document.addEventListener('touchcancel', this[onTouchEnd]);
	      document.addEventListener('touchmove', this[onDistanceChange$1]);
	      container.addEventListener('contextmenu', onContextMenu);

	      if (distance) {
	        preventScrolling = true;
	      }

	      this.tapTimeout = window.setTimeout(function () {
	        _this2[onDistanceChange$1]({
	          touches: [{
	            pageX: _this2.pageX,
	            pageY: _this2.pageY
	          }]
	        });
	      }, delay);
	    }
	    /**
	     * Start the drag
	     * @private
	     */

	  }, {
	    key: startDrag$1,
	    value: function value() {
	      var startEvent = this.startEvent;
	      var container = this.currentContainer;
	      var touch = touchCoords(startEvent);
	      var dragStartEvent = new DragStartSensorEvent({
	        clientX: touch.pageX,
	        clientY: touch.pageY,
	        target: startEvent.target,
	        container: container,
	        originalEvent: startEvent
	      });
	      this.trigger(this.currentContainer, dragStartEvent);
	      this.dragging = !dragStartEvent.canceled();

	      if (this.dragging) {
	        document.addEventListener('touchmove', this[onTouchMove]);
	      }

	      preventScrolling = this.dragging;
	    }
	    /**
	     * Touch move handler prior to drag start.
	     * @private
	     * @param {Event} event - Touch move event
	     */

	  }, {
	    key: onDistanceChange$1,
	    value: function value(event) {
	      var _this$options2 = this.options,
	          delay = _this$options2.delay,
	          distance$1 = _this$options2.distance;
	      var startEvent = this.startEvent;
	      var start = touchCoords(startEvent);
	      var current = touchCoords(event);
	      var timeElapsed = Date.now() - this.onTouchStartAt;
	      var distanceTravelled = distance(start.pageX, start.pageY, current.pageX, current.pageY);
	      Object.assign(this, current);

	      if (timeElapsed >= delay && distanceTravelled >= distance$1) {
	        window.clearTimeout(this.tapTimeout);
	        document.removeEventListener('touchmove', this[onDistanceChange$1]);
	        this[startDrag$1]();
	      }
	    }
	    /**
	     * Mouse move handler while dragging
	     * @private
	     * @param {Event} event - Touch move event
	     */

	  }, {
	    key: onTouchMove,
	    value: function value(event) {
	      if (!this.dragging) {
	        return;
	      }

	      var _touchCoords2 = touchCoords(event),
	          pageX = _touchCoords2.pageX,
	          pageY = _touchCoords2.pageY;

	      var target = document.elementFromPoint(pageX - window.scrollX, pageY - window.scrollY);
	      var dragMoveEvent = new DragMoveSensorEvent({
	        clientX: pageX,
	        clientY: pageY,
	        target: target,
	        container: this.currentContainer,
	        originalEvent: event
	      });
	      this.trigger(this.currentContainer, dragMoveEvent);
	    }
	    /**
	     * Touch end handler
	     * @private
	     * @param {Event} event - Touch end event
	     */

	  }, {
	    key: onTouchEnd,
	    value: function value(event) {
	      clearTimeout(this.tapTimeout);
	      preventScrolling = false;
	      document.removeEventListener('touchend', this[onTouchEnd]);
	      document.removeEventListener('touchcancel', this[onTouchEnd]);
	      document.removeEventListener('touchmove', this[onDistanceChange$1]);

	      if (this.currentContainer) {
	        this.currentContainer.removeEventListener('contextmenu', onContextMenu);
	      }

	      if (!this.dragging) {
	        return;
	      }

	      document.removeEventListener('touchmove', this[onTouchMove]);

	      var _touchCoords3 = touchCoords(event),
	          pageX = _touchCoords3.pageX,
	          pageY = _touchCoords3.pageY;

	      var target = document.elementFromPoint(pageX - window.scrollX, pageY - window.scrollY);
	      event.preventDefault();
	      var dragStopEvent = new DragStopSensorEvent({
	        clientX: pageX,
	        clientY: pageY,
	        target: target,
	        container: this.currentContainer,
	        originalEvent: event
	      });
	      this.trigger(this.currentContainer, dragStopEvent);
	      this.currentContainer = null;
	      this.dragging = false;
	      this.startEvent = null;
	    }
	  }]);

	  return TouchSensor;
	}(Sensor);

	function onContextMenu(event) {
	  event.preventDefault();
	  event.stopPropagation();
	}

	function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	/**
	 * Base collidable event
	 * @class CollidableEvent
	 * @module CollidableEvent
	 * @extends AbstractEvent
	 */

	var CollidableEvent = /*#__PURE__*/function (_AbstractEvent) {
	  inherits(CollidableEvent, _AbstractEvent);

	  var _super = _createSuper$3(CollidableEvent);

	  function CollidableEvent() {
	    classCallCheck(this, CollidableEvent);

	    return _super.apply(this, arguments);
	  }

	  createClass(CollidableEvent, [{
	    key: "dragEvent",

	    /**
	     * Drag event that triggered this colliable event
	     * @property dragEvent
	     * @type {DragEvent}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.dragEvent;
	    }
	  }]);

	  return CollidableEvent;
	}(AbstractEvent);
	/**
	 * Collidable in event
	 * @class CollidableInEvent
	 * @module CollidableInEvent
	 * @extends CollidableEvent
	 */

	defineProperty$6(CollidableEvent, "type", 'collidable');

	var CollidableInEvent = /*#__PURE__*/function (_CollidableEvent) {
	  inherits(CollidableInEvent, _CollidableEvent);

	  var _super2 = _createSuper$3(CollidableInEvent);

	  function CollidableInEvent() {
	    classCallCheck(this, CollidableInEvent);

	    return _super2.apply(this, arguments);
	  }

	  createClass(CollidableInEvent, [{
	    key: "collidingElement",

	    /**
	     * Element you are currently colliding with
	     * @property collidingElement
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.collidingElement;
	    }
	  }]);

	  return CollidableInEvent;
	}(CollidableEvent);
	/**
	 * Collidable out event
	 * @class CollidableOutEvent
	 * @module CollidableOutEvent
	 * @extends CollidableEvent
	 */

	defineProperty$6(CollidableInEvent, "type", 'collidable:in');

	var CollidableOutEvent = /*#__PURE__*/function (_CollidableEvent2) {
	  inherits(CollidableOutEvent, _CollidableEvent2);

	  var _super3 = _createSuper$3(CollidableOutEvent);

	  function CollidableOutEvent() {
	    classCallCheck(this, CollidableOutEvent);

	    return _super3.apply(this, arguments);
	  }

	  createClass(CollidableOutEvent, [{
	    key: "collidingElement",

	    /**
	     * Element you were previously colliding with
	     * @property collidingElement
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.collidingElement;
	    }
	  }]);

	  return CollidableOutEvent;
	}(CollidableEvent);

	defineProperty$6(CollidableOutEvent, "type", 'collidable:out');

	function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	/**
	 * Base snap event
	 * @class SnapEvent
	 * @module SnapEvent
	 * @extends AbstractEvent
	 */

	var SnapEvent = /*#__PURE__*/function (_AbstractEvent) {
	  inherits(SnapEvent, _AbstractEvent);

	  var _super = _createSuper$4(SnapEvent);

	  function SnapEvent() {
	    classCallCheck(this, SnapEvent);

	    return _super.apply(this, arguments);
	  }

	  createClass(SnapEvent, [{
	    key: "dragEvent",

	    /**
	     * Drag event that triggered this snap event
	     * @property dragEvent
	     * @type {DragEvent}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.dragEvent;
	    }
	    /**
	     * Snappable element
	     * @property snappable
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "snappable",
	    get: function get() {
	      return this.data.snappable;
	    }
	  }]);

	  return SnapEvent;
	}(AbstractEvent);
	/**
	 * Snap in event
	 * @class SnapInEvent
	 * @module SnapInEvent
	 * @extends SnapEvent
	 */

	defineProperty$6(SnapEvent, "type", 'snap');

	var SnapInEvent = /*#__PURE__*/function (_SnapEvent) {
	  inherits(SnapInEvent, _SnapEvent);

	  var _super2 = _createSuper$4(SnapInEvent);

	  function SnapInEvent() {
	    classCallCheck(this, SnapInEvent);

	    return _super2.apply(this, arguments);
	  }

	  return SnapInEvent;
	}(SnapEvent);
	/**
	 * Snap out event
	 * @class SnapOutEvent
	 * @module SnapOutEvent
	 * @extends SnapEvent
	 */

	defineProperty$6(SnapInEvent, "type", 'snap:in');

	defineProperty$6(SnapInEvent, "cancelable", true);

	var SnapOutEvent = /*#__PURE__*/function (_SnapEvent2) {
	  inherits(SnapOutEvent, _SnapEvent2);

	  var _super3 = _createSuper$4(SnapOutEvent);

	  function SnapOutEvent() {
	    classCallCheck(this, SnapOutEvent);

	    return _super3.apply(this, arguments);
	  }

	  return SnapOutEvent;
	}(SnapEvent);

	defineProperty$6(SnapOutEvent, "type", 'snap:out');

	defineProperty$6(SnapOutEvent, "cancelable", true);

	var $map = arrayIteration.map;



	var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('map');
	// FF49- issue
	var USES_TO_LENGTH$6 = arrayMethodUsesToLength('map');

	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$6 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod$3 = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aFunction$1(callbackfn);
	    var O = toObject(that);
	    var self = indexedObject(O);
	    var length = toLength(O.length);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError('Reduce of empty array with no initial value');
	      }
	    }
	    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	  left: createMethod$3(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$3(true)
	};

	var $reduce = arrayReduce.left;



	var STRICT_METHOD$2 = arrayMethodIsStrict('reduce');
	var USES_TO_LENGTH$7 = arrayMethodUsesToLength('reduce', { 1: 0 });

	// `Array.prototype.reduce` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$2 || !USES_TO_LENGTH$7 }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var propertyIsEnumerable = objectPropertyIsEnumerable.f;

	// `Object.{ entries, values }` methods implementation
	var createMethod$4 = function (TO_ENTRIES) {
	  return function (it) {
	    var O = toIndexedObject(it);
	    var keys = objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) {
	      key = keys[i++];
	      if (!descriptors || propertyIsEnumerable.call(O, key)) {
	        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
	      }
	    }
	    return result;
	  };
	};

	var objectToArray = {
	  // `Object.entries` method
	  // https://tc39.github.io/ecma262/#sec-object.entries
	  entries: createMethod$4(true),
	  // `Object.values` method
	  // https://tc39.github.io/ecma262/#sec-object.values
	  values: createMethod$4(false)
	};

	var $values = objectToArray.values;

	// `Object.values` method
	// https://tc39.github.io/ecma262/#sec-object.values
	_export({ target: 'Object', stat: true }, {
	  values: function values(O) {
	    return $values(O);
	  }
	});

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$5 = function (TYPE) {
	  return function ($this) {
	    var string = String(requireObjectCoercible($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$5(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
	  end: createMethod$5(2),
	  // `String.prototype.trim` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
	  trim: createMethod$5(3)
	};

	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var stringTrimForced = function (METHOD_NAME) {
	  return fails(function () {
	    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
	  });
	};

	var $trim = stringTrim.trim;


	// `String.prototype.trim` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.trim
	_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { defineProperty$6(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _createSuper$5(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$5(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$5() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	var onInitialize = Symbol('onInitialize');
	var onDestroy = Symbol('onDestroy');
	var announceEvent = Symbol('announceEvent');
	var announceMessage = Symbol('announceMessage');
	var ARIA_RELEVANT = 'aria-relevant';
	var ARIA_ATOMIC = 'aria-atomic';
	var ARIA_LIVE = 'aria-live';
	var ROLE = 'role';
	/**
	 * Announcement default options
	 * @property {Object} defaultOptions
	 * @property {Number} defaultOptions.expire
	 * @type {Object}
	 */

	var defaultOptions = {
	  expire: 7000
	};
	/**
	 * Announcement plugin
	 * @class Announcement
	 * @module Announcement
	 * @extends AbstractPlugin
	 */

	var Announcement = /*#__PURE__*/function (_AbstractPlugin) {
	  inherits(Announcement, _AbstractPlugin);

	  var _super = _createSuper$5(Announcement);

	  /**
	   * Announcement constructor.
	   * @constructs Announcement
	   * @param {Draggable} draggable - Draggable instance
	   */
	  function Announcement(draggable) {
	    var _this;

	    classCallCheck(this, Announcement);

	    _this = _super.call(this, draggable);
	    /**
	     * Plugin options
	     * @property options
	     * @type {Object}
	     */

	    _this.options = _objectSpread$2(_objectSpread$2({}, defaultOptions), _this.getOptions());
	    /**
	     * Original draggable trigger method. Hack until we have onAll or on('all')
	     * @property originalTriggerMethod
	     * @type {Function}
	     */

	    _this.originalTriggerMethod = _this.draggable.trigger;
	    _this[onInitialize] = _this[onInitialize].bind(assertThisInitialized(_this));
	    _this[onDestroy] = _this[onDestroy].bind(assertThisInitialized(_this));
	    return _this;
	  }
	  /**
	   * Attaches listeners to draggable
	   */


	  createClass(Announcement, [{
	    key: "attach",
	    value: function attach() {
	      this.draggable.on('draggable:initialize', this[onInitialize]);
	    }
	    /**
	     * Detaches listeners from draggable
	     */

	  }, {
	    key: "detach",
	    value: function detach() {
	      this.draggable.off('draggable:destroy', this[onDestroy]);
	    }
	    /**
	     * Returns passed in options
	     */

	  }, {
	    key: "getOptions",
	    value: function getOptions() {
	      return this.draggable.options.announcements || {};
	    }
	    /**
	     * Announces event
	     * @private
	     * @param {AbstractEvent} event
	     */

	  }, {
	    key: announceEvent,
	    value: function value(event) {
	      var message = this.options[event.type];

	      if (message && typeof message === 'string') {
	        this[announceMessage](message);
	      }

	      if (message && typeof message === 'function') {
	        this[announceMessage](message(event));
	      }
	    }
	    /**
	     * Announces message to screen reader
	     * @private
	     * @param {String} message
	     */

	  }, {
	    key: announceMessage,
	    value: function value(message) {
	      announce(message, {
	        expire: this.options.expire
	      });
	    }
	    /**
	     * Initialize hander
	     * @private
	     */

	  }, {
	    key: onInitialize,
	    value: function value() {
	      var _this2 = this;

	      // Hack until there is an api for listening for all events
	      this.draggable.trigger = function (event) {
	        try {
	          _this2[announceEvent](event);
	        } finally {
	          // Ensure that original trigger is called
	          _this2.originalTriggerMethod.call(_this2.draggable, event);
	        }
	      };
	    }
	    /**
	     * Destroy hander
	     * @private
	     */

	  }, {
	    key: onDestroy,
	    value: function value() {
	      this.draggable.trigger = this.originalTriggerMethod;
	    }
	  }]);

	  return Announcement;
	}(AbstractPlugin);
	var liveRegion = createRegion();
	/**
	 * Announces message via live region
	 * @param {String} message
	 * @param {Object} options
	 * @param {Number} options.expire
	 */

	function announce(message, _ref) {
	  var expire = _ref.expire;
	  var element = document.createElement('div');
	  element.textContent = message;
	  liveRegion.appendChild(element);
	  return setTimeout(function () {
	    liveRegion.removeChild(element);
	  }, expire);
	}
	/**
	 * Creates region element
	 * @return {HTMLElement}
	 */


	function createRegion() {
	  var element = document.createElement('div');
	  element.setAttribute('id', 'draggable-live-region');
	  element.setAttribute(ARIA_RELEVANT, 'additions');
	  element.setAttribute(ARIA_ATOMIC, 'true');
	  element.setAttribute(ARIA_LIVE, 'assertive');
	  element.setAttribute(ROLE, 'log');
	  element.style.position = 'fixed';
	  element.style.width = '1px';
	  element.style.height = '1px';
	  element.style.top = '-1px';
	  element.style.overflow = 'hidden';
	  return element;
	} // Append live region element as early as possible


	document.addEventListener('DOMContentLoaded', function () {
	  document.body.appendChild(liveRegion);
	});

	function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(Object(source), true).forEach(function (key) { defineProperty$6(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _createSuper$6(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$6(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$6() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	var onInitialize$1 = Symbol('onInitialize');
	var onDestroy$1 = Symbol('onDestroy');
	/**
	 * Focusable default options
	 * @property {Object} defaultOptions
	 * @type {Object}
	 */

	var defaultOptions$1 = {};
	/**
	 * Focusable plugin
	 * @class Focusable
	 * @module Focusable
	 * @extends AbstractPlugin
	 */

	var Focusable = /*#__PURE__*/function (_AbstractPlugin) {
	  inherits(Focusable, _AbstractPlugin);

	  var _super = _createSuper$6(Focusable);

	  /**
	   * Focusable constructor.
	   * @constructs Focusable
	   * @param {Draggable} draggable - Draggable instance
	   */
	  function Focusable(draggable) {
	    var _this;

	    classCallCheck(this, Focusable);

	    _this = _super.call(this, draggable);
	    /**
	     * Focusable options
	     * @property {Object} options
	     * @type {Object}
	     */

	    _this.options = _objectSpread$3(_objectSpread$3({}, defaultOptions$1), _this.getOptions());
	    _this[onInitialize$1] = _this[onInitialize$1].bind(assertThisInitialized(_this));
	    _this[onDestroy$1] = _this[onDestroy$1].bind(assertThisInitialized(_this));
	    return _this;
	  }
	  /**
	   * Attaches listeners to draggable
	   */


	  createClass(Focusable, [{
	    key: "attach",
	    value: function attach() {
	      this.draggable.on('draggable:initialize', this[onInitialize$1]).on('draggable:destroy', this[onDestroy$1]);
	    }
	    /**
	     * Detaches listeners from draggable
	     */

	  }, {
	    key: "detach",
	    value: function detach() {
	      this.draggable.off('draggable:initialize', this[onInitialize$1]).off('draggable:destroy', this[onDestroy$1]); // Remove modified elements when detach

	      this[onDestroy$1]();
	    }
	    /**
	     * Returns options passed through draggable
	     * @return {Object}
	     */

	  }, {
	    key: "getOptions",
	    value: function getOptions() {
	      return this.draggable.options.focusable || {};
	    }
	    /**
	     * Returns draggable containers and elements
	     * @return {HTMLElement[]}
	     */

	  }, {
	    key: "getElements",
	    value: function getElements() {
	      return [].concat(toConsumableArray(this.draggable.containers), toConsumableArray(this.draggable.getDraggableElements()));
	    }
	    /**
	     * Intialize handler
	     * @private
	     */

	  }, {
	    key: onInitialize$1,
	    value: function value() {
	      var _this2 = this;

	      // Can wait until the next best frame is available
	      requestAnimationFrame(function () {
	        _this2.getElements().forEach(function (element) {
	          return decorateElement(element);
	        });
	      });
	    }
	    /**
	     * Destroy handler
	     * @private
	     */

	  }, {
	    key: onDestroy$1,
	    value: function value() {
	      var _this3 = this;

	      // Can wait until the next best frame is available
	      requestAnimationFrame(function () {
	        _this3.getElements().forEach(function (element) {
	          return stripElement(element);
	        });
	      });
	    }
	  }]);

	  return Focusable;
	}(AbstractPlugin);
	var elementsWithMissingTabIndex = [];
	/**
	 * Decorates element with tabindex attributes
	 * @param {HTMLElement} element
	 * @return {Object}
	 * @private
	 */

	function decorateElement(element) {
	  var hasMissingTabIndex = Boolean(!element.getAttribute('tabindex') && element.tabIndex === -1);

	  if (hasMissingTabIndex) {
	    elementsWithMissingTabIndex.push(element);
	    element.tabIndex = 0;
	  }
	}
	/**
	 * Removes elements tabindex attributes
	 * @param {HTMLElement} element
	 * @private
	 */


	function stripElement(element) {
	  var tabIndexElementPosition = elementsWithMissingTabIndex.indexOf(element);

	  if (tabIndexElementPosition !== -1) {
	    element.tabIndex = -1;
	    elementsWithMissingTabIndex.splice(tabIndexElementPosition, 1);
	  }
	}

	function _objectWithoutPropertiesLoose(source, excluded) {
	  if (source == null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key, i;

	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }

	  return target;
	}

	var objectWithoutPropertiesLoose = _objectWithoutPropertiesLoose;

	function _objectWithoutProperties(source, excluded) {
	  if (source == null) return {};
	  var target = objectWithoutPropertiesLoose(source, excluded);
	  var key, i;

	  if (Object.getOwnPropertySymbols) {
	    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

	    for (i = 0; i < sourceSymbolKeys.length; i++) {
	      key = sourceSymbolKeys[i];
	      if (excluded.indexOf(key) >= 0) continue;
	      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
	      target[key] = source[key];
	    }
	  }

	  return target;
	}

	var objectWithoutProperties = _objectWithoutProperties;

	function _createSuper$7(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$7(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$7() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	/**
	 * Base mirror event
	 * @class MirrorEvent
	 * @module MirrorEvent
	 * @extends AbstractEvent
	 */

	var MirrorEvent = /*#__PURE__*/function (_AbstractEvent) {
	  inherits(MirrorEvent, _AbstractEvent);

	  var _super = _createSuper$7(MirrorEvent);

	  function MirrorEvent() {
	    classCallCheck(this, MirrorEvent);

	    return _super.apply(this, arguments);
	  }

	  createClass(MirrorEvent, [{
	    key: "source",

	    /**
	     * Draggables source element
	     * @property source
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.source;
	    }
	    /**
	     * Draggables original source element
	     * @property originalSource
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "originalSource",
	    get: function get() {
	      return this.data.originalSource;
	    }
	    /**
	     * Draggables source container element
	     * @property sourceContainer
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "sourceContainer",
	    get: function get() {
	      return this.data.sourceContainer;
	    }
	    /**
	     * Sensor event
	     * @property sensorEvent
	     * @type {SensorEvent}
	     * @readonly
	     */

	  }, {
	    key: "sensorEvent",
	    get: function get() {
	      return this.data.sensorEvent;
	    }
	    /**
	     * Drag event
	     * @property dragEvent
	     * @type {DragEvent}
	     * @readonly
	     */

	  }, {
	    key: "dragEvent",
	    get: function get() {
	      return this.data.dragEvent;
	    }
	    /**
	     * Original event that triggered sensor event
	     * @property originalEvent
	     * @type {Event}
	     * @readonly
	     */

	  }, {
	    key: "originalEvent",
	    get: function get() {
	      if (this.sensorEvent) {
	        return this.sensorEvent.originalEvent;
	      }

	      return null;
	    }
	  }]);

	  return MirrorEvent;
	}(AbstractEvent);
	/**
	 * Mirror create event
	 * @class MirrorCreateEvent
	 * @module MirrorCreateEvent
	 * @extends MirrorEvent
	 */

	var MirrorCreateEvent = /*#__PURE__*/function (_MirrorEvent) {
	  inherits(MirrorCreateEvent, _MirrorEvent);

	  var _super2 = _createSuper$7(MirrorCreateEvent);

	  function MirrorCreateEvent() {
	    classCallCheck(this, MirrorCreateEvent);

	    return _super2.apply(this, arguments);
	  }

	  return MirrorCreateEvent;
	}(MirrorEvent);
	/**
	 * Mirror created event
	 * @class MirrorCreatedEvent
	 * @module MirrorCreatedEvent
	 * @extends MirrorEvent
	 */

	defineProperty$6(MirrorCreateEvent, "type", 'mirror:create');

	var MirrorCreatedEvent = /*#__PURE__*/function (_MirrorEvent2) {
	  inherits(MirrorCreatedEvent, _MirrorEvent2);

	  var _super3 = _createSuper$7(MirrorCreatedEvent);

	  function MirrorCreatedEvent() {
	    classCallCheck(this, MirrorCreatedEvent);

	    return _super3.apply(this, arguments);
	  }

	  createClass(MirrorCreatedEvent, [{
	    key: "mirror",

	    /**
	     * Draggables mirror element
	     * @property mirror
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.mirror;
	    }
	  }]);

	  return MirrorCreatedEvent;
	}(MirrorEvent);
	/**
	 * Mirror attached event
	 * @class MirrorAttachedEvent
	 * @module MirrorAttachedEvent
	 * @extends MirrorEvent
	 */

	defineProperty$6(MirrorCreatedEvent, "type", 'mirror:created');

	var MirrorAttachedEvent = /*#__PURE__*/function (_MirrorEvent3) {
	  inherits(MirrorAttachedEvent, _MirrorEvent3);

	  var _super4 = _createSuper$7(MirrorAttachedEvent);

	  function MirrorAttachedEvent() {
	    classCallCheck(this, MirrorAttachedEvent);

	    return _super4.apply(this, arguments);
	  }

	  createClass(MirrorAttachedEvent, [{
	    key: "mirror",

	    /**
	     * Draggables mirror element
	     * @property mirror
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.mirror;
	    }
	  }]);

	  return MirrorAttachedEvent;
	}(MirrorEvent);
	/**
	 * Mirror move event
	 * @class MirrorMoveEvent
	 * @module MirrorMoveEvent
	 * @extends MirrorEvent
	 */

	defineProperty$6(MirrorAttachedEvent, "type", 'mirror:attached');

	var MirrorMoveEvent = /*#__PURE__*/function (_MirrorEvent4) {
	  inherits(MirrorMoveEvent, _MirrorEvent4);

	  var _super5 = _createSuper$7(MirrorMoveEvent);

	  function MirrorMoveEvent() {
	    classCallCheck(this, MirrorMoveEvent);

	    return _super5.apply(this, arguments);
	  }

	  createClass(MirrorMoveEvent, [{
	    key: "mirror",

	    /**
	     * Draggables mirror element
	     * @property mirror
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.mirror;
	    }
	    /**
	     * Sensor has exceeded mirror's threshold on x axis
	     * @type {Boolean}
	     * @readonly
	     */

	  }, {
	    key: "passedThreshX",
	    get: function get() {
	      return this.data.passedThreshX;
	    }
	    /**
	     * Sensor has exceeded mirror's threshold on y axis
	     * @type {Boolean}
	     * @readonly
	     */

	  }, {
	    key: "passedThreshY",
	    get: function get() {
	      return this.data.passedThreshY;
	    }
	  }]);

	  return MirrorMoveEvent;
	}(MirrorEvent);
	/**
	 * Mirror destroy event
	 * @class MirrorDestroyEvent
	 * @module MirrorDestroyEvent
	 * @extends MirrorEvent
	 */

	defineProperty$6(MirrorMoveEvent, "type", 'mirror:move');

	defineProperty$6(MirrorMoveEvent, "cancelable", true);

	var MirrorDestroyEvent = /*#__PURE__*/function (_MirrorEvent5) {
	  inherits(MirrorDestroyEvent, _MirrorEvent5);

	  var _super6 = _createSuper$7(MirrorDestroyEvent);

	  function MirrorDestroyEvent() {
	    classCallCheck(this, MirrorDestroyEvent);

	    return _super6.apply(this, arguments);
	  }

	  createClass(MirrorDestroyEvent, [{
	    key: "mirror",

	    /**
	     * Draggables mirror element
	     * @property mirror
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.mirror;
	    }
	  }]);

	  return MirrorDestroyEvent;
	}(MirrorEvent);

	defineProperty$6(MirrorDestroyEvent, "type", 'mirror:destroy');

	defineProperty$6(MirrorDestroyEvent, "cancelable", true);

	function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(Object(source), true).forEach(function (key) { defineProperty$6(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _createSuper$8(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$8(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$8() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	var onDragStart = Symbol('onDragStart');
	var onDragMove = Symbol('onDragMove');
	var onDragStop = Symbol('onDragStop');
	var onMirrorCreated = Symbol('onMirrorCreated');
	var onMirrorMove = Symbol('onMirrorMove');
	var onScroll = Symbol('onScroll');
	var getAppendableContainer = Symbol('getAppendableContainer');
	/**
	 * Mirror default options
	 * @property {Object} defaultOptions
	 * @property {Boolean} defaultOptions.constrainDimensions
	 * @property {Boolean} defaultOptions.xAxis
	 * @property {Boolean} defaultOptions.yAxis
	 * @property {null} defaultOptions.cursorOffsetX
	 * @property {null} defaultOptions.cursorOffsetY
	 * @type {Object}
	 */

	var defaultOptions$2 = {
	  constrainDimensions: false,
	  xAxis: true,
	  yAxis: true,
	  cursorOffsetX: null,
	  cursorOffsetY: null,
	  thresholdX: null,
	  thresholdY: null
	};
	/**
	 * Mirror plugin which controls the mirror positioning while dragging
	 * @class Mirror
	 * @module Mirror
	 * @extends AbstractPlugin
	 */

	var Mirror = /*#__PURE__*/function (_AbstractPlugin) {
	  inherits(Mirror, _AbstractPlugin);

	  var _super = _createSuper$8(Mirror);

	  /**
	   * Mirror constructor.
	   * @constructs Mirror
	   * @param {Draggable} draggable - Draggable instance
	   */
	  function Mirror(draggable) {
	    var _this;

	    classCallCheck(this, Mirror);

	    _this = _super.call(this, draggable);
	    /**
	     * Mirror options
	     * @property {Object} options
	     * @property {Boolean} options.constrainDimensions
	     * @property {Boolean} options.xAxis
	     * @property {Boolean} options.yAxis
	     * @property {Number|null} options.cursorOffsetX
	     * @property {Number|null} options.cursorOffsetY
	     * @property {String|HTMLElement|Function} options.appendTo
	     * @type {Object}
	     */

	    _this.options = _objectSpread$4(_objectSpread$4({}, defaultOptions$2), _this.getOptions());
	    /**
	     * Scroll offset for touch devices because the mirror is positioned fixed
	     * @property {Object} scrollOffset
	     * @property {Number} scrollOffset.x
	     * @property {Number} scrollOffset.y
	     */

	    _this.scrollOffset = {
	      x: 0,
	      y: 0
	    };
	    /**
	     * Initial scroll offset for touch devices because the mirror is positioned fixed
	     * @property {Object} scrollOffset
	     * @property {Number} scrollOffset.x
	     * @property {Number} scrollOffset.y
	     */

	    _this.initialScrollOffset = {
	      x: window.scrollX,
	      y: window.scrollY
	    };
	    _this[onDragStart] = _this[onDragStart].bind(assertThisInitialized(_this));
	    _this[onDragMove] = _this[onDragMove].bind(assertThisInitialized(_this));
	    _this[onDragStop] = _this[onDragStop].bind(assertThisInitialized(_this));
	    _this[onMirrorCreated] = _this[onMirrorCreated].bind(assertThisInitialized(_this));
	    _this[onMirrorMove] = _this[onMirrorMove].bind(assertThisInitialized(_this));
	    _this[onScroll] = _this[onScroll].bind(assertThisInitialized(_this));
	    return _this;
	  }
	  /**
	   * Attaches plugins event listeners
	   */


	  createClass(Mirror, [{
	    key: "attach",
	    value: function attach() {
	      this.draggable.on('drag:start', this[onDragStart]).on('drag:move', this[onDragMove]).on('drag:stop', this[onDragStop]).on('mirror:created', this[onMirrorCreated]).on('mirror:move', this[onMirrorMove]);
	    }
	    /**
	     * Detaches plugins event listeners
	     */

	  }, {
	    key: "detach",
	    value: function detach() {
	      this.draggable.off('drag:start', this[onDragStart]).off('drag:move', this[onDragMove]).off('drag:stop', this[onDragStop]).off('mirror:created', this[onMirrorCreated]).off('mirror:move', this[onMirrorMove]);
	    }
	    /**
	     * Returns options passed through draggable
	     * @return {Object}
	     */

	  }, {
	    key: "getOptions",
	    value: function getOptions() {
	      return this.draggable.options.mirror || {};
	    }
	  }, {
	    key: onDragStart,
	    value: function value(dragEvent) {
	      if (dragEvent.canceled()) {
	        return;
	      }

	      if ('ontouchstart' in window) {
	        document.addEventListener('scroll', this[onScroll], true);
	      }

	      this.initialScrollOffset = {
	        x: window.scrollX,
	        y: window.scrollY
	      };
	      var source = dragEvent.source,
	          originalSource = dragEvent.originalSource,
	          sourceContainer = dragEvent.sourceContainer,
	          sensorEvent = dragEvent.sensorEvent; // Last sensor position of mirror move

	      this.lastMirrorMovedClient = {
	        x: sensorEvent.clientX,
	        y: sensorEvent.clientY
	      };
	      var mirrorCreateEvent = new MirrorCreateEvent({
	        source: source,
	        originalSource: originalSource,
	        sourceContainer: sourceContainer,
	        sensorEvent: sensorEvent,
	        dragEvent: dragEvent
	      });
	      this.draggable.trigger(mirrorCreateEvent);

	      if (isNativeDragEvent(sensorEvent) || mirrorCreateEvent.canceled()) {
	        return;
	      }

	      var appendableContainer = this[getAppendableContainer](source) || sourceContainer;
	      this.mirror = source.cloneNode(true);
	      var mirrorCreatedEvent = new MirrorCreatedEvent({
	        source: source,
	        originalSource: originalSource,
	        sourceContainer: sourceContainer,
	        sensorEvent: sensorEvent,
	        dragEvent: dragEvent,
	        mirror: this.mirror
	      });
	      var mirrorAttachedEvent = new MirrorAttachedEvent({
	        source: source,
	        originalSource: originalSource,
	        sourceContainer: sourceContainer,
	        sensorEvent: sensorEvent,
	        dragEvent: dragEvent,
	        mirror: this.mirror
	      });
	      this.draggable.trigger(mirrorCreatedEvent);
	      appendableContainer.appendChild(this.mirror);
	      this.draggable.trigger(mirrorAttachedEvent);
	    }
	  }, {
	    key: onDragMove,
	    value: function value(dragEvent) {
	      if (!this.mirror || dragEvent.canceled()) {
	        return;
	      }

	      var source = dragEvent.source,
	          originalSource = dragEvent.originalSource,
	          sourceContainer = dragEvent.sourceContainer,
	          sensorEvent = dragEvent.sensorEvent;
	      var passedThreshX = true;
	      var passedThreshY = true;

	      if (this.options.thresholdX || this.options.thresholdY) {
	        var _this$lastMirrorMoved = this.lastMirrorMovedClient,
	            lastX = _this$lastMirrorMoved.x,
	            lastY = _this$lastMirrorMoved.y;

	        if (Math.abs(lastX - sensorEvent.clientX) < this.options.thresholdX) {
	          passedThreshX = false;
	        } else {
	          this.lastMirrorMovedClient.x = sensorEvent.clientX;
	        }

	        if (Math.abs(lastY - sensorEvent.clientY) < this.options.thresholdY) {
	          passedThreshY = false;
	        } else {
	          this.lastMirrorMovedClient.y = sensorEvent.clientY;
	        }

	        if (!passedThreshX && !passedThreshY) {
	          return;
	        }
	      }

	      var mirrorMoveEvent = new MirrorMoveEvent({
	        source: source,
	        originalSource: originalSource,
	        sourceContainer: sourceContainer,
	        sensorEvent: sensorEvent,
	        dragEvent: dragEvent,
	        mirror: this.mirror,
	        passedThreshX: passedThreshX,
	        passedThreshY: passedThreshY
	      });
	      this.draggable.trigger(mirrorMoveEvent);
	    }
	  }, {
	    key: onDragStop,
	    value: function value(dragEvent) {
	      if ('ontouchstart' in window) {
	        document.removeEventListener('scroll', this[onScroll], true);
	      }

	      this.initialScrollOffset = {
	        x: 0,
	        y: 0
	      };
	      this.scrollOffset = {
	        x: 0,
	        y: 0
	      };

	      if (!this.mirror) {
	        return;
	      }

	      var source = dragEvent.source,
	          sourceContainer = dragEvent.sourceContainer,
	          sensorEvent = dragEvent.sensorEvent;
	      var mirrorDestroyEvent = new MirrorDestroyEvent({
	        source: source,
	        mirror: this.mirror,
	        sourceContainer: sourceContainer,
	        sensorEvent: sensorEvent,
	        dragEvent: dragEvent
	      });
	      this.draggable.trigger(mirrorDestroyEvent);

	      if (!mirrorDestroyEvent.canceled()) {
	        this.mirror.parentNode.removeChild(this.mirror);
	      }
	    }
	  }, {
	    key: onScroll,
	    value: function value() {
	      this.scrollOffset = {
	        x: window.scrollX - this.initialScrollOffset.x,
	        y: window.scrollY - this.initialScrollOffset.y
	      };
	    }
	    /**
	     * Mirror created handler
	     * @param {MirrorCreatedEvent} mirrorEvent
	     * @return {Promise}
	     * @private
	     */

	  }, {
	    key: onMirrorCreated,
	    value: function value(_ref) {
	      var _this2 = this;

	      var mirror = _ref.mirror,
	          source = _ref.source,
	          sensorEvent = _ref.sensorEvent;
	      var mirrorClass = this.draggable.getClassNameFor('mirror');

	      var setState = function setState(_ref2) {
	        var mirrorOffset = _ref2.mirrorOffset,
	            initialX = _ref2.initialX,
	            initialY = _ref2.initialY,
	            args = objectWithoutProperties(_ref2, ["mirrorOffset", "initialX", "initialY"]);

	        _this2.mirrorOffset = mirrorOffset;
	        _this2.initialX = initialX;
	        _this2.initialY = initialY;
	        _this2.lastMovedX = initialX;
	        _this2.lastMovedY = initialY;
	        return _objectSpread$4({
	          mirrorOffset: mirrorOffset,
	          initialX: initialX,
	          initialY: initialY
	        }, args);
	      };

	      mirror.style.display = 'none';
	      var initialState = {
	        mirror: mirror,
	        source: source,
	        sensorEvent: sensorEvent,
	        mirrorClass: mirrorClass,
	        scrollOffset: this.scrollOffset,
	        options: this.options,
	        passedThreshX: true,
	        passedThreshY: true
	      };
	      return Promise.resolve(initialState) // Fix reflow here
	      .then(computeMirrorDimensions).then(calculateMirrorOffset).then(resetMirror).then(addMirrorClasses).then(positionMirror({
	        initial: true
	      })).then(removeMirrorID).then(setState);
	    }
	    /**
	     * Mirror move handler
	     * @param {MirrorMoveEvent} mirrorEvent
	     * @return {Promise|null}
	     * @private
	     */

	  }, {
	    key: onMirrorMove,
	    value: function value(mirrorEvent) {
	      var _this3 = this;

	      if (mirrorEvent.canceled()) {
	        return null;
	      }

	      var setState = function setState(_ref3) {
	        var lastMovedX = _ref3.lastMovedX,
	            lastMovedY = _ref3.lastMovedY,
	            args = objectWithoutProperties(_ref3, ["lastMovedX", "lastMovedY"]);

	        _this3.lastMovedX = lastMovedX;
	        _this3.lastMovedY = lastMovedY;
	        return _objectSpread$4({
	          lastMovedX: lastMovedX,
	          lastMovedY: lastMovedY
	        }, args);
	      };

	      var initialState = {
	        mirror: mirrorEvent.mirror,
	        sensorEvent: mirrorEvent.sensorEvent,
	        mirrorOffset: this.mirrorOffset,
	        options: this.options,
	        initialX: this.initialX,
	        initialY: this.initialY,
	        scrollOffset: this.scrollOffset,
	        passedThreshX: mirrorEvent.passedThreshX,
	        passedThreshY: mirrorEvent.passedThreshY,
	        lastMovedX: this.lastMovedX,
	        lastMovedY: this.lastMovedY
	      };
	      return Promise.resolve(initialState).then(positionMirror({
	        raf: true
	      })).then(setState);
	    }
	    /**
	     * Returns appendable container for mirror based on the appendTo option
	     * @private
	     * @param {Object} options
	     * @param {HTMLElement} options.source - Current source
	     * @return {HTMLElement}
	     */

	  }, {
	    key: getAppendableContainer,
	    value: function value(source) {
	      var appendTo = this.options.appendTo;

	      if (typeof appendTo === 'string') {
	        return document.querySelector(appendTo);
	      } else if (appendTo instanceof HTMLElement) {
	        return appendTo;
	      } else if (typeof appendTo === 'function') {
	        return appendTo(source);
	      } else {
	        return source.parentNode;
	      }
	    }
	  }]);

	  return Mirror;
	}(AbstractPlugin);

	function computeMirrorDimensions(_ref4) {
	  var source = _ref4.source,
	      args = objectWithoutProperties(_ref4, ["source"]);

	  return withPromise(function (resolve) {
	    var sourceRect = source.getBoundingClientRect();
	    resolve(_objectSpread$4({
	      source: source,
	      sourceRect: sourceRect
	    }, args));
	  });
	}
	/**
	 * Calculates mirror offset
	 * Adds mirrorOffset to state
	 * @param {Object} state
	 * @param {SensorEvent} state.sensorEvent
	 * @param {DOMRect} state.sourceRect
	 * @return {Promise}
	 * @private
	 */


	function calculateMirrorOffset(_ref5) {
	  var sensorEvent = _ref5.sensorEvent,
	      sourceRect = _ref5.sourceRect,
	      options = _ref5.options,
	      args = objectWithoutProperties(_ref5, ["sensorEvent", "sourceRect", "options"]);

	  return withPromise(function (resolve) {
	    var top = options.cursorOffsetY === null ? sensorEvent.clientY - sourceRect.top : options.cursorOffsetY;
	    var left = options.cursorOffsetX === null ? sensorEvent.clientX - sourceRect.left : options.cursorOffsetX;
	    var mirrorOffset = {
	      top: top,
	      left: left
	    };
	    resolve(_objectSpread$4({
	      sensorEvent: sensorEvent,
	      sourceRect: sourceRect,
	      mirrorOffset: mirrorOffset,
	      options: options
	    }, args));
	  });
	}
	/**
	 * Applys mirror styles
	 * @param {Object} state
	 * @param {HTMLElement} state.mirror
	 * @param {HTMLElement} state.source
	 * @param {Object} state.options
	 * @return {Promise}
	 * @private
	 */


	function resetMirror(_ref6) {
	  var mirror = _ref6.mirror,
	      source = _ref6.source,
	      options = _ref6.options,
	      args = objectWithoutProperties(_ref6, ["mirror", "source", "options"]);

	  return withPromise(function (resolve) {
	    var offsetHeight;
	    var offsetWidth;

	    if (options.constrainDimensions) {
	      var computedSourceStyles = getComputedStyle(source);
	      offsetHeight = computedSourceStyles.getPropertyValue('height');
	      offsetWidth = computedSourceStyles.getPropertyValue('width');
	    }

	    mirror.style.display = null;
	    mirror.style.position = 'fixed';
	    mirror.style.pointerEvents = 'none';
	    mirror.style.top = 0;
	    mirror.style.left = 0;
	    mirror.style.margin = 0;

	    if (options.constrainDimensions) {
	      mirror.style.height = offsetHeight;
	      mirror.style.width = offsetWidth;
	    }

	    resolve(_objectSpread$4({
	      mirror: mirror,
	      source: source,
	      options: options
	    }, args));
	  });
	}
	/**
	 * Applys mirror class on mirror element
	 * @param {Object} state
	 * @param {HTMLElement} state.mirror
	 * @param {String} state.mirrorClass
	 * @return {Promise}
	 * @private
	 */


	function addMirrorClasses(_ref7) {
	  var mirror = _ref7.mirror,
	      mirrorClass = _ref7.mirrorClass,
	      args = objectWithoutProperties(_ref7, ["mirror", "mirrorClass"]);

	  return withPromise(function (resolve) {
	    mirror.classList.add(mirrorClass);
	    resolve(_objectSpread$4({
	      mirror: mirror,
	      mirrorClass: mirrorClass
	    }, args));
	  });
	}
	/**
	 * Removes source ID from cloned mirror element
	 * @param {Object} state
	 * @param {HTMLElement} state.mirror
	 * @return {Promise}
	 * @private
	 */


	function removeMirrorID(_ref8) {
	  var mirror = _ref8.mirror,
	      args = objectWithoutProperties(_ref8, ["mirror"]);

	  return withPromise(function (resolve) {
	    mirror.removeAttribute('id');
	    delete mirror.id;
	    resolve(_objectSpread$4({
	      mirror: mirror
	    }, args));
	  });
	}
	/**
	 * Positions mirror with translate3d
	 * @param {Object} state
	 * @param {HTMLElement} state.mirror
	 * @param {SensorEvent} state.sensorEvent
	 * @param {Object} state.mirrorOffset
	 * @param {Number} state.initialY
	 * @param {Number} state.initialX
	 * @param {Object} state.options
	 * @return {Promise}
	 * @private
	 */


	function positionMirror() {
	  var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	      _ref9$withFrame = _ref9.withFrame,
	      withFrame = _ref9$withFrame === void 0 ? false : _ref9$withFrame,
	      _ref9$initial = _ref9.initial,
	      initial = _ref9$initial === void 0 ? false : _ref9$initial;

	  return function (_ref10) {
	    var mirror = _ref10.mirror,
	        sensorEvent = _ref10.sensorEvent,
	        mirrorOffset = _ref10.mirrorOffset,
	        initialY = _ref10.initialY,
	        initialX = _ref10.initialX,
	        scrollOffset = _ref10.scrollOffset,
	        options = _ref10.options,
	        passedThreshX = _ref10.passedThreshX,
	        passedThreshY = _ref10.passedThreshY,
	        lastMovedX = _ref10.lastMovedX,
	        lastMovedY = _ref10.lastMovedY,
	        args = objectWithoutProperties(_ref10, ["mirror", "sensorEvent", "mirrorOffset", "initialY", "initialX", "scrollOffset", "options", "passedThreshX", "passedThreshY", "lastMovedX", "lastMovedY"]);

	    return withPromise(function (resolve) {
	      var result = _objectSpread$4({
	        mirror: mirror,
	        sensorEvent: sensorEvent,
	        mirrorOffset: mirrorOffset,
	        options: options
	      }, args);

	      if (mirrorOffset) {
	        var x = passedThreshX ? Math.round((sensorEvent.clientX - mirrorOffset.left - scrollOffset.x) / (options.thresholdX || 1)) * (options.thresholdX || 1) : Math.round(lastMovedX);
	        var y = passedThreshY ? Math.round((sensorEvent.clientY - mirrorOffset.top - scrollOffset.y) / (options.thresholdY || 1)) * (options.thresholdY || 1) : Math.round(lastMovedY);

	        if (options.xAxis && options.yAxis || initial) {
	          mirror.style.transform = "translate3d(".concat(x, "px, ").concat(y, "px, 0)");
	        } else if (options.xAxis && !options.yAxis) {
	          mirror.style.transform = "translate3d(".concat(x, "px, ").concat(initialY, "px, 0)");
	        } else if (options.yAxis && !options.xAxis) {
	          mirror.style.transform = "translate3d(".concat(initialX, "px, ").concat(y, "px, 0)");
	        }

	        if (initial) {
	          result.initialX = x;
	          result.initialY = y;
	        }

	        result.lastMovedX = x;
	        result.lastMovedY = y;
	      }

	      resolve(result);
	    }, {
	      frame: withFrame
	    });
	  };
	}
	/**
	 * Wraps functions in promise with potential animation frame option
	 * @param {Function} callback
	 * @param {Object} options
	 * @param {Boolean} options.raf
	 * @return {Promise}
	 * @private
	 */


	function withPromise(callback) {
	  var _ref11 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	      _ref11$raf = _ref11.raf,
	      raf = _ref11$raf === void 0 ? false : _ref11$raf;

	  return new Promise(function (resolve, reject) {
	    if (raf) {
	      requestAnimationFrame(function () {
	        callback(resolve, reject);
	      });
	    } else {
	      callback(resolve, reject);
	    }
	  });
	}
	/**
	 * Returns true if the sensor event was triggered by a native browser drag event
	 * @param {SensorEvent} sensorEvent
	 */


	function isNativeDragEvent(sensorEvent) {
	  return /^drag/.test(sensorEvent.originalEvent.type);
	}

	function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$6(Object(source), true).forEach(function (key) { defineProperty$6(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _createSuper$9(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$9(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$9() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	var onDragStart$1 = Symbol('onDragStart');
	var onDragMove$1 = Symbol('onDragMove');
	var onDragStop$1 = Symbol('onDragStop');
	var scroll = Symbol('scroll');
	/**
	 * Scrollable default options
	 * @property {Object} defaultOptions
	 * @property {Number} defaultOptions.speed
	 * @property {Number} defaultOptions.sensitivity
	 * @property {HTMLElement[]} defaultOptions.scrollableElements
	 * @type {Object}
	 */

	var defaultOptions$3 = {
	  speed: 6,
	  sensitivity: 50,
	  scrollableElements: []
	};
	/**
	 * Scrollable plugin which scrolls the closest scrollable parent
	 * @class Scrollable
	 * @module Scrollable
	 * @extends AbstractPlugin
	 */

	var Scrollable = /*#__PURE__*/function (_AbstractPlugin) {
	  inherits(Scrollable, _AbstractPlugin);

	  var _super = _createSuper$9(Scrollable);

	  /**
	   * Scrollable constructor.
	   * @constructs Scrollable
	   * @param {Draggable} draggable - Draggable instance
	   */
	  function Scrollable(draggable) {
	    var _this;

	    classCallCheck(this, Scrollable);

	    _this = _super.call(this, draggable);
	    /**
	     * Scrollable options
	     * @property {Object} options
	     * @property {Number} options.speed
	     * @property {Number} options.sensitivity
	     * @property {HTMLElement[]} options.scrollableElements
	     * @type {Object}
	     */

	    _this.options = _objectSpread$5(_objectSpread$5({}, defaultOptions$3), _this.getOptions());
	    /**
	     * Keeps current mouse position
	     * @property {Object} currentMousePosition
	     * @property {Number} currentMousePosition.clientX
	     * @property {Number} currentMousePosition.clientY
	     * @type {Object|null}
	     */

	    _this.currentMousePosition = null;
	    /**
	     * Scroll animation frame
	     * @property scrollAnimationFrame
	     * @type {Number|null}
	     */

	    _this.scrollAnimationFrame = null;
	    /**
	     * Closest scrollable element
	     * @property scrollableElement
	     * @type {HTMLElement|null}
	     */

	    _this.scrollableElement = null;
	    /**
	     * Animation frame looking for the closest scrollable element
	     * @property findScrollableElementFrame
	     * @type {Number|null}
	     */

	    _this.findScrollableElementFrame = null;
	    _this[onDragStart$1] = _this[onDragStart$1].bind(assertThisInitialized(_this));
	    _this[onDragMove$1] = _this[onDragMove$1].bind(assertThisInitialized(_this));
	    _this[onDragStop$1] = _this[onDragStop$1].bind(assertThisInitialized(_this));
	    _this[scroll] = _this[scroll].bind(assertThisInitialized(_this));
	    return _this;
	  }
	  /**
	   * Attaches plugins event listeners
	   */


	  createClass(Scrollable, [{
	    key: "attach",
	    value: function attach() {
	      this.draggable.on('drag:start', this[onDragStart$1]).on('drag:move', this[onDragMove$1]).on('drag:stop', this[onDragStop$1]);
	    }
	    /**
	     * Detaches plugins event listeners
	     */

	  }, {
	    key: "detach",
	    value: function detach() {
	      this.draggable.off('drag:start', this[onDragStart$1]).off('drag:move', this[onDragMove$1]).off('drag:stop', this[onDragStop$1]);
	    }
	    /**
	     * Returns options passed through draggable
	     * @return {Object}
	     */

	  }, {
	    key: "getOptions",
	    value: function getOptions() {
	      return this.draggable.options.scrollable || {};
	    }
	    /**
	     * Returns closest scrollable elements by element
	     * @param {HTMLElement} target
	     * @return {HTMLElement}
	     */

	  }, {
	    key: "getScrollableElement",
	    value: function getScrollableElement(target) {
	      if (this.hasDefinedScrollableElements()) {
	        return closest(target, this.options.scrollableElements) || document.documentElement;
	      } else {
	        return closestScrollableElement(target);
	      }
	    }
	    /**
	     * Returns true if at least one scrollable element have been defined via options
	     * @param {HTMLElement} target
	     * @return {Boolean}
	     */

	  }, {
	    key: "hasDefinedScrollableElements",
	    value: function hasDefinedScrollableElements() {
	      return Boolean(this.options.scrollableElements.length !== 0);
	    }
	    /**
	     * Drag start handler. Finds closest scrollable parent in separate frame
	     * @param {DragStartEvent} dragEvent
	     * @private
	     */

	  }, {
	    key: onDragStart$1,
	    value: function value(dragEvent) {
	      var _this2 = this;

	      this.findScrollableElementFrame = requestAnimationFrame(function () {
	        _this2.scrollableElement = _this2.getScrollableElement(dragEvent.source);
	      });
	    }
	    /**
	     * Drag move handler. Remembers mouse position and initiates scrolling
	     * @param {DragMoveEvent} dragEvent
	     * @private
	     */

	  }, {
	    key: onDragMove$1,
	    value: function value(dragEvent) {
	      var _this3 = this;

	      this.findScrollableElementFrame = requestAnimationFrame(function () {
	        _this3.scrollableElement = _this3.getScrollableElement(dragEvent.sensorEvent.target);
	      });

	      if (!this.scrollableElement) {
	        return;
	      }

	      var sensorEvent = dragEvent.sensorEvent;
	      var scrollOffset = {
	        x: 0,
	        y: 0
	      };

	      if ('ontouchstart' in window) {
	        scrollOffset.y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	        scrollOffset.x = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
	      }

	      this.currentMousePosition = {
	        clientX: sensorEvent.clientX - scrollOffset.x,
	        clientY: sensorEvent.clientY - scrollOffset.y
	      };
	      this.scrollAnimationFrame = requestAnimationFrame(this[scroll]);
	    }
	    /**
	     * Drag stop handler. Cancels scroll animations and resets state
	     * @private
	     */

	  }, {
	    key: onDragStop$1,
	    value: function value() {
	      cancelAnimationFrame(this.scrollAnimationFrame);
	      cancelAnimationFrame(this.findScrollableElementFrame);
	      this.scrollableElement = null;
	      this.scrollAnimationFrame = null;
	      this.findScrollableElementFrame = null;
	      this.currentMousePosition = null;
	    }
	    /**
	     * Scroll function that does the heavylifting
	     * @private
	     */

	  }, {
	    key: scroll,
	    value: function value() {
	      if (!this.scrollableElement || !this.currentMousePosition) {
	        return;
	      }

	      cancelAnimationFrame(this.scrollAnimationFrame);
	      var _this$options = this.options,
	          speed = _this$options.speed,
	          sensitivity = _this$options.sensitivity;
	      var rect = this.scrollableElement.getBoundingClientRect();
	      var bottomCutOff = rect.bottom > window.innerHeight;
	      var topCutOff = rect.top < 0;
	      var cutOff = topCutOff || bottomCutOff;
	      var documentScrollingElement = getDocumentScrollingElement();
	      var scrollableElement = this.scrollableElement;
	      var clientX = this.currentMousePosition.clientX;
	      var clientY = this.currentMousePosition.clientY;

	      if (scrollableElement !== document.body && scrollableElement !== document.documentElement && !cutOff) {
	        var offsetHeight = scrollableElement.offsetHeight,
	            offsetWidth = scrollableElement.offsetWidth;

	        if (rect.top + offsetHeight - clientY < sensitivity) {
	          scrollableElement.scrollTop += speed;
	        } else if (clientY - rect.top < sensitivity) {
	          scrollableElement.scrollTop -= speed;
	        }

	        if (rect.left + offsetWidth - clientX < sensitivity) {
	          scrollableElement.scrollLeft += speed;
	        } else if (clientX - rect.left < sensitivity) {
	          scrollableElement.scrollLeft -= speed;
	        }
	      } else {
	        var _window = window,
	            innerHeight = _window.innerHeight,
	            innerWidth = _window.innerWidth;

	        if (clientY < sensitivity) {
	          documentScrollingElement.scrollTop -= speed;
	        } else if (innerHeight - clientY < sensitivity) {
	          documentScrollingElement.scrollTop += speed;
	        }

	        if (clientX < sensitivity) {
	          documentScrollingElement.scrollLeft -= speed;
	        } else if (innerWidth - clientX < sensitivity) {
	          documentScrollingElement.scrollLeft += speed;
	        }
	      }

	      this.scrollAnimationFrame = requestAnimationFrame(this[scroll]);
	    }
	  }]);

	  return Scrollable;
	}(AbstractPlugin);

	function hasOverflow(element) {
	  var overflowRegex = /(auto|scroll)/;
	  var computedStyles = getComputedStyle(element, null);
	  var overflow = computedStyles.getPropertyValue('overflow') + computedStyles.getPropertyValue('overflow-y') + computedStyles.getPropertyValue('overflow-x');
	  return overflowRegex.test(overflow);
	}
	/**
	 * Returns true if the passed element is statically positioned
	 * @param {HTMLElement} element
	 * @return {Boolean}
	 * @private
	 */


	function isStaticallyPositioned(element) {
	  var position = getComputedStyle(element).getPropertyValue('position');
	  return position === 'static';
	}
	/**
	 * Finds closest scrollable element
	 * @param {HTMLElement} element
	 * @return {HTMLElement}
	 * @private
	 */


	function closestScrollableElement(element) {
	  if (!element) {
	    return getDocumentScrollingElement();
	  }

	  var position = getComputedStyle(element).getPropertyValue('position');
	  var excludeStaticParents = position === 'absolute';
	  var scrollableElement = closest(element, function (parent) {
	    if (excludeStaticParents && isStaticallyPositioned(parent)) {
	      return false;
	    }

	    return hasOverflow(parent);
	  });

	  if (position === 'fixed' || !scrollableElement) {
	    return getDocumentScrollingElement();
	  } else {
	    return scrollableElement;
	  }
	}
	/**
	 * Returns element that scrolls document
	 * @return {HTMLElement}
	 * @private
	 */


	function getDocumentScrollingElement() {
	  return document.scrollingElement || document.documentElement;
	}

	/**
	 * The Emitter is a simple emitter class that provides you with `on()`, `off()` and `trigger()` methods
	 * @class Emitter
	 * @module Emitter
	 */
	var Emitter = /*#__PURE__*/function () {
	  function Emitter() {
	    classCallCheck(this, Emitter);

	    this.callbacks = {};
	  }
	  /**
	   * Registers callbacks by event name
	   * @param {String} type
	   * @param {...Function} callbacks
	   */


	  createClass(Emitter, [{
	    key: "on",
	    value: function on(type) {
	      var _this$callbacks$type;

	      if (!this.callbacks[type]) {
	        this.callbacks[type] = [];
	      }

	      for (var _len = arguments.length, callbacks = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        callbacks[_key - 1] = arguments[_key];
	      }

	      (_this$callbacks$type = this.callbacks[type]).push.apply(_this$callbacks$type, callbacks);

	      return this;
	    }
	    /**
	     * Unregisters callbacks by event name
	     * @param {String} type
	     * @param {Function} callback
	     */

	  }, {
	    key: "off",
	    value: function off(type, callback) {
	      if (!this.callbacks[type]) {
	        return null;
	      }

	      var copy = this.callbacks[type].slice(0);

	      for (var i = 0; i < copy.length; i++) {
	        if (callback === copy[i]) {
	          this.callbacks[type].splice(i, 1);
	        }
	      }

	      return this;
	    }
	    /**
	     * Triggers event callbacks by event object
	     * @param {AbstractEvent} event
	     */

	  }, {
	    key: "trigger",
	    value: function trigger(event) {
	      if (!this.callbacks[event.type]) {
	        return null;
	      }

	      var callbacks = toConsumableArray(this.callbacks[event.type]);

	      var caughtErrors = [];

	      for (var i = callbacks.length - 1; i >= 0; i--) {
	        var callback = callbacks[i];

	        try {
	          callback(event);
	        } catch (error) {
	          caughtErrors.push(error);
	        }
	      }

	      if (caughtErrors.length) {
	        /* eslint-disable no-console */
	        console.error("Draggable caught errors while triggering '".concat(event.type, "'"), caughtErrors);
	        /* eslint-disable no-console */
	      }

	      return this;
	    }
	  }]);

	  return Emitter;
	}();

	function _createSuper$a(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$a(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$a() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	/**
	 * Base draggable event
	 * @class DraggableEvent
	 * @module DraggableEvent
	 * @extends AbstractEvent
	 */

	var DraggableEvent = /*#__PURE__*/function (_AbstractEvent) {
	  inherits(DraggableEvent, _AbstractEvent);

	  var _super = _createSuper$a(DraggableEvent);

	  function DraggableEvent() {
	    classCallCheck(this, DraggableEvent);

	    return _super.apply(this, arguments);
	  }

	  createClass(DraggableEvent, [{
	    key: "draggable",

	    /**
	     * Draggable instance
	     * @property draggable
	     * @type {Draggable}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.draggable;
	    }
	  }]);

	  return DraggableEvent;
	}(AbstractEvent);
	/**
	 * Draggable initialized event
	 * @class DraggableInitializedEvent
	 * @module DraggableInitializedEvent
	 * @extends DraggableEvent
	 */

	defineProperty$6(DraggableEvent, "type", 'draggable');

	var DraggableInitializedEvent = /*#__PURE__*/function (_DraggableEvent) {
	  inherits(DraggableInitializedEvent, _DraggableEvent);

	  var _super2 = _createSuper$a(DraggableInitializedEvent);

	  function DraggableInitializedEvent() {
	    classCallCheck(this, DraggableInitializedEvent);

	    return _super2.apply(this, arguments);
	  }

	  return DraggableInitializedEvent;
	}(DraggableEvent);
	/**
	 * Draggable destory event
	 * @class DraggableInitializedEvent
	 * @module DraggableDestroyEvent
	 * @extends DraggableDestroyEvent
	 */

	defineProperty$6(DraggableInitializedEvent, "type", 'draggable:initialize');

	var DraggableDestroyEvent = /*#__PURE__*/function (_DraggableEvent2) {
	  inherits(DraggableDestroyEvent, _DraggableEvent2);

	  var _super3 = _createSuper$a(DraggableDestroyEvent);

	  function DraggableDestroyEvent() {
	    classCallCheck(this, DraggableDestroyEvent);

	    return _super3.apply(this, arguments);
	  }

	  return DraggableDestroyEvent;
	}(DraggableEvent);

	defineProperty$6(DraggableDestroyEvent, "type", 'draggable:destroy');

	function _createSuper$b(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$b(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$b() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	/**
	 * Base drag event
	 * @class DragEvent
	 * @module DragEvent
	 * @extends AbstractEvent
	 */

	var DragEvent = /*#__PURE__*/function (_AbstractEvent) {
	  inherits(DragEvent, _AbstractEvent);

	  var _super = _createSuper$b(DragEvent);

	  function DragEvent() {
	    classCallCheck(this, DragEvent);

	    return _super.apply(this, arguments);
	  }

	  createClass(DragEvent, [{
	    key: "source",

	    /**
	     * Draggables source element
	     * @property source
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.source;
	    }
	    /**
	     * Draggables original source element
	     * @property originalSource
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "originalSource",
	    get: function get() {
	      return this.data.originalSource;
	    }
	    /**
	     * Draggables mirror element
	     * @property mirror
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "mirror",
	    get: function get() {
	      return this.data.mirror;
	    }
	    /**
	     * Draggables source container element
	     * @property sourceContainer
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "sourceContainer",
	    get: function get() {
	      return this.data.sourceContainer;
	    }
	    /**
	     * Sensor event
	     * @property sensorEvent
	     * @type {SensorEvent}
	     * @readonly
	     */

	  }, {
	    key: "sensorEvent",
	    get: function get() {
	      return this.data.sensorEvent;
	    }
	    /**
	     * Original event that triggered sensor event
	     * @property originalEvent
	     * @type {Event}
	     * @readonly
	     */

	  }, {
	    key: "originalEvent",
	    get: function get() {
	      if (this.sensorEvent) {
	        return this.sensorEvent.originalEvent;
	      }

	      return null;
	    }
	  }]);

	  return DragEvent;
	}(AbstractEvent);
	/**
	 * Drag start event
	 * @class DragStartEvent
	 * @module DragStartEvent
	 * @extends DragEvent
	 */

	defineProperty$6(DragEvent, "type", 'drag');

	var DragStartEvent = /*#__PURE__*/function (_DragEvent) {
	  inherits(DragStartEvent, _DragEvent);

	  var _super2 = _createSuper$b(DragStartEvent);

	  function DragStartEvent() {
	    classCallCheck(this, DragStartEvent);

	    return _super2.apply(this, arguments);
	  }

	  return DragStartEvent;
	}(DragEvent);
	/**
	 * Drag move event
	 * @class DragMoveEvent
	 * @module DragMoveEvent
	 * @extends DragEvent
	 */

	defineProperty$6(DragStartEvent, "type", 'drag:start');

	defineProperty$6(DragStartEvent, "cancelable", true);

	var DragMoveEvent = /*#__PURE__*/function (_DragEvent2) {
	  inherits(DragMoveEvent, _DragEvent2);

	  var _super3 = _createSuper$b(DragMoveEvent);

	  function DragMoveEvent() {
	    classCallCheck(this, DragMoveEvent);

	    return _super3.apply(this, arguments);
	  }

	  return DragMoveEvent;
	}(DragEvent);
	/**
	 * Drag over event
	 * @class DragOverEvent
	 * @module DragOverEvent
	 * @extends DragEvent
	 */

	defineProperty$6(DragMoveEvent, "type", 'drag:move');

	var DragOverEvent = /*#__PURE__*/function (_DragEvent3) {
	  inherits(DragOverEvent, _DragEvent3);

	  var _super4 = _createSuper$b(DragOverEvent);

	  function DragOverEvent() {
	    classCallCheck(this, DragOverEvent);

	    return _super4.apply(this, arguments);
	  }

	  createClass(DragOverEvent, [{
	    key: "overContainer",

	    /**
	     * Draggable container you are over
	     * @property overContainer
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.overContainer;
	    }
	    /**
	     * Draggable element you are over
	     * @property over
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "over",
	    get: function get() {
	      return this.data.over;
	    }
	  }]);

	  return DragOverEvent;
	}(DragEvent);
	/**
	 * Drag out event
	 * @class DragOutEvent
	 * @module DragOutEvent
	 * @extends DragEvent
	 */

	defineProperty$6(DragOverEvent, "type", 'drag:over');

	defineProperty$6(DragOverEvent, "cancelable", true);

	var DragOutEvent = /*#__PURE__*/function (_DragEvent4) {
	  inherits(DragOutEvent, _DragEvent4);

	  var _super5 = _createSuper$b(DragOutEvent);

	  function DragOutEvent() {
	    classCallCheck(this, DragOutEvent);

	    return _super5.apply(this, arguments);
	  }

	  createClass(DragOutEvent, [{
	    key: "overContainer",

	    /**
	     * Draggable container you are over
	     * @property overContainer
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.overContainer;
	    }
	    /**
	     * Draggable element you left
	     * @property over
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "over",
	    get: function get() {
	      return this.data.over;
	    }
	  }]);

	  return DragOutEvent;
	}(DragEvent);
	/**
	 * Drag over container event
	 * @class DragOverContainerEvent
	 * @module DragOverContainerEvent
	 * @extends DragEvent
	 */

	defineProperty$6(DragOutEvent, "type", 'drag:out');

	var DragOverContainerEvent = /*#__PURE__*/function (_DragEvent5) {
	  inherits(DragOverContainerEvent, _DragEvent5);

	  var _super6 = _createSuper$b(DragOverContainerEvent);

	  function DragOverContainerEvent() {
	    classCallCheck(this, DragOverContainerEvent);

	    return _super6.apply(this, arguments);
	  }

	  createClass(DragOverContainerEvent, [{
	    key: "overContainer",

	    /**
	     * Draggable container you are over
	     * @property overContainer
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.overContainer;
	    }
	  }]);

	  return DragOverContainerEvent;
	}(DragEvent);
	/**
	 * Drag out container event
	 * @class DragOutContainerEvent
	 * @module DragOutContainerEvent
	 * @extends DragEvent
	 */

	defineProperty$6(DragOverContainerEvent, "type", 'drag:over:container');

	var DragOutContainerEvent = /*#__PURE__*/function (_DragEvent6) {
	  inherits(DragOutContainerEvent, _DragEvent6);

	  var _super7 = _createSuper$b(DragOutContainerEvent);

	  function DragOutContainerEvent() {
	    classCallCheck(this, DragOutContainerEvent);

	    return _super7.apply(this, arguments);
	  }

	  createClass(DragOutContainerEvent, [{
	    key: "overContainer",

	    /**
	     * Draggable container you left
	     * @property overContainer
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.overContainer;
	    }
	  }]);

	  return DragOutContainerEvent;
	}(DragEvent);
	/**
	 * Drag pressure event
	 * @class DragPressureEvent
	 * @module DragPressureEvent
	 * @extends DragEvent
	 */

	defineProperty$6(DragOutContainerEvent, "type", 'drag:out:container');

	var DragPressureEvent = /*#__PURE__*/function (_DragEvent7) {
	  inherits(DragPressureEvent, _DragEvent7);

	  var _super8 = _createSuper$b(DragPressureEvent);

	  function DragPressureEvent() {
	    classCallCheck(this, DragPressureEvent);

	    return _super8.apply(this, arguments);
	  }

	  createClass(DragPressureEvent, [{
	    key: "pressure",

	    /**
	     * Pressure applied on draggable element
	     * @property pressure
	     * @type {Number}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.pressure;
	    }
	  }]);

	  return DragPressureEvent;
	}(DragEvent);
	/**
	 * Drag stop event
	 * @class DragStopEvent
	 * @module DragStopEvent
	 * @extends DragEvent
	 */

	defineProperty$6(DragPressureEvent, "type", 'drag:pressure');

	var DragStopEvent = /*#__PURE__*/function (_DragEvent8) {
	  inherits(DragStopEvent, _DragEvent8);

	  var _super9 = _createSuper$b(DragStopEvent);

	  function DragStopEvent() {
	    classCallCheck(this, DragStopEvent);

	    return _super9.apply(this, arguments);
	  }

	  return DragStopEvent;
	}(DragEvent);
	/**
	 * Drag stopped event
	 * @class DragStoppedEvent
	 * @module DragStoppedEvent
	 * @extends DragEvent
	 */

	defineProperty$6(DragStopEvent, "type", 'drag:stop');

	var DragStoppedEvent = /*#__PURE__*/function (_DragEvent9) {
	  inherits(DragStoppedEvent, _DragEvent9);

	  var _super10 = _createSuper$b(DragStoppedEvent);

	  function DragStoppedEvent() {
	    classCallCheck(this, DragStoppedEvent);

	    return _super10.apply(this, arguments);
	  }

	  return DragStoppedEvent;
	}(DragEvent);

	defineProperty$6(DragStoppedEvent, "type", 'drag:stopped');

	function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$7(Object(source), true).forEach(function (key) { defineProperty$6(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
	var onDragStart$2 = Symbol('onDragStart');
	var onDragMove$2 = Symbol('onDragMove');
	var onDragStop$2 = Symbol('onDragStop');
	var onDragPressure = Symbol('onDragPressure');
	/**
	 * @const {Object} defaultAnnouncements
	 * @const {Function} defaultAnnouncements['drag:start']
	 * @const {Function} defaultAnnouncements['drag:stop']
	 */

	var defaultAnnouncements = {
	  'drag:start': function dragStart(event) {
	    return "Picked up ".concat(event.source.textContent.trim() || event.source.id || 'draggable element');
	  },
	  'drag:stop': function dragStop(event) {
	    return "Released ".concat(event.source.textContent.trim() || event.source.id || 'draggable element');
	  }
	};
	var defaultClasses = {
	  'container:dragging': 'draggable-container--is-dragging',
	  'source:dragging': 'draggable-source--is-dragging',
	  'source:placed': 'draggable-source--placed',
	  'container:placed': 'draggable-container--placed',
	  'body:dragging': 'draggable--is-dragging',
	  'draggable:over': 'draggable--over',
	  'container:over': 'draggable-container--over',
	  'source:original': 'draggable--original',
	  mirror: 'draggable-mirror'
	};
	var defaultOptions$4 = {
	  draggable: '.draggable-source',
	  handle: null,
	  delay: 100,
	  distance: 0,
	  placedTimeout: 800,
	  plugins: [],
	  sensors: [],
	  exclude: {
	    plugins: [],
	    sensors: []
	  }
	};
	/**
	 * This is the core draggable library that does the heavy lifting
	 * @class Draggable
	 * @module Draggable
	 */

	var Draggable = /*#__PURE__*/function () {
	  /**
	   * Default plugins draggable uses
	   * @static
	   * @property {Object} Plugins
	   * @property {Announcement} Plugins.Announcement
	   * @property {Focusable} Plugins.Focusable
	   * @property {Mirror} Plugins.Mirror
	   * @property {Scrollable} Plugins.Scrollable
	   * @type {Object}
	   */

	  /**
	   * Default sensors draggable uses
	   * @static
	   * @property {Object} Sensors
	   * @property {MouseSensor} Sensors.MouseSensor
	   * @property {TouchSensor} Sensors.TouchSensor
	   * @type {Object}
	   */

	  /**
	   * Draggable constructor.
	   * @constructs Draggable
	   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Draggable containers
	   * @param {Object} options - Options for draggable
	   */
	  function Draggable() {
	    var _this = this;

	    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [document.body];
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    classCallCheck(this, Draggable);

	    /**
	     * Draggable containers
	     * @property containers
	     * @type {HTMLElement[]}
	     */
	    if (containers instanceof NodeList || containers instanceof Array) {
	      this.containers = toConsumableArray(containers);
	    } else if (containers instanceof HTMLElement) {
	      this.containers = [containers];
	    } else {
	      throw new Error('Draggable containers are expected to be of type `NodeList`, `HTMLElement[]` or `HTMLElement`');
	    }

	    this.options = _objectSpread$6(_objectSpread$6(_objectSpread$6({}, defaultOptions$4), options), {}, {
	      classes: _objectSpread$6(_objectSpread$6({}, defaultClasses), options.classes || {}),
	      announcements: _objectSpread$6(_objectSpread$6({}, defaultAnnouncements), options.announcements || {}),
	      exclude: {
	        plugins: options.exclude && options.exclude.plugins || [],
	        sensors: options.exclude && options.exclude.sensors || []
	      }
	    });
	    /**
	     * Draggables event emitter
	     * @property emitter
	     * @type {Emitter}
	     */

	    this.emitter = new Emitter();
	    /**
	     * Current drag state
	     * @property dragging
	     * @type {Boolean}
	     */

	    this.dragging = false;
	    /**
	     * Active plugins
	     * @property plugins
	     * @type {Plugin[]}
	     */

	    this.plugins = [];
	    /**
	     * Active sensors
	     * @property sensors
	     * @type {Sensor[]}
	     */

	    this.sensors = [];
	    this[onDragStart$2] = this[onDragStart$2].bind(this);
	    this[onDragMove$2] = this[onDragMove$2].bind(this);
	    this[onDragStop$2] = this[onDragStop$2].bind(this);
	    this[onDragPressure] = this[onDragPressure].bind(this);
	    document.addEventListener('drag:start', this[onDragStart$2], true);
	    document.addEventListener('drag:move', this[onDragMove$2], true);
	    document.addEventListener('drag:stop', this[onDragStop$2], true);
	    document.addEventListener('drag:pressure', this[onDragPressure], true);
	    var defaultPlugins = Object.values(Draggable.Plugins).filter(function (Plugin) {
	      return !_this.options.exclude.plugins.includes(Plugin);
	    });
	    var defaultSensors = Object.values(Draggable.Sensors).filter(function (sensor) {
	      return !_this.options.exclude.sensors.includes(sensor);
	    });
	    this.addPlugin.apply(this, [].concat(toConsumableArray(defaultPlugins), toConsumableArray(this.options.plugins)));
	    this.addSensor.apply(this, [].concat(toConsumableArray(defaultSensors), toConsumableArray(this.options.sensors)));
	    var draggableInitializedEvent = new DraggableInitializedEvent({
	      draggable: this
	    });
	    this.on('mirror:created', function (_ref) {
	      var mirror = _ref.mirror;
	      return _this.mirror = mirror;
	    });
	    this.on('mirror:destroy', function () {
	      return _this.mirror = null;
	    });
	    this.trigger(draggableInitializedEvent);
	  }
	  /**
	   * Destroys Draggable instance. This removes all internal event listeners and
	   * deactivates sensors and plugins
	   */


	  createClass(Draggable, [{
	    key: "destroy",
	    value: function destroy() {
	      document.removeEventListener('drag:start', this[onDragStart$2], true);
	      document.removeEventListener('drag:move', this[onDragMove$2], true);
	      document.removeEventListener('drag:stop', this[onDragStop$2], true);
	      document.removeEventListener('drag:pressure', this[onDragPressure], true);
	      var draggableDestroyEvent = new DraggableDestroyEvent({
	        draggable: this
	      });
	      this.trigger(draggableDestroyEvent);
	      this.removePlugin.apply(this, toConsumableArray(this.plugins.map(function (plugin) {
	        return plugin.constructor;
	      })));
	      this.removeSensor.apply(this, toConsumableArray(this.sensors.map(function (sensor) {
	        return sensor.constructor;
	      })));
	    }
	    /**
	     * Adds plugin to this draggable instance. This will end up calling the attach method of the plugin
	     * @param {...typeof Plugin} plugins - Plugins that you want attached to draggable
	     * @return {Draggable}
	     * @example draggable.addPlugin(CustomA11yPlugin, CustomMirrorPlugin)
	     */

	  }, {
	    key: "addPlugin",
	    value: function addPlugin() {
	      var _this2 = this;

	      for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
	        plugins[_key] = arguments[_key];
	      }

	      var activePlugins = plugins.map(function (Plugin) {
	        return new Plugin(_this2);
	      });
	      activePlugins.forEach(function (plugin) {
	        return plugin.attach();
	      });
	      this.plugins = [].concat(toConsumableArray(this.plugins), toConsumableArray(activePlugins));
	      return this;
	    }
	    /**
	     * Removes plugins that are already attached to this draggable instance. This will end up calling
	     * the detach method of the plugin
	     * @param {...typeof Plugin} plugins - Plugins that you want detached from draggable
	     * @return {Draggable}
	     * @example draggable.removePlugin(MirrorPlugin, CustomMirrorPlugin)
	     */

	  }, {
	    key: "removePlugin",
	    value: function removePlugin() {
	      for (var _len2 = arguments.length, plugins = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        plugins[_key2] = arguments[_key2];
	      }

	      var removedPlugins = this.plugins.filter(function (plugin) {
	        return plugins.includes(plugin.constructor);
	      });
	      removedPlugins.forEach(function (plugin) {
	        return plugin.detach();
	      });
	      this.plugins = this.plugins.filter(function (plugin) {
	        return !plugins.includes(plugin.constructor);
	      });
	      return this;
	    }
	    /**
	     * Adds sensors to this draggable instance. This will end up calling the attach method of the sensor
	     * @param {...typeof Sensor} sensors - Sensors that you want attached to draggable
	     * @return {Draggable}
	     * @example draggable.addSensor(ForceTouchSensor, CustomSensor)
	     */

	  }, {
	    key: "addSensor",
	    value: function addSensor() {
	      var _this3 = this;

	      for (var _len3 = arguments.length, sensors = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        sensors[_key3] = arguments[_key3];
	      }

	      var activeSensors = sensors.map(function (Sensor) {
	        return new Sensor(_this3.containers, _this3.options);
	      });
	      activeSensors.forEach(function (sensor) {
	        return sensor.attach();
	      });
	      this.sensors = [].concat(toConsumableArray(this.sensors), toConsumableArray(activeSensors));
	      return this;
	    }
	    /**
	     * Removes sensors that are already attached to this draggable instance. This will end up calling
	     * the detach method of the sensor
	     * @param {...typeof Sensor} sensors - Sensors that you want attached to draggable
	     * @return {Draggable}
	     * @example draggable.removeSensor(TouchSensor, DragSensor)
	     */

	  }, {
	    key: "removeSensor",
	    value: function removeSensor() {
	      for (var _len4 = arguments.length, sensors = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	        sensors[_key4] = arguments[_key4];
	      }

	      var removedSensors = this.sensors.filter(function (sensor) {
	        return sensors.includes(sensor.constructor);
	      });
	      removedSensors.forEach(function (sensor) {
	        return sensor.detach();
	      });
	      this.sensors = this.sensors.filter(function (sensor) {
	        return !sensors.includes(sensor.constructor);
	      });
	      return this;
	    }
	    /**
	     * Adds container to this draggable instance
	     * @param {...HTMLElement} containers - Containers you want to add to draggable
	     * @return {Draggable}
	     * @example draggable.addContainer(document.body)
	     */

	  }, {
	    key: "addContainer",
	    value: function addContainer() {
	      for (var _len5 = arguments.length, containers = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	        containers[_key5] = arguments[_key5];
	      }

	      this.containers = [].concat(toConsumableArray(this.containers), containers);
	      this.sensors.forEach(function (sensor) {
	        return sensor.addContainer.apply(sensor, containers);
	      });
	      return this;
	    }
	    /**
	     * Removes container from this draggable instance
	     * @param {...HTMLElement} containers - Containers you want to remove from draggable
	     * @return {Draggable}
	     * @example draggable.removeContainer(document.body)
	     */

	  }, {
	    key: "removeContainer",
	    value: function removeContainer() {
	      for (var _len6 = arguments.length, containers = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
	        containers[_key6] = arguments[_key6];
	      }

	      this.containers = this.containers.filter(function (container) {
	        return !containers.includes(container);
	      });
	      this.sensors.forEach(function (sensor) {
	        return sensor.removeContainer.apply(sensor, containers);
	      });
	      return this;
	    }
	    /**
	     * Adds listener for draggable events
	     * @param {String} type - Event name
	     * @param {...Function} callbacks - Event callbacks
	     * @return {Draggable}
	     * @example draggable.on('drag:start', (dragEvent) => dragEvent.cancel());
	     */

	  }, {
	    key: "on",
	    value: function on(type) {
	      var _this$emitter;

	      for (var _len7 = arguments.length, callbacks = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
	        callbacks[_key7 - 1] = arguments[_key7];
	      }

	      (_this$emitter = this.emitter).on.apply(_this$emitter, [type].concat(callbacks));

	      return this;
	    }
	    /**
	     * Removes listener from draggable
	     * @param {String} type - Event name
	     * @param {Function} callback - Event callback
	     * @return {Draggable}
	     * @example draggable.off('drag:start', handlerFunction);
	     */

	  }, {
	    key: "off",
	    value: function off(type, callback) {
	      this.emitter.off(type, callback);
	      return this;
	    }
	    /**
	     * Triggers draggable event
	     * @param {AbstractEvent} event - Event instance
	     * @return {Draggable}
	     * @example draggable.trigger(event);
	     */

	  }, {
	    key: "trigger",
	    value: function trigger(event) {
	      this.emitter.trigger(event);
	      return this;
	    }
	    /**
	     * Returns class name for class identifier
	     * @param {String} name - Name of class identifier
	     * @return {String|null}
	     */

	  }, {
	    key: "getClassNameFor",
	    value: function getClassNameFor(name) {
	      return this.options.classes[name];
	    }
	    /**
	     * Returns true if this draggable instance is currently dragging
	     * @return {Boolean}
	     */

	  }, {
	    key: "isDragging",
	    value: function isDragging() {
	      return Boolean(this.dragging);
	    }
	    /**
	     * Returns all draggable elements
	     * @return {HTMLElement[]}
	     */

	  }, {
	    key: "getDraggableElements",
	    value: function getDraggableElements() {
	      var _this4 = this;

	      return this.containers.reduce(function (current, container) {
	        return [].concat(toConsumableArray(current), toConsumableArray(_this4.getDraggableElementsForContainer(container)));
	      }, []);
	    }
	    /**
	     * Returns draggable elements for a given container, excluding the mirror and
	     * original source element if present
	     * @param {HTMLElement} container
	     * @return {HTMLElement[]}
	     */

	  }, {
	    key: "getDraggableElementsForContainer",
	    value: function getDraggableElementsForContainer(container) {
	      var _this5 = this;

	      var allDraggableElements = container.querySelectorAll(this.options.draggable);
	      return toConsumableArray(allDraggableElements).filter(function (childElement) {
	        return childElement !== _this5.originalSource && childElement !== _this5.mirror;
	      });
	    }
	    /**
	     * Drag start handler
	     * @private
	     * @param {Event} event - DOM Drag event
	     */

	  }, {
	    key: onDragStart$2,
	    value: function value(event) {
	      var _this6 = this;

	      var sensorEvent = getSensorEvent(event);
	      var target = sensorEvent.target,
	          container = sensorEvent.container;

	      if (!this.containers.includes(container)) {
	        return;
	      }

	      if (this.options.handle && target && !closest(target, this.options.handle)) {
	        sensorEvent.cancel();
	        return;
	      } // Find draggable source element


	      this.originalSource = closest(target, this.options.draggable);
	      this.sourceContainer = container;

	      if (!this.originalSource) {
	        sensorEvent.cancel();
	        return;
	      }

	      if (this.lastPlacedSource && this.lastPlacedContainer) {
	        clearTimeout(this.placedTimeoutID);
	        this.lastPlacedSource.classList.remove(this.getClassNameFor('source:placed'));
	        this.lastPlacedContainer.classList.remove(this.getClassNameFor('container:placed'));
	      }

	      this.source = this.originalSource.cloneNode(true);
	      this.originalSource.parentNode.insertBefore(this.source, this.originalSource);
	      this.originalSource.style.display = 'none';
	      var dragEvent = new DragStartEvent({
	        source: this.source,
	        originalSource: this.originalSource,
	        sourceContainer: container,
	        sensorEvent: sensorEvent
	      });
	      this.trigger(dragEvent);
	      this.dragging = !dragEvent.canceled();

	      if (dragEvent.canceled()) {
	        this.source.parentNode.removeChild(this.source);
	        this.originalSource.style.display = null;
	        return;
	      }

	      this.originalSource.classList.add(this.getClassNameFor('source:original'));
	      this.source.classList.add(this.getClassNameFor('source:dragging'));
	      this.sourceContainer.classList.add(this.getClassNameFor('container:dragging'));
	      document.body.classList.add(this.getClassNameFor('body:dragging'));
	      applyUserSelect(document.body, 'none');
	      requestAnimationFrame(function () {
	        var oldSensorEvent = getSensorEvent(event);
	        var newSensorEvent = oldSensorEvent.clone({
	          target: _this6.source
	        });

	        _this6[onDragMove$2](_objectSpread$6(_objectSpread$6({}, event), {}, {
	          detail: newSensorEvent
	        }));
	      });
	    }
	    /**
	     * Drag move handler
	     * @private
	     * @param {Event} event - DOM Drag event
	     */

	  }, {
	    key: onDragMove$2,
	    value: function value(event) {
	      if (!this.dragging) {
	        return;
	      }

	      var sensorEvent = getSensorEvent(event);
	      var container = sensorEvent.container;
	      var target = sensorEvent.target;
	      var dragMoveEvent = new DragMoveEvent({
	        source: this.source,
	        originalSource: this.originalSource,
	        sourceContainer: container,
	        sensorEvent: sensorEvent
	      });
	      this.trigger(dragMoveEvent);

	      if (dragMoveEvent.canceled()) {
	        sensorEvent.cancel();
	      }

	      target = closest(target, this.options.draggable);
	      var withinCorrectContainer = closest(sensorEvent.target, this.containers);
	      var overContainer = sensorEvent.overContainer || withinCorrectContainer;
	      var isLeavingContainer = this.currentOverContainer && overContainer !== this.currentOverContainer;
	      var isLeavingDraggable = this.currentOver && target !== this.currentOver;
	      var isOverContainer = overContainer && this.currentOverContainer !== overContainer;
	      var isOverDraggable = withinCorrectContainer && target && this.currentOver !== target;

	      if (isLeavingDraggable) {
	        var dragOutEvent = new DragOutEvent({
	          source: this.source,
	          originalSource: this.originalSource,
	          sourceContainer: container,
	          sensorEvent: sensorEvent,
	          over: this.currentOver
	        });
	        this.currentOver.classList.remove(this.getClassNameFor('draggable:over'));
	        this.currentOver = null;
	        this.trigger(dragOutEvent);
	      }

	      if (isLeavingContainer) {
	        var dragOutContainerEvent = new DragOutContainerEvent({
	          source: this.source,
	          originalSource: this.originalSource,
	          sourceContainer: container,
	          sensorEvent: sensorEvent,
	          overContainer: this.currentOverContainer
	        });
	        this.currentOverContainer.classList.remove(this.getClassNameFor('container:over'));
	        this.currentOverContainer = null;
	        this.trigger(dragOutContainerEvent);
	      }

	      if (isOverContainer) {
	        overContainer.classList.add(this.getClassNameFor('container:over'));
	        var dragOverContainerEvent = new DragOverContainerEvent({
	          source: this.source,
	          originalSource: this.originalSource,
	          sourceContainer: container,
	          sensorEvent: sensorEvent,
	          overContainer: overContainer
	        });
	        this.currentOverContainer = overContainer;
	        this.trigger(dragOverContainerEvent);
	      }

	      if (isOverDraggable) {
	        target.classList.add(this.getClassNameFor('draggable:over'));
	        var dragOverEvent = new DragOverEvent({
	          source: this.source,
	          originalSource: this.originalSource,
	          sourceContainer: container,
	          sensorEvent: sensorEvent,
	          overContainer: overContainer,
	          over: target
	        });
	        this.currentOver = target;
	        this.trigger(dragOverEvent);
	      }
	    }
	    /**
	     * Drag stop handler
	     * @private
	     * @param {Event} event - DOM Drag event
	     */

	  }, {
	    key: onDragStop$2,
	    value: function value(event) {
	      var _this7 = this;

	      if (!this.dragging) {
	        return;
	      }

	      this.dragging = false;
	      var dragStopEvent = new DragStopEvent({
	        source: this.source,
	        originalSource: this.originalSource,
	        sensorEvent: event.sensorEvent,
	        sourceContainer: this.sourceContainer
	      });
	      this.trigger(dragStopEvent);
	      this.source.parentNode.insertBefore(this.originalSource, this.source);
	      this.source.parentNode.removeChild(this.source);
	      this.originalSource.style.display = '';
	      this.source.classList.remove(this.getClassNameFor('source:dragging'));
	      this.originalSource.classList.remove(this.getClassNameFor('source:original'));
	      this.originalSource.classList.add(this.getClassNameFor('source:placed'));
	      this.sourceContainer.classList.add(this.getClassNameFor('container:placed'));
	      this.sourceContainer.classList.remove(this.getClassNameFor('container:dragging'));
	      document.body.classList.remove(this.getClassNameFor('body:dragging'));
	      applyUserSelect(document.body, '');

	      if (this.currentOver) {
	        this.currentOver.classList.remove(this.getClassNameFor('draggable:over'));
	      }

	      if (this.currentOverContainer) {
	        this.currentOverContainer.classList.remove(this.getClassNameFor('container:over'));
	      }

	      this.lastPlacedSource = this.originalSource;
	      this.lastPlacedContainer = this.sourceContainer;
	      this.placedTimeoutID = setTimeout(function () {
	        if (_this7.lastPlacedSource) {
	          _this7.lastPlacedSource.classList.remove(_this7.getClassNameFor('source:placed'));
	        }

	        if (_this7.lastPlacedContainer) {
	          _this7.lastPlacedContainer.classList.remove(_this7.getClassNameFor('container:placed'));
	        }

	        _this7.lastPlacedSource = null;
	        _this7.lastPlacedContainer = null;
	      }, this.options.placedTimeout);
	      var dragStoppedEvent = new DragStoppedEvent({
	        source: this.source,
	        originalSource: this.originalSource,
	        sensorEvent: event.sensorEvent,
	        sourceContainer: this.sourceContainer
	      });
	      this.trigger(dragStoppedEvent);
	      this.source = null;
	      this.originalSource = null;
	      this.currentOverContainer = null;
	      this.currentOver = null;
	      this.sourceContainer = null;
	    }
	    /**
	     * Drag pressure handler
	     * @private
	     * @param {Event} event - DOM Drag event
	     */

	  }, {
	    key: onDragPressure,
	    value: function value(event) {
	      if (!this.dragging) {
	        return;
	      }

	      var sensorEvent = getSensorEvent(event);
	      var source = this.source || closest(sensorEvent.originalEvent.target, this.options.draggable);
	      var dragPressureEvent = new DragPressureEvent({
	        sensorEvent: sensorEvent,
	        source: source,
	        pressure: sensorEvent.pressure
	      });
	      this.trigger(dragPressureEvent);
	    }
	  }]);

	  return Draggable;
	}();

	defineProperty$6(Draggable, "Plugins", {
	  Announcement: Announcement,
	  Focusable: Focusable,
	  Mirror: Mirror,
	  Scrollable: Scrollable
	});

	defineProperty$6(Draggable, "Sensors", {
	  MouseSensor: MouseSensor,
	  TouchSensor: TouchSensor
	});

	function getSensorEvent(event) {
	  return event.detail;
	}

	function applyUserSelect(element, value) {
	  element.style.webkitUserSelect = value;
	  element.style.mozUserSelect = value;
	  element.style.msUserSelect = value;
	  element.style.oUserSelect = value;
	  element.style.userSelect = value;
	}

	function _superPropBase(object, property) {
	  while (!Object.prototype.hasOwnProperty.call(object, property)) {
	    object = getPrototypeOf(object);
	    if (object === null) break;
	  }

	  return object;
	}

	var superPropBase = _superPropBase;

	var get$2 = createCommonjsModule(function (module) {
	function _get(target, property, receiver) {
	  if (typeof Reflect !== "undefined" && Reflect.get) {
	    module.exports = _get = Reflect.get;
	  } else {
	    module.exports = _get = function _get(target, property, receiver) {
	      var base = superPropBase(target, property);
	      if (!base) return;
	      var desc = Object.getOwnPropertyDescriptor(base, property);

	      if (desc.get) {
	        return desc.get.call(receiver);
	      }

	      return desc.value;
	    };
	  }

	  return _get(target, property, receiver || target);
	}

	module.exports = _get;
	});

	function _createSuper$c(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$c(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$c() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	/**
	 * Base droppable event
	 * @class DroppableEvent
	 * @module DroppableEvent
	 * @extends AbstractEvent
	 */

	var DroppableEvent = /*#__PURE__*/function (_AbstractEvent) {
	  inherits(DroppableEvent, _AbstractEvent);

	  var _super = _createSuper$c(DroppableEvent);

	  function DroppableEvent() {
	    classCallCheck(this, DroppableEvent);

	    return _super.apply(this, arguments);
	  }

	  createClass(DroppableEvent, [{
	    key: "dragEvent",

	    /**
	     * Original drag event that triggered this droppable event
	     * @property dragEvent
	     * @type {DragEvent}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.dragEvent;
	    }
	  }]);

	  return DroppableEvent;
	}(AbstractEvent);
	/**
	 * Droppable start event
	 * @class DroppableStartEvent
	 * @module DroppableStartEvent
	 * @extends DroppableEvent
	 */

	defineProperty$6(DroppableEvent, "type", 'droppable');

	var DroppableStartEvent = /*#__PURE__*/function (_DroppableEvent) {
	  inherits(DroppableStartEvent, _DroppableEvent);

	  var _super2 = _createSuper$c(DroppableStartEvent);

	  function DroppableStartEvent() {
	    classCallCheck(this, DroppableStartEvent);

	    return _super2.apply(this, arguments);
	  }

	  createClass(DroppableStartEvent, [{
	    key: "dropzone",

	    /**
	     * The initial dropzone element of the currently dragging draggable element
	     * @property dropzone
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.dropzone;
	    }
	  }]);

	  return DroppableStartEvent;
	}(DroppableEvent);
	/**
	 * Droppable dropped event
	 * @class DroppableDroppedEvent
	 * @module DroppableDroppedEvent
	 * @extends DroppableEvent
	 */

	defineProperty$6(DroppableStartEvent, "type", 'droppable:start');

	defineProperty$6(DroppableStartEvent, "cancelable", true);

	var DroppableDroppedEvent = /*#__PURE__*/function (_DroppableEvent2) {
	  inherits(DroppableDroppedEvent, _DroppableEvent2);

	  var _super3 = _createSuper$c(DroppableDroppedEvent);

	  function DroppableDroppedEvent() {
	    classCallCheck(this, DroppableDroppedEvent);

	    return _super3.apply(this, arguments);
	  }

	  createClass(DroppableDroppedEvent, [{
	    key: "dropzone",

	    /**
	     * The dropzone element you dropped the draggable element into
	     * @property dropzone
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.dropzone;
	    }
	  }]);

	  return DroppableDroppedEvent;
	}(DroppableEvent);
	/**
	 * Droppable returned event
	 * @class DroppableReturnedEvent
	 * @module DroppableReturnedEvent
	 * @extends DroppableEvent
	 */

	defineProperty$6(DroppableDroppedEvent, "type", 'droppable:dropped');

	defineProperty$6(DroppableDroppedEvent, "cancelable", true);

	var DroppableReturnedEvent = /*#__PURE__*/function (_DroppableEvent3) {
	  inherits(DroppableReturnedEvent, _DroppableEvent3);

	  var _super4 = _createSuper$c(DroppableReturnedEvent);

	  function DroppableReturnedEvent() {
	    classCallCheck(this, DroppableReturnedEvent);

	    return _super4.apply(this, arguments);
	  }

	  createClass(DroppableReturnedEvent, [{
	    key: "dropzone",

	    /**
	     * The dropzone element you dragged away from
	     * @property dropzone
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.dropzone;
	    }
	  }]);

	  return DroppableReturnedEvent;
	}(DroppableEvent);
	/**
	 * Droppable stop event
	 * @class DroppableStopEvent
	 * @module DroppableStopEvent
	 * @extends DroppableEvent
	 */

	defineProperty$6(DroppableReturnedEvent, "type", 'droppable:returned');

	defineProperty$6(DroppableReturnedEvent, "cancelable", true);

	var DroppableStopEvent = /*#__PURE__*/function (_DroppableEvent4) {
	  inherits(DroppableStopEvent, _DroppableEvent4);

	  var _super5 = _createSuper$c(DroppableStopEvent);

	  function DroppableStopEvent() {
	    classCallCheck(this, DroppableStopEvent);

	    return _super5.apply(this, arguments);
	  }

	  createClass(DroppableStopEvent, [{
	    key: "dropzone",

	    /**
	     * The final dropzone element of the draggable element
	     * @property dropzone
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.dropzone;
	    }
	  }]);

	  return DroppableStopEvent;
	}(DroppableEvent);

	defineProperty$6(DroppableStopEvent, "type", 'droppable:stop');

	defineProperty$6(DroppableStopEvent, "cancelable", true);

	function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

	function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

	function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

	function ownKeys$8(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

	function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$8(Object(source), true).forEach(function (key) { defineProperty$6(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$8(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

	function _createSuper$d(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$d(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$d() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	var onDragStart$3 = Symbol('onDragStart');
	var onDragMove$3 = Symbol('onDragMove');
	var onDragStop$3 = Symbol('onDragStop');
	var dropInDropzone = Symbol('dropInDropZone');
	var returnToOriginalDropzone = Symbol('returnToOriginalDropzone');
	var closestDropzone = Symbol('closestDropzone');
	var getDropzones = Symbol('getDropzones');
	/**
	 * Returns an announcement message when the Draggable element is dropped into a dropzone element
	 * @param {DroppableDroppedEvent} droppableEvent
	 * @return {String}
	 */

	function onDroppableDroppedDefaultAnnouncement(_ref) {
	  var dragEvent = _ref.dragEvent,
	      dropzone = _ref.dropzone;
	  var sourceText = dragEvent.source.textContent.trim() || dragEvent.source.id || 'draggable element';
	  var dropzoneText = dropzone.textContent.trim() || dropzone.id || 'droppable element';
	  return "Dropped ".concat(sourceText, " into ").concat(dropzoneText);
	}
	/**
	 * Returns an announcement message when the Draggable element has returned to its original dropzone element
	 * @param {DroppableReturnedEvent} droppableEvent
	 * @return {String}
	 */


	function onDroppableReturnedDefaultAnnouncement(_ref2) {
	  var dragEvent = _ref2.dragEvent,
	      dropzone = _ref2.dropzone;
	  var sourceText = dragEvent.source.textContent.trim() || dragEvent.source.id || 'draggable element';
	  var dropzoneText = dropzone.textContent.trim() || dropzone.id || 'droppable element';
	  return "Returned ".concat(sourceText, " from ").concat(dropzoneText);
	}
	/**
	 * @const {Object} defaultAnnouncements
	 * @const {Function} defaultAnnouncements['droppable:dropped']
	 * @const {Function} defaultAnnouncements['droppable:returned']
	 */


	var defaultAnnouncements$1 = {
	  'droppable:dropped': onDroppableDroppedDefaultAnnouncement,
	  'droppable:returned': onDroppableReturnedDefaultAnnouncement
	};
	var defaultClasses$1 = {
	  'droppable:active': 'draggable-dropzone--active',
	  'droppable:occupied': 'draggable-dropzone--occupied'
	};
	var defaultOptions$5 = {
	  dropzone: '.draggable-droppable'
	};
	/**
	 * Droppable is built on top of Draggable and allows dropping draggable elements
	 * into dropzone element
	 * @class Droppable
	 * @module Droppable
	 * @extends Draggable
	 */

	var Droppable = /*#__PURE__*/function (_Draggable) {
	  inherits(Droppable, _Draggable);

	  var _super = _createSuper$d(Droppable);

	  /**
	   * Droppable constructor.
	   * @constructs Droppable
	   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Droppable containers
	   * @param {Object} options - Options for Droppable
	   */
	  function Droppable() {
	    var _this;

	    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    classCallCheck(this, Droppable);

	    _this = _super.call(this, containers, _objectSpread$7(_objectSpread$7(_objectSpread$7({}, defaultOptions$5), options), {}, {
	      classes: _objectSpread$7(_objectSpread$7({}, defaultClasses$1), options.classes || {}),
	      announcements: _objectSpread$7(_objectSpread$7({}, defaultAnnouncements$1), options.announcements || {})
	    }));
	    /**
	     * All dropzone elements on drag start
	     * @property dropzones
	     * @type {HTMLElement[]}
	     */

	    _this.dropzones = null;
	    /**
	     * Last dropzone element that the source was dropped into
	     * @property lastDropzone
	     * @type {HTMLElement}
	     */

	    _this.lastDropzone = null;
	    /**
	     * Initial dropzone element that the source was drag from
	     * @property initialDropzone
	     * @type {HTMLElement}
	     */

	    _this.initialDropzone = null;
	    _this[onDragStart$3] = _this[onDragStart$3].bind(assertThisInitialized(_this));
	    _this[onDragMove$3] = _this[onDragMove$3].bind(assertThisInitialized(_this));
	    _this[onDragStop$3] = _this[onDragStop$3].bind(assertThisInitialized(_this));

	    _this.on('drag:start', _this[onDragStart$3]).on('drag:move', _this[onDragMove$3]).on('drag:stop', _this[onDragStop$3]);

	    return _this;
	  }
	  /**
	   * Destroys Droppable instance.
	   */


	  createClass(Droppable, [{
	    key: "destroy",
	    value: function destroy() {
	      get$2(getPrototypeOf(Droppable.prototype), "destroy", this).call(this);

	      this.off('drag:start', this[onDragStart$3]).off('drag:move', this[onDragMove$3]).off('drag:stop', this[onDragStop$3]);
	    }
	    /**
	     * Drag start handler
	     * @private
	     * @param {DragStartEvent} event - Drag start event
	     */

	  }, {
	    key: onDragStart$3,
	    value: function value(event) {
	      if (event.canceled()) {
	        console.log('event.canceled');
	        return;
	      }

	      this.dropzones = toConsumableArray(this[getDropzones]());
	      var dropzone = closest(event.sensorEvent.target, this.options.dropzone);

	      if (!dropzone) {
	        console.log('no drop zone');
	        event.cancel();
	        return;
	      }

	      var droppableStartEvent = new DroppableStartEvent({
	        dragEvent: event,
	        dropzone: dropzone
	      });
	      this.trigger(droppableStartEvent);

	      if (droppableStartEvent.canceled()) {
	        console.log('droppableStartEvent.canceled');
	        event.cancel();
	        return;
	      }

	      this.initialDropzone = dropzone;

	      var _iterator = _createForOfIteratorHelper(this.dropzones),
	          _step;

	      try {
	        for (_iterator.s(); !(_step = _iterator.n()).done;) {
	          var dropzoneElement = _step.value;

	          if (dropzoneElement.classList.contains(this.getClassNameFor('droppable:occupied'))) {
	            continue;
	          }

	          dropzoneElement.classList.add(this.getClassNameFor('droppable:active'));
	        }
	      } catch (err) {
	        _iterator.e(err);
	      } finally {
	        _iterator.f();
	      }
	    }
	    /**
	     * Drag move handler
	     * @private
	     * @param {DragMoveEvent} event - Drag move event
	     */

	  }, {
	    key: onDragMove$3,
	    value: function value(event) {
	      if (event.canceled()) {
	        return;
	      }

	      var dropzone = this[closestDropzone](event.sensorEvent.target);
	      var overEmptyDropzone = dropzone && !dropzone.classList.contains(this.getClassNameFor('droppable:occupied'));

	      if (overEmptyDropzone && this[dropInDropzone](event, dropzone)) {
	        this.lastDropzone = dropzone;
	      } else if ((!dropzone || dropzone === this.initialDropzone) && this.lastDropzone) {
	        this[returnToOriginalDropzone](event);
	        this.lastDropzone = null;
	      }
	    }
	    /**
	     * Drag stop handler
	     * @private
	     * @param {DragStopEvent} event - Drag stop event
	     */

	  }, {
	    key: onDragStop$3,
	    value: function value(event) {
	      var droppableStopEvent = new DroppableStopEvent({
	        dragEvent: event,
	        dropzone: this.lastDropzone || this.initialDropzone
	      });
	      this.trigger(droppableStopEvent);
	      var occupiedClass = this.getClassNameFor('droppable:occupied');

	      var _iterator2 = _createForOfIteratorHelper(this.dropzones),
	          _step2;

	      try {
	        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	          var dropzone = _step2.value;
	          dropzone.classList.remove(this.getClassNameFor('droppable:active'));
	        }
	      } catch (err) {
	        _iterator2.e(err);
	      } finally {
	        _iterator2.f();
	      }

	      if (this.lastDropzone && this.lastDropzone !== this.initialDropzone) {
	        this.initialDropzone.classList.remove(occupiedClass);
	      }

	      this.dropzones = null;
	      this.lastDropzone = null;
	      this.initialDropzone = null;
	    }
	    /**
	     * Drops a draggable element into a dropzone element
	     * @private
	     * @param {DragMoveEvent} event - Drag move event
	     * @param {HTMLElement} dropzone - Dropzone element to drop draggable into
	     */

	  }, {
	    key: dropInDropzone,
	    value: function value(event, dropzone) {
	      var droppableDroppedEvent = new DroppableDroppedEvent({
	        dragEvent: event,
	        dropzone: dropzone
	      });
	      this.trigger(droppableDroppedEvent);

	      if (droppableDroppedEvent.canceled()) {
	        return false;
	      }

	      var occupiedClass = this.getClassNameFor('droppable:occupied');

	      if (this.lastDropzone) {
	        this.lastDropzone.classList.remove(occupiedClass);
	      }

	      dropzone.appendChild(event.source);
	      dropzone.classList.add(occupiedClass);
	      return true;
	    }
	    /**
	     * Moves the previously dropped element back into its original dropzone
	     * @private
	     * @param {DragMoveEvent} event - Drag move event
	     */

	  }, {
	    key: returnToOriginalDropzone,
	    value: function value(event) {
	      var droppableReturnedEvent = new DroppableReturnedEvent({
	        dragEvent: event,
	        dropzone: this.lastDropzone
	      });
	      this.trigger(droppableReturnedEvent);

	      if (droppableReturnedEvent.canceled()) {
	        return;
	      }

	      this.initialDropzone.appendChild(event.source);
	      this.lastDropzone.classList.remove(this.getClassNameFor('droppable:occupied'));
	    }
	    /**
	     * Returns closest dropzone element for even target
	     * @private
	     * @param {HTMLElement} target - Event target
	     * @return {HTMLElement|null}
	     */

	  }, {
	    key: closestDropzone,
	    value: function value(target) {
	      if (!this.dropzones) {
	        return null;
	      }

	      return closest(target, this.dropzones);
	    }
	    /**
	     * Returns all current dropzone elements for this draggable instance
	     * @private
	     * @return {NodeList|HTMLElement[]|Array}
	     */

	  }, {
	    key: getDropzones,
	    value: function value() {
	      var dropzone = this.options.dropzone;

	      if (typeof dropzone === 'string') {
	        return document.querySelectorAll(dropzone);
	      } else if (dropzone instanceof NodeList || dropzone instanceof Array) {
	        return dropzone;
	      } else if (typeof dropzone === 'function') {
	        return dropzone();
	      } else {
	        return [];
	      }
	    }
	  }]);

	  return Droppable;
	}(Draggable);

	function _createSuper$e(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$e(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$e() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	/**
	 * Base swappable event
	 * @class SwappableEvent
	 * @module SwappableEvent
	 * @extends AbstractEvent
	 */

	var SwappableEvent = /*#__PURE__*/function (_AbstractEvent) {
	  inherits(SwappableEvent, _AbstractEvent);

	  var _super = _createSuper$e(SwappableEvent);

	  function SwappableEvent() {
	    classCallCheck(this, SwappableEvent);

	    return _super.apply(this, arguments);
	  }

	  createClass(SwappableEvent, [{
	    key: "dragEvent",

	    /**
	     * Original drag event that triggered this swappable event
	     * @property dragEvent
	     * @type {DragEvent}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.dragEvent;
	    }
	  }]);

	  return SwappableEvent;
	}(AbstractEvent);
	/**
	 * Swappable start event
	 * @class SwappableStartEvent
	 * @module SwappableStartEvent
	 * @extends SwappableEvent
	 */

	defineProperty$6(SwappableEvent, "type", 'swappable');

	var SwappableStartEvent = /*#__PURE__*/function (_SwappableEvent) {
	  inherits(SwappableStartEvent, _SwappableEvent);

	  var _super2 = _createSuper$e(SwappableStartEvent);

	  function SwappableStartEvent() {
	    classCallCheck(this, SwappableStartEvent);

	    return _super2.apply(this, arguments);
	  }

	  return SwappableStartEvent;
	}(SwappableEvent);
	/**
	 * Swappable swap event
	 * @class SwappableSwapEvent
	 * @module SwappableSwapEvent
	 * @extends SwappableEvent
	 */

	defineProperty$6(SwappableStartEvent, "type", 'swappable:start');

	defineProperty$6(SwappableStartEvent, "cancelable", true);

	var SwappableSwapEvent = /*#__PURE__*/function (_SwappableEvent2) {
	  inherits(SwappableSwapEvent, _SwappableEvent2);

	  var _super3 = _createSuper$e(SwappableSwapEvent);

	  function SwappableSwapEvent() {
	    classCallCheck(this, SwappableSwapEvent);

	    return _super3.apply(this, arguments);
	  }

	  createClass(SwappableSwapEvent, [{
	    key: "over",

	    /**
	     * Draggable element you are over
	     * @property over
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.over;
	    }
	    /**
	     * Draggable container you are over
	     * @property overContainer
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "overContainer",
	    get: function get() {
	      return this.data.overContainer;
	    }
	  }]);

	  return SwappableSwapEvent;
	}(SwappableEvent);
	/**
	 * Swappable swapped event
	 * @class SwappableSwappedEvent
	 * @module SwappableSwappedEvent
	 * @extends SwappableEvent
	 */

	defineProperty$6(SwappableSwapEvent, "type", 'swappable:swap');

	defineProperty$6(SwappableSwapEvent, "cancelable", true);

	var SwappableSwappedEvent = /*#__PURE__*/function (_SwappableEvent3) {
	  inherits(SwappableSwappedEvent, _SwappableEvent3);

	  var _super4 = _createSuper$e(SwappableSwappedEvent);

	  function SwappableSwappedEvent() {
	    classCallCheck(this, SwappableSwappedEvent);

	    return _super4.apply(this, arguments);
	  }

	  createClass(SwappableSwappedEvent, [{
	    key: "swappedElement",

	    /**
	     * The draggable element that you swapped with
	     * @property swappedElement
	     * @type {HTMLElement}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.swappedElement;
	    }
	  }]);

	  return SwappableSwappedEvent;
	}(SwappableEvent);
	/**
	 * Swappable stop event
	 * @class SwappableStopEvent
	 * @module SwappableStopEvent
	 * @extends SwappableEvent
	 */

	defineProperty$6(SwappableSwappedEvent, "type", 'swappable:swapped');

	var SwappableStopEvent = /*#__PURE__*/function (_SwappableEvent4) {
	  inherits(SwappableStopEvent, _SwappableEvent4);

	  var _super5 = _createSuper$e(SwappableStopEvent);

	  function SwappableStopEvent() {
	    classCallCheck(this, SwappableStopEvent);

	    return _super5.apply(this, arguments);
	  }

	  return SwappableStopEvent;
	}(SwappableEvent);

	defineProperty$6(SwappableStopEvent, "type", 'swappable:stop');

	function _createSuper$f(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$f(); return function _createSuperInternal() { var Super = getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$f() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
	/**
	 * Base sortable event
	 * @class SortableEvent
	 * @module SortableEvent
	 * @extends AbstractEvent
	 */

	var SortableEvent = /*#__PURE__*/function (_AbstractEvent) {
	  inherits(SortableEvent, _AbstractEvent);

	  var _super = _createSuper$f(SortableEvent);

	  function SortableEvent() {
	    classCallCheck(this, SortableEvent);

	    return _super.apply(this, arguments);
	  }

	  createClass(SortableEvent, [{
	    key: "dragEvent",

	    /**
	     * Original drag event that triggered this sortable event
	     * @property dragEvent
	     * @type {DragEvent}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.dragEvent;
	    }
	  }]);

	  return SortableEvent;
	}(AbstractEvent);
	/**
	 * Sortable start event
	 * @class SortableStartEvent
	 * @module SortableStartEvent
	 * @extends SortableEvent
	 */

	defineProperty$6(SortableEvent, "type", 'sortable');

	var SortableStartEvent = /*#__PURE__*/function (_SortableEvent) {
	  inherits(SortableStartEvent, _SortableEvent);

	  var _super2 = _createSuper$f(SortableStartEvent);

	  function SortableStartEvent() {
	    classCallCheck(this, SortableStartEvent);

	    return _super2.apply(this, arguments);
	  }

	  createClass(SortableStartEvent, [{
	    key: "startIndex",

	    /**
	     * Start index of source on sortable start
	     * @property startIndex
	     * @type {Number}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.startIndex;
	    }
	    /**
	     * Start container on sortable start
	     * @property startContainer
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "startContainer",
	    get: function get() {
	      return this.data.startContainer;
	    }
	  }]);

	  return SortableStartEvent;
	}(SortableEvent);
	/**
	 * Sortable sort event
	 * @class SortableSortEvent
	 * @module SortableSortEvent
	 * @extends SortableEvent
	 */

	defineProperty$6(SortableStartEvent, "type", 'sortable:start');

	defineProperty$6(SortableStartEvent, "cancelable", true);

	var SortableSortEvent = /*#__PURE__*/function (_SortableEvent2) {
	  inherits(SortableSortEvent, _SortableEvent2);

	  var _super3 = _createSuper$f(SortableSortEvent);

	  function SortableSortEvent() {
	    classCallCheck(this, SortableSortEvent);

	    return _super3.apply(this, arguments);
	  }

	  createClass(SortableSortEvent, [{
	    key: "currentIndex",

	    /**
	     * Index of current draggable element
	     * @property currentIndex
	     * @type {Number}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.currentIndex;
	    }
	    /**
	     * Draggable element you are hovering over
	     * @property over
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "over",
	    get: function get() {
	      return this.data.over;
	    }
	    /**
	     * Draggable container element you are hovering over
	     * @property overContainer
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "overContainer",
	    get: function get() {
	      return this.data.dragEvent.overContainer;
	    }
	  }]);

	  return SortableSortEvent;
	}(SortableEvent);
	/**
	 * Sortable sorted event
	 * @class SortableSortedEvent
	 * @module SortableSortedEvent
	 * @extends SortableEvent
	 */

	defineProperty$6(SortableSortEvent, "type", 'sortable:sort');

	defineProperty$6(SortableSortEvent, "cancelable", true);

	var SortableSortedEvent = /*#__PURE__*/function (_SortableEvent3) {
	  inherits(SortableSortedEvent, _SortableEvent3);

	  var _super4 = _createSuper$f(SortableSortedEvent);

	  function SortableSortedEvent() {
	    classCallCheck(this, SortableSortedEvent);

	    return _super4.apply(this, arguments);
	  }

	  createClass(SortableSortedEvent, [{
	    key: "oldIndex",

	    /**
	     * Index of last sorted event
	     * @property oldIndex
	     * @type {Number}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.oldIndex;
	    }
	    /**
	     * New index of this sorted event
	     * @property newIndex
	     * @type {Number}
	     * @readonly
	     */

	  }, {
	    key: "newIndex",
	    get: function get() {
	      return this.data.newIndex;
	    }
	    /**
	     * Old container of draggable element
	     * @property oldContainer
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "oldContainer",
	    get: function get() {
	      return this.data.oldContainer;
	    }
	    /**
	     * New container of draggable element
	     * @property newContainer
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "newContainer",
	    get: function get() {
	      return this.data.newContainer;
	    }
	  }]);

	  return SortableSortedEvent;
	}(SortableEvent);
	/**
	 * Sortable stop event
	 * @class SortableStopEvent
	 * @module SortableStopEvent
	 * @extends SortableEvent
	 */

	defineProperty$6(SortableSortedEvent, "type", 'sortable:sorted');

	var SortableStopEvent = /*#__PURE__*/function (_SortableEvent4) {
	  inherits(SortableStopEvent, _SortableEvent4);

	  var _super5 = _createSuper$f(SortableStopEvent);

	  function SortableStopEvent() {
	    classCallCheck(this, SortableStopEvent);

	    return _super5.apply(this, arguments);
	  }

	  createClass(SortableStopEvent, [{
	    key: "oldIndex",

	    /**
	     * Original index on sortable start
	     * @property oldIndex
	     * @type {Number}
	     * @readonly
	     */
	    get: function get() {
	      return this.data.oldIndex;
	    }
	    /**
	     * New index of draggable element
	     * @property newIndex
	     * @type {Number}
	     * @readonly
	     */

	  }, {
	    key: "newIndex",
	    get: function get() {
	      return this.data.newIndex;
	    }
	    /**
	     * Original container of draggable element
	     * @property oldContainer
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "oldContainer",
	    get: function get() {
	      return this.data.oldContainer;
	    }
	    /**
	     * New container of draggable element
	     * @property newContainer
	     * @type {HTMLElement}
	     * @readonly
	     */

	  }, {
	    key: "newContainer",
	    get: function get() {
	      return this.data.newContainer;
	    }
	  }]);

	  return SortableStopEvent;
	}(SortableEvent);

	defineProperty$6(SortableStopEvent, "type", 'sortable:stop');

	/* src/standalone/file.svelte generated by Svelte v3.29.0 */

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

	// (113:2) {#if data.path}
	function create_if_block(ctx) {
		let figure;
		let t0;
		let img;
		let img_src_value;
		let img_alt_value;
		let t1;
		let div1;
		let div0;
		let t2_value = /*data*/ ctx[5].name + "";
		let t2;
		let if_block = !/*hideDeleteButton*/ ctx[3] && create_if_block_1(ctx);

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
				if (img.src !== (img_src_value = /*data*/ ctx[5].path.small.cloud.Location)) attr(img, "src", img_src_value);
				attr(img, "alt", img_alt_value = /*data*/ ctx[5].name);
				attr(img, "class", "svelte-1n0ppue");
				attr(div0, "class", "text svelte-1n0ppue");
				attr(div1, "draggable", "true");
				attr(div1, "class", "middle svelte-1n0ppue");
				attr(figure, "class", "image is-4by3 svelte-1n0ppue");
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
				if (!/*hideDeleteButton*/ ctx[3]) {
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

				if (dirty & /*data*/ 32 && img.src !== (img_src_value = /*data*/ ctx[5].path.small.cloud.Location)) {
					attr(img, "src", img_src_value);
				}

				if (dirty & /*data*/ 32 && img_alt_value !== (img_alt_value = /*data*/ ctx[5].name)) {
					attr(img, "alt", img_alt_value);
				}

				if (dirty & /*data*/ 32 && t2_value !== (t2_value = /*data*/ ctx[5].name + "")) set_data(t2, t2_value);
			},
			d(detaching) {
				if (detaching) detach(figure);
				if (if_block) if_block.d();
			}
		};
	}

	// (115:3) {#if !hideDeleteButton}
	function create_if_block_1(ctx) {
		let button;
		let mounted;
		let dispose;

		return {
			c() {
				button = element("button");
				attr(button, "class", "delete svelte-1n0ppue");
			},
			m(target, anchor) {
				insert(target, button, anchor);

				if (!mounted) {
					dispose = listen(button, "click", /*remove*/ ctx[9]);
					mounted = true;
				}
			},
			p: noop,
			d(detaching) {
				if (detaching) detach(button);
				mounted = false;
				dispose();
			}
		};
	}

	function create_fragment$1(ctx) {
		let div1;
		let div0;
		let t;
		let div0_class_value;
		let div0_data_uuid_value;
		let div1_class_value;
		let div1_data_uuid_value;
		let mounted;
		let dispose;
		let if_block0 = /*notUploaded*/ ctx[2] && create_if_block_2(ctx);
		let if_block1 = /*data*/ ctx[5].path && create_if_block(ctx);

		return {
			c() {
				div1 = element("div");
				div0 = element("div");
				if (if_block0) if_block0.c();
				t = space();
				if (if_block1) if_block1.c();
				attr(div0, "class", div0_class_value = "" + (null_to_empty(/*droppableClass*/ ctx[1]) + " svelte-1n0ppue"));
				attr(div0, "data-uuid", div0_data_uuid_value = /*data*/ ctx[5].uuid);
				attr(div1, "class", div1_class_value = "tile file is-" + /*elementSize*/ ctx[4] + " is-child " + /*ifSelected*/ ctx[6] + " " + /*ifDragNDrop*/ ctx[7] + " svelte-1n0ppue");
				attr(div1, "data-uuid", div1_data_uuid_value = /*data*/ ctx[5].uuid);
			},
			m(target, anchor) {
				insert(target, div1, anchor);
				append(div1, div0);
				if (if_block0) if_block0.m(div0, null);
				append(div0, t);
				if (if_block1) if_block1.m(div0, null);

				if (!mounted) {
					dispose = listen(div1, "click", /*onClick*/ ctx[8]);
					mounted = true;
				}
			},
			p(ctx, [dirty]) {
				if (/*notUploaded*/ ctx[2]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);
					} else {
						if_block0 = create_if_block_2(ctx);
						if_block0.c();
						if_block0.m(div0, t);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (/*data*/ ctx[5].path) {
					if (if_block1) {
						if_block1.p(ctx, dirty);
					} else {
						if_block1 = create_if_block(ctx);
						if_block1.c();
						if_block1.m(div0, null);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}

				if (dirty & /*droppableClass*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*droppableClass*/ ctx[1]) + " svelte-1n0ppue"))) {
					attr(div0, "class", div0_class_value);
				}

				if (dirty & /*data*/ 32 && div0_data_uuid_value !== (div0_data_uuid_value = /*data*/ ctx[5].uuid)) {
					attr(div0, "data-uuid", div0_data_uuid_value);
				}

				if (dirty & /*elementSize, ifSelected, ifDragNDrop*/ 208 && div1_class_value !== (div1_class_value = "tile file is-" + /*elementSize*/ ctx[4] + " is-child " + /*ifSelected*/ ctx[6] + " " + /*ifDragNDrop*/ ctx[7] + " svelte-1n0ppue")) {
					attr(div1, "class", div1_class_value);
				}

				if (dirty & /*data*/ 32 && div1_data_uuid_value !== (div1_data_uuid_value = /*data*/ ctx[5].uuid)) {
					attr(div1, "data-uuid", div1_data_uuid_value);
				}
			},
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) detach(div1);
				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				mounted = false;
				dispose();
			}
		};
	}

	function instance$1($$self, $$props, $$invalidate) {
		const dispatch = createEventDispatcher();
		let { progress = 0 } = $$props;
		let { selected = false } = $$props;
		let { dragNDrop = false } = $$props;
		let { dragNDropContainerClass = "drag-n-drop" } = $$props;
		let { dropzoneClass = "dropzone" } = $$props;
		let { droppableClass = "droppable" } = $$props;
		let { notUploaded = false } = $$props;
		let { selectMany = false } = $$props;
		let { hideDeleteButton = false } = $$props;
		let { elementSize = 3 } = $$props;
		let { bucketId } = $$props;

		let { data = {
			name: "default.file.name",
			size: 1000,
			preview: false
		} } = $$props;

		let lastDrop = false;

		function reinitDroppable() {
			const droppable = new Droppable(document.querySelectorAll(`.${dragNDropContainerClass}`),
			{
					draggable: `.file[data-uuid="${data.uuid}"]>.${droppableClass}`,
					dropzone: `.${dropzoneClass}`
				});

			droppable.on("droppable:start", e => {
				lastDrop = false;
			});

			droppable.on("droppable:dropped", e => {
				let elId = e.data.dragEvent.data.originalSource.dataset.uuid;
				let zoneId = e.data.dropzone.dataset.id;
				lastDrop = { elId, zoneId };
				e.cancel();
			});

			droppable.on("droppable:returned", e => {
				lastDrop = false;
			});

			droppable.on("droppable:stop", e => {
				if (lastDrop) {
					dispatch("dropped", lastDrop);
				}
			});
		}

		onMount(() => {
			get$1(bucketId).selected.subscribe(value => {
				if (value.indexOf(data.uuid) > -1) {
					$$invalidate(10, selected = true);
				} else {
					$$invalidate(10, selected = false);
				}
			});

			if (dragNDrop) {
				reinitDroppable();
			}
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
				}

				return value;
			});
		}

		function remove(ev) {
			console.log("remove file", ev);

			Confirmation.ask({
				title: `Удаление файла (${data.name}) `,
				text: "Файл будет удалён без возможнеости восстановления!",
				approval: "Удалить файл?"
			}).then(() => {
				console.log("remove approved");
				dispatch("remove", data);
			}).catch(() => {
				console.log("remove disapprove");
			});
		}

		$$self.$$set = $$props => {
			if ("progress" in $$props) $$invalidate(0, progress = $$props.progress);
			if ("selected" in $$props) $$invalidate(10, selected = $$props.selected);
			if ("dragNDrop" in $$props) $$invalidate(11, dragNDrop = $$props.dragNDrop);
			if ("dragNDropContainerClass" in $$props) $$invalidate(12, dragNDropContainerClass = $$props.dragNDropContainerClass);
			if ("dropzoneClass" in $$props) $$invalidate(13, dropzoneClass = $$props.dropzoneClass);
			if ("droppableClass" in $$props) $$invalidate(1, droppableClass = $$props.droppableClass);
			if ("notUploaded" in $$props) $$invalidate(2, notUploaded = $$props.notUploaded);
			if ("selectMany" in $$props) $$invalidate(14, selectMany = $$props.selectMany);
			if ("hideDeleteButton" in $$props) $$invalidate(3, hideDeleteButton = $$props.hideDeleteButton);
			if ("elementSize" in $$props) $$invalidate(4, elementSize = $$props.elementSize);
			if ("bucketId" in $$props) $$invalidate(15, bucketId = $$props.bucketId);
			if ("data" in $$props) $$invalidate(5, data = $$props.data);
		};

		let ifSelected;
		let ifDragNDrop;

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*selected*/ 1024) {
				 $$invalidate(6, ifSelected = selected ? "selected" : "");
			}

			if ($$self.$$.dirty & /*dragNDrop*/ 2048) {
				 $$invalidate(7, ifDragNDrop = dragNDrop ? " draggable-dropzone--occupied " : "");
			}
		};

		return [
			progress,
			droppableClass,
			notUploaded,
			hideDeleteButton,
			elementSize,
			data,
			ifSelected,
			ifDragNDrop,
			onClick,
			remove,
			selected,
			dragNDrop,
			dragNDropContainerClass,
			dropzoneClass,
			selectMany,
			bucketId
		];
	}

	class File extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$1, create_fragment$1, safe_not_equal, {
				progress: 0,
				selected: 10,
				dragNDrop: 11,
				dragNDropContainerClass: 12,
				dropzoneClass: 13,
				droppableClass: 1,
				notUploaded: 2,
				selectMany: 14,
				hideDeleteButton: 3,
				elementSize: 4,
				bucketId: 15,
				data: 5
			});
		}
	}

	/* src/standalone/storage.svelte generated by Svelte v3.29.0 */

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[27] = list[i];
		child_ctx[28] = list;
		child_ctx[29] = i;
		return child_ctx;
	}

	function get_each_context_1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[27] = list[i];
		child_ctx[30] = list;
		child_ctx[31] = i;
		return child_ctx;
	}

	// (131:0) {#if !popup && show}
	function create_if_block_1$1(ctx) {
		let div1;
		let div0;
		let div1_class_value;
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

				attr(div0, "class", "file-list");

				attr(div1, "class", div1_class_value = "container " + (/*dragNDrop*/ ctx[6]
				? /*dragNDropContainerClass*/ ctx[7]
				: "") + " svelte-18hgx6z");
			},
			m(target, anchor) {
				insert(target, div1, anchor);
				append(div1, div0);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(div0, null);
				}

				/*div1_binding*/ ctx[22](div1);
				current = true;
			},
			p(ctx, dirty) {
				if (dirty[0] & /*dragNDrop, dragNDropContainerClass, dropzoneClass, droppableClass, elementSize, id, selectMany, files, removeFile*/ 66541) {
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

				if (!current || dirty[0] & /*dragNDrop, dragNDropContainerClass*/ 192 && div1_class_value !== (div1_class_value = "container " + (/*dragNDrop*/ ctx[6]
				? /*dragNDropContainerClass*/ ctx[7]
				: "") + " svelte-18hgx6z")) {
					attr(div1, "class", div1_class_value);
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
				/*div1_binding*/ ctx[22](null);
			}
		};
	}

	// (134:2) {#each files as file, index}
	function create_each_block_1(ctx) {
		let notfileitem;
		let updating_data;
		let current;

		function notfileitem_data_binding(value) {
			/*notfileitem_data_binding*/ ctx[21].call(null, value, /*file*/ ctx[27], /*each_value_1*/ ctx[30], /*index*/ ctx[31]);
		}

		let notfileitem_props = {
			dragNDrop: /*dragNDrop*/ ctx[6],
			dragNDropContainerClass: /*dragNDropContainerClass*/ ctx[7],
			dropzoneClass: /*dropzoneClass*/ ctx[8],
			droppableClass: /*droppableClass*/ ctx[9],
			elementSize: /*elementSize*/ ctx[5],
			bucketId: /*id*/ ctx[2],
			selectMany: /*selectMany*/ ctx[3]
		};

		if (/*file*/ ctx[27] !== void 0) {
			notfileitem_props.data = /*file*/ ctx[27];
		}

		notfileitem = new File({ props: notfileitem_props });
		binding_callbacks.push(() => bind$1(notfileitem, "data", notfileitem_data_binding));
		notfileitem.$on("remove", /*removeFile*/ ctx[16]);

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
				if (dirty[0] & /*dragNDrop*/ 64) notfileitem_changes.dragNDrop = /*dragNDrop*/ ctx[6];
				if (dirty[0] & /*dragNDropContainerClass*/ 128) notfileitem_changes.dragNDropContainerClass = /*dragNDropContainerClass*/ ctx[7];
				if (dirty[0] & /*dropzoneClass*/ 256) notfileitem_changes.dropzoneClass = /*dropzoneClass*/ ctx[8];
				if (dirty[0] & /*droppableClass*/ 512) notfileitem_changes.droppableClass = /*droppableClass*/ ctx[9];
				if (dirty[0] & /*elementSize*/ 32) notfileitem_changes.elementSize = /*elementSize*/ ctx[5];
				if (dirty[0] & /*id*/ 4) notfileitem_changes.bucketId = /*id*/ ctx[2];
				if (dirty[0] & /*selectMany*/ 8) notfileitem_changes.selectMany = /*selectMany*/ ctx[3];

				if (!updating_data && dirty[0] & /*files*/ 1) {
					updating_data = true;
					notfileitem_changes.data = /*file*/ ctx[27];
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

	// (141:0) {#if popup && show}
	function create_if_block$1(ctx) {
		let div4;
		let div0;
		let t0;
		let div3;
		let header;
		let p;
		let t2;
		let button0;
		let t3;
		let section;
		let div2;
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
		const get_key = ctx => /*file*/ ctx[27].id;

		for (let i = 0; i < each_value.length; i += 1) {
			let child_ctx = get_each_context(ctx, each_value, i);
			let key = get_key(child_ctx);
			each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
		}

		return {
			c() {
				div4 = element("div");
				div0 = element("div");
				t0 = space();
				div3 = element("div");
				header = element("header");
				p = element("p");
				p.textContent = "Выберите файл";
				t2 = space();
				button0 = element("button");
				t3 = space();
				section = element("section");
				div2 = element("div");
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
				attr(div1, "class", "file-list");
				attr(div2, "class", "container svelte-18hgx6z");
				attr(section, "class", "modal-card-body");
				attr(button1, "class", "button is-success");
				attr(button2, "class", "button is-danger");
				attr(button3, "class", "button");
				attr(footer, "class", "modal-card-foot");
				attr(div3, "class", "modal-card");
				attr(div4, "class", "modal is-active");
			},
			m(target, anchor) {
				insert(target, div4, anchor);
				append(div4, div0);
				append(div4, t0);
				append(div4, div3);
				append(div3, header);
				append(header, p);
				append(header, t2);
				append(header, button0);
				append(div3, t3);
				append(div3, section);
				append(section, div2);
				append(div2, div1);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(div1, null);
				}

				append(div3, t4);
				append(div3, footer);
				append(footer, button1);
				append(footer, t6);
				append(footer, button2);
				append(footer, t8);
				append(footer, button3);
				/*div4_binding*/ ctx[24](div4);
				current = true;

				if (!mounted) {
					dispose = [
						listen(button0, "click", /*closePopup*/ ctx[12]),
						listen(button1, "click", /*resolvePopup*/ ctx[14]),
						listen(button2, "click", /*removeSelected*/ ctx[15]),
						listen(button3, "click", /*rejectPopup*/ ctx[13])
					];

					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (dirty[0] & /*id, selectMany, files, removeFile*/ 65549) {
					const each_value = /*files*/ ctx[0];
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
				if (detaching) detach(div4);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].d();
				}

				/*div4_binding*/ ctx[24](null);
				mounted = false;
				run_all(dispose);
			}
		};
	}

	// (152:5) {#each files as file(file.id)}
	function create_each_block(key_1, ctx) {
		let first;
		let notfileitem;
		let updating_data;
		let current;

		function notfileitem_data_binding_1(value) {
			/*notfileitem_data_binding_1*/ ctx[23].call(null, value, /*file*/ ctx[27], /*each_value*/ ctx[28], /*file_index*/ ctx[29]);
		}

		let notfileitem_props = {
			bucketId: /*id*/ ctx[2],
			selectMany: /*selectMany*/ ctx[3]
		};

		if (/*file*/ ctx[27] !== void 0) {
			notfileitem_props.data = /*file*/ ctx[27];
		}

		notfileitem = new File({ props: notfileitem_props });
		binding_callbacks.push(() => bind$1(notfileitem, "data", notfileitem_data_binding_1));
		notfileitem.$on("remove", /*removeFile*/ ctx[16]);

		return {
			key: key_1,
			first: null,
			c() {
				first = empty();
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
				if (dirty[0] & /*id*/ 4) notfileitem_changes.bucketId = /*id*/ ctx[2];
				if (dirty[0] & /*selectMany*/ 8) notfileitem_changes.selectMany = /*selectMany*/ ctx[3];

				if (!updating_data && dirty[0] & /*files*/ 1) {
					updating_data = true;
					notfileitem_changes.data = /*file*/ ctx[27];
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
				if_block1_anchor = empty();
			},
			m(target, anchor) {
				if (if_block0) if_block0.m(target, anchor);
				insert(target, t, anchor);
				if (if_block1) if_block1.m(target, anchor);
				insert(target, if_block1_anchor, anchor);
				current = true;
			},
			p(ctx, dirty) {
				if (!/*popup*/ ctx[4] && /*show*/ ctx[1]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);

						if (dirty[0] & /*popup, show*/ 18) {
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

						if (dirty[0] & /*popup, show*/ 18) {
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
		let { dragNDrop = false } = $$props;
		let { dragNDropContainerClass = "drag-n-drop" } = $$props;
		let { dropzoneClass = "dropzone" } = $$props;
		let { droppableClass = "droppable" } = $$props;
		let { onReject } = $$props;
		let { onResolve } = $$props;

		onMount(() => {
			get$1(id).files.subscribe(value => {
				files.forEach((file, id) => {
					file.id = id;
				});

				$$invalidate(0, files = value);
			});

			get$1(id).selected.subscribe(value => {
				$$invalidate(17, selected = value);
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
				$$invalidate(18, onReject = null);
			} else {
				dispatch("reject");
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
					$$invalidate(19, onResolve = null);
				} else {
					dispatch("resolve", { selected: images });
				}
			} else {
				if (onResolve) {
					onResolve([]);
					$$invalidate(19, onResolve = null);
				} else {
					dispatch("resolve", { selected: [] });
				}
			}
		}

		function removeSelected() {
			Confirmation.ask({
				title: `Удаление файлов (${selected.length}) `,
				text: "Файлы будут удалены без возможнеости восстановления!",
				approval: "Удалить файлы?"
			}).then(() => {
				console.log("remove approved");
				dispatch("remove", { selected });
			}).catch(() => {
				console.log("remove disapprove");
			});
		}

		function removeFile(ev) {
			console.log("removeFile", ev);
			dispatch("remove", { selected: [ev.detail.uuid] });
		}

		function notfileitem_data_binding(value, file, each_value_1, index) {
			each_value_1[index] = value;
			$$invalidate(0, files);
		}

		function div1_binding($$value) {
			binding_callbacks[$$value ? "unshift" : "push"](() => {
				inlineList = $$value;
				$$invalidate(10, inlineList);
			});
		}

		function notfileitem_data_binding_1(value, file, each_value, file_index) {
			each_value[file_index] = value;
			$$invalidate(0, files);
		}

		function div4_binding($$value) {
			binding_callbacks[$$value ? "unshift" : "push"](() => {
				modalList = $$value;
				$$invalidate(11, modalList);
			});
		}

		$$self.$$set = $$props => {
			if ("files" in $$props) $$invalidate(0, files = $$props.files);
			if ("selected" in $$props) $$invalidate(17, selected = $$props.selected);
			if ("id" in $$props) $$invalidate(2, id = $$props.id);
			if ("selectMany" in $$props) $$invalidate(3, selectMany = $$props.selectMany);
			if ("popup" in $$props) $$invalidate(4, popup = $$props.popup);
			if ("show" in $$props) $$invalidate(1, show = $$props.show);
			if ("elementSize" in $$props) $$invalidate(5, elementSize = $$props.elementSize);
			if ("dragNDrop" in $$props) $$invalidate(6, dragNDrop = $$props.dragNDrop);
			if ("dragNDropContainerClass" in $$props) $$invalidate(7, dragNDropContainerClass = $$props.dragNDropContainerClass);
			if ("dropzoneClass" in $$props) $$invalidate(8, dropzoneClass = $$props.dropzoneClass);
			if ("droppableClass" in $$props) $$invalidate(9, droppableClass = $$props.droppableClass);
			if ("onReject" in $$props) $$invalidate(18, onReject = $$props.onReject);
			if ("onResolve" in $$props) $$invalidate(19, onResolve = $$props.onResolve);
		};

		return [
			files,
			show,
			id,
			selectMany,
			popup,
			elementSize,
			dragNDrop,
			dragNDropContainerClass,
			dropzoneClass,
			droppableClass,
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
			div1_binding,
			notfileitem_data_binding_1,
			div4_binding
		];
	}

	class Storage extends SvelteComponent {
		constructor(options) {
			super();

			init(
				this,
				options,
				instance$2,
				create_fragment$2,
				safe_not_equal,
				{
					files: 0,
					selected: 17,
					id: 2,
					selectMany: 3,
					popup: 4,
					show: 1,
					elementSize: 5,
					dragNDrop: 6,
					dragNDropContainerClass: 7,
					dropzoneClass: 8,
					droppableClass: 9,
					onReject: 18,
					onResolve: 19,
					updateFiles: 20
				},
				[-1, -1]
			);
		}

		get updateFiles() {
			return this.$$.ctx[20];
		}
	}

	/* src/standalone/file.upload.svelte generated by Svelte v3.29.0 */

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
				if (img.src !== (img_src_value = /*data*/ ctx[1].preview)) attr(img, "src", img_src_value);
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

				if (dirty & /*data*/ 2 && img.src !== (img_src_value = /*data*/ ctx[1].preview)) {
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
			i: noop,
			o: noop,
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
			name: "default.file.name",
			size: 1000,
			preview: false
		} } = $$props;

		$$self.$$set = $$props => {
			if ("uploaded" in $$props) $$invalidate(0, uploaded = $$props.uploaded);
			if ("data" in $$props) $$invalidate(1, data = $$props.data);
		};

		return [uploaded, data];
	}

	class File_upload extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$3, create_fragment$3, safe_not_equal, { uploaded: 0, data: 1 });
		}
	}

	/* src/standalone/upload.svelte generated by Svelte v3.29.0 */

	function get_each_context$1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[8] = list[i];
		return child_ctx;
	}

	function get_each_context_1$1(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[8] = list[i];
		return child_ctx;
	}

	// (39:0) {#if !popup && show}
	function create_if_block_3(ctx) {
		let div0;
		let label;
		let form;
		let input;
		let t0;
		let span1;
		let t2;
		let div1;
		let t3;
		let current;
		let mounted;
		let dispose;
		let if_block0 = /*uploads*/ ctx[0].length === 0 && create_if_block_5();
		let if_block1 = /*uploads*/ ctx[0].length > 0 && create_if_block_4(ctx);

		return {
			c() {
				div0 = element("div");
				label = element("label");
				form = element("form");
				input = element("input");
				t0 = space();
				span1 = element("span");
				span1.innerHTML = `<span class="file-label svelte-9du03">Выберите изображения для загрузки</span>`;
				t2 = space();
				div1 = element("div");
				if (if_block0) if_block0.c();
				t3 = space();
				if (if_block1) if_block1.c();
				attr(input, "class", "file-input");
				attr(input, "type", "file");
				attr(input, "name", "file");
				attr(input, "accept", "image/*");
				input.multiple = "true";
				attr(span1, "class", "file-cta svelte-9du03");
				attr(form, "action", "./");
				attr(label, "class", "file-label svelte-9du03");
				attr(div0, "class", "file is-boxed dropzone svelte-9du03");
				attr(div1, "class", "previews svelte-9du03");
			},
			m(target, anchor) {
				insert(target, div0, anchor);
				append(div0, label);
				append(label, form);
				append(form, input);
				append(form, t0);
				append(form, span1);
				insert(target, t2, anchor);
				insert(target, div1, anchor);
				if (if_block0) if_block0.m(div1, null);
				append(div1, t3);
				if (if_block1) if_block1.m(div1, null);
				current = true;

				if (!mounted) {
					dispose = listen(input, "change", /*onChange*/ ctx[6]);
					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (/*uploads*/ ctx[0].length === 0) {
					if (if_block0) ; else {
						if_block0 = create_if_block_5();
						if_block0.c();
						if_block0.m(div1, t3);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (/*uploads*/ ctx[0].length > 0) {
					if (if_block1) {
						if_block1.p(ctx, dirty);

						if (dirty & /*uploads*/ 1) {
							transition_in(if_block1, 1);
						}
					} else {
						if_block1 = create_if_block_4(ctx);
						if_block1.c();
						transition_in(if_block1, 1);
						if_block1.m(div1, null);
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
				transition_in(if_block1);
				current = true;
			},
			o(local) {
				transition_out(if_block1);
				current = false;
			},
			d(detaching) {
				if (detaching) detach(div0);
				if (detaching) detach(t2);
				if (detaching) detach(div1);
				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				mounted = false;
				dispose();
			}
		};
	}

	// (51:1) {#if uploads.length === 0}
	function create_if_block_5(ctx) {
		let h2;

		return {
			c() {
				h2 = element("h2");
				h2.textContent = "Нету загружаемых файлов";
				attr(h2, "class", "subtitle");
			},
			m(target, anchor) {
				insert(target, h2, anchor);
			},
			d(detaching) {
				if (detaching) detach(h2);
			}
		};
	}

	// (54:1) {#if uploads.length > 0}
	function create_if_block_4(ctx) {
		let each_1_anchor;
		let current;
		let each_value_1 = /*uploads*/ ctx[0];
		let each_blocks = [];

		for (let i = 0; i < each_value_1.length; i += 1) {
			each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
		}

		const out = i => transition_out(each_blocks[i], 1, 1, () => {
			each_blocks[i] = null;
		});

		return {
			c() {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty();
			},
			m(target, anchor) {
				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert(target, each_1_anchor, anchor);
				current = true;
			},
			p(ctx, dirty) {
				if (dirty & /*id, uploads*/ 5) {
					each_value_1 = /*uploads*/ ctx[0];
					let i;

					for (i = 0; i < each_value_1.length; i += 1) {
						const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block_1$1(child_ctx);
							each_blocks[i].c();
							transition_in(each_blocks[i], 1);
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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
				destroy_each(each_blocks, detaching);
				if (detaching) detach(each_1_anchor);
			}
		};
	}

	// (55:1) {#each uploads as upload}
	function create_each_block_1$1(ctx) {
		let notfileupload;
		let current;

		notfileupload = new File_upload({
				props: {
					bucketId: /*id*/ ctx[2],
					data: /*upload*/ ctx[8]
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
				if (dirty & /*uploads*/ 1) notfileupload_changes.data = /*upload*/ ctx[8];
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

	// (62:0) {#if popup && show}
	function create_if_block$3(ctx) {
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
		let t4;
		let t5;
		let footer;
		let button1;
		let current;
		let mounted;
		let dispose;
		let if_block0 = /*uploads*/ ctx[0].length === 0 && create_if_block_2$1();
		let if_block1 = /*uploads*/ ctx[0].length > 0 && create_if_block_1$3(ctx);

		return {
			c() {
				div3 = element("div");
				div0 = element("div");
				t0 = space();
				div2 = element("div");
				header = element("header");
				p = element("p");
				p.textContent = "Добавьте файлы для загрузки";
				t2 = space();
				button0 = element("button");
				t3 = space();
				section = element("section");
				div1 = element("div");
				if (if_block0) if_block0.c();
				t4 = space();
				if (if_block1) if_block1.c();
				t5 = space();
				footer = element("footer");
				button1 = element("button");
				button1.textContent = "Завершить";
				attr(div0, "class", "modal-background");
				attr(p, "class", "modal-card-title");
				attr(button0, "class", "delete");
				attr(button0, "aria-label", "close");
				attr(header, "class", "modal-card-head");
				attr(div1, "class", "container");
				attr(section, "class", "modal-card-body");
				attr(button1, "class", "button is-success");
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
				if (if_block0) if_block0.m(div1, null);
				append(div1, t4);
				if (if_block1) if_block1.m(div1, null);
				append(div2, t5);
				append(div2, footer);
				append(footer, button1);
				current = true;

				if (!mounted) {
					dispose = [
						listen(button0, "click", /*closePopup*/ ctx[4]),
						listen(button1, "click", /*resolvePopup*/ ctx[5])
					];

					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (/*uploads*/ ctx[0].length === 0) {
					if (if_block0) ; else {
						if_block0 = create_if_block_2$1();
						if_block0.c();
						if_block0.m(div1, t4);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (/*uploads*/ ctx[0].length > 0) {
					if (if_block1) {
						if_block1.p(ctx, dirty);

						if (dirty & /*uploads*/ 1) {
							transition_in(if_block1, 1);
						}
					} else {
						if_block1 = create_if_block_1$3(ctx);
						if_block1.c();
						transition_in(if_block1, 1);
						if_block1.m(div1, null);
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
				transition_in(if_block1);
				current = true;
			},
			o(local) {
				transition_out(if_block1);
				current = false;
			},
			d(detaching) {
				if (detaching) detach(div3);
				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				mounted = false;
				run_all(dispose);
			}
		};
	}

	// (72:4) {#if uploads.length === 0}
	function create_if_block_2$1(ctx) {
		let h2;

		return {
			c() {
				h2 = element("h2");
				h2.textContent = "Нету загружаемых файлов";
				attr(h2, "class", "subtitle");
			},
			m(target, anchor) {
				insert(target, h2, anchor);
			},
			d(detaching) {
				if (detaching) detach(h2);
			}
		};
	}

	// (75:4) {#if uploads.length > 0}
	function create_if_block_1$3(ctx) {
		let div;
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
				div = element("div");

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				attr(div, "class", "file-list");
			},
			m(target, anchor) {
				insert(target, div, anchor);

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(div, null);
				}

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
							each_blocks[i].m(div, null);
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
				if (detaching) detach(div);
				destroy_each(each_blocks, detaching);
			}
		};
	}

	// (77:5) {#each uploads as upload}
	function create_each_block$1(ctx) {
		let notfileupload;
		let current;

		notfileupload = new File_upload({
				props: {
					bucketId: /*id*/ ctx[2],
					data: /*upload*/ ctx[8]
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
				if (dirty & /*uploads*/ 1) notfileupload_changes.data = /*upload*/ ctx[8];
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
		let t;
		let if_block1_anchor;
		let current;
		let if_block0 = !/*popup*/ ctx[3] && /*show*/ ctx[1] && create_if_block_3(ctx);
		let if_block1 = /*popup*/ ctx[3] && /*show*/ ctx[1] && create_if_block$3(ctx);

		return {
			c() {
				if (if_block0) if_block0.c();
				t = space();
				if (if_block1) if_block1.c();
				if_block1_anchor = empty();
			},
			m(target, anchor) {
				if (if_block0) if_block0.m(target, anchor);
				insert(target, t, anchor);
				if (if_block1) if_block1.m(target, anchor);
				insert(target, if_block1_anchor, anchor);
				current = true;
			},
			p(ctx, [dirty]) {
				if (!/*popup*/ ctx[3] && /*show*/ ctx[1]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);

						if (dirty & /*popup, show*/ 10) {
							transition_in(if_block0, 1);
						}
					} else {
						if_block0 = create_if_block_3(ctx);
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

				if (/*popup*/ ctx[3] && /*show*/ ctx[1]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);

						if (dirty & /*popup, show*/ 10) {
							transition_in(if_block1, 1);
						}
					} else {
						if_block1 = create_if_block$3(ctx);
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

	function instance$4($$self, $$props, $$invalidate) {
		const dispatch = createEventDispatcher();
		let { id } = $$props;
		let { uploads = [] } = $$props;
		let { popup = false } = $$props;
		let { show = false } = $$props;

		onMount(() => {
			get$1(id).uploads.subscribe(value => {
				$$invalidate(0, uploads = value);
			});
		});

		function closePopup() {
			$$invalidate(1, show = false);
		}

		function resolvePopup() {
			closePopup();
			dispatch("resolve");
		}

		function onChange(ev) {
			console.log("on input change", ev);
			dispatch("filesAdded", ev.target.files);
		}

		$$self.$$set = $$props => {
			if ("id" in $$props) $$invalidate(2, id = $$props.id);
			if ("uploads" in $$props) $$invalidate(0, uploads = $$props.uploads);
			if ("popup" in $$props) $$invalidate(3, popup = $$props.popup);
			if ("show" in $$props) $$invalidate(1, show = $$props.show);
		};

		return [uploads, show, id, popup, closePopup, resolvePopup, onChange];
	}

	class Upload extends SvelteComponent {
		constructor(options) {
			super();
			init(this, options, instance$4, create_fragment$4, safe_not_equal, { id: 2, uploads: 0, popup: 3, show: 1 });
		}
	}

	/* src/standalone/complex.svelte generated by Svelte v3.29.0 */

	function create_if_block_1$4(ctx) {
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
		let uploadercomponent;
		let updating_id;
		let t4;
		let storagecomponent;
		let updating_id_1;
		let updating_selectMany;
		let t5;
		let footer;
		let button1;
		let t7;
		let button2;
		let t9;
		let button3;
		let current;
		let mounted;
		let dispose;

		function uploadercomponent_id_binding(value) {
			/*uploadercomponent_id_binding*/ ctx[19].call(null, value);
		}

		let uploadercomponent_props = { popup: false, show: true };

		if (/*id*/ ctx[0] !== void 0) {
			uploadercomponent_props.id = /*id*/ ctx[0];
		}

		uploadercomponent = new Upload({ props: uploadercomponent_props });
		binding_callbacks.push(() => bind$1(uploadercomponent, "id", uploadercomponent_id_binding));
		uploadercomponent.$on("filesAdded", /*onChange*/ ctx[12]);

		function storagecomponent_id_binding(value) {
			/*storagecomponent_id_binding*/ ctx[20].call(null, value);
		}

		function storagecomponent_selectMany_binding(value) {
			/*storagecomponent_selectMany_binding*/ ctx[21].call(null, value);
		}

		let storagecomponent_props = { popup: false, show: true };

		if (/*id*/ ctx[0] !== void 0) {
			storagecomponent_props.id = /*id*/ ctx[0];
		}

		if (/*selectMany*/ ctx[1] !== void 0) {
			storagecomponent_props.selectMany = /*selectMany*/ ctx[1];
		}

		storagecomponent = new Storage({ props: storagecomponent_props });
		binding_callbacks.push(() => bind$1(storagecomponent, "id", storagecomponent_id_binding));
		binding_callbacks.push(() => bind$1(storagecomponent, "selectMany", storagecomponent_selectMany_binding));
		storagecomponent.$on("remove", /*removeFile*/ ctx[14]);

		return {
			c() {
				div3 = element("div");
				div0 = element("div");
				t0 = space();
				div2 = element("div");
				header = element("header");
				p = element("p");
				p.textContent = "Добавьте файлы для загрузки";
				t2 = space();
				button0 = element("button");
				t3 = space();
				section = element("section");
				div1 = element("div");
				create_component(uploadercomponent.$$.fragment);
				t4 = space();
				create_component(storagecomponent.$$.fragment);
				t5 = space();
				footer = element("footer");
				button1 = element("button");
				button1.textContent = "Выбрать";
				t7 = space();
				button2 = element("button");
				button2.textContent = "Удалить";
				t9 = space();
				button3 = element("button");
				button3.textContent = "Закрыть";
				attr(div0, "class", "modal-background");
				attr(p, "class", "modal-card-title");
				attr(button0, "class", "delete");
				attr(button0, "aria-label", "close");
				attr(header, "class", "modal-card-head");
				attr(div1, "class", "container");
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
				mount_component(uploadercomponent, div1, null);
				append(div1, t4);
				mount_component(storagecomponent, div1, null);
				append(div2, t5);
				append(div2, footer);
				append(footer, button1);
				append(footer, t7);
				append(footer, button2);
				append(footer, t9);
				append(footer, button3);
				current = true;

				if (!mounted) {
					dispose = [
						listen(button0, "click", /*closePopup*/ ctx[9]),
						listen(button1, "click", /*resolvePopup*/ ctx[10]),
						listen(button2, "click", /*removeSelected*/ ctx[13]),
						listen(button3, "click", /*rejectPopup*/ ctx[11])
					];

					mounted = true;
				}
			},
			p(ctx, dirty) {
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
				destroy_component(uploadercomponent);
				destroy_component(storagecomponent);
				mounted = false;
				run_all(dispose);
			}
		};
	}

	// (140:0) {#if !popup && show}
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

		uploadercomponent.$on("filesAdded", /*onChange*/ ctx[12]);

		storagecomponent = new Storage({
				props: {
					popup: false,
					dragNDrop: /*dragNDrop*/ ctx[4],
					dragNDropContainerClass: /*dragNDropContainerClass*/ ctx[5],
					dropzoneClass: /*dropzoneClass*/ ctx[6],
					droppableClass: /*droppableClass*/ ctx[7],
					elementSize: /*elementSize*/ ctx[8],
					show: true,
					id: /*id*/ ctx[0],
					selectMany: false
				}
			});

		storagecomponent.$on("remove", /*removeFile*/ ctx[14]);

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
				if (dirty & /*dragNDrop*/ 16) storagecomponent_changes.dragNDrop = /*dragNDrop*/ ctx[4];
				if (dirty & /*dragNDropContainerClass*/ 32) storagecomponent_changes.dragNDropContainerClass = /*dragNDropContainerClass*/ ctx[5];
				if (dirty & /*dropzoneClass*/ 64) storagecomponent_changes.dropzoneClass = /*dropzoneClass*/ ctx[6];
				if (dirty & /*droppableClass*/ 128) storagecomponent_changes.droppableClass = /*droppableClass*/ ctx[7];
				if (dirty & /*elementSize*/ 256) storagecomponent_changes.elementSize = /*elementSize*/ ctx[8];
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
		let if_block0 = /*popup*/ ctx[3] && /*show*/ ctx[2] && create_if_block_1$4(ctx);
		let if_block1 = !/*popup*/ ctx[3] && /*show*/ ctx[2] && create_if_block$4(ctx);

		return {
			c() {
				if (if_block0) if_block0.c();
				t = space();
				if (if_block1) if_block1.c();
				if_block1_anchor = empty();
			},
			m(target, anchor) {
				if (if_block0) if_block0.m(target, anchor);
				insert(target, t, anchor);
				if (if_block1) if_block1.m(target, anchor);
				insert(target, if_block1_anchor, anchor);
				current = true;
			},
			p(ctx, [dirty]) {
				if (/*popup*/ ctx[3] && /*show*/ ctx[2]) {
					if (if_block0) {
						if_block0.p(ctx, dirty);

						if (dirty & /*popup, show*/ 12) {
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

				if (!/*popup*/ ctx[3] && /*show*/ ctx[2]) {
					if (if_block1) {
						if_block1.p(ctx, dirty);

						if (dirty & /*popup, show*/ 12) {
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
				console.log(popup, show);
				$$invalidate(15, files = value);
			});

			get$1(id).selected.subscribe(value => {
				$$invalidate(16, selected = value);
			});
		});

		let { id } = $$props;
		let { files = [] } = $$props;
		let { selected = [] } = $$props;
		let { selectMany } = $$props;
		let { show = true } = $$props;
		let { popup = true } = $$props;
		let { dragNDrop = false } = $$props;
		let { dragNDropContainerClass = "drag-n-drop" } = $$props;
		let { dropzoneClass = "dropzone" } = $$props;
		let { droppableClass = "droppable" } = $$props;
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
					$$invalidate(18, onResolve = null);
				} else {
					dispatch("resolve", { selected: images });
				}
			} else {
				if (onResolve) {
					onResolve([]);
					$$invalidate(18, onResolve = null);
				} else {
					dispatch("resolve", { selected: [] });
				}
			}
		}

		function rejectPopup() {
			closePopup();

			if (onReject) {
				onReject();
				$$invalidate(17, onReject = null);
			} else {
				dispatch("reject");
			}
		}

		function onChange(ev) {
			console.log("on input change", ev);
			dispatch("filesAdded", ev.detail);
		}

		function removeSelected() {
			Confirmation.ask({
				title: `Удаление файлов (${selected.length}) `,
				text: "Файлы будут удалены без возможнеости восстановления!",
				approval: "Удалить файлы?"
			}).then(() => {
				console.log("remove approved");
				dispatch("remove", { selected });
			}).catch(() => {
				console.log("remove disapprove");
			});
		}

		function removeFile(ev) {
			console.log("removeFile", ev);
			dispatch("remove", { selected: ev.detail.selected });
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
			if ("id" in $$props) $$invalidate(0, id = $$props.id);
			if ("files" in $$props) $$invalidate(15, files = $$props.files);
			if ("selected" in $$props) $$invalidate(16, selected = $$props.selected);
			if ("selectMany" in $$props) $$invalidate(1, selectMany = $$props.selectMany);
			if ("show" in $$props) $$invalidate(2, show = $$props.show);
			if ("popup" in $$props) $$invalidate(3, popup = $$props.popup);
			if ("dragNDrop" in $$props) $$invalidate(4, dragNDrop = $$props.dragNDrop);
			if ("dragNDropContainerClass" in $$props) $$invalidate(5, dragNDropContainerClass = $$props.dragNDropContainerClass);
			if ("dropzoneClass" in $$props) $$invalidate(6, dropzoneClass = $$props.dropzoneClass);
			if ("droppableClass" in $$props) $$invalidate(7, droppableClass = $$props.droppableClass);
			if ("elementSize" in $$props) $$invalidate(8, elementSize = $$props.elementSize);
			if ("onReject" in $$props) $$invalidate(17, onReject = $$props.onReject);
			if ("onResolve" in $$props) $$invalidate(18, onResolve = $$props.onResolve);
		};

		return [
			id,
			selectMany,
			show,
			popup,
			dragNDrop,
			dragNDropContainerClass,
			dropzoneClass,
			droppableClass,
			elementSize,
			closePopup,
			resolvePopup,
			rejectPopup,
			onChange,
			removeSelected,
			removeFile,
			files,
			selected,
			onReject,
			onResolve,
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
				files: 15,
				selected: 16,
				selectMany: 1,
				show: 2,
				popup: 3,
				dragNDrop: 4,
				dragNDropContainerClass: 5,
				dropzoneClass: 6,
				droppableClass: 7,
				elementSize: 8,
				onReject: 17,
				onResolve: 18
			});
		}
	}

	var file_manifest = {
	  model: 'file',
	  url: '/api/:modelName',
	  fields: {},
	  actions: {
	    create: {
	      method: 'PUT',
	      isArray: false,
	      data: ['record'],
	      postFix: '/:bucket?',
	      rules: [{
	        auth: true,
	        admin: true
	      }, {
	        auth: true,
	        admin: false
	      }, {
	        auth: false,
	        admin: false
	      }]
	    },
	    list: {
	      method: 'GET',
	      isArray: true,
	      data: ['pager', 'sorter', 'filter', 'search'],
	      fields: ['_id', 'fileID', 'name', 'extension', 'bucket', 'metadata', 'path', 'userIp', 'userId', 'session', 'width', 'height', 'size'],
	      rules: [{
	        auth: true,
	        admin: true
	      }, {
	        auth: true,
	        admin: false
	      }, {
	        auth: false,
	        admin: false
	      }]
	    },
	    listAndCount: {
	      method: 'get',
	      data: ['pager', 'sorter', 'filter', 'search'],
	      fields: ['_id', 'fileID', 'name', 'extension', 'bucket', 'metadata', 'path', 'userIp', 'userId', 'session', 'width', 'height', 'size'],
	      rules: [{
	        auth: true,
	        admin: true
	      }, {
	        auth: true,
	        role: 'admin'
	      }],
	      postFix: '/:actionName'
	    },
	    get: {
	      method: 'GET',
	      isArray: false,
	      postFix: '/:record[_id]',
	      data: ['filter', 'record'],
	      fields: ['_id', 'fileID', 'name', 'extension', 'bucket', 'metadata', 'path', 'userIp', 'userId', 'session', 'width', 'height', 'size'],
	      rules: [{
	        auth: true,
	        admin: true
	      }, {
	        auth: true,
	        admin: false
	      }, {
	        auth: false,
	        admin: false
	      }]
	    },
	    delete: {
	      method: 'DELETE',
	      postFix: '/:record[fileID]',
	      isArray: false,
	      rules: [{
	        auth: true,
	        admin: true
	      }, {
	        auth: true,
	        admin: false
	      }, {
	        auth: false,
	        admin: false
	      }]
	    }
	  }
	};

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    typeof (NewTarget = dummy.constructor) == 'function' &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$7 = objectDefineProperty.f;
	var trim = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global_1[NUMBER];
	var NumberPrototype = NativeNumber.prototype;

	// Opera ~12 has broken Object#toString
	var BROKEN_CLASSOF = classofRaw(objectCreate(NumberPrototype)) == NUMBER;

	// `ToNumber` abstract operation
	// https://tc39.github.io/ecma262/#sec-tonumber
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, false);
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (typeof it == 'string' && it.length > 2) {
	    it = trim(it);
	    first = it.charCodeAt(0);
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
	        default: return +it;
	      }
	      digits = it.slice(2);
	      length = digits.length;
	      for (index = 0; index < length; index++) {
	        code = digits.charCodeAt(index);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	// `Number` constructor
	// https://tc39.github.io/ecma262/#sec-number-constructor
	if (isForced_1(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var dummy = this;
	    return dummy instanceof NumberWrapper
	      // check on 1..constructor(foo) case
	      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classofRaw(dummy) != NUMBER)
	        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
	  };
	  for (var keys$1 = descriptors ? getOwnPropertyNames(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j = 0, key; keys$1.length > j; j++) {
	    if (has(NativeNumber, key = keys$1[j]) && !has(NumberWrapper, key)) {
	      defineProperty$7(NumberWrapper, key, getOwnPropertyDescriptor$3(NativeNumber, key));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  redefine(global_1, NUMBER, NumberWrapper);
	}

	// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
	// so we use an intermediate function.
	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
		UNSUPPORTED_Y: UNSUPPORTED_Y,
		BROKEN_CARET: BROKEN_CARET
	};

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');
	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
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

	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points







	var SPECIES$6 = wellKnownSymbol('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	var REPLACE = wellKnownSymbol('replace');
	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
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

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !(
	      REPLACE_SUPPORTS_NAMED_GROUPS &&
	      REPLACE_KEEPS_$0 &&
	      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    )) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];

	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return regexMethod.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return regexMethod.call(string, this); }
	    );
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	var charAt$1 = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt$1(S, index).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	var max$3 = Math.max;
	var min$3 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
	  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
	  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible(this);
	      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return replacer !== undefined
	        ? replacer.call(searchValue, O, replaceValue)
	        : nativeReplace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      if (
	        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
	        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
	      ) {
	        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	        if (res.done) return res.value;
	      }

	      var rx = anObject(regexp);
	      var S = String(this);

	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regexpExecAbstract(rx, S);
	        if (result === null) break;

	        results.push(result);
	        if (!global) break;

	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = String(result[0]);
	        var position = max$3(min$3(toInteger(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];

	  // https://tc39.github.io/ecma262/#sec-getsubstitution
	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }
	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;
	      switch (ch.charAt(0)) {
	        case '$': return '$';
	        case '&': return matched;
	        case '`': return str.slice(0, position);
	        case "'": return str.slice(tailPos);
	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;
	        default: // \d\d?
	          var n = +ch;
	          if (n === 0) return match;
	          if (n > m) {
	            var f = floor$1(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }
	          capture = captures[n - 1];
	      }
	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	/*
		:property.sub1.func().funcProp
		 = return funcProp of function result of sub1 property of property of object
		:{::helperVal}.sub
		 = return sub property of object property with name retrieved from helperVal property of helpers object
		:{::helperFunc()}.sub
		= return sub property of object property with name retrieved from helperVal function result of helpers object.
		if helpersFunx return 'car' then source path becomes :car.sub

	*/

	const SUB_PATH_START = '{',
		SUB_PATH_END = '}',
		PATH_SPLIT = '.',
		PATH_START_OBJECT = ':',
		PATH_START_HELPERS = '::',
		FUNCTION_MARKER = '()',
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
		constructor() {
			return this;
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
		findNextSubPath(path) {
			let subPath = '',
				find = false;
			for (let i = 0; i < path.length; i++) {
				if (path[i] === SUB_PATH_START) {
					find = true;
					subPath = '';
				} else {
					if ((path[i] === SUB_PATH_END) && find) {
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

		replaceSubPath(path, sub, parsed) {
			let subf = SUB_PATH_START + sub + SUB_PATH_END,
				i = 0;
			while ((path.indexOf(subf) > -1) && i < MAX_DEEP) {
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
		parseSubs(path, item, helpers) {
			let subPath = this.findNextSubPath(path),
				subPathParsed, i = 0;
			while (subPath) {
				subPathParsed = this.getValueByPath(subPath.indexOf(PATH_START_HELPERS) > -1 ? helpers : item, subPath, item, helpers);
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

		get(path, item, helpers) {
			switch (path) {
			case PATH_START_OBJECT:
				return item;
			case PATH_START_HELPERS:
				return helpers;
			}
			path = this.parseSubs(path, item, helpers);
			return this.getValueByPath(path.indexOf(PATH_START_HELPERS) > -1 ? helpers : item, path, item, helpers);
		}

		/**
		 * Set property value
		 * @param {string} path path to property
		 * @param {object} item item object
		 * @param {object} helpers helpers object
		 * @param {any} attrValue value we want to assign
		 */

		set(path, item, helpers, attrValue) {
			if (arguments.length === 3) {
				attrValue = helpers;
				helpers = undefined;
			}
			let subPath = this.findNextSubPath(path),
				subPathParsed,
				i = 0;
			while (subPath) {

				subPathParsed = this.getValueByPath(subPath.indexOf(PATH_START_HELPERS) > -1 ? helpers : item, subPath, item, helpers);

				path = this.replaceSubPath(path, subPath, subPathParsed);

				if (i > MAX_DEEP) {
					break;
				}
				subPath = this.findNextSubPath(path);
				i++;
			}

			this.setValueByPath(item, path, attrValue);

			if (item.isRecord && this.normilizePath(path).length > 1 && item.__isActive) {
				item.trigger('change', item, path, attrValue);
			}
		}

		/**
		 * Set target property to null
		 * @param {string} path path to property
		 * @param {object} item item object
		 * @param {object} helpers helpers object
		 */

		unset(path, item, helpers) {
			this.set(path, item, helpers, null);
		}

		/**
		 * Parses step key, transforms it to end-form
		 * @param {string} step not parsed step key
		 * @param {object} item item object
		 * @param {object} helper helpers object
		 * @return {string|number} parsed step key
		 */

		parsePathStep(step, item, helper) {
			let rStep = null;
			if (step.indexOf(PATH_START_HELPERS) === 0 && helper) {
				rStep = step.replace(PATH_START_HELPERS, '');
				if (rStep.indexOf(FUNCTION_MARKER) === rStep.length - 2) {
					rStep = rStep.replace(FUNCTION_MARKER, '');
					if (helper.hasOwnProperty(rStep)) {
						return helper[rStep](item, undefined);
					}
				} else {
					return helper[rStep];
				}
			} else {
				if (step.indexOf(PATH_START_OBJECT) === 0 && item) {
					rStep = step.replace(PATH_START_OBJECT, '');
					if (rStep.indexOf(FUNCTION_MARKER) === rStep.length - 2) {
						rStep = rStep.replace(FUNCTION_MARKER, '');
						if (item.hasOwnProperty(rStep)) {
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
		parsePath(path, item, helper) {
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

		normilizePath(path) {
			if (Array.isArray(path)) {
				return path;
			} else {
				while (path.indexOf(PATH_START_OBJECT) > -1) {
					path = path.replace(PATH_START_OBJECT, '');
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

		ifFullSubPath(big, small) {
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

		getValueByPath(object, attrPath, item, helpers) {
			attrPath = this.normilizePath(attrPath);
			let attrName = attrPath.shift(),
				isFunction = attrName.indexOf(FUNCTION_MARKER) > -1;
			if (isFunction) {
				attrName = attrName.replace(FUNCTION_MARKER, '');
			}
			if ((typeof object === 'object' && typeof object !== 'undefined' && object!== null) && typeof object[attrName] !== 'undefined' && object[attrName] !== null) {
				let newObj = isFunction ? object[attrName]({
					item,
					helpers
				}) : object[attrName];
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

		setValueByPath(object, attrPath, attrValue) {
			attrPath = this.normilizePath(attrPath);
			let attrName = attrPath.shift();
			if (attrPath.length > 0) {
				if (!object.hasOwnProperty(attrName)) {
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

		join() {
			let args = Array.prototype.slice.call(arguments);
			return args.join(PATH_SPLIT);
		}
	}

	var src = new notPath();

	var notPath$1 = src;

	function _createForOfIteratorHelper$1(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$2(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

	function _unsupportedIterableToArray$2(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$2(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$2(o, minLen); }

	function _arrayLikeToArray$2(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
	var OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY = ['_id', 'id', 'ID'],
	    DEFAULT_FILTER = {},
	    DEFAULT_SEARCH = '',
	    DEFAULT_RETURN = {},
	    DEFAULT_PAGE_NUMBER = 1,
	    DEFAULT_PAGE_SIZE = 10,
	    DEFAULT_ACTION_PREFIX = '$';

	function capitalizeFirstLetter(string) {
	  return string.charAt(0).toUpperCase() + string.slice(1);
	}

	var netInterface = /*#__PURE__*/function () {
	  function netInterface(manifest, options) {
	    classCallCheck(this, netInterface);

	    this.options = options;
	    this.manifest = manifest;
	    this.working = {};
	    this.initActions();
	    return this;
	  }

	  createClass(netInterface, [{
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
	        console.log('request url for file upload', url);
	        var fd = new FormData();
	        fd.append('file', files);
	        opts.body = fd;
	      } else {
	        if (['OPTIONS', 'GET'].indexOf(actionData.method.toUpperCase()) === -1) {
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
	      var fieldName = '';
	      var len = start.length;

	      while (line.indexOf(start) > -1) {
	        var ind = line.indexOf(start);
	        var startSlice = ind + len;
	        var endSlice = line.indexOf(end);
	        fieldName = line.slice(startSlice, endSlice);
	        if (fieldName == '') break;
	        console.log(start + fieldName + end, notPath$1.get(fieldName, record));
	        line = line.replace(start + fieldName + end, notPath$1.get(fieldName, record));
	      }

	      return line;
	    }
	  }, {
	    key: "parseLine",
	    value: function parseLine(line, record, actionName) {
	      line = line.replace(':modelName', this.manifest.model);
	      line = line.replace(':actionName', actionName);
	      line = this.parseParams(':record[', ']', line, record);
	      line = this.parseParams(':', '?', line, record);
	      return line;
	    }
	  }, {
	    key: "getURL",
	    value: function getURL(record, actionData, actionName) {
	      var line = this.parseLine(this.manifest.url, record, actionName) + (Object.prototype.hasOwnProperty.call(actionData, 'postFix') ? this.parseLine(actionData.postFix, record, actionName) : '');
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
	      var p = '?';

	      for (var t in data) {
	        if (typeof data[t] !== 'undefined' && data[t] !== null) {
	          p += encodeURIComponent(t) + '=' + encodeURIComponent(data[t].constructor === Object ? JSON.stringify(data[t]) : data[t]) + '&';
	        }
	      } //for test purpose only, special test server needed


	      if (this.options.test) {
	        p += '&test=1';

	        if (this.options.test.session) {
	          p += '&session=' + this.options.test.session;
	        }

	        if (this.options.test.session) {
	          p += '&role=' + this.options.test.role;
	        }
	      }

	      return p;
	    }
	  }, {
	    key: "collectRequestData",
	    value: function collectRequestData(actionData) {
	      var requestData = {};

	      if (Object.prototype.hasOwnProperty.call(actionData, 'data') && Array.isArray(actionData.data)) {
	        for (var i = 0; i < actionData.data.length; i++) {
	          var dataProviderName = 'get' + capitalizeFirstLetter(actionData.data[i]);

	          if (this[dataProviderName] && typeof this[dataProviderName] === 'function') {
	            var data = this[dataProviderName](),
	                res = {};

	            if (['pager', 'sorter', 'filter', 'search', 'return'].indexOf(actionData.data[i]) > -1) {
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
	          prefixes = ['', this.manifest.model];

	      if (Object.prototype.hasOwnProperty.call(actionData, 'index') && actionData.index) {
	        list = [actionData.index].concat(OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY);
	      }

	      for (var _i = 0, _prefixes = prefixes; _i < _prefixes.length; _i++) {
	        var pre = _prefixes[_i];

	        var _iterator = _createForOfIteratorHelper$1(list),
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
	      notPath$1.set('filter', this.working, filterData);
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
	      return notPath$1.get('filter', this.working);
	    }
	  }, {
	    key: "setSearch",
	    value: function setSearch() {
	      var searchData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_SEARCH;
	      notPath$1.set('search', this.working, searchData);
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
	      return notPath$1.get('search', this.working);
	    }
	  }, {
	    key: "setSorter",
	    value: function setSorter(sorterData) {
	      notPath$1.set('sorter', this.working, sorterData);
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
	      return notPath$1.get('sorter', this.working);
	    }
	  }, {
	    key: "setReturn",
	    value: function setReturn() {
	      var returnData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_RETURN;
	      notPath$1.set('return', this.working, returnData);
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
	      return notPath$1.get('return', this.working);
	    }
	  }, {
	    key: "setPageNumber",
	    value: function setPageNumber(pageNumber) {
	      notPath$1.set('pager.page', this.working, pageNumber);
	      return this;
	    }
	  }, {
	    key: "setPageSize",
	    value: function setPageSize(pageSize) {
	      notPath$1.set('pager.size', this.working, pageSize);
	      return this;
	    }
	  }, {
	    key: "setPager",
	    value: function setPager() {
	      var pageSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_PAGE_SIZE;
	      var pageNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_PAGE_NUMBER;

	      if (pageSize.constructor === Number) {
	        notPath$1.set('pager', this.working, {
	          size: pageSize,
	          page: pageNumber
	        });
	      } else if (pageSize.constructor === Object) {
	        notPath$1.set('pager', this.working, {
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
	      return notPath$1.get('pager', this.working);
	    }
	  }]);

	  return netInterface;
	}();

	function _createForOfIteratorHelper$2(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$3(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

	function _unsupportedIterableToArray$3(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$3(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$3(o, minLen); }

	function _arrayLikeToArray$3(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

	/* global FileReader, document, Image */
	var DEFAULT_OPTS = {
	  bucket: 'client',
	  server: '',
	  selectMany: false,
	  preview: {
	    width: 100,
	    height: 100
	  }
	}; //выбор из уже загруженных

	var notStore = /*#__PURE__*/function () {
	  function notStore(options) {
	    classCallCheck(this, notStore);

	    this.options = Object.assign({}, DEFAULT_OPTS, options);
	    this.ui = {};
	    this.init();
	  }

	  createClass(notStore, [{
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
	          show: this.options.complex && this.options.complex.show,
	          popup: this.options.complex && this.options.complex.popup
	        }
	      });
	      this.ui.complex.$on('remove', this.removeFiles.bind(this));
	      this.ui.complex.$on('filesAdded', this.onUploads.bind(this));
	    }
	  }, {
	    key: "renderStorage",
	    value: function renderStorage() {
	      this.ui.storage = new Storage({
	        target: this.options.storageEl,
	        props: {
	          files: this.files,
	          id: this.options.id,
	          selectMany: this.options.selectMany,
	          popup: this.options.storage && this.options.storage.popup,
	          show: this.options.storage && this.options.storage.show
	        }
	      });
	      this.ui.storage.$on('remove', this.removeFiles.bind(this));
	    }
	  }, {
	    key: "renderUpload",
	    value: function renderUpload() {
	      this.ui.upload = new Upload({
	        target: this.options.uploadEl,
	        props: {
	          id: this.options.id,
	          popup: this.options.upload && this.options.upload.popup,
	          show: this.options.upload && this.options.upload.show
	        }
	      });
	      this.ui.upload.$on('filesAdded', this.onUploads.bind(this));
	      this.ui.upload.$on('remove', this.removeUpload.bind(this));
	    }
	  }, {
	    key: "loadFilesData",
	    value: function loadFilesData() {
	      var _this2 = this;

	      var reqOpts = {
	        bucket: this.options.bucket,
	        session: this.options.session
	      };
	      var req = this.getInterface().setFilter(reqOpts).setSorter({
	        fileID: -1
	      }).$list({});
	      return req.then(function (data) {
	        _this2.storage.files.update(function (value) {
	          value.splice.apply(value, [0, value.length].concat(toConsumableArray(data)));
	          return value;
	        });

	        return data;
	      }).catch(function (err) {
	        console.error(err, 'Список загруженных файлов не доступен!');
	      });
	    }
	  }, {
	    key: "getInfo",
	    value: function getInfo(_id) {
	      var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'get';
	      var reqOpts = {
	        bucket: this.options.bucket,
	        session: this.options.session
	      };
	      var req = this.getInterface().setFilter(reqOpts)['$' + action]({
	        _id: _id
	      });
	      return req.catch(function (err) {
	        console.error(err, 'Информация о файле не доступна!');
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
	      var _removeFiles = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(ev) {
	        var uuids, reqOpts, toRemove, _iterator, _step, uuid, file, result;

	        return regenerator.wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                uuids = ev.detail.selected;
	                reqOpts = {
	                  bucket: this.options.bucket,
	                  session: this.options.session
	                };
	                toRemove = [];
	                _iterator = _createForOfIteratorHelper$2(uuids);
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
	                  fileID: file.fileID
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
	      return res.status && res.status === 'ok';
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
	      var _onUploads = asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee2(data) {
	        var files, _iterator2, _step2, file, preview, upload;

	        return regenerator.wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                files = data.detail;
	                _iterator2 = _createForOfIteratorHelper$2(files);
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
	            var cnvs = document.createElement('canvas');
	            cnvs.width = _this4.options.preview.width;
	            cnvs.height = _this4.options.preview.height;
	            var ctx = cnvs.getContext('2d'),
	                img = new Image();

	            img.onload = function () {
	              ctx.drawImage(img, 0, 0, _this4.options.preview.width, _this4.options.preview.height); // Or at whatever offset you like

	              res(cnvs.toDataURL('image/png'));
	            };

	            img.src = e.target.result;
	          };

	          reader.onerror = rej; // Read in the image file as a data URL.

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
	    value: function removeUpload() {//let ids = ev.detail.selected;
	    }
	  }, {
	    key: "uploadFile",
	    value: function uploadFile(upload) {
	      var _this5 = this;

	      var reqOpts = {
	        bucket: this.options.bucket,
	        session: this.options.session
	      };
	      return this.getInterface().setFilter(reqOpts).$create(reqOpts, false, true, upload.file).then(function (data) {
	        if (data.status === 'ok') {
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
