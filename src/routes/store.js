const
	UserActions = [],
	AdminActions = [
		'create',
		'update',
		'listAndCount',
		'delete'
	],
	MODEL_NAME = 'Store',
	MODEL_OPTIONS = {
		MODEL_NAME,
		MODEL_TITLE: 'Хранилище',
	},
	modMeta = require('not-meta');


	exports.getIP = (req) => {
		return req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket.remoteAddress;
	};

exports.before = (req) => {
	this.body.session = req.session.id;
	this.body.userId = req.user._id;
	this.body.userIp = exports.getIP(req);
};

modMeta.extend(modMeta.Route, module.exports, AdminActions, MODEL_OPTIONS, '_');
modMeta.extend(modMeta.Route, module.exports, UserActions, MODEL_OPTIONS);
