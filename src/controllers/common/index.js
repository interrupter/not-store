export default {
  isError(e){
    return e instanceof Error;
  },
  DRIVERS:[
    {
      id:     'notStoreYandex',
      title:  'Яндекс.Облако - изображения'
    },{
      id:     'notStoreAWS',
      title:  'Amazon.S3 - изображения'
    },{
      id:     'notStoreImage',
      title:  'Локальное хранение - изображения'
    }
  ]
};
