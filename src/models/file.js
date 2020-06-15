const Schema = require('mongoose').Schema,
	store = require('../../').notStore;

exports.thisModelName = 'File';
exports.enrich = {
	versioning: true,
	increment: true,
	validators: true
};

exports.schemaOptions = {
	schemaOptions: {
		timestamps: true
	}
};

exports.thisSchema = {
	uuid: {
		type: String,
		searchable: true,
		required: true
	},
	name: {
		type: String,
		searchable: true,
		required: true
	},
	extension: {
		type: String,
		searchable: true,
		required: true
	},
	bucket: {
		type: String,
		searchable: true,
		required: true
	},
	metadata: {
		type: Schema.Types.Mixed,
		required: false
	},
	path: {
		type: Schema.Types.Mixed,
		required: false
	},
	userIp: {
		type: String,
		searchable: true,
		required: true
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: false
	},
	session: {
		type: String,
		searchable: true,
		required: true
	},
	size: {
		type: Number,
		default: 0,
		required: true
	},
	width: {
		type: Number,
		required: false
	},
	height: {
		type: Number,
		required: false
	},
};

exports.thisStatics = {
	async getOneByIDAndRemove(ID, sessionId) {
		let query = {};
		query[this.schema.statics.__incField] = parseInt(ID);
		query['__latest'] = true;
		if (sessionId) {
			query['session'] = sessionId;
		}
		let rec = await this.deleteOne(query);
		if(rec){
			await store.delete(rec.bucket, rec.metadata);
		}
		return rec;
	}
};

exports.thisMethods = {

};
