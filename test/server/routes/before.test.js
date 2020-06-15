const uuidv4 = require('uuid').v4;
const notApp = require('not-node').Application;
const FILE_COUNT = 10;

module.exports = async (req, res)=>{
  try{
    //creating few records for files
    let File = notApp.getModel('not-store//File');
    for(let t = 0; t < FILE_COUNT; t++){
      await File.add({
        ip: '127.0.0.1',
        size: t,
        session: 'test',
        userIp: '127.0.0.1',
        bucket: 'test',
        name: 'test_'+t,
        extension: 'jpg',
        uuid: uuidv4(),
      });
    }
    res.status(200).json({});
  }catch(e){
    notApp.report(e);
    res.status(500).json();
  }
};
