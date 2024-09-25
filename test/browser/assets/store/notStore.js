var notStore = (function (exports) {
	'use strict';

	/** @returns {void} */
	function noop() {}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	/**
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function run_all(fns) {
		fns.forEach(run);
	}

	/**
	 * @param {any} thing
	 * @returns {thing is Function}
	 */
	function is_function(thing) {
		return typeof thing === 'function';
	}

	/** @returns {boolean} */
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
	}

	let src_url_equal_anchor;

	/**
	 * @param {string} element_src
	 * @param {string} url
	 * @returns {boolean}
	 */
	function src_url_equal(element_src, url) {
		if (element_src === url) return true;
		if (!src_url_equal_anchor) {
			src_url_equal_anchor = document.createElement('a');
		}
		// This is actually faster than doing URL(..).href
		src_url_equal_anchor.href = url;
		return element_src === src_url_equal_anchor.href;
	}

	/** @returns {boolean} */
	function is_empty(obj) {
		return Object.keys(obj).length === 0;
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @returns {void}
	 */
	function append(target, node) {
		target.appendChild(node);
	}

	/**
	 * @param {Node} target
	 * @param {Node} node
	 * @param {Node} [anchor]
	 * @returns {void}
	 */
	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	/**
	 * @param {Node} node
	 * @returns {void}
	 */
	function detach(node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
	}

	/**
	 * @returns {void} */
	function destroy_each(iterations, detaching) {
		for (let i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detaching);
		}
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} name
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	function element(name) {
		return document.createElement(name);
	}

	/**
	 * @param {string} data
	 * @returns {Text}
	 */
	function text(data) {
		return document.createTextNode(data);
	}

	/**
	 * @returns {Text} */
	function space() {
		return text(' ');
	}

	/**
	 * @returns {Text} */
	function empty() {
		return text('');
	}

	/**
	 * @param {EventTarget} node
	 * @param {string} event
	 * @param {EventListenerOrEventListenerObject} handler
	 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
	 * @returns {() => void}
	 */
	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	/**
	 * @param {Element} node
	 * @param {string} attribute
	 * @param {string} [value]
	 * @returns {void}
	 */
	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
	}

	/**
	 * @param {Element} element
	 * @returns {ChildNode[]}
	 */
	function children(element) {
		return Array.from(element.childNodes);
	}

	/**
	 * @param {Text} text
	 * @param {unknown} data
	 * @returns {void}
	 */
	function set_data(text, data) {
		data = '' + data;
		if (text.data === data) return;
		text.data = /** @type {string} */ (data);
	}

	/**
	 * @template T
	 * @param {string} type
	 * @param {T} [detail]
	 * @param {{ bubbles?: boolean, cancelable?: boolean }} [options]
	 * @returns {CustomEvent<T>}
	 */
	function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
		return new CustomEvent(type, { detail, bubbles, cancelable });
	}

	/**
	 * @typedef {Node & {
	 * 	claim_order?: number;
	 * 	hydrate_init?: true;
	 * 	actual_end_child?: NodeEx;
	 * 	childNodes: NodeListOf<NodeEx>;
	 * }} NodeEx
	 */

	/** @typedef {ChildNode & NodeEx} ChildNodeEx */

	/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

	/**
	 * @typedef {ChildNodeEx[] & {
	 * 	claim_info?: {
	 * 		last_index: number;
	 * 		total_claimed: number;
	 * 	};
	 * }} ChildNodeArray
	 */

	let current_component;

	/** @returns {void} */
	function set_current_component(component) {
		current_component = component;
	}

	function get_current_component() {
		if (!current_component) throw new Error('Function called outside component initialization');
		return current_component;
	}

	/**
	 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
	 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
	 * it can be called from an external module).
	 *
	 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
	 *
	 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
	 *
	 * https://svelte.dev/docs/svelte#onmount
	 * @template T
	 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
	 * @returns {void}
	 */
	function onMount(fn) {
		get_current_component().$$.on_mount.push(fn);
	}

	/**
	 * Creates an event dispatcher that can be used to dispatch [component events](https://svelte.dev/docs#template-syntax-component-directives-on-eventname).
	 * Event dispatchers are functions that can take two arguments: `name` and `detail`.
	 *
	 * Component events created with `createEventDispatcher` create a
	 * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
	 * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
	 * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
	 * property and can contain any type of data.
	 *
	 * The event dispatcher can be typed to narrow the allowed event names and the type of the `detail` argument:
	 * ```ts
	 * const dispatch = createEventDispatcher<{
	 *  loaded: never; // does not take a detail argument
	 *  change: string; // takes a detail argument of type string, which is required
	 *  optional: number | null; // takes an optional detail argument of type number
	 * }>();
	 * ```
	 *
	 * https://svelte.dev/docs/svelte#createeventdispatcher
	 * @template {Record<string, any>} [EventMap=any]
	 * @returns {import('./public.js').EventDispatcher<EventMap>}
	 */
	function createEventDispatcher() {
		const component = get_current_component();
		return (type, detail, { cancelable = false } = {}) => {
			const callbacks = component.$$.callbacks[type];
			if (callbacks) {
				// TODO are there situations where events could be dispatched
				// in a server (non-DOM) environment?
				const event = custom_event(/** @type {string} */ (type), detail, { cancelable });
				callbacks.slice().forEach((fn) => {
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
	/**
	 * @param component
	 * @param event
	 * @returns {void}
	 */
	function bubble(component, event) {
		const callbacks = component.$$.callbacks[event.type];
		if (callbacks) {
			// @ts-ignore
			callbacks.slice().forEach((fn) => fn.call(this, event));
		}
	}

	const dirty_components = [];
	const binding_callbacks = [];

	let render_callbacks = [];

	const flush_callbacks = [];

	const resolved_promise = /* @__PURE__ */ Promise.resolve();

	let update_scheduled = false;

	/** @returns {void} */
	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	/** @returns {void} */
	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	/** @returns {void} */
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

	/** @returns {void} */
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
			} catch (e) {
				// reset dirty state to not end up in a deadlocked state and then rethrow
				dirty_components.length = 0;
				flushidx = 0;
				throw e;
			}
			set_current_component(null);
			dirty_components.length = 0;
			flushidx = 0;
			while (binding_callbacks.length) binding_callbacks.pop()();
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

	/** @returns {void} */
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
	 * @param {Function[]} fns
	 * @returns {void}
	 */
	function flush_render_callbacks(fns) {
		const filtered = [];
		const targets = [];
		render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
		targets.forEach((c) => c());
		render_callbacks = filtered;
	}

	const outroing = new Set();

	/**
	 * @type {Outro}
	 */
	let outros;

	/**
	 * @returns {void} */
	function group_outros() {
		outros = {
			r: 0,
			c: [],
			p: outros // parent group
		};
	}

	/**
	 * @returns {void} */
	function check_outros() {
		if (!outros.r) {
			run_all(outros.c);
		}
		outros = outros.p;
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} [local]
	 * @returns {void}
	 */
	function transition_in(block, local) {
		if (block && block.i) {
			outroing.delete(block);
			block.i(local);
		}
	}

	/**
	 * @param {import('./private.js').Fragment} block
	 * @param {0 | 1} local
	 * @param {0 | 1} [detach]
	 * @param {() => void} [callback]
	 * @returns {void}
	 */
	function transition_out(block, local, detach, callback) {
		if (block && block.o) {
			if (outroing.has(block)) return;
			outroing.add(block);
			outros.c.push(() => {
				outroing.delete(block);
				if (callback) {
					if (detach) block.d(1);
					callback();
				}
			});
			block.o(local);
		} else if (callback) {
			callback();
		}
	}

	/** @typedef {1} INTRO */
	/** @typedef {0} OUTRO */
	/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
	/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

	/**
	 * @typedef {Object} Outro
	 * @property {number} r
	 * @property {Function[]} c
	 * @property {Object} p
	 */

	/**
	 * @typedef {Object} PendingProgram
	 * @property {number} start
	 * @property {INTRO|OUTRO} b
	 * @property {Outro} [group]
	 */

	/**
	 * @typedef {Object} Program
	 * @property {number} a
	 * @property {INTRO|OUTRO} b
	 * @property {1|-1} d
	 * @property {number} duration
	 * @property {number} start
	 * @property {number} end
	 * @property {Outro} [group]
	 */

	// general each functions:

	function ensure_array_like(array_like_or_iterator) {
		return array_like_or_iterator?.length !== undefined
			? array_like_or_iterator
			: Array.from(array_like_or_iterator);
	}

	/** @returns {void} */
	function outro_and_destroy_block(block, lookup) {
		transition_out(block, 1, 1, () => {
			lookup.delete(block.key);
		});
	}

	/** @returns {any[]} */
	function update_keyed_each(
		old_blocks,
		dirty,
		get_key,
		dynamic,
		ctx,
		list,
		lookup,
		node,
		destroy,
		create_each_block,
		next,
		get_context
	) {
		let o = old_blocks.length;
		let n = list.length;
		let i = o;
		const old_indexes = {};
		while (i--) old_indexes[old_blocks[i].key] = i;
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
			} else if (dynamic) {
				// defer updates until all the DOM shuffling is done
				updates.push(() => block.p(child_ctx, dirty));
			}
			new_lookup.set(key, (new_blocks[i] = block));
			if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
		}
		const will_move = new Set();
		const did_move = new Set();
		/** @returns {void} */
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
			} else if (!new_lookup.has(old_key)) {
				// remove old block
				destroy(old_block, lookup);
				o--;
			} else if (!lookup.has(new_key) || will_move.has(new_key)) {
				insert(new_block);
			} else if (did_move.has(old_key)) {
				o--;
			} else if (deltas.get(new_key) > deltas.get(old_key)) {
				did_move.add(new_key);
				insert(new_block);
			} else {
				will_move.add(old_key);
				o--;
			}
		}
		while (o--) {
			const old_block = old_blocks[o];
			if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
		}
		while (n) insert(new_blocks[n - 1]);
		run_all(updates);
		return new_blocks;
	}

	/** @returns {void} */
	function bind(component, name, callback) {
		const index = component.$$.props[name];
		if (index !== undefined) {
			component.$$.bound[index] = callback;
			callback(component.$$.ctx[index]);
		}
	}

	/** @returns {void} */
	function create_component(block) {
		block && block.c();
	}

	/** @returns {void} */
	function mount_component(component, target, anchor) {
		const { fragment, after_update } = component.$$;
		fragment && fragment.m(target, anchor);
		// onMount happens before the initial afterUpdate
		add_render_callback(() => {
			const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
			// if the component was destroyed immediately
			// it will update the `$$.on_destroy` reference to `null`.
			// the destructured on_destroy may still reference to the old array
			if (component.$$.on_destroy) {
				component.$$.on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});
		after_update.forEach(add_render_callback);
	}

	/** @returns {void} */
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

	/** @returns {void} */
	function make_dirty(component, i) {
		if (component.$$.dirty[0] === -1) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty.fill(0);
		}
		component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
	}

	// TODO: Document the other params
	/**
	 * @param {SvelteComponent} component
	 * @param {import('./public.js').ComponentConstructorOptions} options
	 *
	 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
	 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
	 * This will be the `add_css` function from the compiled component.
	 *
	 * @returns {void}
	 */
	function init(
		component,
		options,
		instance,
		create_fragment,
		not_equal,
		props,
		append_styles = null,
		dirty = [-1]
	) {
		const parent_component = current_component;
		set_current_component(component);
		/** @type {import('./private.js').T$$} */
		const $$ = (component.$$ = {
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
		});
		append_styles && append_styles($$.root);
		let ready = false;
		$$.ctx = instance
			? instance(component, options.props || {}, (i, ret, ...rest) => {
					const value = rest.length ? rest[0] : ret;
					if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
						if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
						if (ready) make_dirty(component, i);
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
				// TODO: what is the correct type here?
				// @ts-expect-error
				const nodes = children(options.target);
				$$.fragment && $$.fragment.l(nodes);
				nodes.forEach(detach);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				$$.fragment && $$.fragment.c();
			}
			if (options.intro) transition_in(component.$$.fragment);
			mount_component(component, options.target, options.anchor);
			flush();
		}
		set_current_component(parent_component);
	}

	/**
	 * Base class for Svelte components. Used when dev=false.
	 *
	 * @template {Record<string, any>} [Props=any]
	 * @template {Record<string, any>} [Events=any]
	 */
	class SvelteComponent {
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$ = undefined;
		/**
		 * ### PRIVATE API
		 *
		 * Do not use, may change at any time
		 *
		 * @type {any}
		 */
		$$set = undefined;

		/** @returns {void} */
		$destroy() {
			destroy_component(this, 1);
			this.$destroy = noop;
		}

		/**
		 * @template {Extract<keyof Events, string>} K
		 * @param {K} type
		 * @param {((e: Events[K]) => void) | null | undefined} callback
		 * @returns {() => void}
		 */
		$on(type, callback) {
			if (!is_function(callback)) {
				return noop;
			}
			const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
			callbacks.push(callback);
			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		/**
		 * @param {Partial<Props>} props
		 * @returns {void}
		 */
		$set(props) {
			if (this.$$set && !is_empty(props)) {
				this.$$.skip_bound = true;
				this.$$set(props);
				this.$$.skip_bound = false;
			}
		}
	}

	/**
	 * @typedef {Object} CustomElementPropDefinition
	 * @property {string} [attribute]
	 * @property {boolean} [reflect]
	 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
	 */

	// generated during release, do not modify
	const PUBLIC_VERSION = '4';

	if (typeof window !== 'undefined')
		// @ts-ignore
		(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

	/* src/standalone/confirm.svelte generated by Svelte v4.2.19 */

	function create_fragment$5(ctx) {
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
				if (detaching) {
					detach(div2);
				}

				mounted = false;
				run_all(dispose);
			}
		};
	}

	function instance$5($$self, $$props, $$invalidate) {
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

			init(this, options, instance$5, create_fragment$5, safe_not_equal, {
				title: 0,
				text: 1,
				approval: 2,
				resolve: 8,
				reject: 9,
				label: 3
			});
		}
	}

	class Confirmation {
	  static ask({
	    approval,
	    text,
	    title
	  }) {
	    return new Promise(function (res, rej) {
	      let comp = new Confirm({
	        props: {
	          approval,
	          reject() {
	            comp.$destroy();
	            rej();
	          },
	          resolve() {
	            comp.$destroy();
	            res();
	          },
	          text,
	          title
	        },
	        target: document.body
	      });
	    });
	  }
	}

	const subscriber_queue = [];

	/**
	 * Create a `Writable` store that allows both updating and reading by subscription.
	 *
	 * https://svelte.dev/docs/svelte-store#writable
	 * @template T
	 * @param {T} [value] initial value
	 * @param {import('./public.js').StartStopNotifier<T>} [start]
	 * @returns {import('./public.js').Writable<T>}
	 */
	function writable(value, start = noop) {
		/** @type {import('./public.js').Unsubscriber} */
		let stop;
		/** @type {Set<import('./private.js').SubscribeInvalidateTuple<T>>} */
		const subscribers = new Set();
		/** @param {T} new_value
		 * @returns {void}
		 */
		function set(new_value) {
			if (safe_not_equal(value, new_value)) {
				value = new_value;
				if (stop) {
					// store is ready
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

		/**
		 * @param {import('./public.js').Updater<T>} fn
		 * @returns {void}
		 */
		function update(fn) {
			set(fn(value));
		}

		/**
		 * @param {import('./public.js').Subscriber<T>} run
		 * @param {import('./private.js').Invalidator<T>} [invalidate]
		 * @returns {import('./public.js').Unsubscriber}
		 */
		function subscribe(run, invalidate = noop) {
			/** @type {import('./private.js').SubscribeInvalidateTuple<T>} */
			const subscriber = [run, invalidate];
			subscribers.add(subscriber);
			if (subscribers.size === 1) {
				stop = start(set, update) || noop;
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

	const ALL = {};
	function exist(key) {
	  return Object.hasOwn(ALL, key);
	}
	function get(key, createIfNotExists = false) {
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

	/* src/standalone/file.svelte generated by Svelte v4.2.19 */

	function create_if_block_2$2(ctx) {
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
				if (detaching) {
					detach(progress_1);
				}
			}
		};
	}

	// (74:4) {#if data.path}
	function create_if_block$4(ctx) {
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
		let if_block = !/*hideDeleteButton*/ ctx[2] && create_if_block_1$4(ctx);

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
				if (!src_url_equal(img.src, img_src_value = /*data*/ ctx[3].info?.variantURL?.micro || /*data*/ ctx[3].cloud.Location)) attr(img, "src", img_src_value);
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
						if_block = create_if_block_1$4(ctx);
						if_block.c();
						if_block.m(figure, t0);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if (dirty & /*data*/ 8 && !src_url_equal(img.src, img_src_value = /*data*/ ctx[3].info?.variantURL?.micro || /*data*/ ctx[3].cloud.Location)) {
					attr(img, "src", img_src_value);
				}

				if (dirty & /*data*/ 8 && img_alt_value !== (img_alt_value = /*data*/ ctx[3].name)) {
					attr(img, "alt", img_alt_value);
				}

				if (dirty & /*data*/ 8 && t2_value !== (t2_value = /*data*/ ctx[3].name + "")) set_data(t2, t2_value);
			},
			d(detaching) {
				if (detaching) {
					detach(figure);
				}

				if (if_block) if_block.d();
			}
		};
	}

	// (76:12) {#if !hideDeleteButton}
	function create_if_block_1$4(ctx) {
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
			p: noop,
			d(detaching) {
				if (detaching) {
					detach(button);
				}

				mounted = false;
				dispose();
			}
		};
	}

	function create_fragment$4(ctx) {
		let div;
		let t;
		let div_class_value;
		let div_data_uuid_value;
		let mounted;
		let dispose;
		let if_block0 = /*notUploaded*/ ctx[1] && create_if_block_2$2(ctx);
		let if_block1 = /*data*/ ctx[3].path && create_if_block$4(ctx);

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
						if_block0 = create_if_block_2$2(ctx);
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
						if_block1 = create_if_block$4(ctx);
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
			i: noop,
			o: noop,
			d(detaching) {
				if (detaching) {
					detach(div);
				}

				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				mounted = false;
				dispose();
			}
		};
	}

	function instance$4($$self, $$props, $$invalidate) {
		let ifSelected;
		const dispatch = createEventDispatcher();
		let { progress = 0 } = $$props;
		let { selected = false } = $$props;
		let { notUploaded = false } = $$props;
		let { selectMany = false } = $$props;
		let { hideDeleteButton = false } = $$props;
		let { storeId } = $$props;

		let { data = {
			name: "default.file.name",
			size: 1000,
			preview: false
		} } = $$props;

		onMount(() => {
			get(storeId).selected.subscribe(value => {
				if (value.indexOf(data.uuid) > -1) {
					$$invalidate(7, selected = true);
				} else {
					$$invalidate(7, selected = false);
				}
			});
		});

		function onClick() {
			get(storeId).selected.update(value => {
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

		$$self.$$set = $$props => {
			if ('progress' in $$props) $$invalidate(0, progress = $$props.progress);
			if ('selected' in $$props) $$invalidate(7, selected = $$props.selected);
			if ('notUploaded' in $$props) $$invalidate(1, notUploaded = $$props.notUploaded);
			if ('selectMany' in $$props) $$invalidate(8, selectMany = $$props.selectMany);
			if ('hideDeleteButton' in $$props) $$invalidate(2, hideDeleteButton = $$props.hideDeleteButton);
			if ('storeId' in $$props) $$invalidate(9, storeId = $$props.storeId);
			if ('data' in $$props) $$invalidate(3, data = $$props.data);
		};

		$$self.$$.update = () => {
			if ($$self.$$.dirty & /*selected*/ 128) {
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
			selected,
			selectMany,
			storeId
		];
	}

	class File extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$4, create_fragment$4, safe_not_equal, {
				progress: 0,
				selected: 7,
				notUploaded: 1,
				selectMany: 8,
				hideDeleteButton: 2,
				storeId: 9,
				data: 3
			});
		}
	}

	/* src/standalone/storage.svelte generated by Svelte v4.2.19 */

	function get_each_context$1(ctx, list, i) {
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

	// (121:0) {#if !popup && show}
	function create_if_block_1$3(ctx) {
		let div1;
		let div0;
		let current;
		let each_value_1 = ensure_array_like(/*files*/ ctx[0]);
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

				attr(div0, "class", "file-list columns is-mobile is-multiline svelte-fdc82o");
				attr(div1, "class", "file-list-wrapper svelte-fdc82o");
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
					each_value_1 = ensure_array_like(/*files*/ ctx[0]);
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
				if (detaching) {
					detach(div1);
				}

				destroy_each(each_blocks, detaching);
				/*div1_binding*/ ctx[19](null);
			}
		};
	}

	// (124:12) {#each files as file, index}
	function create_each_block_1(ctx) {
		let notfileitem;
		let updating_data;
		let current;

		function notfileitem_data_binding(value) {
			/*notfileitem_data_binding*/ ctx[17](value, /*file*/ ctx[24], /*each_value_1*/ ctx[27], /*index*/ ctx[28]);
		}

		let notfileitem_props = {
			elementSize: /*elementSize*/ ctx[5],
			storeId: /*id*/ ctx[2],
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
				if (dirty & /*id*/ 4) notfileitem_changes.storeId = /*id*/ ctx[2];
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

	// (138:0) {#if popup && show}
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
		let each_value = ensure_array_like(/*files*/ ctx[0]);
		const get_key = ctx => /*file*/ ctx[24].id;

		for (let i = 0; i < each_value.length; i += 1) {
			let child_ctx = get_each_context$1(ctx, each_value, i);
			let key = get_key(child_ctx);
			each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
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
				attr(div1, "class", "file-list columns is-multiline svelte-fdc82o");
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
					each_value = ensure_array_like(/*files*/ ctx[0]);
					group_outros();
					each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div1, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
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
				if (detaching) {
					detach(div3);
				}

				for (let i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].d();
				}

				/*div3_binding*/ ctx[22](null);
				mounted = false;
				run_all(dispose);
			}
		};
	}

	// (149:20) {#each files as file (file.id)}
	function create_each_block$1(key_1, ctx) {
		let first;
		let notfileitem;
		let updating_data;
		let current;

		function notfileitem_data_binding_1(value) {
			/*notfileitem_data_binding_1*/ ctx[20](value, /*file*/ ctx[24], /*each_value*/ ctx[25], /*file_index*/ ctx[26]);
		}

		let notfileitem_props = {
			storeId: /*id*/ ctx[2],
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
				if (dirty & /*id*/ 4) notfileitem_changes.storeId = /*id*/ ctx[2];
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
				if (detaching) {
					detach(first);
				}

				destroy_component(notfileitem, detaching);
			}
		};
	}

	function create_fragment$3(ctx) {
		let t;
		let if_block1_anchor;
		let current;
		let if_block0 = !/*popup*/ ctx[4] && /*show*/ ctx[1] && create_if_block_1$3(ctx);
		let if_block1 = /*popup*/ ctx[4] && /*show*/ ctx[1] && create_if_block$3(ctx);

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
						if_block0 = create_if_block_1$3(ctx);
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
				if (detaching) {
					detach(t);
					detach(if_block1_anchor);
				}

				if (if_block0) if_block0.d(detaching);
				if (if_block1) if_block1.d(detaching);
			}
		};
	}

	function instance$3($$self, $$props, $$invalidate) {
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
		let { onReject = null } = $$props;
		let { onResolve = null } = $$props;

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
					$$invalidate(15, onResolve = null);
				} else {
					dispatch("resolve", { selected: images });
				}
			} else {
				if (onResolve) {
					onResolve([]);
					$$invalidate(15, onResolve = null);
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

			init(this, options, instance$3, create_fragment$3, safe_not_equal, {
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

	/* src/standalone/file.upload.svelte generated by Svelte v4.2.19 */

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
				if (detaching) {
					detach(progress);
				}
			}
		};
	}

	// (14:4) {#if typeof data.preview === "string"}
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
				attr(img, "class", "svelte-dd1rpy");
				attr(figure, "class", "image is-4by3 svelte-dd1rpy");
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
				if (detaching) {
					detach(figure);
				}
			}
		};
	}

	function create_fragment$2(ctx) {
		let div;
		let t;
		let div_data_id_value;
		let if_block0 = !/*uploaded*/ ctx[0] && create_if_block_1$2();
		let if_block1 = typeof /*data*/ ctx[1].preview === "string" && create_if_block$2(ctx);

		return {
			c() {
				div = element("div");
				if (if_block0) if_block0.c();
				t = space();
				if (if_block1) if_block1.c();
				attr(div, "class", "tile file is-3 is-child svelte-dd1rpy");
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

				if (typeof /*data*/ ctx[1].preview === "string") {
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
				if (detaching) {
					detach(div);
				}

				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { uploaded = false } = $$props;

		let { data = {
			name: "default.file.name",
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
			init(this, options, instance$2, create_fragment$2, safe_not_equal, { uploaded: 0, data: 1 });
		}
	}

	/* src/standalone/upload.svelte generated by Svelte v4.2.19 */

	function get_each_context(ctx, list, i) {
		const child_ctx = ctx.slice();
		child_ctx[14] = list[i];
		return child_ctx;
	}

	// (68:0) {#if show}
	function create_if_block$1(ctx) {
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
		const if_block_creators = [create_if_block_1$1, create_else_block];
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
				attr(input, "name", /*fieldname*/ ctx[3]);
				attr(input, "accept", /*accept*/ ctx[4]);
				input.multiple = /*multiple*/ ctx[5];
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
				/*div_binding*/ ctx[10](div);
				insert(target, t1, anchor);
				if_blocks[current_block_type_index].m(target, anchor);
				insert(target, if_block_anchor, anchor);
				current = true;

				if (!mounted) {
					dispose = listen(input, "change", /*onChange*/ ctx[7]);
					mounted = true;
				}
			},
			p(ctx, dirty) {
				if (!current || dirty & /*fieldname*/ 8) {
					attr(input, "name", /*fieldname*/ ctx[3]);
				}

				if (!current || dirty & /*accept*/ 16) {
					attr(input, "accept", /*accept*/ ctx[4]);
				}

				if (!current || dirty & /*multiple*/ 32) {
					input.multiple = /*multiple*/ ctx[5];
				}

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
				if (detaching) {
					detach(div);
					detach(t1);
					detach(if_block_anchor);
				}

				/*div_binding*/ ctx[10](null);
				if_blocks[current_block_type_index].d(detaching);
				mounted = false;
				dispose();
			}
		};
	}

	// (91:4) {:else}
	function create_else_block(ctx) {
		let div;
		let div_class_value;
		let current;
		let if_block = /*uploads*/ ctx[0].length > 0 && create_if_block_2$1(ctx);

		return {
			c() {
				div = element("div");
				if (if_block) if_block.c();
				attr(div, "class", div_class_value = "previews " + (/*short*/ ctx[2] ? 'short' : 'long') + " svelte-112twgk");
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

				if (!current || dirty & /*short*/ 4 && div_class_value !== (div_class_value = "previews " + (/*short*/ ctx[2] ? 'short' : 'long') + " svelte-112twgk")) {
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
				if (detaching) {
					detach(div);
				}

				if (if_block) if_block.d();
			}
		};
	}

	// (87:4) {#if uploads.length === 0}
	function create_if_block_1$1(ctx) {
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
				if (detaching) {
					detach(div);
				}
			}
		};
	}

	// (93:12) {#if uploads.length > 0}
	function create_if_block_2$1(ctx) {
		let each_1_anchor;
		let current;
		let each_value = ensure_array_like(/*uploads*/ ctx[0]);
		let each_blocks = [];

		for (let i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
				if (dirty & /*uploads*/ 1) {
					each_value = ensure_array_like(/*uploads*/ ctx[0]);
					let i;

					for (i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(child_ctx, dirty);
							transition_in(each_blocks[i], 1);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
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
				if (detaching) {
					detach(each_1_anchor);
				}

				destroy_each(each_blocks, detaching);
			}
		};
	}

	// (94:16) {#each uploads as upload}
	function create_each_block(ctx) {
		let notfileupload;
		let current;
		notfileupload = new File_upload({ props: { data: /*upload*/ ctx[14] } });

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
				if (dirty & /*uploads*/ 1) notfileupload_changes.data = /*upload*/ ctx[14];
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

	function create_fragment$1(ctx) {
		let if_block_anchor;
		let current;
		let if_block = /*show*/ ctx[1] && create_if_block$1(ctx);

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
						if_block = create_if_block$1(ctx);
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
				if (detaching) {
					detach(if_block_anchor);
				}

				if (if_block) if_block.d(detaching);
			}
		};
	}

	function instance$1($$self, $$props, $$invalidate) {
		const dispatch = createEventDispatcher();
		let dropzone;
		let { id } = $$props;
		let { uploads = [] } = $$props;
		let { show = false } = $$props;
		let { short = false } = $$props;
		let { fieldname = "file" } = $$props;
		let { accept = "image/*" } = $$props;
		let { multiple = true } = $$props;

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
				$$invalidate(6, dropzone);
			});
		}

		$$self.$$set = $$props => {
			if ('id' in $$props) $$invalidate(8, id = $$props.id);
			if ('uploads' in $$props) $$invalidate(0, uploads = $$props.uploads);
			if ('show' in $$props) $$invalidate(1, show = $$props.show);
			if ('short' in $$props) $$invalidate(2, short = $$props.short);
			if ('fieldname' in $$props) $$invalidate(3, fieldname = $$props.fieldname);
			if ('accept' in $$props) $$invalidate(4, accept = $$props.accept);
			if ('multiple' in $$props) $$invalidate(5, multiple = $$props.multiple);
		};

		return [
			uploads,
			show,
			short,
			fieldname,
			accept,
			multiple,
			dropzone,
			onChange,
			id,
			resolvePopup,
			div_binding
		];
	}

	class Upload extends SvelteComponent {
		constructor(options) {
			super();

			init(this, options, instance$1, create_fragment$1, safe_not_equal, {
				id: 8,
				uploads: 0,
				show: 1,
				short: 2,
				fieldname: 3,
				accept: 4,
				multiple: 5,
				resolvePopup: 9
			});
		}

		get resolvePopup() {
			return this.$$.ctx[9];
		}
	}

	/* src/standalone/complex.svelte generated by Svelte v4.2.19 */

	function create_if_block_1(ctx) {
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
		let if_block1 = !/*short*/ ctx[3] && create_if_block_2(ctx);

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
						if_block1 = create_if_block_2(ctx);
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
				if (detaching) {
					detach(div3);
				}

				if (if_block0) if_block0.d();
				destroy_component(uploadercomponent);
				destroy_component(storagecomponent);
				if (if_block1) if_block1.d();
				mounted = false;
				dispose();
			}
		};
	}

	// (110:12) {#if !short}
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
				if (detaching) {
					detach(header);
				}

				mounted = false;
				dispose();
			}
		};
	}

	// (139:12) {#if !short}
	function create_if_block_2(ctx) {
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
				if (detaching) {
					detach(footer);
				}

				mounted = false;
				run_all(dispose);
			}
		};
	}

	// (156:0) {#if !popup && show}
	function create_if_block(ctx) {
		let uploadercomponent;
		let t;
		let storagecomponent;
		let current;
		uploadercomponent = new Upload({ props: { show: true, id: /*id*/ ctx[0] } });
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
				if (detaching) {
					detach(t);
				}

				destroy_component(uploadercomponent, detaching);
				destroy_component(storagecomponent, detaching);
			}
		};
	}

	function create_fragment(ctx) {
		let t;
		let if_block1_anchor;
		let current;
		let if_block0 = /*popup*/ ctx[4] && /*show*/ ctx[2] && create_if_block_1(ctx);
		let if_block1 = !/*popup*/ ctx[4] && /*show*/ ctx[2] && create_if_block(ctx);

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
						if_block0 = create_if_block_1(ctx);
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
						if_block1 = create_if_block(ctx);
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
				if (detaching) {
					detach(t);
					detach(if_block1_anchor);
				}

				if (if_block0) if_block0.d(detaching);
				if (if_block1) if_block1.d(detaching);
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
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
					dispatch("resolve", { selected: images });
				}
			} else {
				if (onResolve) {
					onResolve([]);
					$$invalidate(16, onResolve = null);
				} else {
					dispatch("resolve", { selected: [] });
				}
			}
		}

		function rejectPopup() {
			closePopup();

			if (onReject) {
				onReject();
				$$invalidate(15, onReject = null);
			} else {
				dispatch("reject");
			}
		}

		function onSelected() {
			if (selectOnClick) {
				resolvePopup();
			}
		}

		function onChange(ev) {
			dispatch("filesAdded", ev.detail);
		}

		function removeSelected() {
			Confirmation.ask({
				title: `Удаление файлов (${selected.length}) `,
				text: "Файлы будут удалены без возможнеости восстановления!",
				approval: "Удалить файлы?"
			}).then(() => {
				dispatch("remove", { selected });
			}).catch(() => {
				
			}); //console.error('remove disapproved');
		}

		function removeFile(ev) {
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

			init(this, options, instance, create_fragment, safe_not_equal, {
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

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	const safeFields = ["_id", "fileID", "uuid", "parent", "variant", "name", "extension", "store", "info", "path", "cloud", "size", "createdAt", "updatedAt"];
	var file_manifest = {
	  actions: {
	    create: {
	      data: ["data"],
	      method: "PUT",
	      postFix: "/:store?",
	      rules: [{
	        root: true
	      }, {
	        auth: true
	      }, {
	        auth: false
	      }]
	    },
	    delete: {
	      method: "DELETE",
	      postFix: "/:record[_id]",
	      rules: [{
	        root: true
	      }, {
	        auth: true
	      }, {
	        auth: false
	      }]
	    },
	    listAndCountOriginal: {
	      data: ["pager", "sorter", "filter", "search"],
	      fields: safeFields,
	      method: "get",
	      postFix: "/:actionName",
	      return: safeFields,
	      rules: [{
	        root: true,
	        returnRoot: "list",
	        return: safeFields
	      }, {
	        auth: true,
	        returnRoot: "list",
	        return: safeFields
	      }, {
	        auth: false,
	        returnRoot: "list",
	        return: safeFields
	      }]
	    },
	    listAndCount: {
	      data: ["pager", "sorter", "filter", "search"],
	      fields: safeFields,
	      method: "get",
	      postFix: "/:actionName",
	      return: safeFields,
	      rules: [{
	        root: true,
	        returnRoot: "list",
	        return: safeFields
	      }, {
	        auth: true,
	        returnRoot: "list",
	        return: safeFields
	      }, {
	        auth: false,
	        returnRoot: "list",
	        return: safeFields
	      }]
	    },
	    get: {
	      data: ["filter", "data"],
	      method: "GET",
	      postFix: "/:record[_id]",
	      rules: [{
	        root: true,
	        fields: safeFields,
	        return: safeFields
	      }, {
	        auth: true,
	        fields: safeFields,
	        return: safeFields
	      }, {
	        auth: false,
	        fields: safeFields,
	        return: safeFields
	      }]
	    },
	    getRaw: {
	      data: ["filter", "data"],
	      method: "GET",
	      postFix: "/:record[_id]/:actionName",
	      rules: [{
	        root: true,
	        fields: safeFields,
	        return: safeFields
	      }, {
	        auth: true,
	        fields: safeFields,
	        return: safeFields
	      }, {
	        auth: false,
	        fields: safeFields,
	        return: safeFields
	      }]
	    },
	    list: {
	      data: ["pager", "sorter", "filter", "search"],
	      method: "GET",
	      rules: [{
	        root: true,
	        return: safeFields
	      }, {
	        auth: true,
	        return: safeFields
	      }, {
	        auth: false,
	        return: safeFields
	      }]
	    }
	  },
	  fields: {},
	  model: "file",
	  url: "/api/:modelName"
	};
	var StandartInterface = /*@__PURE__*/getDefaultExportFromCjs(file_manifest);

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
	class notPath$2 {
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
	     * @param {object} [helpers] helpers object
	     */

	    static get(path, item, helpers = undefined) {
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

	    static set(path, item, helpers, attrValue = undefined) {
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

	var src = notPath$2;

	var notPath = src;

	var notPath$1 = /*@__PURE__*/getDefaultExportFromCjs(notPath);

	const OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY = ["_id", "id", "ID"],
	  DEFAULT_FILTER = {},
	  DEFAULT_SEARCH = "",
	  DEFAULT_RETURN = {},
	  DEFAULT_PAGE_NUMBER = 1,
	  DEFAULT_PAGE_SIZE = 10,
	  DEFAULT_ACTION_PREFIX = "$";
	function capitalizeFirstLetter(string) {
	  return string.charAt(0).toUpperCase() + string.slice(1);
	}
	class netInterface {
	  constructor(manifest, options) {
	    this.options = options;
	    this.manifest = manifest;
	    this.working = {};
	    this.initActions();
	    return this;
	  }
	  initActions() {
	    if (this.getActionsCount() > 0) {
	      let actions = this.getActions();
	      for (let actionName in actions) {
	        this.initAction(actionName, actions[actionName]);
	      }
	    }
	  }
	  initAction(actionName) {
	    var _this = this;
	    if (!Object.hasOwn(this, [DEFAULT_ACTION_PREFIX + actionName])) {
	      this[DEFAULT_ACTION_PREFIX + actionName] = function (opts, headers, fileUpload = false, files) {
	        return _this.request(_this, actionName, opts, headers, fileUpload, files);
	      };
	    }
	  }
	  request(record, actionName, params, headers = {}, fileUpload = false, files) {
	    let compositeData = Object.assign({}, record, params);
	    let actionData = this.getActionData(actionName),
	      requestParams = this.collectRequestData(actionData),
	      requestParamsEncoded = this.encodeRequest(requestParams),
	      //id = this.getID(compositeData, actionData, actionName),
	      apiServerURL = this.getServerURL(),
	      url = this.getURL(compositeData, actionData, actionName),
	      opts = {};
	    if (fileUpload) {
	      url = this.getURL(params, actionData, actionName);
	      console.log("request url for file upload", url);
	      const fd = new FormData();
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
	  getModelName() {
	    return this && this.manifest ? this.manifest.model : null;
	  }
	  getActionData(actionName) {
	    return this.getActions() && this.getActions()[actionName] ? this.getActions()[actionName] : null;
	  }
	  getActionsCount() {
	    return this.getActions() ? Object.keys(this.getActions()).length : 0;
	  }
	  getActions() {
	    return this.manifest && this.manifest.actions ? this.manifest.actions : {};
	  }
	  parseParams(start, end, line, record) {
	    let fieldName = "";
	    let len = start.length;
	    while (line.indexOf(start) > -1) {
	      let ind = line.indexOf(start);
	      let startSlice = ind + len;
	      let endSlice = line.indexOf(end);
	      fieldName = line.slice(startSlice, endSlice);
	      if (fieldName == "") break;
	      console.log(start + fieldName + end, notPath$1.get(fieldName, record));
	      line = line.replace(start + fieldName + end, notPath$1.get(fieldName, record));
	    }
	    return line;
	  }
	  parseLine(line, record, actionName) {
	    line = line.replace(":modelName", this.manifest.model);
	    line = line.replace(":actionName", actionName);
	    line = this.parseParams(":record[", "]", line, record);
	    line = this.parseParams(":", "?", line, record);
	    return line;
	  }
	  getURL(record, actionData, actionName) {
	    var line = this.parseLine(this.manifest.url, record, actionName) + (Object.hasOwn(actionData, "postFix") ? this.parseLine(actionData.postFix, record, actionName) : "");
	    return line;
	  }
	  getServerURL() {
	    return this.options.server;
	  }
	  encodeRequest(data) {
	    let p = "?";
	    for (let t in data) {
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
	  collectRequestData(actionData) {
	    let requestData = {};
	    if (Object.hasOwn(actionData, "data") && Array.isArray(actionData.data)) {
	      for (let i = 0; i < actionData.data.length; i++) {
	        let dataProviderName = "get" + capitalizeFirstLetter(actionData.data[i]);
	        if (this[dataProviderName] && typeof this[dataProviderName] === "function") {
	          let data = this[dataProviderName](),
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
	  getID(record, actionData) {
	    let resultId,
	      list = OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY,
	      prefixes = ["", this.manifest.model];
	    if (Object.hasOwn(actionData, "index") && actionData.index) {
	      list = [actionData.index].concat(OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY);
	    }
	    for (let pre of prefixes) {
	      for (let t of list) {
	        if (Object.hasOwn(record, pre + t)) {
	          resultId = record[pre + t];
	          break;
	        }
	      }
	    }
	    return resultId;
	  }
	  setFindBy(key, value) {
	    var obj = {};
	    obj[key] = value;
	    return this.setFilter(obj);
	  }
	  setFilter(filterData = DEFAULT_FILTER) {
	    notPath$1.set("filter", this.working, filterData);
	    return this;
	  }
	  resetFilter() {
	    return this.setFilter();
	  }
	  getFilter() {
	    return notPath$1.get("filter", this.working);
	  }
	  setSearch(searchData = DEFAULT_SEARCH) {
	    notPath$1.set("search", this.working, searchData);
	    return this;
	  }
	  resetSearch() {
	    return this.setSearch();
	  }
	  getSearch() {
	    return notPath$1.get("search", this.working);
	  }
	  setSorter(sorterData) {
	    notPath$1.set("sorter", this.working, sorterData);
	    return this;
	  }
	  resetSorter() {
	    return this.setSorter({});
	  }
	  getSorter() {
	    return notPath$1.get("sorter", this.working);
	  }
	  setReturn(returnData = DEFAULT_RETURN) {
	    notPath$1.set("return", this.working, returnData);
	    return this;
	  }
	  resetReturn() {
	    return this.setReturn({});
	  }
	  getReturn() {
	    return notPath$1.get("return", this.working);
	  }
	  setPageNumber(pageNumber) {
	    notPath$1.set("pager.page", this.working, pageNumber);
	    return this;
	  }
	  setPageSize(pageSize) {
	    notPath$1.set("pager.size", this.working, pageSize);
	    return this;
	  }
	  setPager(pageSize = DEFAULT_PAGE_SIZE, pageNumber = DEFAULT_PAGE_NUMBER) {
	    if (pageSize.constructor === Number) {
	      notPath$1.set("pager", this.working, {
	        page: pageNumber,
	        size: pageSize
	      });
	    } else if (pageSize.constructor === Object) {
	      notPath$1.set("pager", this.working, {
	        page: pageSize.page || DEFAULT_PAGE_NUMBER,
	        size: pageSize.size || DEFAULT_PAGE_SIZE
	      });
	    }
	    return this;
	  }
	  resetPager() {
	    return this.setPager();
	  }
	  getPager() {
	    return notPath$1.get("pager", this.working);
	  }
	}

	const DEFAULT_OPTS = {
	  preview: {
	    height: 100,
	    width: 100
	  },
	  selectMany: false,
	  server: "",
	  store: "client"
	};
	class notStore {
	  constructor(options) {
	    this.options = Object.assign({}, DEFAULT_OPTS, options);
	    this.ui = {};
	    this.init();
	  }
	  init() {
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
	  generateID() {
	    if (!this.options.id) {
	      this.options.id = Math.random();
	    }
	  }
	  createStore() {
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
	  renderComplex() {
	    this.ui.complex = new Complex({
	      props: {
	        files: this.files,
	        id: this.options.id,
	        popup: this.options.complex && this.options.complex.popup,
	        selectMany: this.options.selectMany,
	        selectOnClick: this.options.selectOnClick,
	        short: this.options.complex && this.options.complex.short,
	        show: this.options.complex && this.options.complex.show
	      },
	      target: this.options.complexEl
	    });
	    this.ui.complex.$on("remove", this.removeFiles.bind(this));
	    this.ui.complex.$on("filesAdded", this.onUploads.bind(this));
	  }
	  renderStorage() {
	    this.ui.storage = new Storage({
	      props: {
	        files: this.files,
	        id: this.options.id,
	        popup: this.options.storage && this.options.storage.popup,
	        selectMany: this.options.selectMany,
	        selectOnClick: this.options.selectOnClick,
	        show: this.options.storage && this.options.storage.show
	      },
	      target: this.options.storageEl
	    });
	    this.ui.storage.$on("remove", this.removeFiles.bind(this));
	  }
	  renderUpload() {
	    this.ui.upload = new Upload({
	      props: {
	        id: this.options.id,
	        popup: this.options.upload && this.options.upload.popup,
	        short: this.options.upload && this.options.upload.short,
	        show: this.options.upload && this.options.upload.show
	      },
	      target: this.options.uploadEl
	    });
	    this.ui.upload.$on("filesAdded", this.onUploads.bind(this));
	    this.ui.upload.$on("remove", this.removeUpload.bind(this));
	  }
	  loadFilesData() {
	    var _this2 = this;
	    let reqOpts = {
	      session: this.options.session,
	      store: this.options.store
	    };
	    let req = this.getInterface().setFilter(reqOpts).setSorter({
	      fileID: -1
	    }).$list({});
	    return req.then(function ({
	      result,
	      status
	    }) {
	      if (status === "ok") {
	        _this2.storage.files.update(function (value) {
	          value.splice(0, value.length, ...result);
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
	  getInfo(_id, action = "get") {
	    let reqOpts = {
	      session: this.options.session,
	      store: this.options.store
	    };
	    let req = this.getInterface().setFilter(reqOpts)["$" + action]({
	      _id
	    });
	    return req.catch(function (err) {
	      console.error(err, "Информация о файле не доступна!");
	    });
	  }
	  useGlobalInterface() {
	    return this.options.useGlobalInterface && this.nrFile;
	  }
	  getInterface() {
	    return new netInterface(StandartInterface, this.options);
	  }
	  show() {
	    var _this3 = this;
	    return new Promise(function (resolve, reject) {
	      if (_this3.ui.storage) {
	        _this3.ui.storage.$set({
	          onReject: reject,
	          onResolve: resolve,
	          show: true
	        });
	      } else if (_this3.ui.complex) {
	        _this3.ui.complex.$set({
	          onReject: reject,
	          onResolve: resolve,
	          show: true
	        });
	      }
	    });
	  }
	  async removeFiles(ev) {
	    let uuids = ev.detail.selected;
	    let reqOpts = {
	      session: this.options.session,
	      store: this.options.store
	    };
	    let toRemove = [];
	    for (let uuid of uuids) {
	      let file = this.findFileByUUID(uuid);
	      if (file) {
	        try {
	          let result = await this.getInterface().setFilter(reqOpts).$delete({
	            _id: file._id
	          });
	          if (this.isGood(result)) {
	            toRemove.push(file);
	          }
	        } catch (e) {
	          console.error(e);
	        }
	      }
	    }
	    toRemove.forEach(this.removeFromStore.bind(this));
	    this.resetSelected();
	  }
	  findFileByUUID(uuid) {
	    let res = false;
	    this.files.forEach(function (file) {
	      if (file.uuid === uuid) {
	        res = file;
	      }
	    });
	    return res;
	  }
	  isGood(res) {
	    return res.status && res.status === "ok";
	  }
	  removeFromStore(file) {
	    this.storage.files.update(function (list) {
	      let indx = list.indexOf(file);
	      if (indx > -1) {
	        list.splice(indx, 1);
	      }
	      return list;
	    });
	  }
	  resetSelected() {
	    this.storage.selected.update(function (val) {
	      val.splice(0, val.length);
	      return val;
	    });
	  }
	  async onUploads(data) {
	    let files = data.detail;
	    for (let file of files) {
	      let preview = await this.preloadFilePreview(file);
	      file.id = `fid_` + Math.random();
	      let upload = {
	        file,
	        id: file.id,
	        name: file.name,
	        preview,
	        size: file.size,
	        type: file.type
	      };
	      this.addToUploads(upload);
	    }
	  }
	  preloadFilePreview(file) {
	    var _this4 = this;
	    return new Promise(function (res, rej) {
	      try {
	        let reader = new FileReader();
	        reader.onload = function (e) {
	          let cnvs = document.createElement("canvas");
	          cnvs.width = _this4.options.preview.width;
	          cnvs.height = _this4.options.preview.height;
	          let ctx = cnvs.getContext("2d"),
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
	  addToUploads(upload) {
	    this.uploadFile(upload).catch(console.error);
	    this.storage.uploads.update(function (val) {
	      val.push(upload);
	      return val;
	    });
	  }
	  removeUpload() {
	    //let ids = ev.detail.selected;
	  }
	  uploadFile(upload) {
	    var _this5 = this;
	    let reqOpts = {
	      session: this.options.session,
	      store: this.options.store
	    };
	    return this.getInterface().setFilter(reqOpts).$create(reqOpts, false, true, upload.file).then(function (data) {
	      if (data.status === "ok") {
	        _this5.uploadFinished(upload);
	      }
	    });
	  }
	  uploadFinished(upload) {
	    this.storage.uploads.update(function (val) {
	      let toRemove;
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
	}

	exports.ComplexComponent = Complex;
	exports.FileStores = file_stores;
	exports.StorageComponent = Storage;
	exports.UploadComponent = Upload;
	exports.notStore = notStore;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

})({});
