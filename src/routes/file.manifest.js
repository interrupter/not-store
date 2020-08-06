const defaultManifest = require('../standalone/file.manifest.js');
const modelSchema = require('../models/file.js').thisSchema;
const initFromSchema = require('not-node').Fields.fromSchema;

const FIELDS = initFromSchema(modelSchema, [
	'_id',
	['name', {}, 'filename'],
	['fileID', {}, 'ID'],
	['userIp', {}, 'ip'],
]);

defaultManifest.fields = FIELDS;
module.exports = defaultManifest;
