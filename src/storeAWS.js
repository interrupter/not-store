const OPT_MAX_INPUT_PATH_LENGTH = 255;
const OPT_DEFAULT_THUMB_EXTENSION = 'jpeg';
const OPT_DEFAULT_THUMB_OPTIONS = {
	quality: 90
};
//for Mail.ru Cloud
const OPT_DEFAULT_ENDPOINT = {
	region: 'ru-msk',
	endpoint: 'http://hb.bizmrg.com',
};

const fs = require('fs');
const path = require('path');
const Stream = require('stream');
const http = require('http');
const https = require('https');
const isStream = require('is-stream');
const isUrl = require('valid-url');
const streamifier = require('streamifier');
const AWS = require('aws-sdk');
const UUID = require('uuid');
const sharp = require('sharp');

/*
  Storing and serving png files
*/
class notStoreAWS {
	/*
  options = {
    tmp - строка - полный путь к директории где находится временное хранилице,
    extension - строка - тип файла
		bucket -	название корзины в облаке
		pathInBucket	- путь внутри корзины к папке с файлами
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
		AWS.config.update(options.endpoint || OPT_DEFAULT_ENDPOINT);
		this.s3 = new AWS.S3();
		return this;
	}

	/**
	*	Returns UUID4 name for file
	*	@returns	{string}	UUIDv4 name
	*/
	randomFilename(){
		return UUID.v4();
	}

	/**
	*	Returns filaname for object by uuid, postfix and format
	*	@param	{string}	uuid		unique id of object
	*	@param	{string}	postfix	postfix that will be added at end of uuid after '_'
	*	@param	{string}	format	file format name will be added at the end after '.'
	*	@returns{string}	filename
	*/
	getFilename(uuid, postfix, format){
		return uuid + (postfix?('_'+postfix):'') +(format?( '.'+format):'');
	}

	/**
	*	Returns filaname from root of the bucket for object by uuid, postfix and format
	*	@param	{string}	uuid		unique id of object
	*	@param	{string}	postfix	postfix that will be added at end of uuid after '_'
	*	@param	{string}	format	file format name will be added at the end after '.'
	*	@returns{string}	full filename in bucket
	*/
	getFullFilename(uuid, postfix, format){
		return path.join(this.options.pathInBucket, this.getFilename(uuid, postfix, format));
	}

