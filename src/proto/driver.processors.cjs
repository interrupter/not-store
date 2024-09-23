// @ts-check

const notStoreProcessors = require("../store.processors.cjs");
const { PROCESSOR_TYPES } = require("../const.cjs");

/**
 *
 *
 * @class notStoreDriverProcessors
 */
class notStoreDriverProcessors {
    #processors;
    /**
     * Creates an instance of notStoreDriverProcessors.
     * @param {*} processors
     * @memberof notStoreDriverProcessors
     */
    constructor(processors) {
        this.#processors = processors;
    }

    /**
     *
     * @param {string} 	type 	`pre` or `post`
     * @param {string} 	action 			name of action pipeline dedicated for
     * @param {import('mongoose').Document} 	file 		file document
     * @param {object} 	driver 		    driver instance
     * @returns {Promise}
     * @memberof notStoreDriverProcessors
     */
    async run(type, action, file, driver) {
        if (this.isSet(type, action)) {
            await notStoreProcessors.run(
                this.get(type, action), //processors list to run against file
                file, //file  object
                driver
            );
        }
    }

    /**
     * if processor exists returns true
     * @param {string} 	processorType 	`pre` or `post`
     * @param {string} 	action 			name of action pipeline dedicated for
     * @returns {boolean}
     * @memberof notStoreDriverProcessors
     */
    isSet(processorType, action) {
        return (
            Object.hasOwn(this.#processors, action) &&
            Object.hasOwn(this.#processors[action], processorType) &&
            Array.isArray(this.#processors[action][processorType]) &&
            this.#processors[action][processorType].length > 0
        );
    }

    /**
     * list of pipeline processors declarations. item or plain name of processor or array[name:string, options:object]
     * @param {string} processorType 	'pre' or 'post'
     * @param {string} action 			name of pipeline action
     * @returns {array}	list of pipeline processors declarations. item or plain name of processor or array[name:string, options:object]
     * @memberof notStoreDriverProcessors
     */
    get(processorType, action) {
        return this.#processors[action][processorType];
    }

    /**
     * Runs pre processors of action
     * @param {string}  action      name of action
     * @param {import('mongoose').Document}  file        object with different information about file
     * @param {object} 	driver 		driver instance
     * @returns {Promise<any>}
     * @memberof notStoreDriverProcessors
     */
    async runPre(action, file, driver) {
        return this.run(
            PROCESSOR_TYPES.PROCESSOR_TYPE_PRE,
            action,
            file,
            driver
        );
    }

    /**
     * Runs post processors of action
     * @param {string}  action      name of action
     * @param {import('mongoose').Document}  file        object with different information about file
     * @param {object} 	driver 		driver instance
     * @returns {Promise<any>}
     * @memberof notStoreDriverProcessors
     */
    async runPost(action, file, driver) {
        return this.run(
            PROCESSOR_TYPES.PROCESSOR_TYPE_POST,
            action,
            file,
            driver
        );
    }
}

module.exports = notStoreDriverProcessors;
