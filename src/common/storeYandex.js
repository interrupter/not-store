const EasyYandexS3 = require('easy-yandex-s3');
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const isStream = require('is-stream');
const isUrl = require('valid-url');
const streamifier = require('streamifier');
const sharp = require('sharp');
const uuidv4 = require('uuid').v4;

const OPT_DEFAULT_ACL = 'private';
const OPT_MAX_INPUT_PATH_LENGTH = 255;
const FIRST_DIR_NAME_LENGTH = 2;
/*const OPT_DEFAULT_THUMB_OPTIONS = {
	quality: 90
};*/

class notStoreYandex extends EventEmitter {
	constructor(options) {
		super();
		this.options = options;
		this.initS3Client();
		return this;
	}

	getACL() {
		return this.options.ACL || OPT_DEFAULT_ACL;
	}

	initS3Client() {
		this.s3 = new EasyYandexS3({
			auth: {
				accessKeyId: this.options.s3.id,
				secretAccessKey: this.options.s3.key,
			},
			Bucket: this.options.s3.bucket
		});
	}


	makeThumb(src, dest, size) {
		let image = sharp(src, {
			failOnError: false
		});
		return image.resize(size, size, this.options.sharp.resize || {}).toFile(dest);
	}

	async makeThumbs(src, thumbs) {
		for (let size in thumbs) {
			await this.makeThumb(src, thumbs[size].file, parseInt(thumbs[size].size));
		}
	}

	async upload(file, folder) {
		return await this.s3.Upload({
			path: file,
			save_name: true
		}, folder);
	}

	async uploadMany(filenames, folder) {
		let list = filenames.map(
			(filename) => {
				return {
					path: filename,
					save_name: true
				};
			}
		);
		return await this.s3.Upload(list, folder);
	}

	getSizesPaths(src, sizes, format) {
		let srcParts = path.parse(src),
			result = {};
		if (format) {
			srcParts.ext = `.${format}`;
		}
		Object.keys(sizes).forEach((size) => {
			result[size] = {
				size: sizes[size],
				file: path.join(srcParts.dir, `${srcParts.name}-${size}${srcParts.ext}`)
			};
		});
		return result;
	}

	getSizesFilenames(uuid, sizes, format, addOriginal = true) {
		let result = {};
		Object.keys(sizes).forEach((size) => {
			result[size] = `${uuid}-${size}.${format}`;
		});
		if (addOriginal) {
			result.original = `${uuid}.${format}`;
		}
		return result;
	}

	/**
	 *	Returns filaname for object by uuid, postfix and format
	 *	@param	{string}	uuid		unique id of object
	 *	@param	{string}	postfix	postfix that will be added at end of uuid after '_'
	 *	@param	{string}	format	file format name will be added at the end after '.'
	 *	@returns{string}	filename
	 */
	getFilename(uuid, postfix, format) {
		return uuid + (postfix ? ('_' + postfix) : '') + (format ? ('.' + format) : '');
	}

	/**
	 *	Returns filaname from root of the bucket for object by uuid, postfix and format
	 *	@param	{string}	uuid		unique id of object
	 *	@param	{string}	postfix	postfix that will be added at end of uuid after '_'
	 *	@param	{string}	format	file format name will be added at the end after '.'
	 *	@returns{string}	full filename in bucket
	 */
	getFullFilename(uuid, postfix, format) {
		return path.join(this.getPathInBucket(uuid), this.getFilename(uuid, postfix, format));
	}

	getPathInBucket(uuid) {
		let pathInBucket = '';
		if (this.options.subPath) {
			let end = this.getPath(uuid);
			if (this.options.s3.path) {
				pathInBucket = path.join(this.options.s3.path, end);
			} else {
				pathInBucket = end;
			}
		} else {
			if (this.options.s3.path) {
				pathInBucket = this.options.s3.path;
			}
		}
		return pathInBucket;
	}

	/**
	 *	converts "anything" to readable stream
	 *	@param {String|Buffer|Stream} source	source of data
	 *	@returns	{ReadableStream} for data consumption
	 **/
	convertToReadableStream(source) {
		return new Promise(function(resolve, reject) {
			if (typeof source === 'string') {
				if (source.length < OPT_MAX_INPUT_PATH_LENGTH) {
					//guess this is file path, but lets check it on existence
					if (isUrl.isUri(encodeURI(source))) {
						if (isUrl.isHttpsUri(source)) {
							https.get(source, resolve);
						} else {
							if (isUrl.isHttpUri(source)) {
								http.get(source, resolve);
							}
						}
					} else {
						let stat = fs.lstatSync(source);
						if (stat.isFile()) {
							resolve(fs.createReadStream(source));
						} else {
							reject(new Error('string but not file or URL'));
						}
					}
				} else {
					//file as string
					resolve(streamifier.createReadStream(source));
				}
			} else if (source instanceof Buffer) {
				//file as buffer
				resolve(streamifier.createReadStream(source));
			} else if (isStream(source)) {
				resolve(source);
			} else {
				reject(new Error('not streamable'));
			}
		});
	}

