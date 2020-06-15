const fs = require('fs');
const notStoreYandex = require('../../src/common/storeYandex.js');
const expect = require('chai').expect;
const path = require('path');
const process = require('process');
const request = require('request');
const superagent = require('superagent');

const toRemove = [];

const OPTS = {
  sharp: {
    sizes: {
      "micro": 100,
      "small": 480,
      "middle": 1080,
      "big": 2160
    },
    resize: {
      fit: 'outside'
    }
  },
  subPath: true,
  ACL: 'public',
  tmp: path.resolve(__dirname, '../tmp'),
  s3: {
    id: process.env.modules__store__common__s3__id,
    key: process.env.modules__store__common__s3__key,
    bucket: process.env.modules__store__common__s3__bucket,
    path: 'test.not'
  }
};

const OPTS_2 = {
  sharp: {
    sizes: {
      "micro": 100,
      "small": 480,
      "middle": 1080,
      "big": 2160
    },
    resize: {
      fit: 'outside'
    }
  },
  subPath: true,
  tmp: path.resolve(__dirname, '../tmp'),
  s3: {
    id: process.env.modules__store__common__s3__id,
    key: process.env.modules__store__common__s3__key,
    bucket: process.env.modules__store__common__s3__bucket
  }
};

const OPTS_3 = {
  sharp: {
    sizes: {
      "micro": 100,
      "small": 480,
      "middle": 1080,
      "big": 2160
    },
    resize: {
      fit: 'outside'
    }
  },
  subPath: false,
  tmp: path.resolve(__dirname, '../tmp'),
  saveOriginal: true,
  s3: {
    id: process.env.modules__store__common__s3__id,
    key: process.env.modules__store__common__s3__key,
    bucket: process.env.modules__store__common__s3__bucket,
    path: 'test.not'
  }
};

const files = {
  boats: path.resolve(__dirname, '../browser/files/boats.jpg'),
  "bone.tomahawk": path.resolve(__dirname, '../browser/files/bone.tomahawk.jpg'),
  "doge": path.resolve(__dirname, '../browser/files/doge.png')
};

