const FIRST_DIR_NAME_LENGTH = 3;
const uuidv4 = require("uuid").v4;

const interfaces = {};

function interfaceExists(interfaceName) {
    return Object.prototype.hasOwnProperty.call(interfaces, interfaceName);
}

function getInterface(interfaceName) {
    return interfaces[interfaceName];
}

function removeInterface(interfaceName) {
    delete interfaces[interfaceName];
}

const getAllMethods = (obj) => {
    let props = [];
    do {
        const l = Object.getOwnPropertyNames(obj)
            .concat(Object.getOwnPropertySymbols(obj).map((s) => s.toString()))
            .sort()
            .filter(
                (p, i, arr) =>
                    typeof obj[p] === "function" && //only the methods
                    p !== "constructor" && //not the constructor
                    (i == 0 || p !== arr[i - 1]) && //not overriding in this prototype
                    props.indexOf(p) === -1 //not overridden in a child
            );
        props = props.concat(l);
    } while (
        (obj = Object.getPrototypeOf(obj)) && //walk-up the prototype chain
        Object.getPrototypeOf(obj) //not the the Object prototype methods (hasOwnProperty, etc...)
    );
    return props;
};

function interfaceMethodExists(interfaceName, methodName) {
    return getAllMethods(interfaces[interfaceName]).indexOf(methodName) > -1;
}

function createStandartCall(methodName) {
    return (interfaceName, ...useful) => {
        if (
            interfaceExists(interfaceName) &&
            interfaceMethodExists(interfaceName, methodName)
        ) {
            return getInterface(interfaceName)[methodName](...useful);
        }
    };
}

function extendFromInterface(storeInterface) {
    for (let i of getAllMethods(storeInterface)) {
        if (!Object.prototype.hasOwnProperty.call(exports, i)) {
            //eslint-disable-next-line no-console
            //console.log('Add new methods for interface forwarding', i);
            exports[i] = createStandartCall(i);
        }
    }
}

exports.addInterface = (name, storeInterface) => {
    if (interfaceExists(name)) {
        return false;
    } else {
        interfaces[name] = storeInterface;
        extendFromInterface(storeInterface);
        return true;
    }
};

exports.getInterface = (name) => {
    if (interfaceExists(name)) {
        return getInterface(name);
    } else {
        return false;
    }
};

exports.removeInterface = (name) => {
    if (interfaceExists(name)) {
        removeInterface(name);
    }
    return true;
};

exports.getPath = (uuid) => {
    return uuid.substr(0, FIRST_DIR_NAME_LENGTH);
};

exports.createFileName = () => {
    return uuidv4();
};

exports.getPathFromHash = function (hash) {
    return (
        hash.substr(0, FIRST_DIR_NAME_LENGTH) +
        "/" +
        hash.substr(FIRST_DIR_NAME_LENGTH)
    );
};
