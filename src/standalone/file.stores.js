import {
	writable
} from 'svelte/store';

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

export {
	create,
	get
};
