const OPT_DEFAULT_EXTENSION = 'png',
	OPT_DEFAULT_THUMB_EXTENSION = 'jpeg',
	OPT_DEFAULT_THUMB_QUALITY = 0.8,
	OPT_MAX_INPUT_PATH_LENGTH = 256,
	OPT_DEFAULT_EXTENSIONS = ['jpeg', 'png', 'webp', 'gif', 'svg', 'tiff'];

const fs = require('fs'),
	path = require('path'),
	mkdirp = require('mkdirp'),
	store = require('./store'),
	isStream = require('is-stream'),
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
		return path.join(this.options.root, pathName) + (thumb ? ('.' + thumb) : '')+'.'+(ext?ext:OPT_DEFAULT_EXTENSION);
	}

	resolveFileFullName(name, thumb){
		let stat, fullname;
		for(let i of OPT_DEFAULT_EXTENSIONS){
			fullname = this.getFullName(name, thumb, i);
			stat = fs.lstatSync(fullname);
			if (stat.isFile()){
				return fullname;
			}
		}
		return false;
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
		if (fullName){
			let image = sharp(fullName),
				thumbFullName = this.getFullName(name, thumb, OPT_DEFAULT_THUMB_EXTENSION);
			image.resize(profile.width || profile.max, profile.height || profile.max).max().toFile(thumbFullName);
		}
	}

	convertToReadableStream(source) {
		if (typeof source === 'string') {
			if (source.length < OPT_MAX_INPUT_PATH_LENGTH) {
				//guess this is file path, but lets check it on existence
				let stat = fs.lstatSync(source);
				if (stat.isFile()) {
					return fs.createReadStream(source);
				}
			} else {
				//file as string
				return streamifier.createReadStream(source);
			}
		} else if (source instanceof Buffer) {
			//file as buffer
			return streamifier.createReadStream(source);
		} else if (isStream(source)) {
			return source;
		} else {
			return null;
		}
	}

	stashFile(file, next){
		let name = store.createFileName(),
			fullName = path.join(this.options.tmp, name),
			streamIn = this.convertToReadableStream(file),
			dirName = path.dirname(fullName);
		mkdirp.sync(dirName);
		let streamOut = fs.createWriteStream(fullName)
		streamOut.on('finish', function(err) {
			if (err) {
				//return error
				if (next) {
					next(err, null);
				}
			} else {
				//return image name in store
				let img = sharp(fullName).metadata(function(err, metadata){
					if (next) {
						if (err){
							next(err);
						}else{
							metadata.fullName = fullName;
							next(err, metadata);
						}
					}
				});
			}
		});
		streamIn.pipe(streamOut);
	}

	/* input file as base64 string */
	/* input file[string, path, buffer, stream] */
	add(file, next) {
		this.stashFile(file, function(err, metadata){
			if (err){
				next(err);
			}else{
				let name = store.createFileName(),
					pathName = store.getPathFromHash(name),
					fullName = this.getFullName(name, null, metadata.format),
					dirName = path.dirname(fullName);
				mkdirp.sync(dirName);
				fs.rename(metadata.fullName, fullName, function(err){
					if (err) {
						next(err, null);
					}else{
						delete metadata.fullName;
						metadata.name = name;
						next(null, metadata);
						this.makeThumbs(metadata.name);
					}
				}.bind(this));
			}
		}.bind(this));
	}

	/*
	name, streamOut
	name, thumb, streamOut
	*/
	get() {
		let fullName, streamOut;
		if (arguments.length == 2) {
			fullName = this.resolveFileFullName(arguments[0])
			streamOut = arguments[1];
		} else if (arguments.length == 3) {
			fullName = this.resolveFileFullName(arguments[0], arguments[1])
			streamOut = arguments[2];
		}
		if (fullName) {
			fs.lstat(fullName, function(err, stat) {
				if (err) {
					streamOut.end();
				} else {
					fs.createReadStream(fullName).pipe(streamOut);
				}
			});
		}
	}

	list() {

	}

	update(name, file, next) {
		this.stashFile(file, function(err, metadata){
			if (err){
				next(err);
			}else{
				let pathName = store.getPathFromHash(name),
					fullName = this.getFullName(name, null, metadata.format),
					dirName = path.dirname(fullName);
				mkdirp.sync(dirName);
				fs.rename(metadata.fullName, fullName, function(err){
					if (err) {
						next(err, null);
					}else{
						delete metadata.fullName;
						metadata.name = name;
						next(null, metadata);
						this.makeThumbs(metadata.name);
					}
				}.bind(this));
			}
		}.bind(this));
	}

	delete(name, callback) {
		let fullName = this.resolveFileFullName(name);
		if (fullName){
			fs.unlink(fullName, callback);
		}else{
			callback();
		}
		this.deleteThumbs(name);
	}

	deleteThumbs(name){
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