describe('Store in Yandex Object cloud', () => {
  describe('Block', () => {
    it('creating bucket', () => {
      let bucket = new notStoreYandex(OPTS);
      expect(bucket).to.be.ok;
    });

    it('upload file by full path and filename', function (done){
      this.timeout(10000);
      let bucket = new notStoreYandex(OPTS_3);
      bucket.add(files['boats'])
        .then((result) => {
          toRemove.push(result);
          done();
        })
        .catch(done);
    });

    it('getACL', () => {
      let bucket = new notStoreYandex(OPTS);
      expect(bucket.getACL()).to.be.equal('public');
      let bucket_2 = new notStoreYandex(OPTS_2);
      expect(bucket_2.getACL()).to.be.equal('private');
    });

    it('getFilename', () => {
      let bucket = new notStoreYandex(OPTS);
      expect(bucket.getFilename('first', 'post', 'format')).to.be.equal('first_post.format');
      expect(bucket.getFilename('first', false, 'format')).to.be.equal('first.format');
      expect(bucket.getFilename('first', 'post', false)).to.be.equal('first_post');
    });

    it('getPathInBucket', () => {
      let bucket = new notStoreYandex(OPTS);
      expect(bucket.getPathInBucket('first')).to.be.equal('test.not/fi');
      let bucket2 = new notStoreYandex(OPTS_2);
      expect(bucket2.getPathInBucket('first')).to.be.equal('fi');
      let bucket3 = new notStoreYandex(OPTS_3);
      expect(bucket3.getPathInBucket('first')).to.be.equal('test.not');
    });

    it('getFullFilename', () => {
      let bucket = new notStoreYandex(OPTS);
      const result1 = 'test.not/uu/uuid_postfix.format';
      const result2 = 'test.not/uu/uuid_postfix';
      expect(bucket.getFullFilename('uuid', 'postfix', 'format')).to.be.equal(result1);
      expect(bucket.getFullFilename('uuid', 'postfix')).to.be.equal(result2);
    });


    it('getSizesPaths', () => {
      let bucket = new notStoreYandex(OPTS);
      let dir = path.parse(files.boats).dir;
      let sizes1 = {
        'micro': {
          size: 100,
          file: path.join(dir, 'boats-micro.jpg')
        },
        'small': {
          size: 480,
          file: path.join(dir, 'boats-small.jpg')
        },
        'middle': {
          size: 1080,
          file: path.join(dir, 'boats-middle.jpg')
        },
        'big': {
          size: 2160,
          file: path.join(dir, 'boats-big.jpg')
        },
      };
      expect(bucket.getSizesPaths(files.boats, bucket.options.sharp.sizes)).to.be.deep.equal(sizes1);
      let sizes2 = {
        'micro': {
          size: 100,
          file: path.join(dir, 'boats-micro.png')
        },
        'small': {
          size: 480,
          file: path.join(dir, 'boats-small.png')
        },
        'middle': {
          size: 1080,
          file: path.join(dir, 'boats-middle.png')
        },
        'big': {
          size: 2160,
          file: path.join(dir, 'boats-big.png')
        },
      };
      expect(bucket.getSizesPaths(files.boats, bucket.options.sharp.sizes, 'png')).to.be.deep.equal(sizes2);
    });

    it('getSizesFilenames', () => {
      let bucket = new notStoreYandex(OPTS);
      expect(bucket.getSizesFilenames('boats', bucket.options.sharp.sizes, 'png')).to.be.deep.equal({
        'micro': 'boats-micro.png',
        'small': 'boats-small.png',
        'middle': 'boats-middle.png',
        'big': 'boats-big.png',
        'original': 'boats.png',
      });
    });

    it('getMetadata', (done) => {
      let bucket = new notStoreYandex(OPTS);
      Promise.all([bucket.getMetadata(files.boats), bucket.getMetadata(files["bone.tomahawk"]), bucket.getMetadata(files["doge"])])
        .then((metadatas) => {
          let formats = metadatas.map(meta => meta.format);
          expect(formats).to.be.deep.equal(['jpeg', 'jpeg', 'png']);
          done();
        })
        .catch(done);
    });

    it('getMetadata - error, file is not exist', (done) => {
      let bucket = new notStoreYandex(OPTS);
      bucket.getMetadata(files.boats + ' failed').then(() => {
          done(new Error('No throwed error. File is not exist'))
        })
        .catch(() => done());
    });

    it('getMetadata - error, filename is undefined', (done) => {
      let bucket = new notStoreYandex(OPTS);
      bucket.getMetadata().then(() => {
          done(new Error('No throwed error. File is not exist'))
        })
        .catch(() => done());
    });

    it('list', (done) => {
      let bucket = new notStoreYandex(OPTS_3);
      bucket.list()
        .then((list) => {
          expect(list).to.be.instanceof(Object);
          expect(list).to.include.all.keys(['KeyCount', 'Contents', 'Name'])
          expect(list.Name).to.be.equal(OPTS_3.s3.bucket);
          expect(list.Contents).to.be.instanceof(Array);
          expect(list.Contents).to.be.have.length.above(0);
          expect(list.Contents[0]).to.include.all.keys(['Key', 'LastModified', 'ETag', 'Size', 'StorageClass']);
          done();
        })
        .catch(done);
    });

    it('remove', (done) => {
      let bucket = new notStoreYandex(OPTS_3);
      expect(toRemove).to.have.length.above(0);
      bucket.delete(toRemove[0].metadata.uuid)
        .then((result) => {
          console.log(result);
          done();
        })
        .catch(done);
    });


  });


  describe('Live API with test server', () => {

    it('manifest is ok', (done) => {
      superagent.get('http://localhost:7357/api/manifest')
        .set('accept', 'json')
        .then((res) => {
          expect(res.status).to.be.equal(200);
          let json;
          try {
            json = JSON.parse(res.text);
            expect(json).to.include.all.keys(['file', 'error']);
          } catch (e) {
            done(e);
          }
          done();
        }).catch(done);
    });

    it('upload file',function (done) {
      this.timeout(10000);
      const formData = {
        'file': [fs.createReadStream(files.boats)],
      };
      request.put({
        url:'http://localhost:7357/api/file',
        formData: formData,
        headers: {
          'X-FILENAME': 'boats.jpg'
        }
      },
        (err, res, body) => {
          if (err) {
            done(err);
          }else{
            expect(res.statusCode).to.be.equal(200);
            let json;
            try {
              json = JSON.parse(body);
              expect(json.status).to.be.equal('ok');
              expect(json.result).to.be.instanceof(Array);
              expect(json.result[0]).to.be.instanceof(Object);
              expect(json.result[0].status).to.be.equal('fulfilled');
              expect(json.result[0].value).to.include.all.keys(['uuid', 'name', 'path', 'metadata']);
              done();
            } catch (e) {
              done(e);
            }
          }
        });
    });

    it('upload many files', function(done){
      this.timeout(10000);
      const formData = {
        'file': [
          fs.createReadStream(files.boats),
          fs.createReadStream(files.doge),
          fs.createReadStream(files["bone.tomahawk"])
        ],
      };
      request.put({
        url:'http://localhost:7357/api/file',
        formData: formData,
        headers: {}
      },
        (err, res, body) => {
          if (err) {
            done(err);
          }else{
            expect(res.statusCode).to.be.equal(200);
            let json;
            try {
              json = JSON.parse(body);
              expect(json.status).to.be.equal('ok');
              expect(json.result).to.be.instanceof(Array);
              expect(json.result[0]).to.be.instanceof(Object);
              expect(json.result[0].status).to.be.equal('fulfilled');
              expect(json.result[0].value).to.include.all.keys(['uuid', 'name', 'path', 'metadata']);
              done();
            } catch (e) {
              done(e);
            }
          }
        });
    });
  });
});
