const fs = require("fs");
const Stream = require("stream");
const http = require("http");
const https = require("https");
const isStream = require("is-stream");
const isUrl = require("valid-url");
const streamifier = require("streamifier");

const { OPT_MAX_INPUT_PATH_LENGTH } = require("../const.cjs");

const {
    notStoreDriverStreamerExceptionNotStreamableSource,
} = require("../exceptions/driver.streamer.exception.cjs");

class notStoreDriverStreamer {
    /**
     *	converts "anything" to readable stream
     *	@param {String|Buffer|Stream} source	source of data
     *	@returns	{ReadableStream} for data consumption
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
     * @returns {Promise<Stream>}		buffer content
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
     * @returns {Promise<Stream>}	promise of content
     */
    static async readableStreamFromString(source) {
        //line is too long === file in string
        if (source.length < OPT_MAX_INPUT_PATH_LENGTH) {
            //
            if (isUrl.isUri(encodeURI(source))) {
                return notStoreDriverStreamer.readerStreamFromURL(source);
            } else {
                //guess this is file path, but lets check it on existence
                try {
                    let stat = await fs.promises.lstat(source);
                    if (stat.isFile()) {
                        return notStoreDriverStreamer.readableStreamFromFilename(
                            source
                        );
                    }
                } catch (e) {}
            }
        }
        //file as string
        return notStoreDriverStreamer.readableStreamFromFileInString(source);
    }

    /**
     * URL to Promise of readable stream
     * @param {string} 	source 		url of file
     * @returns {Promise<Stream>}	readable stream
     */
    static async readerStreamFromURL(source) {
        return new Promise((resolve, reject) => {
            try {
                if (isUrl.isHttpsUri(source)) {
                    https.get(source, resolve);
                } else {
                    if (isUrl.isHttpUri(source)) {
                        http.get(source, resolve);
                    }
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Filename to Promise of ReadStream
     * @param 		{string} 				source 		filename
     * @returns 	{Promise<Stream>}					readable stream of file data
     */
    static async readableStreamFromFilename(source) {
        return fs.createReadStream(source);
    }

    /**
     * String to Stream
     * @param {string} 	source 	file saved in string
     * @returns {Promise<Stream>}	reading stream
     */
    static async readableStreamFromFileInString(source) {
        return streamifier.createReadStream(source);
    }

    /**
     * Saves data in temporal file returns Promise of temp filename
     * @param {Stream} streamIn 	        incoming stream of file data
     * @param {string} uuid 	            uuid as unique base for a filename
     * @param {string} name_tmp 	        path to tmp file
     * @returns Promise<object>
     * @returns Promise<object>.name_tmp	filename of saved temporal file
     * @returns Promise<object>.uuid	    file uuid
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
