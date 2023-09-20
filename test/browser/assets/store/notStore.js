var notStore = (function (exports) {
	'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

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

	var toPrimitive = createCommonjsModule(function (module) {
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

	unwrapExports(toPrimitive);

	var toPropertyKey = createCommonjsModule(function (module) {
	var _typeof = _typeof_1["default"];

	function _toPropertyKey(arg) {
	  var key = toPrimitive(arg, "string");
	  return _typeof(key) === "symbol" ? key : String(key);
	}
	module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
	});

	unwrapExports(toPropertyKey);

	var createClass = createCommonjsModule(function (module) {
	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
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

	function noop() { }
	function run(fn) {
	    return fn();
	}
	function blank_object() {
	    return Object.create(null);
	}
	function run_all(fns) {
	    fns.forEach(run);
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
	        resolved_promise.then(flush);
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
	function flush() {
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

	function bind(component, name, callback) {
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
	            const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
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
	        update: noop,
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
	        flush();
	    }
	    set_current_component(parent_component);
	}
	/**
	 * Base class for Svelte components. Used when dev=false.
	 */
	class SvelteComponent {
	    $destroy() {
	        destroy_component(this, 1);
	        this.$destroy = noop;
	    }
	    $on(type, callback) {
	        if (!is_function(callback)) {
	            return noop;
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
	function writable(value, start = noop) {
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
	    function subscribe(run, invalidate = noop) {
	        const subscriber = [run, invalidate];
	        subscribers.add(subscriber);
	        if (subscribers.size === 1) {
	            stop = start(set) || noop;
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
	function get(key) {
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
		get: get
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

	// (73:1) {#if data.path}
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
				if (!src_url_equal(img.src, img_src_value = /*data*/ ctx[3].path.small.cloud.Location)) attr(img, "src", img_src_value);
				attr(img, "alt", img_alt_value = /*data*/ ctx[3].name);
				attr(img, "crossorigin", "anonymous");
				attr(img, "class", "svelte-evde9a");
				attr(div0, "class", "text svelte-evde9a");
				attr(div1, "draggable", "true");
				attr(div1, "class", "middle svelte-evde9a");
				attr(figure, "class", "image is-4by3 svelte-evde9a");
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

				if (dirty & /*data*/ 8 && !src_url_equal(img.src, img_src_value = /*data*/ ctx[3].path.small.cloud.Location)) {
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

	// (75:2) {#if !hideDeleteButton}
	function create_if_block_1(ctx) {
		let button;
		let mounted;
		let dispose;

		return {
			c() {
				button = element("button");
				attr(button, "class", "delete svelte-evde9a");
			},
			m(target, anchor) {
				insert(target, button, anchor);

				if (!mounted) {
					dispose = listen(button, "click", /*remove*/ ctx[6]);
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
				attr(div, "class", div_class_value = "column file-tile is-one-quarter-desktop is-half-mobile " + /*ifSelected*/ ctx[4] + " svelte-evde9a");
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

				if (dirty & /*ifSelected*/ 16 && div_class_value !== (div_class_value = "column file-tile is-one-quarter-desktop is-half-mobile " + /*ifSelected*/ ctx[4] + " svelte-evde9a")) {
					attr(div, "class", div_class_value);
				}

				if (dirty & /*data*/ 8 && div_data_uuid_value !== (div_data_uuid_value = /*data*/ ctx[3].uuid)) {
					attr(div, "data-uuid", div_data_uuid_value);
				}
			},
			i: noop,
			o: noop,
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
			name: 'default.file.name',
			size: 1000,
			preview: false
		} } = $$props;

		onMount(() => {
			get(bucketId).selected.subscribe(value => {
				if (value.indexOf(data.uuid) > -1) {
					$$invalidate(7, selected = true);
				} else {
					$$invalidate(7, selected = false);
				}
			});
		});

		function onClick() {
			get(bucketId).selected.update(value => {
				if (value.indexOf(data.uuid) > -1) {
					value.splice(value.indexOf(data.uuid), 1);
				} else {
					if (selectMany) {
						value.push(data.uuid);
					} else {
						value.splice(0, value.length, data.uuid);
					}

					dispatch('selected');
				}

				return value;
			});
		}

		function remove() {
			Confirmation.ask({
				title: `Удаление файла (${data.name}) `,
				text: 'Файл будет удалён без возможнеости восстановления!',
				approval: 'Удалить файл?'
			}).then(() => {
				dispatch('remove', data);
			}).catch(() => {
				
			});
		}

		$$self.$$set = $$props => {
			if ('progress' in $$props) $$invalidate(0, progress = $$props.progress);
			if ('selected' in $$props) $$invalidate(7, selected = $$props.selected);
			if ('notUploaded' in $$props) $$invalidate(1, notUploaded = $$props.notUploaded);
			if ('selectMany' in $$props) $$invalidate(8, selectMany = $$props.selectMany);
			if ('hideDeleteButton' in $$props) $$invalidate(2, hideDeleteButton = $$props.hideDeleteButton);
			if ('bucketId' in $$props) $$invalidate(9, bucketId = $$props.bucketId);
			if ('data' in $$props) $$invalidate(3, data = $$props.data);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*selected*/ 128) {
				 $$invalidate(4, ifSelected = selected ? 'selected' : '');
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
				selected: 7,
				notUploaded: 1,
				selectMany: 8,
				hideDeleteButton: 2,
				bucketId: 9,
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
		binding_callbacks.push(() => bind(notfileitem, 'data', notfileitem_data_binding));
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
		binding_callbacks.push(() => bind(notfileitem, 'data', notfileitem_data_binding_1));
		notfileitem.$on("remove", /*removeFile*/ ctx[12]);
		notfileitem.$on("selected", /*selected_handler_1*/ ctx[21]);

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
			get(id).files.subscribe(value => {
				files.forEach((file, id) => {
					file.id = id;
				});

				$$invalidate(0, files = value);
			});

			get(id).selected.subscribe(value => {
				$$invalidate(13, selected = value);
			});
		});

		function updateFiles(newFiles) {
			get(id).update(oldFiles => {
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
				if_block_anchor = empty();
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
			p: noop,
			i: noop,
			o: noop,
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

				each_1_anchor = empty();
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
				if_block_anchor = empty();
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
			get(id, true).uploads.subscribe(value => {
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
		binding_callbacks.push(() => bind(uploadercomponent, 'id', uploadercomponent_id_binding));
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
		binding_callbacks.push(() => bind(storagecomponent, 'id', storagecomponent_id_binding));
		binding_callbacks.push(() => bind(storagecomponent, 'selectMany', storagecomponent_selectMany_binding));
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
			p: noop,
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
			p: noop,
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
			get(id).files.subscribe(value => {
				$$invalidate(13, files = value);
			});

			get(id).selected.subscribe(value => {
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

	var file_manifest = {
	  model: "file",
	  url: "/api/:modelName",
	  fields: {},
	  actions: {
	    create: {
	      method: "PUT",
	      isArray: false,
	      data: ["record"],
	      postFix: "/:bucket?",
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
	    list: {
	      method: "GET",
	      isArray: true,
	      data: ["pager", "sorter", "filter", "search"],
	      fields: ["_id", "fileID", "name", "extension", "bucket", "metadata", "path", "paths", "userIp", "userId", "session", "width", "height", "size"],
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
	    listAndCount: {
	      method: "get",
	      data: ["pager", "sorter", "filter", "search"],
	      fields: ["_id", "fileID", "name", "extension", "bucket", "metadata", "path", "paths", "userIp", "userId", "session", "width", "height", "size"],
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
	      fields: ["_id", "fileID", "name", "extension", "bucket", "metadata", "path", "paths", "userIp", "userId", "session", "width", "height", "size"],
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
	      fields: ["_id", "fileID", "name", "extension", "bucket", "metadata", "path", "paths", "userIp", "userId", "session", "width", "height", "size"],
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
	     * @param {string} path path to property
	     * @param {object} item item object
	     * @param {object} helpers helpers object
	     * @param {any} attrValue value we want to assign
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
	      }
	      //for test purpose only, special test server needed
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

	function _createForOfIteratorHelper$1(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray$1(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
	function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }
	function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
	var DEFAULT_OPTS = {
	  bucket: 'client',
	  server: '',
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
	        return;
	      } else {
	        if (this.options.storageEl) {
	          this.renderStorage();
	          this.loadFilesData().catch(console.error);
	          return;
	        }
	        if (this.options.uploadEl) {
	          this.renderUpload();
	          return;
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
	          show: this.options.storage && this.options.storage.show,
	          selectOnClick: this.options.selectOnClick
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
	          show: this.options.upload && this.options.upload.show,
	          short: this.options.upload && this.options.upload.short
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
	      return req.then(function (_ref) {
	        var status = _ref.status,
	          result = _ref.result;
	        if (status === 'ok') {
	          _this2.storage.files.update(function (value) {
	            value.splice.apply(value, [0, value.length].concat(_toConsumableArray(result)));
	            return value;
	          });
	          return result;
	        } else {
	          return [];
	        }
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
	      var _removeFiles = _asyncToGenerator( /*#__PURE__*/regenerator.mark(function _callee(ev) {
	        var uuids, reqOpts, toRemove, _iterator, _step, uuid, file, result;
	        return regenerator.wrap(function _callee$(_context) {
	          while (1) switch (_context.prev = _context.next) {
	            case 0:
	              uuids = ev.detail.selected;
	              reqOpts = {
	                bucket: this.options.bucket,
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
