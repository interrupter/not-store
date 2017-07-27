const OPT_DEFAULT_EXTENSION = 'png',
	OPT_DEFAULT_THUMB_EXTENSION = 'jpeg',
	OPT_DEFAULT_THUMB_QUALITY = 0.8,
	OPT_ORIGINAL_THUMB = 'original',
	OPT_MAX_INPUT_PATH_LENGTH = 256,
	OPT_DEFAULT_EXTENSIONS = ['jpeg', 'png', 'webp', 'gif', 'svg', 'tiff'];

const fs = require('fs'),
	path = require('path'),
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
						console.log('uri');
						if (isUrl.isHttpsUri(source)) {
							console.log('https');
							https.get(source, resolve);
						} else {
							if (isUrl.isHttpUri(source)) {
								console.log('http');
								http.get(source, resolve);
							}
						}
					} else {
						let stat = fs.lstatSync(source);
						if (stat.isFile()) {
							console.log('file');
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
		console.log('stash');
		return new Promise((resolve, reject) => {
			let name = store.createFileName(),
				fullName = path.join(this.options.tmp, name),
				dirName = path.dirname(fullName);
			this.convertToReadableStream(file)
				.then((streamIn) => {
					console.log('stream in successfull');
					console.log(dirName);
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
			streamOut.close();
		}
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
}

module.exports = notStoreImage;
