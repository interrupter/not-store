const notNode = require('not-node');
const Log = require('not-log')(module, 'logics');
const config = require('not-config').readerForModule('store');

const store = require('../../').notStore;
const mongoose = require('mongoose');
const {notError} = require('not-error');

const NAME = 'File';
exports.thisLogicName = NAME;

const METADATA_FORBIDDEN_FIELDS = ['exif', 'xmp', 'icc', 'iptc'];

function clearMetadata(metadata) {
	METADATA_FORBIDDEN_FIELDS.forEach((fieldName) => {
		if (Object.prototype.hasOwnProperty.call(metadata, fieldName)) {
			delete metadata[fieldName];
		}
	});
}

function uploadFile(bucket, file, info, owner) {
	const App = notNode.Application;
	return store.add(bucket, file)
		.then(async (data) => {
			let File = App.getModel('File');
			clearMetadata(data.metadata);
			let fileName = info.name || data.metadata.name;
			App.logger.debug('store.add.then', bucket, fileName, data);
			let fileData = {
				uuid:       data.metadata.uuid,
				bucket:     bucket,
				name:       fileName,
				extension:   data.metadata.format || info.mimetype,
				metadata:   data.metadata,
				path:       data.store,
				size:       0,
				width:       data.metadata.width,
				height:     data.metadata.height,
				session:     owner.session,
				userIp:     owner.ip,
				userId:     owner.id,
			};
			App.logger.debug(fileData);
			return File.add(fileData);
		});
}


function createUploads(files, bucket, owner){
	let uploads = [];
	let slimFiles = {};
	if (files && Object.keys(files).length > 0) {
		for (let t of Object.keys(files)) {
			let fileField = files[t];
			if (Array.isArray(fileField)) {
				slimFiles[t] = [];
				Object.keys(fileField).forEach((fileFieldKey) => {
					let oneFileFromField = fileField[fileFieldKey];
					let slimInfo = {
						name: oneFileFromField.name,
						size: oneFileFromField.size,
						format: oneFileFromField.format
					};
					slimFiles[t].push(slimInfo);
					uploads.push(uploadFile(bucket, oneFileFromField.data, slimInfo, owner));
				});
			} else {
				let slimInfo = {
					name: fileField.name,
					size: fileField.size,
					format: fileField.format
				};
				slimFiles[t] = slimInfo;
				uploads.push(uploadFile(bucket, fileField.data, slimInfo, owner));
			}
		}
	}
	return uploads;
}

class File {

	static async upload({
		bucket = 'client',
		sessionId,
		userIp,
		ownerId,
		files,
		/*  admin = false,
			ownerModel = 'User'*/
	}) {
		const App = notNode.Application;
		Log.debug('file.createNew');
		Log.debug(files);
		if (!sessionId) {
			App.report(new notError('User session is undefined', {userIp}));
			return {status: 'error'};
		}
		if (bucket && Object.keys(config.get('buckets')).indexOf(bucket) > -1) {
			let uploads = createUploads(files, bucket, {
				session:   sessionId,
				ip:       userIp,
				id:       ownerId,
			});
			if(uploads.length){
				let results = await Promise.allSettled(uploads);
				let errors = results.some(item => item.status === 'rejected');
				Log.debug('data saved to db ' + (errors ? 'with' : 'without') + ' errors');
				Log.debug('store.add.then.return/redirect');
				if (errors) {
					return {status: 'ok',result: results};
				} else {
					App.report(new notError('Uploads not saved', {results}));
					return {status: 'error',result: results};
				}
			}else{
				return {status: 'error'};
			}
		} else {
			App.report(new notError('store.add error, bucket is not exist', {bucket}));
			return {status: 'error'};
		}
	}


	static async list({size, skip, filter, sorter}){
		const App = notNode.Application;
		try{
			let File = App.getModel('File');
			let result = await File.listAndPopulate(skip, size, sorter, filter, []);
			return {
				status: 'ok',
				result
			};
		}catch(e){
			App.report(new notError('store.list error', {}, e));
			return {status: 'error'};
		}
	}

	static async delete({fileId, sessionId = undefined, admin = false}) {
		try {
			if (!mongoose.Types.ObjectId.isValid(fileId)) {
				throw new notError('delete error; fileId is not ObjectId', {
					fileId,
					sid: sessionId,
					admin
				});
			} else {
				const App = notNode.Application;
				let File = App.getModel('File');

				if (admin) {
					let result = File.getOneByIdAndRemove(fileId, undefined);
					if(result){
						return { status: 'ok', result};
					}else{
						return {status: 'failed'};
					}
				} else if (typeof sessionId !== undefined && sessionId !== null && sessionId && sessionId.length > 10) {
					let result = File.getOneByIdAndRemove(fileId, sessionId);
					if(result){
						return { status: 'ok' };
					}else{
						return { status: 'failed' };
					}
				} else {
					throw new notError('delete error; no user session id', {
						fileId,
						sid: sessionId,
						admin
					});
				}
			}
		} catch (e) {
			notNode.Application.logger.error(e);
			notNode.Application.report(e);
			return {
				status: 'error'
			};
		}
	}

}

exports[NAME] = File;
