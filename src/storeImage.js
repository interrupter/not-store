const OPT_DEFAULT_EXTENSION = 'png',
	OPT_DEFAULT_THUMB_EXTENSION = 'jpeg',
	OPT_DEFAULT_THUMB_QUALITY = 0.8,
	OPT_ORIGINAL_THUMB = 'original',
	OPT_MAX_INPUT_PATH_LENGTH = 256,
	OPT_DEFAULT_EXTENSIONS = ['jpeg', 'png', 'webp', 'gif', 'svg', 'tiff', 'tif'];

const fs = require('fs'),
	path = require('path'),
	async = require('async'),
	mkdirp = require('mkdirp'),
	store = require('./store'),
	http = require('http'),
	https = require('https'),
	isStream = require('is-stream'),
	isUrl = require('valid-url'),
	streamifier = require('streamifier'),
	sharp = require('sharp');

/*
	Storing and serving png files
*/

class notStoreImage {
	/*
	options = {
		root - строка - полный путь к директории где находится хранилице,
		uriRoot - строка - префикс пути к для доступа к файлу на прямую (для реверс прокси),
		tmp - строка - полный путь к директории где находится временное хранилице,
		extension - строка - тип файла
		thumbs:{
			small: {
				width: 60,
				height: 70
			},
			middle: {
				max: 700
			},
		}
	};
	*/

	constructor(options) {
		this.options = options;
		return this;
	}

	getFullName(name, thumb, ext) {
		let pathName = store.getPathFromHash(name);
		return path.join(this.options.root, pathName) + (thumb ? ('.' + thumb) : '') + '.' + (ext ? ext : OPT_DEFAULT_EXTENSION);
	}

	getFullNameFromRoot(name, thumb, ext) {
		let pathName = store.getPathFromHash(name);
		return pathName + ((thumb ? ('.' + thumb) : '') + '.' + (ext ? ext : OPT_DEFAULT_EXTENSION));
	}

	resolveFileFullName(name, thumb) {
		let stat, fullname;
		for (let i of OPT_DEFAULT_EXTENSIONS) {
			fullname = this.getFullName(name, thumb, i);
			try {
				stat = fs.lstatSync(fullname);
				if (stat && stat.isFile()) {
					return fullname;
				}
			} catch (e) {
				//console.error(e);
			}
		}
		return false;
	}

	resolveFileExtension(name) {
		for (let i of OPT_DEFAULT_EXTENSIONS) {
			if (name.indexOf(i) === name.length - i.length) {
				return name;
			}
		}
		return '';
	}

	getThumbsNames(name) {
		let names = {};
		if (this.options.thumbs) {
			for (let thumb in this.options.thumbs) {
				names[thumb] = this.getFullNameFromRoot(name, thumb, this.options.extension || OPT_DEFAULT_THUMB_EXTENSION);
			}
		}
		return names;
	}

	makeThumbs(name) {
		if (this.options.thumbs) {
			for (let tName in this.options.thumbs) {
				this.makeThumb(name, tName, this.options.thumbs[tName]);
			}
		}
	}

	makeThumb(name, thumb, profile) {
		let fullName = this.resolveFileFullName(name);
		if (fullName) {
			let image = sharp(fullName),
				thumbFullName = this.getFullName(name, thumb, this.options.extension || OPT_DEFAULT_THUMB_EXTENSION);
			image.resize(profile.width || profile.max, profile.height || profile.max).max().toFile(thumbFullName);
		}
	}

