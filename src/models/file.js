const store = require('../../').notStore;
const initFields = require('not-node').Fields.initFields;
const MODEL_NAME = 'File';

const FIELDS = [
	'uuid',
	['name', {}, 'filename'],
	'extension',
	'bucket',
	'metadata',
	'path',
	['userIp', {}, 'ip'],
	'userId',
	'session',
	'size',
	'width',
	'height'
];

exports.thisModelName = MODEL_NAME;

exports.enrich = {
	versioning: true,
	increment: true,
	validators: true
};

exports.thisSchema = initFields(FIELDS, 'model');

exports.schemaOptions = {
	schemaOptions: {
		timestamps: true
	}
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
