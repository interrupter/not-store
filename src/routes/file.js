const store = require('../../').notStore,
	App = require('not-node').Application,
	Auth = require('not-node').Auth,
	query = require('not-filter'),
	mongoose = require('mongoose'),
	routine = require('not-node').Routine,
	notError = require('not-error').notError,
	config = require('not-config').readerForModule('store');


const METADATA_FORBIDDEN_FIELDS = ['exif', 'xmp', 'icc', 'iptc'];

exports.before = (req) => {
	console.log(req.session);
};

exports._list = function(req, res) {
	let File = App.getModel('File'),
		thisSchema = App.getModelSchema('File'),
		{
			size,
			skip
		} = query.pager.process(req) || {
			size: 200,
			skip: 0,
			page: 0
		},
		filter = query.filter.process(req, thisSchema),
		sorter = query.sorter.process(req, thisSchema);
	App.logger.info('this is _list filter', req.query, filter);
	File.listAndPopulate(skip, size, sorter, filter, [])
		.then((items) => {
			res.status(200).json(items);
		})
		.catch((err) => {
			App.report(new notError('store.list error, admin level', {}, err));
			res.status(500).json({});
		});
};

exports.list = function(req, res) {
	let File = App.getModel('File'),
		thisSchema = App.getModelSchema('File'),
		{
			size,
			skip
		} = query.pager.process(req) || {
			size: 200,
			skip: 0,
			page: 0
		},
		filter = query.filter.process(req, thisSchema),
		sorter = query.sorter.process(req, thisSchema);
	if (!filter) {
		filter = {};
	}
	filter = query.filter.modifyRules(filter, {
		session: req.session.id
	});
	console.log({
		skip,
		size,
		sorter,
		filter
	});
	File.listAndPopulate(skip, size, sorter, filter, [])
		.then((items) => {
			console.log('files', items);
			res.status(200).json(items);
		})
		.catch((err) => {
			App.report(new notError('store.list error, user level', {}, err));
			res.status(500).json({});
		});
};

function clearMetadata(metadata) {
	METADATA_FORBIDDEN_FIELDS.forEach((fieldName) => {
		if (Object.prototype.hasOwnProperty.call(metadata, fieldName)) {
			delete metadata[fieldName];
		}
	});
}

function uploadFile(req, bucket, file, info) {
	return store.add(bucket, file)
		.then(async (data) => {
			let File = App.getModel('File');
			let session = req.session ? req.session.id : undefined;
			//if admin set session in query, override his own for this request
			if (Auth.ifAdmin(req)) {
				if (req.query.session) {
					session = req.query.session;
				}
			}
			clearMetadata(data.metadata);
			App.logger.debug('store.add.then', bucket, req.get('X-FILENAME'), data);
			let fileData = {
				uuid: data.metadata.uuid,
				bucket: bucket,
				name: info.name || data.metadata.name,
				extension: data.metadata.format || info.mimetype,
				metadata: data.metadata,
				path: data.store,
				size: 0,
				session: session,
				width: data.metadata.width,
				height: data.metadata.height,
				userIp: req.connection.remoteAddress,
				userId: req.session && req.session.user && (mongoose.Types.ObjectId.isValid(req.session.user)) ? req.session.user : undefined
			};
			App.logger.debug(fileData);
			return routine.add(File, fileData);
		});
}

exports.uploadFile = uploadFile;

let createNew = function(bucket = 'client', req, res) {
	App.logger.debug('file.createNew');
	App.logger.debug(req.files);
	let session = req.session ? req.session.id : undefined;
	//if admin set session in query, override his own for this request
	if (Auth.ifAdmin(req)) {
		if (req.query.session) {
			session = req.query.session;
		}
	}
	if (!session) {
		App.report(
			new notError('User session is undefined', {
				userIp: req.connection.remoteAddress
			})
		);
		res.status(500).json({
			'status': 'error'
		});
	}
	if (bucket && Object.keys(config.get('buckets')).indexOf(bucket) > -1) {
		let uploads = [];
		let slimFiles = {};
		if (req.files && Object.keys(req.files).length > 0) {
			for (let t of Object.keys(req.files)) {
				let fileField = req.files[t];
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
						uploads.push(uploadFile(req, bucket, oneFileFromField.data, slimInfo));
					});
				} else {
					let slimInfo = {
						name: fileField.name,
						size: fileField.size,
						format: fileField.format
					};
					slimFiles[t] = slimInfo;
					uploads.push(uploadFile(req, bucket, fileField.data, slimInfo));
				}
			}
		}
		Promise.allSettled(uploads)
			.then((results) => {
				let noErrors = true;
				results.forEach((item) => {
					if (item.status === 'rejected') {
						noErrors = false;
						App.logger.debug(item);
					}
				});
				App.logger.debug('data saved to db ' + (noErrors ? 'without' : 'with') + ' errors');
				App.logger.debug('store.add.then.return/redirect');
				if (noErrors) {
					res.status(200).json({
						'status': 'ok',
						'result': results
					});
				} else {
					App.report(new notError('Uploads not saved', {
						results
					}));
					res.status(500).json({
						'status': 'error',
						'result': results
					});
				}
			})
			.catch((err) => {
				App.report(new notError('cant write fileData to db', {
					uploads
				}, err));
				res.status(500).json({
					'status': 'error'
				});
			});
	} else {
		App.report(new notError('store.add error, bucket is not exist', {
			bucket
		}));
		res.status(500).json({
			'status': 'error'
		});
	}
};


exports.create = (req, res, next) => {
	createNew('client', req, res, next);
};

exports._create = (req, res, next) => {
	createNew(req.params.bucket ? req.params.bucket : 'server', req, res, next);
};

exports._delete = function(req, res) {
	var id = parseInt(req.params.fileID);
	let File = App.getModel('File');
	File.getOneByIDAndRemove(id, undefined)
		.then((rec) => {
			res.status(200).json({
				status: 'ok',
				result: rec
			});
		})
		.catch((err) => {
			App.report(new notError('delete error, admin level', {}, err));
			res.status(500).json({
				status: 'error',
				message: 'delete file error'
			});
		});
};

exports.delete = function(req, res) {
	let id = parseInt(req.params.fileID);
	if (typeof req.session.id !== undefined) {
		let File = App.getModel('File');
		File.getOneByIDAndRemove(id, req.session.id)
			.then((rec) => {
				res.status(200).json({
					status: 'ok',
					result: rec
				});
			})
			.catch((err) => {
				App.report(new notError('delete error, user level', {
					fileID: id,
					sid: req.session.id
				}, err));
				res.status(500).json({
					error: 'delete file error'
				});
			});
	} else {
		App.report(new notError('delete error, user level; no user session id', {
			fileID: id,
			sid: req.session.id
		}));
		res.status(500).json({
			status: 'error',
			message: 'no user session data'
		});
	}
};
