var notStore = (function (exports) {
    'use strict';

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
        if (text.data !== data)
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
            resolved_promise.then(flush);
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
    function flush() {
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
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
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
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
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
            flush();
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
        $set() {
            // overridden by instance, if it has props
        }
    }

    /* src/standalone/confirm.svelte generated by Svelte v3.23.1 */

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

    	$$self.$set = $$props => {
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

    /* global document */

    class Confirmation {
    	static ask({
    		title,
    		text,
    		approval
    	}) {
    		return new Promise((res, rej) => {
    			let comp = new Confirm({
    				target: document.body,
    				props: {
    					title,
    					text,
    					approval,
    					reject() {
    						comp.$destroy();
    						rej();
    					},
    					resolve() {
    						comp.$destroy();
    						res();
    					}
    				}
    			});
    		});
    	}
    }

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

    const ALL = {};

    function exist(key) {
    	return Object.prototype.hasOwnProperty.call(ALL, key);
    }

    function get(key) {
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
    			uploads: writable([]),
    		};
    	}
    	return ALL[key];
    }

    var file_stores = /*#__PURE__*/Object.freeze({
        __proto__: null,
        create: create,
        get: get
    });

    /* src/standalone/file.svelte generated by Svelte v3.23.1 */

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

    // (74:1) {#if data.path}
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
    			if (img.src !== (img_src_value = /*data*/ ctx[3].path.small.cloud.Location)) attr(img, "src", img_src_value);
    			attr(img, "alt", img_alt_value = /*data*/ ctx[3].name);
    			attr(img, "class", "svelte-1n0ppue");
    			attr(div0, "class", "text svelte-1n0ppue");
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

    			if (dirty & /*data*/ 8 && img.src !== (img_src_value = /*data*/ ctx[3].path.small.cloud.Location)) {
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

    // (76:2) {#if !hideDeleteButton}
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
    			attr(div, "class", div_class_value = "tile file is-3 is-child " + /*ifSelected*/ ctx[4] + " svelte-1n0ppue");
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

    			if (dirty & /*ifSelected*/ 16 && div_class_value !== (div_class_value = "tile file is-3 is-child " + /*ifSelected*/ ctx[4] + " svelte-1n0ppue")) {
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

    	$$self.$set = $$props => {
    		if ("progress" in $$props) $$invalidate(0, progress = $$props.progress);
    		if ("selected" in $$props) $$invalidate(7, selected = $$props.selected);
    		if ("notUploaded" in $$props) $$invalidate(1, notUploaded = $$props.notUploaded);
    		if ("selectMany" in $$props) $$invalidate(8, selectMany = $$props.selectMany);
    		if ("hideDeleteButton" in $$props) $$invalidate(2, hideDeleteButton = $$props.hideDeleteButton);
    		if ("bucketId" in $$props) $$invalidate(9, bucketId = $$props.bucketId);
    		if ("data" in $$props) $$invalidate(3, data = $$props.data);
    	};

    	let ifSelected;

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

    /* src/standalone/storage.svelte generated by Svelte v3.23.1 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[18] = list;
    	child_ctx[19] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[20] = list;
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (98:0) {#if !popup && show}
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

    			attr(div0, "class", "file-list");
    			attr(div1, "class", "container svelte-18hgx6z");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*id, selectMany, files, removeFile*/ 525) {
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
    		}
    	};
    }

    // (101:2) {#each files as file, index}
    function create_each_block_1(ctx) {
    	let updating_data;
    	let current;

    	function notfileitem_data_binding(value) {
    		/*notfileitem_data_binding*/ ctx[14].call(null, value, /*file*/ ctx[17], /*each_value_1*/ ctx[20], /*index*/ ctx[19]);
    	}

    	let notfileitem_props = {
    		bucketId: /*id*/ ctx[2],
    		selectMany: /*selectMany*/ ctx[3]
    	};

    	if (/*file*/ ctx[17] !== void 0) {
    		notfileitem_props.data = /*file*/ ctx[17];
    	}

    	const notfileitem = new File({ props: notfileitem_props });
    	binding_callbacks.push(() => bind(notfileitem, "data", notfileitem_data_binding));
    	notfileitem.$on("remove", /*removeFile*/ ctx[9]);

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
    			if (dirty & /*id*/ 4) notfileitem_changes.bucketId = /*id*/ ctx[2];
    			if (dirty & /*selectMany*/ 8) notfileitem_changes.selectMany = /*selectMany*/ ctx[3];

    			if (!updating_data && dirty & /*files*/ 1) {
    				updating_data = true;
    				notfileitem_changes.data = /*file*/ ctx[17];
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

    // (108:0) {#if popup && show}
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
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

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
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*closePopup*/ ctx[5]),
    					listen(button1, "click", /*resolvePopup*/ ctx[7]),
    					listen(button2, "click", /*removeSelected*/ ctx[8]),
    					listen(button3, "click", /*rejectPopup*/ ctx[6])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty & /*id, selectMany, files, removeFile*/ 525) {
    				each_value = /*files*/ ctx[0];
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
    						each_blocks[i].m(div1, null);
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
    			if (detaching) detach(div4);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    // (119:5) {#each files as file, index}
    function create_each_block(ctx) {
    	let updating_data;
    	let current;

    	function notfileitem_data_binding_1(value) {
    		/*notfileitem_data_binding_1*/ ctx[15].call(null, value, /*file*/ ctx[17], /*each_value*/ ctx[18], /*index*/ ctx[19]);
    	}

    	let notfileitem_props = {
    		bucketId: /*id*/ ctx[2],
    		selectMany: /*selectMany*/ ctx[3]
    	};

    	if (/*file*/ ctx[17] !== void 0) {
    		notfileitem_props.data = /*file*/ ctx[17];
    	}

    	const notfileitem = new File({ props: notfileitem_props });
    	binding_callbacks.push(() => bind(notfileitem, "data", notfileitem_data_binding_1));
    	notfileitem.$on("remove", /*removeFile*/ ctx[9]);

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
    			if (dirty & /*id*/ 4) notfileitem_changes.bucketId = /*id*/ ctx[2];
    			if (dirty & /*selectMany*/ 8) notfileitem_changes.selectMany = /*selectMany*/ ctx[3];

    			if (!updating_data && dirty & /*files*/ 1) {
    				updating_data = true;
    				notfileitem_changes.data = /*file*/ ctx[17];
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
    	const dispatch = createEventDispatcher();
    	let { files = [] } = $$props;
    	let { selected = [] } = $$props;
    	let { id } = $$props;
    	let { selectMany } = $$props;
    	let { popup = false } = $$props;
    	let { show = false } = $$props;
    	let { onReject } = $$props;
    	let { onResolve } = $$props;

    	onMount(() => {
    		get(id).files.subscribe(value => {
    			$$invalidate(0, files = value);
    		});

    		get(id).selected.subscribe(value => {
    			$$invalidate(10, selected = value);
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
    			$$invalidate(11, onReject = null);
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
    				$$invalidate(12, onResolve = null);
    			} else {
    				dispatch("resolve", { selected: images });
    			}
    		} else {
    			if (onResolve) {
    				onResolve([]);
    				$$invalidate(12, onResolve = null);
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

    	function notfileitem_data_binding_1(value, file, each_value, index) {
    		each_value[index] = value;
    		$$invalidate(0, files);
    	}

    	$$self.$set = $$props => {
    		if ("files" in $$props) $$invalidate(0, files = $$props.files);
    		if ("selected" in $$props) $$invalidate(10, selected = $$props.selected);
    		if ("id" in $$props) $$invalidate(2, id = $$props.id);
    		if ("selectMany" in $$props) $$invalidate(3, selectMany = $$props.selectMany);
    		if ("popup" in $$props) $$invalidate(4, popup = $$props.popup);
    		if ("show" in $$props) $$invalidate(1, show = $$props.show);
    		if ("onReject" in $$props) $$invalidate(11, onReject = $$props.onReject);
    		if ("onResolve" in $$props) $$invalidate(12, onResolve = $$props.onResolve);
    	};

    	return [
    		files,
    		show,
    		id,
    		selectMany,
    		popup,
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
    		notfileitem_data_binding_1
    	];
    }

    class Storage extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			files: 0,
    			selected: 10,
    			id: 2,
    			selectMany: 3,
    			popup: 4,
    			show: 1,
    			onReject: 11,
    			onResolve: 12,
    			updateFiles: 13
    		});
    	}

    	get updateFiles() {
    		return this.$$.ctx[13];
    	}
    }

    /* src/standalone/file.upload.svelte generated by Svelte v3.23.1 */

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

    	$$self.$set = $$props => {
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

    /* src/standalone/upload.svelte generated by Svelte v3.23.1 */

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
    	let current;

    	const notfileupload = new File_upload({
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
    	let current;

    	const notfileupload = new File_upload({
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
    		get(id).uploads.subscribe(value => {
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

    	$$self.$set = $$props => {
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

    /* src/standalone/complex.svelte generated by Svelte v3.23.1 */

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
    	let updating_id;
    	let t4;
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
    		/*uploadercomponent_id_binding*/ ctx[14].call(null, value);
    	}

    	let uploadercomponent_props = { popup: false, show: true };

    	if (/*id*/ ctx[0] !== void 0) {
    		uploadercomponent_props.id = /*id*/ ctx[0];
    	}

    	const uploadercomponent = new Upload({ props: uploadercomponent_props });
    	binding_callbacks.push(() => bind(uploadercomponent, "id", uploadercomponent_id_binding));
    	uploadercomponent.$on("filesAdded", /*onChange*/ ctx[7]);

    	function storagecomponent_id_binding(value) {
    		/*storagecomponent_id_binding*/ ctx[15].call(null, value);
    	}

    	function storagecomponent_selectMany_binding(value) {
    		/*storagecomponent_selectMany_binding*/ ctx[16].call(null, value);
    	}

    	let storagecomponent_props = { popup: false, show: true };

    	if (/*id*/ ctx[0] !== void 0) {
    		storagecomponent_props.id = /*id*/ ctx[0];
    	}

    	if (/*selectMany*/ ctx[1] !== void 0) {
    		storagecomponent_props.selectMany = /*selectMany*/ ctx[1];
    	}

    	const storagecomponent = new Storage({ props: storagecomponent_props });
    	binding_callbacks.push(() => bind(storagecomponent, "id", storagecomponent_id_binding));
    	binding_callbacks.push(() => bind(storagecomponent, "selectMany", storagecomponent_selectMany_binding));
    	storagecomponent.$on("remove", /*removeFile*/ ctx[9]);

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
    					listen(button0, "click", /*closePopup*/ ctx[4]),
    					listen(button1, "click", /*resolvePopup*/ ctx[5]),
    					listen(button2, "click", /*removeSelected*/ ctx[8]),
    					listen(button3, "click", /*rejectPopup*/ ctx[6])
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

    // (135:0) {#if !popup && show}
    function create_if_block$4(ctx) {
    	let t;
    	let current;

    	const uploadercomponent = new Upload({
    			props: { popup: false, id: /*id*/ ctx[0] }
    		});

    	uploadercomponent.$on("filesAdded", /*onChange*/ ctx[7]);

    	const storagecomponent = new Storage({
    			props: {
    				popup: false,
    				id: /*id*/ ctx[0],
    				selectMany: false
    			}
    		});

    	storagecomponent.$on("remove", /*removeFile*/ ctx[9]);

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
    		get(id).files.subscribe(value => {
    			console.log(popup, show);
    			$$invalidate(10, files = value);
    		});

    		get(id).selected.subscribe(value => {
    			$$invalidate(11, selected = value);
    		});
    	});

    	let { id } = $$props;
    	let { files = [] } = $$props;
    	let { selected = [] } = $$props;
    	let { selectMany } = $$props;
    	let { show = true } = $$props;
    	let { popup = true } = $$props;
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
    				$$invalidate(13, onResolve = null);
    			} else {
    				dispatch("resolve", { selected: images });
    			}
    		} else {
    			if (onResolve) {
    				onResolve([]);
    				$$invalidate(13, onResolve = null);
    			} else {
    				dispatch("resolve", { selected: [] });
    			}
    		}
    	}

    	function rejectPopup() {
    		closePopup();

    		if (onReject) {
    			onReject();
    			$$invalidate(12, onReject = null);
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

    	$$self.$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("files" in $$props) $$invalidate(10, files = $$props.files);
    		if ("selected" in $$props) $$invalidate(11, selected = $$props.selected);
    		if ("selectMany" in $$props) $$invalidate(1, selectMany = $$props.selectMany);
    		if ("show" in $$props) $$invalidate(2, show = $$props.show);
    		if ("popup" in $$props) $$invalidate(3, popup = $$props.popup);
    		if ("onReject" in $$props) $$invalidate(12, onReject = $$props.onReject);
    		if ("onResolve" in $$props) $$invalidate(13, onResolve = $$props.onResolve);
    	};

    	return [
    		id,
    		selectMany,
    		show,
    		popup,
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
    			files: 10,
    			selected: 11,
    			selectMany: 1,
    			show: 2,
    			popup: 3,
    			onReject: 12,
    			onResolve: 13
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
    			data: ['pager', 'sorter', 'filter'],
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
    		listAndCount:{
    			method: 'get',
    			rules:[{
    				auth: true,
    				admin: true
    			},{
    				auth: true,
    				role: 'admin'
    			}],
    			postFix: '/:actionName'
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
    		},
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

    /* global fetch, FormData */
    const OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY = ['_id', 'id', 'ID'],
    	DEFAULT_FILTER = {},
    	DEFAULT_SEARCH = '',
    	DEFAULT_RETURN = {},
    	DEFAULT_PAGE_NUMBER = 1,
    	DEFAULT_PAGE_SIZE = 10,
    	DEFAULT_ACTION_PREFIX = '$';

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
    		if (!Object.prototype.hasOwnProperty.call(this, [DEFAULT_ACTION_PREFIX + actionName])) {
    			this[DEFAULT_ACTION_PREFIX + actionName] = (opts, headers, fileUpload = false, files) => this.request(this, actionName, opts, headers, fileUpload, files);
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
    			console.log('request url for file upload', url);
    			const fd = new FormData();
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
    		return fetch(apiServerURL + url + requestParamsEncoded, opts).then(response => response.json());

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

    	parseParams(start, end, line, record){
    		let fieldName = '';
    		let len = start.length;
    		while (line.indexOf(start) > -1) {
    			let ind = line.indexOf(start);
    			let startSlice = ind + len;
    			let endSlice = line.indexOf(end);
    			fieldName = line.slice(startSlice, endSlice);
    			if (fieldName == '') break;
    			console.log(start + fieldName + end, notPath$1.get(fieldName, record));
    			line = line.replace(start + fieldName + end, notPath$1.get(fieldName, record));
    		}
    		return line;
    	}

    	parseLine(line, record, actionName) {
    		line = line.replace(':modelName', this.manifest.model);
    		line = line.replace(':actionName', actionName);
    		line = this.parseParams(':record[',']', line, record);
    		line = this.parseParams(':', '?', line, record);
    		return line;
    	}

    	getURL(record, actionData, actionName) {
    		var line = this.parseLine(this.manifest.url, record, actionName) + ((Object.prototype.hasOwnProperty.call(actionData, 'postFix')) ? this.parseLine(actionData.postFix, record, actionName) : '');
    		return line;
    	}

    	getServerURL() {
    		return this.options.server;
    	}

    	encodeRequest(data) {
    		let p = '?';
    		for (let t in data) {
    			if (typeof data[t] !== 'undefined' && data[t] !== null) {
    				p += encodeURIComponent(t) + '=' + encodeURIComponent(data[t].constructor === Object ? JSON.stringify(data[t]) : data[t]) + '&';
    			}
    		}
    		//for test purpose only, special test server needed
    		if (this.options.test) {
    			p += '&test=1';
    			if (this.options.test.session) {
    				p += ('&session=' + this.options.test.session);
    			}
    			if (this.options.test.session) {
    				p += ('&role=' + this.options.test.role);
    			}
    		}
    		return p;
    	}

    	collectRequestData(actionData) {
    		let requestData = {};
    		if ((Object.prototype.hasOwnProperty.call(actionData, 'data')) && Array.isArray(actionData.data)) {
    			for (let i = 0; i < actionData.data.length; i++) {
    				let dataProviderName = 'get' + capitalizeFirstLetter(actionData.data[i]);
    				if (this[dataProviderName] && typeof this[dataProviderName] === 'function') {
    					let data = this[dataProviderName](),
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

    	getID(record, actionData) {
    		let resultId,
    			list = OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY,
    			prefixes = ['', this.manifest.model];
    		if (Object.prototype.hasOwnProperty.call(actionData, 'index') && actionData.index) {
    			list = [actionData.index].concat(OPT_DEFAULT_INDEX_FIELD_NAME_PRIORITY);
    		}
    		for (let pre of prefixes) {
    			for (let t of list) {
    				if (Object.prototype.hasOwnProperty.call(record, pre + t)) {
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
    		notPath$1.set('filter', this.working, filterData);
    		return this;
    	}

    	resetFilter() {
    		return this.setFilter();
    	}

    	getFilter() {
    		return notPath$1.get('filter', this.working);
    	}

    	setSearch(searchData = DEFAULT_SEARCH) {
    		notPath$1.set('search', this.working, searchData);
    		return this;
    	}

    	resetSearch() {
    		return this.setSearch();
    	}

    	getSearch() {
    		return notPath$1.get('search', this.working);
    	}

    	setSorter(sorterData) {
    		notPath$1.set('sorter', this.working, sorterData);
    		return this;
    	}

    	resetSorter() {
    		return this.setSorter({});
    	}

    	getSorter() {
    		return notPath$1.get('sorter', this.working);
    	}

    	setReturn(returnData = DEFAULT_RETURN) {
    		notPath$1.set('return', this.working, returnData);
    		return this;
    	}

    	resetReturn() {
    		return this.setReturn({});
    	}

    	getReturn() {
    		return notPath$1.get('return', this.working);
    	}

    	setPageNumber(pageNumber) {
    		notPath$1.set('pager.page', this.working, pageNumber);
    		return this;
    	}

    	setPageSize(pageSize) {
    		notPath$1.set('pager.size', this.working, pageSize);
    		return this;
    	}

    	setPager(pageSize = DEFAULT_PAGE_SIZE, pageNumber = DEFAULT_PAGE_NUMBER) {
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

    	resetPager() {
    		return this.setPager();
    	}

    	getPager() {
    		return notPath$1.get('pager', this.working);
    	}
    }

    /* global FileReader, document, Image */
    const DEFAULT_OPTS = {
    	bucket: 'client',
    	server: '',
    	selectMany: false,
    	preview: {
    		width: 100,
    		height: 100
    	}
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
    		if(this.options.complex && this.options.complex.popup){
    				this.renderComplex();
    				this.loadFilesData().catch(console.error);
    		}else {
    			if (this.options.storageEl) {
    				this.renderStorage();
    				this.loadFilesData().catch(console.error);
    			}
    			if (this.options.uploadEl) {
    				this.renderUpload();
    			}
    		}
    	}

    	generateID() {
    		if (!this.options.id) {
    			this.options.id = Math.random();
    		}
    	}

    	createStore() {
    		this.storage = create(this.options.id);
    		this.storage.files.subscribe((files) => {
    			this.files = files;
    		});
    		this.storage.selected.subscribe((selected) => {
    			this.selected = selected;
    		});
    		this.storage.uploads.subscribe((selected) => {
    			this.uploads = selected;
    		});
    	}

    	renderComplex(){
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

    	renderStorage() {
    		this.ui.storage = new Storage({
    			target: this.options.storageEl,
    			props: {
    				files: this.files,
    				id: this.options.id,
    				selectMany: this.options.selectMany,
    				popup:  this.options.storage && this.options.storage.popup,
    				show: this.options.storage && this.options.storage.show,
    			}
    		});
    		this.ui.storage.$on('remove', this.removeFiles.bind(this));
    	}

    	renderUpload() {
    		this.ui.upload = new Upload({
    			target: this.options.uploadEl,
    			props: {
    				id: this.options.id,
    				popup: this.options.upload && this.options.upload.popup,
    				show: this.options.upload && this.options.upload.show,
    			}
    		});
    		this.ui.upload.$on('filesAdded', this.onUploads.bind(this));
    		this.ui.upload.$on('remove', this.removeUpload.bind(this));
    	}

    	loadFilesData() {
    		let reqOpts = {
    			bucket: this.options.bucket,
    			session: this.options.session
    		};
    		let req = this.getInterface()
    			.setFilter(reqOpts)
    			.setSorter({fileID: -1})
    			.$list({});
    		return req.then((data) => {
    			this.storage.files.update((value) => {
    				value.splice(0, value.length, ...data);
    				return value;
    			});
    			return data;
    		}).catch((err) => {
    			console.error(err, 'Список загруженных файлов не доступен!');
    		});
    	}

    	useGlobalInterface() {
    		return this.options.useGlobalInterface && this.nrFile;
    	}

    	getInterface() {
    		return new netInterface(file_manifest, this.options);
    	}

    	show() {
    		return new Promise((resolve, reject) => {
    			if(this.ui.storage){
    				this.ui.storage.$set({
    					show: true,
    					onResolve: resolve,
    					onReject: reject
    				});
    			}else if(this.ui.complex){
    				this.ui.complex.$set({
    					show: true,
    					onResolve: resolve,
    					onReject: reject
    				});
    			}
    		});
    	}

    	async removeFiles(ev) {
    		let uuids = ev.detail.selected;
    		let reqOpts = {
    			bucket: this.options.bucket,
    			session: this.options.session
    		};
    		let toRemove = [];
    		for (let uuid of uuids) {
    			let file = this.findFileByUUID(uuid);
    			if (file) {
    				try {
    					let result = await this.getInterface().setFilter(reqOpts).$delete({
    						fileID: file.fileID
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
    		this.files.forEach((file) => {
    			if (file.uuid === uuid) {
    				res = file;
    			}
    		});
    		return res;
    	}

    	isGood(res) {
    		return res.status && (res.status === 'ok');
    	}

    	removeFromStore(file) {
    		this.storage.files.update((list) => {
    			let indx = list.indexOf(file);
    			if (indx > -1) {
    				list.splice(indx, 1);
    			}
    			return list;
    		});
    	}

    	resetSelected() {
    		this.storage.selected.update((val) => {
    			val.splice(0, val.length);
    			return val;
    		});
    	}

    	async onUploads(data) {
    		console.log('new files to upload', data);
    		let files = data.detail;
    		for (let file of files) {
    			let preview = await this.preloadFilePreview(file);
    			file.id = `fid_` + Math.random();
    			let upload = {
    				id: file.id,
    				name: file.name,
    				size: file.size,
    				type: file.type,
    				file,
    				preview
    			};
    			this.addToUploads(upload);
    		}
    	}

    	preloadFilePreview(file) {
    		return new Promise((res, rej) => {
    			try {
    				let reader = new FileReader();
    				reader.onload = (e) => {
    					let cnvs = document.createElement('canvas');
    					cnvs.width = this.options.preview.width;
    					cnvs.height = this.options.preview.height;
    					let ctx = cnvs.getContext('2d'),
    						img = new Image;
    					img.onload = () => {
    						ctx.drawImage(img, 0, 0, this.options.preview.width, this.options.preview.height); // Or at whatever offset you like
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


    	addToUploads(upload) {
    		this.uploadFile(upload).catch(console.error);
    		this.storage.uploads.update((val) => {
    			val.push(upload);
    			return val;
    		});
    	}

    	removeUpload(ev) {
    		let ids = ev.detail.selected;
    		console.log('remove uploads', ids);
    	}

    	uploadFile(upload) {
    		let reqOpts = {
    			bucket: this.options.bucket,
    			session: this.options.session
    		};
    		return this.getInterface()
    			.setFilter(reqOpts)
    			.$create(reqOpts, false, true, upload.file)
    			.then((data) => {
    				if (data.status === 'ok') {
    					this.uploadFinished(upload);
    				}
    			});
    	}

    	uploadFinished(upload) {
    		this.storage.uploads.update((val) => {
    			let toRemove;
    			val.forEach((item) => {
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

    return exports;

}({}));
