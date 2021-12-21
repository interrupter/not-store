const Schema = require('mongoose').Schema;

module.exports = {
  ui:{
    component: 'UIJSON',
    placeholder: 'Пути',
    label: 'Пути'
  },
  model: {
    type: Schema.Types.Mixed,
    required: false
  }
};