	convertToReadableStream(source) {
		return new Promise(function (resolve, reject) {
			if (typeof source === 'string') {
				if (source.length < OPT_MAX_INPUT_PATH_LENGTH) {
					//guess this is file path, but lets check it on existence
					if (isUrl.isUri(source)) {
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
							reject('string but not file or URL');
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
				reject('not streamable');
			}
		});
	}

	stashFile(file) {
		return new Promise((resolve, reject) => {
			let name = store.createFileName(),
				fullName = path.join(this.options.tmp, name),
				dirName = path.dirname(fullName);
			this.convertToReadableStream(file)
				.then((streamIn) => {
					mkdirp.sync(dirName);
					let streamOut = fs.createWriteStream(fullName)
					streamOut.on('finish', function (err) {
						if (err) {
							//return error
							reject(err);
						} else {
							//return image name in store
							let img = sharp(fullName).metadata(function (err, metadata) {
								if (err) {
									reject(err);
								} else {
									metadata.fullName = fullName;
									resolve(metadata);
								}
							});
						}
					});
					streamIn.pipe(streamOut);
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	/* input file as base64 string */
	/* input file[string, path, buffer, stream] */
	add(file) {
		return new Promise((resolve, reject) => {
			this.stashFile(file)
				.then((metadata) => {
					let name = store.createFileName(),
						pathName = store.getPathFromHash(name),
						fullName = this.getFullName(name, null, metadata.format),
						fullNameFromRoot = this.getFullNameFromRoot(name, null, metadata.format),
						dirName = path.dirname(fullName);
					mkdirp.sync(dirName);
					metadata.path = {
						original: fullNameFromRoot
					};
					fs.rename(metadata.fullName, fullName, (err) => {
						if (err) {
							reject(err);
						} else {
							delete metadata.fullName;
							metadata.name = name;
							metadata.path.thumb = this.getThumbsNames(name);
							resolve(metadata);
							this.makeThumbs(metadata.name);
						}
					})
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	/*
	name, streamOut(response)
	name, thumb, streamOut
	*/
	get() {
		let fullName, streamOut;
		if (arguments.length == 2) {
			fullName = this.resolveFileFullName(arguments[0])
			streamOut = arguments[1];
		} else if (arguments.length == 3) {
			fullName = this.resolveFileFullName(arguments[0], arguments[1] === OPT_ORIGINAL_THUMB ? undefined : arguments[1])
			streamOut = arguments[2];
		}
		if (fullName) {
			fs.lstat(fullName, (err, stat) => {
				if (err) {
					streamOut.end();
				} else {
					if (streamOut.type) {
						streamOut.type(this.resolveFileExtension(fullName));
					}
					fs.createReadStream(fullName).pipe(streamOut);
				}
			});
		} else {
			streamOut.end();
		}
	}

	/*
	meta
	*/
	getURIs(meta) {
		let paths = {
			original: this.getURI(meta.path.original),
			thumb: {}
		};
		if (meta.path.thumb) {
			for (let thumb in meta.path.thumb) {
				paths.thumb[thumb] = this.getURI(meta.path.thumb[thumb]);
			}
		}
		return paths;
	}

	getURI(p) {
		return path.join(this.options.uriRoot || '/', p);
	}

	/*
	name, streamOut(express.io/response)
	name, thumb, streamOut(express.io/response)
	*/
	download() {
		let fullName, streamOut;
		if (arguments.length == 2) {
			fullName = this.resolveFileFullName(arguments[0])
			streamOut = arguments[1];
		} else if (arguments.length == 3) {
			fullName = this.resolveFileFullName(arguments[0], arguments[1])
			streamOut = arguments[2];
		}
		if (fullName) {
			streamOut.sendFile(fullName);
		} else {
			streamOut.end();
		}
	}

	list() {

	}

	update(name, file) {
		return new Promise((resolve, reject) => {
			this.stashFile(file).then((metadata) => {
					if (err) {
						reject(err);
					} else {
						let pathName = store.getPathFromHash(name),
							fullName = this.getFullName(name, null, metadata.format),
							dirName = path.dirname(fullName);
						mkdirp.sync(dirName);
						fs.rename(metadata.fullName, fullName, (err) => {
							if (err) {
								reject(err);
							} else {
								delete metadata.fullName;
								metadata.name = name;
								resolve(metadata);
								this.makeThumbs(metadata.name);
							}
						});
					}
				})
				.catch(e => {
					reject(e)
				});
		});
	}

	delete(name) {
		return new Promise((resolve, reject) => {
			let fullName = this.resolveFileFullName(name);
			if (fullName) {
				fs.unlink(fullName, (e) => {
					e ? reject(e) : resolve(name)
				});
			} else {
				reject();
			}
			this.deleteThumbs(name);
		});

	}

	deleteThumbs(name) {
		let thumbFullName;
		if (this.options.thumbs) {
			for (let tName in this.options.thumbs) {
				thumbFullName = this.resolveFileFullName(name, tName);
				fs.unlink(thumbFullName);
			}
		}
	}

	getSize() {
		return new Promise((resolve, reject) => {
			this.getFolderSize(this.options.root, (err, size) => {
				if (err) {
					reject(err);
				} else {
					resolve(size);
				}
			});
		});
	}

	getFolderSize(path, cb) {
		fs.lstat(path, (err, stats) => {
			if (!err && stats.isDirectory()) {
				var total = stats.size;
				fs.readdir(path, (err, list) => {
					if (err) return cb(err);
					async.forEach(
						list,
						(diritem, callback) => {
							this.getFolderSize(path.join(path, diritem), (err, size) => {
								total += size;
								callback(err);
							});
						},
						(err) => {
							cb(err, total);
						}
					);
				});
			} else {
				cb(err);
			}
		});
	}
}

module.exports = notStoreImage;
