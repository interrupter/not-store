const EasyYandexS3 = require('easy-yandex-s3');
const notError = require('not-error/src/error.node.cjs');
const notNode = require('not-node');
const notStoreDriver = require('../proto/driver');
const {
	notStoreExceptionAddToStoreError,
	notStoreExceptionDeleteFromStoreError,
	notStoreExceptionListStoreError
} = require('../exceptions');
const {OPT_DEFAULT_ACL} = require('../const');

class notStoreDriverTimeweb extends notStoreDriver{
	/**
	 * 
	 * @param {Object} options object with options for driver
	 * @param {string} options.ACL type of bucket 'private' or 'public'
	 * @param {string} options.id 	bucket access key id
	 * @param {string} options.secret 	bucket secret access key
	 * @param {string} options.bucket 	bucket name
	 * @param {object} options.processors 	processing pipes 
	 * 	{
	 * 		add:	//store action name
	 * 			{
	 * 				pre:[	//list of pre processing pipe
	 * 					['name_of_processor', {options: 1}],		//processor with options
	 * 					'name_of_processor_2'						//processor without options
	 * 					],
	 * 				post:[]	//same story as in pre section
	 * 			}
	 * 	}	 
	 */	
    constructor(options){
        super(options);
        this.#initS3Client();
    }

    getACL() {
		return this.options.ACL || OPT_DEFAULT_ACL;
	}

	#initS3Client() {
		this.#s3 = new EasyYandexS3({
			auth: {
				accessKeyId: this.options.id,
				secretAccessKey: this.options.secret,
			},
			Bucket: this.options.bucket
		});
	}

    async add(file){
        try{
            const tmpFilename = this.stashFile(file);        
            const metadata = {};
            await this.runPreProcessors('add', tmpFilename, metadata);
			//do
			await this.runPostProcessors('add', tmpFilename, metadata);
        }catch(e){
            if(e instanceof notError ){
                notNode.Application.report(e);
            }else{
                notNode.Application.report(new notStoreExceptionAddToStoreError(e));
            }
        }finally{
            if (tmpFilename && await notNode.Common.tryFileAsync(tmpFilename)){
                await this.removeLocalFile(tmpFilename);
            }
        }
    }

    directUpload(file, folder) {
		return this.#s3.Upload({
			path: file,
			save_name: true
		}, folder);
	}

	directUploadMany(filenames, folder) {
		let list = filenames.map(
				(filename) => {
					return {
						path: filename,
						save_name: true
					};
				}
			);
		return this.#s3.Upload(list, folder);		
	}

	directDelete(key){
		return this.#s3.Remove(key);
	}

    async delete(filename) {		
		try{
			const metadata = {};
            await this.runPreProcessors('delete', filename, metadata);
			const result = await this.directDelete(filename);
			await this.runPostProcessors('delete', filename, metadata);			
			return [result, metadata];
		}catch(e){
            if(e instanceof notError ){
                notNode.Application.report(e);
            }else{
                notNode.Application.report(new notStoreExceptionDeleteFromStoreError(filename, e));
            }
        }
	}

    directList(pathInStore){
        if (!pathInStore) {
			pathInStore = this.getPathInStore();
		}
		return this.#s3.GetList(pathInStore);
    }

	async list(pathInStore){
        try{
			const metadata = {};
            await this.runPreProcessors('list', pathInStore, metadata);
			const result = await this.directList(pathInStore);
			await this.runPostProcessors('list', pathInStore, metadata);			
			return [result, metadata];
		}catch(e){
            if(e instanceof notError ){
                notNode.Application.report(e);
            }else{
                notNode.Application.report(new notStoreExceptionListStoreError(pathInStore,e));
            }
        }
    }

    
}


module.exports = notStoreDriverTimeweb;