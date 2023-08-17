import {
	writable
} from 'svelte/store';

const ALL = {};

function exist(key) {
	return Object.hasOwn(ALL, key);
}

function get(key, createIfNotExists = false) {
	if (exist(key)) {
		return ALL[key];
	} else {
		if(createIfNotExists){
			return create(key);
		}else{
			return false;
		}
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
