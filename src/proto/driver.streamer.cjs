// @ts-check

const fs = require("fs");
const Stream = require("stream");
const http = require("http");
const https = require("https");
const isStream = require("is-stream");
const isUrl = require("valid-url");
const streamifier = require("streamifier");
const { resolve } = require("path");

const tryFileAsync = require("not-node").Common.tryFileAsync;

const { OPT_MAX_INPUT_PATH_LENGTH } = require("../const.cjs");

const httpOptions = require("../http.options.js");

const {
    notStoreDriverStreamerExceptionFileNotExists,
    notStoreDriverStreamerExceptionNotStreamableSource,
} = require("../exceptions/driver.streamer.exception.cjs");

/**
 * @typedef {NodeJS.ReadableStream|fs.ReadStream|http.IncomingMessage|Stream.Duplex} ReadingPipe
 */
class notStoreDriverStreamer {
    /**
     *	converts "anything" to readable stream
     *	@param {String|Buffer|NodeJS.ReadableStream} source	source of data
     *	@returns	{Promise<ReadingPipe>} for data consumption
     **/
    static async convertToReadableStream(source) {
        if (typeof source === "string") {
            return notStoreDriverStreamer.readableStreamFromString(source);
        } else if (source instanceof Buffer) {
            //file as buffer
            return notStoreDriverStreamer.readableStreamFromBuffer(source);
        } else if (isStream(source)) {
            return source;
        } else {
            throw new notStoreDriverStreamerExceptionNotStreamableSource();
        }
    }

    /**
     * Buffer to Promise of readable stream
     * @param {Buffer} 		buffer 		buffer
     * @returns {Promise<ReadingPipe>}		buffer content
     */
    static async readableStreamFromBuffer(buffer) {
        let stream = new Stream.Duplex();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }

    /**
     * String to promise of readable stream
     * @param 	{string} 	source 	string to convert
     * @returns {Promise<ReadingPipe>}	promise of content
     */
    static async readableStreamFromString(source) {
        //line is too long === file in string
        if (source.length < OPT_MAX_INPUT_PATH_LENGTH) {
            //
            if (isUrl.isUri(encodeURI(source))) {
                return notStoreDriverStreamer.readableStreamFromURL(
                    encodeURI(source)
                );
            } else {
                //guess this is file path, but lets check it on existence
                try {
                    let stat = await fs.promises.lstat(resolve(source));
                    if (stat.isFile()) {
                        return notStoreDriverStreamer.readableStreamFromFilename(
                            source
                        );
                    }
                } catch (_) {
                    //file not exists, treat string as a file content
                }
            }
        }
        //file as string
        return notStoreDriverStreamer.readableStreamFromFileInString(source);
    }

    /**
     * URL to Promise of readable stream
     * @param {string} 	source 		url of file
     * @returns {Promise<ReadingPipe>}	readable stream
     */
    static async readableStreamFromURL(source) {
        return new Promise((resolve, reject) => {
            try {
                const HTTP_OPTIONS = this.getHTTPOptions();
                if (isUrl.isHttpsUri(source)) {
                    https
                        .get(source, HTTP_OPTIONS, resolve)
                        .on("error", (e) => {
                            reject(e);
                        });
                } else {
                    if (isUrl.isHttpUri(source)) {
                        http.get(source, HTTP_OPTIONS, resolve).on(
                            "error",
                            (e) => {
                                reject(e);
                            }
                        );
                    } else {
                        reject(
                            new notStoreDriverStreamerExceptionNotStreamableSource(
                                source
                            )
                        );
                    }
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    static getHTTPOptions() {
        return httpOptions();
    }

    /**
     * Filename to Promise of readable stream
     * @param 		{string} 				source 		filename
     * @returns 	{Promise<ReadingPipe>}					readable stream of file data
     */
    static async readableStreamFromFilename(source) {
        if (await tryFileAsync(source)) {
            return fs.createReadStream(source);
        } else {
            throw new notStoreDriverStreamerExceptionFileNotExists(source);
        }
    }

    /**
     * String to Stream
     * @param {string} 	source 	file saved in string
     * @returns {Promise<ReadingPipe>}	reading stream
     */
    static async readableStreamFromFileInString(source) {
        return streamifier.createReadStream(source);
    }

    /**
     * @typedef {Object} FileInfoShort
     * @property {string} uuid - The X Coordinate
     * @property {string} name_tmp - The Y Coordinate
     */
    /**
     * Saves data in temporal file returns Promise of temp filename
     * @param {ReadingPipe} streamIn 	        incoming stream of file data
     * @param {string} uuid 	            uuid as unique base for a filename
     * @param {string} name_tmp 	        path to tmp file
     * @returns {Promise<FileInfoShort>}
     * @memberof notStoreDriverStreamer
     */
    static async streamFileOut(streamIn, uuid, name_tmp) {
        return new Promise((resolve, reject) => {
            try {
                if (!(streamIn instanceof Stream)) {
                    throw new Error("input is not stream");
                }
                streamIn.on &&
                    streamIn.on("error", (err) => {
                        reject(err);
                    });
                let streamOut = fs.createWriteStream(name_tmp);
                streamOut.on("finish", (err) => {
                    if (err) {
                        //return error
                        reject(err);
                    } else {
                        //return image name in store
                        resolve({ name_tmp, uuid });
                    }
                });
                streamIn.pipe(streamOut);
            } catch (e) {
                reject(e);
            }
        });
    }
}

module.exports = notStoreDriverStreamer;
