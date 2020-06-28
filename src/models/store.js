const Schema = require('mongoose').Schema;

exports.thisModelName = 'Store';
exports.enrich = {
	versioning:  true,
	increment:   true,
	validators:  true
};

exports.schemaOptions = {
	schemaOptions: {
		timestamps: true
	}
};

exports.thisSchema = {
	name: {
		type: String,
		unique: true,
		searchable: true,
		required: true
	},
	driver: {
		type: String,
		searchable: true,
		required: true
	},
	options: {
		type: Schema.Types.Mixed,
		required: true
	},
	active: {
		type: Boolean,
		required: true,
		default: true
	},
	userIp: {
		type: String,
		searchable: true,
		required: true
	},
	session: {
		type: String,
		searchable: true,
		required: true
	}
};
