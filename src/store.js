const OPT_SUB_DIR_NAME_LENGTH = 6,
	OPT_TOKEN_LENGTH = 48,
	crypto = require('crypto'),
	log = require('not-log')(module);

var interfaces = {};

var interfaceExists = function (interfaceName) {
	return interfaces.hasOwnProperty(interfaceName);
};

var getInterface = function (interfaceName) {
	return interfaces[interfaceName];
};

var removeInterface = function (interfaceName) {
	delete interfaces[interfaceName];
};


const getAllMethods = (obj) => {
	let props = [];
	do {
		const l = Object.getOwnPropertyNames(obj)
			.concat(Object.getOwnPropertySymbols(obj).map(s => s.toString()))
			.sort()
			.filter((p, i, arr) =>
				typeof obj[p] === 'function' && //only the methods
				p !== 'constructor' && //not the constructor
				(i == 0 || p !== arr[i - 1]) && //not overriding in this prototype
				props.indexOf(p) === -1 //not overridden in a child
			);
		props = props.concat(l);
	}
	while (
		(obj = Object.getPrototypeOf(obj)) && //walk-up the prototype chain
		Object.getPrototypeOf(obj) //not the the Object prototype methods (hasOwnProperty, etc...)
	);
	return props;
};

var interfaceMethodExists = function (interfaceName, methodName) {
	return getAllMethods(interfaces[interfaceName]).indexOf(methodName) > -1;
};

var createStandartCall = function (methodName) {
	return function (interfaceName/*, some other not standart arguments*/ ) {
		if (interfaceExists(interfaceName) && interfaceMethodExists(interfaceName, methodName)) {
			//no need to pass interfaceName to interface instance
			let [...useful] = Array.prototype.splice.call(arguments, 1);
			return getInterface(interfaceName)[methodName](...useful);
		}
	};
};


var extendFromInterface = function (storeInterface) {
	for (let i of getAllMethods(storeInterface)) {
		if (!exports.hasOwnProperty(i)) {
			log.info('Add new methods for interface forwarding', i);
			exports[i] = createStandartCall(i);
		}
	}
};

exports.addInterface = function (name, storeInterface) {
	if (interfaceExists(name)) {
		return false;
	} else {
		interfaces[name] = storeInterface;
		extendFromInterface(storeInterface);
		return true;
	}
};

exports.getInterface = function (name) {
	if (interfaceExists(name)) {
		return getInterface(name);
	} else {
		return false;
	}
};

exports.removeInterface = function (name) {
	if (interfaceExists(name)) {
		removeInterface(name);
	}
	return true;
};

exports.getPathFromHash = function (hash) {
	var len = OPT_SUB_DIR_NAME_LENGTH;
	var result = [];
	while (len < hash.length) {
		result.push(hash.substring(0, len));
		hash = hash.slice(len);
	}
	if (hash.length > 0) result.push(hash);
	return result.join('/');
};

exports.createFileName = function () {
	let t = crypto.randomBytes(OPT_TOKEN_LENGTH),
		token = t.toString('hex');
	return token;
};
