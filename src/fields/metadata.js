const Schema = require('mongoose').Schema;

module.exports = {
  ui:{
    component: 'UIJSON',
    placeholder: 'Metadata',
    label: 'Metadata'
  },
  model:{
    type: Schema.Types.Mixed,
    required: false
  }
};
