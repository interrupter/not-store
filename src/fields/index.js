const Schema = require('mongoose').Schema;

exports.FIELDS = {
	filename: {
		ui:{
			component: 'UITextfield',
			placeholder: 'Название',
			label: 'Название'
		},
		model:{
			type: String,
			searchable: true,
			required: true
		}
	},
	extension: {
		ui:{
			component: 'UITextfield',
			placeholder: 'Тип',
			label: 'Тип'
		},
		model:{
			type: String,
			searchable: true,
			required: true
		}
	},
	bucket: {
		ui:{
			component: 'UITextfield',
			placeholder: 'Бакет',
			label: 'Бакет'
		},
		model:{
			type: String,
			searchable: true,
			required: true
		}
	},
	metadata: {
		model:{
			type: Schema.Types.Mixed,
			required: false
		}
	},
	path: {
		model: {
			type: Schema.Types.Mixed,
			required: false
		}
	},
};