	/**
	 *	Downloads file and saves to tmp folder
	 *	@param		{String|Buffer|Stream}	file	file in some form or his URI
	 *	@returns	{Promise}	of image metadata extracted with sharp with extra fields: uuid, tmpName
	 */
	stashFile(file) {
		return new Promise((resolve, reject) => {
			let name = this.randomFilename(),
				tmpName = path.join(this.options.tmp, name);
			this.convertToReadableStream(file)
				.then((streamIn) => this.streamOut(streamIn, tmpName))
				.then(this.getMetadata)
				.then((metadata) => {
					metadata.localFilename = tmpName;
					metadata.uuid = name;
					return metadata;
				})
				.then(this.moveFileToTmpWithFormat)
				.then(resolve)
				.catch((e) => {
					reject(e);
				});
		});
	}

	streamOut(streamIn, tmpName) {
		return new Promise((resolve, reject) => {
			try {
				let streamOut = fs.createWriteStream(tmpName);
				streamOut.on('finish', (err) => {
					if (err) {
						//return error
						reject(err);
					} else {
						//return image name in store
						resolve(tmpName);
					}
				});
				streamIn.pipe(streamOut);
			} catch (e) {
				reject(e);
			}
		});
	}

	getMetadata(filename) {
		return new Promise((resolve, reject) => {
			try {
				sharp(filename).metadata((err, metadata) => {
					if (err) {
						reject(err);
					} else {
						resolve(metadata);
					}
				});
			} catch (e) {
				reject(e);
			}
		});
	}

	async moveFileToTmpWithFormat(metadata) {
		let src = metadata.localFilename;
		let dest = metadata.localFilename + '.' + metadata.format;
		await fs.promises.rename(src, dest);
		metadata.localFilename = dest;
		return metadata;
	}

	/**
	 *	Removes local file by full filename
	 *	@param	{String}	filename	filename with path
	 *	@returns{Promise}
	 */
	async removeLocalFile(filename) {
		try {
			await fs.promises.unlink(filename);
		} catch (e) {
			//eslint-disable-next-line no-console
			console.error(e);
		}
	}

	/**
	 * Input file as base64 string
	 *  @param {String|Path|Buffer|Stream}  file file content in various forms
	 *  @returns {Promise}
	 **/
	add(file) {
		return this.stashFile(file)
			.then(this.saveImageToCloudWithThumbs.bind(this));
	}

	async saveImageToCloudWithThumbs(metadata) {
		try {
			let filename = metadata.localFilename;
			let pathInBucket = this.getPathInBucket(metadata.uuid);
			let thumbs = this.getSizesPaths(metadata.localFilename, this.options.sharp.sizes, metadata.format);
			await this.makeThumbs(metadata.localFilename, thumbs);
			if (this.options.saveOriginal) {
				thumbs.original = {
					file: filename
				};
			}
			let filenames = [];
			for (let sizeName in thumbs) {
				filenames.push(thumbs[sizeName].file);
			}
			let cloudNames = await this.uploadMany(filenames, pathInBucket);
			let thumbKeys = Object.keys(thumbs);
			for (let t = 0; t < cloudNames.length; t++) {
				thumbs[thumbKeys[t]].cloud = cloudNames[t];
			}
			for (let sizeName in thumbs) {
				await this.removeLocalFile(thumbs[sizeName].file);
			}
			if (!this.options.saveOriginal) {
				await this.removeLocalFile(filename);
			}
			delete metadata.localFilename;
			return {
				metadata,
				store: thumbs
			};
		} catch (e) {
			//eslint-disable-next-line no-console
			console.error(e);
			return undefined;
		}
	}

	remove(key) {
		//eslint-disable-next-line no-console
		return this.s3.Remove(key).catch(console.error);
	}

	list(pathInBucket) {
		if (!pathInBucket) {
			pathInBucket = this.getPathInBucket();
		}
		return this.s3.GetList(pathInBucket);
	}

	async delete(metadata) {
		let sizesFilenames = this.getSizesFilenames(metadata.uuid, this.options.sharp.sizes, metadata.format);
		let results = {};
		for (let size in sizesFilenames) {
			let filename = sizesFilenames[size];
			results[size] = await this.remove(path.join(this.getPathInBucket(metadata.uuid), filename));
		}
		return results;
	}

	randomFilename() {
		return uuidv4();
	}

	getPath(uuid) {
		return uuid.substr(0, FIRST_DIR_NAME_LENGTH);
	}

}


module.exports = notStoreYandex;