	/**
	*	converts "anything" to readable stream
	*	@param {String|Buffer|Stream} source	source of data
	*	@returns	{ReadableStream} for data consumption
	**/
	convertToReadableStream(source) {
		return new Promise(function (resolve, reject) {
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
				.then((streamIn) => {
					let streamOut = fs.createWriteStream(tmpName);
					streamOut.on('finish', (err) => {
						if (err) {
							//return error
							reject(err);
						} else {
							//return image name in store
							sharp(tmpName).metadata((err, metadata) => {
								if (err) {
									reject(err);
								} else {
									metadata.tmpName = tmpName;
									metadata.uuid = name;
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

	/**
	*	Removes local file by full filename
	*	@param	{String}	filename	filename with path
	*	@returns{Promise}
	*/
	removeLocalFile(filename){
		return new Promise((resolve, reject)=>{
			try{
				fs.unlink(filename, (err)=>{
					if(err){
						reject(err);
					}else{
						resolve(filename);
					}
				});
			}catch(e){
				reject(e);
			}
		});
	}

	/**
  * Input file as base64 string
  *  @param {String|Path|Buffer|Stream}  file file content in various forms
  *  @returns {Promise}
  **/
	add(file){
		return this.stashFile(file)
			.then(this.uploadOriginal.bind(this))
			.then(this.createThumbs.bind(this))
			.then(async (metadata)=>{
				await this.removeLocalFile(metadata.tmpName);
				return metadata;
			});
	}

	/**
	*	Uploading original file to AWS bucket
	*	@param		{object}		metadata	metadata of sharp for this image with uuid and tmpName
	*	@returns	{Promise}		of metadata
	*/
	uploadOriginal(metadata){
		let key = this.getFullFilename(metadata.uuid, '', metadata.format),
			stream = fs.createReadStream(metadata.tmpName);
		return this.uploadStream(stream, key).then(() => metadata);
	}

	/**
	*	Загружает ReadableStream
	*	@param		{ReadableStream}	stream	поток
	*	@param		{String}					key	название
	*	@returns	{Promise}					Promise of uuid
	*/
	uploadStream(stream, key){
		return new Promise((resolve, reject)=>{
			try{
				this.s3.putObject(
					{
						Body:   stream,
						Bucket: this.options.bucket,
						Key:    key,
					},
					(err) => {
						if (err) {
							reject(err);
						}else{
							resolve(key);
						}
					}
				);
			}catch(e){
				reject(e);
			}
		});
	}

	delete(metadata){
		let deleteQuee = [this.deleteImage(metadata.uuid,'', metadata.format)];
		if (this.options.thumbs) {
			for (let tName in this.options.thumbs) {
				deleteQuee.push[this.deleteImage(metadata.uuid, tName, OPT_DEFAULT_THUMB_EXTENSION)];
			}
		}
		return Promise.all(deleteQuee);
	}

	deleteImage(uuid, postfix, format) {
		return new Promise((resolve, reject) => {
			try{
				this.s3.deleteObject(
					{
						Bucket: this.options.bucket,
						Key: this.getFullFilename(uuid, postfix, format),
					},
					(err) => {
						if (err) {
							reject(err);
						}else{
							resolve(uuid);
						}
					}
				);
			}catch(e){
				reject(e);
			}
		});
	}


	bufferToStream(buffer) {
  	let stream = new Stream.Duplex();
  	stream.push(buffer);
  	stream.push(null);
  	return stream;
	}

	/**
	*	Thumbnails creation routine
	*	@param	{object}	metadata	image metadata extracted by sharp, with tmpName, uuid fields added
	*	@return	{Promise}
	*/
	createThumbs(metadata) {
		try{
			let list = [];
			if (this.options.thumbs) {
				for (let tName in this.options.thumbs) {
					list.push(
						this.createThumb(
							metadata.tmpName,
							metadata.uuid,
							tName,
							this.options.thumbs[tName]
						)
					);
				}
			}
			return Promise.all(list).then(() => metadata);
		}catch(e){
			throw e;
		}
	}

	/**
	*	Thumbnail creation routine
	*	@param		{string}	filename	source file name
	*	@param		{string}	uuid			uuid of image
	*	@param		{string}	thumb			thumb size code name e.g. small, middle etc
	*	@param		{object}	profile		info about sizes (width, height, max)
	*	@returns	{Promise}
	*/
	createThumb(filename, uuid, thumb, profile){
		return this.resizeImage(filename, profile, thumb)
			.then((thumbFilename)=>{
				let key = this.getFullFilename(uuid, thumb, this.getThumbFormat());
				return this.uploadStream(fs.createReadStream(thumbFilename), key).then(()=>{
					return thumbFilename;
				});
			})
			.then(this.removeLocalFile.bind(this));
	}


	/**
	*	@returns	{String}	file format for thumbnails
	*/
	getThumbFormat(){
		return this.options.extension || OPT_DEFAULT_THUMB_EXTENSION;
	}

	/**
	*	@returns	{Object}	options for encoding
	*/
	getThumbFormatOptions(){
		return this.options.options || OPT_DEFAULT_THUMB_OPTIONS;
	}

	/**
	*	Reads file converts it to required dimensions and format, returns Promise
	*	of readable stream
	*	@param 	{String}	filename	file name
	*	@param	{Object}	profile	information about required manipulations
	*	@returns{Promise}	ReadableStream
	*/
	resizeImage(filename, profile, thumb) {
		return new Promise((resolve, reject)=>{
			try {
				let image = sharp(filename),
					thumbFilename = filename + '_' + thumb;
				image.resize(profile.width || profile.max, profile.height || profile.max);
				image.toFormat(this.getThumbFormat(), this.getThumbFormatOptions());
				image.toFile(thumbFilename)
					.then((info)=>{
						resolve(thumbFilename);
					});
			}catch (e) {
				reject(e);
			}
		});
	}

	getURIs(meta) {
		let paths = {
			original: this.getURI(this.getFullFilename(meta.uuid, null, meta.format)),
			thumb: {}
		};
		if (this.options.thumbs) {
			for (let thumb in this.options.thumbs) {
				paths.thumb[thumb] = this.getURI(this.getFullFilename(meta.uuid, thumb, this.getThumbFormat()));
			}
		}
		return paths;
	}

	getURI(filename) {
		return path.join(this.options.host, filename);
	}
}

module.exports = notStoreAWS;
