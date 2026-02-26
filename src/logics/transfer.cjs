// @ts-check
const MODEL_NAME = "Transfer";
const { MODULE_NAME } = require("../const.cjs");
const notNode = require("not-node");
const notStore = require("../store.cjs");
const pathUtil = require('path');
const getApp = require('not-node/src/getApp');

const {
    Log,
    LogAction,
    config,
    getLogic,
    getModel,
    getModelSchema,
    getModelUser,
    phrase,
    say,
} = notNode.Bootstrap.notBootstrapLogic({
    MODEL_NAME,
    MODULE_NAME,
    target: module,
});

const StoreGenericLogic = notNode.Generic.GenericLogic({
    Log,
    LogAction,
    MODEL_NAME,
    MODULE_NAME,
    config,
    getLogic,
    getModel,
    getModelSchema,
    getModelUser,
    phrase,
    say,
});

module.exports.thisLogicName = MODEL_NAME;

class TransferLogic extends StoreGenericLogic {
    static isFileField(field){
        return ['File'].includes(field.ref);
    }

    static getSchemaFilesFields(modSchema){
        return Object.keys(modSchema).filter((fieldName)=> this.isFileField(modSchema[fieldName]));
    }

    static schemaHasFileFields(modSchema){
        return this.getSchemaFilesFields(modSchema).length;
    }

    static isNotStoreFileModel(name){
        return name !== `${MODULE_NAME}//File`;
    }
    
    static async listAllModels(){
        const list = getApp().getFullModelsNames();
        return list.filter((modelName)=>{            
            return this.schemaHasFileFields(getApp().getModelSchema(modelName)) && this.isNotStoreFileModel(modelName);
        }).map((modelName)=> {
            return {
                id:modelName,
                title:modelName
            };
        });
    }

    static async reUploadChild(url, file, targetStoreBucket){
        let name_tmp;
            try{
                const stashResult = await targetStoreBucket.stashFile(url);
                name_tmp = stashResult.name_tmp;
                file.reUploadResult = await targetStoreBucket.directUpload(name_tmp, pathUtil.parse(file.path).base);
                await getApp().getModel('not-store//File').findOneAndUpdate(
                    {
                        _id: file._id.toString(),                        
                    }, 
                    {
                        cloud: file.reUploadResult,
                        path: file.reUploadResult.Key,
                        userIp: '127.0.0.1'
                    }
                );                
            }catch(e){
                file.reUploadError = e;
                Log.error(e);
                throw e;
            }finally{
                if (
                    name_tmp &&
                    (await notNode.Common.tryFileAsync(name_tmp))
                ) {
                    await targetStoreBucket.removeFile(name_tmp);
                }                           
            }            
    }


    static extractURL(file, child){
        if(file.info.variantURL[child.variant]){
            return file.info.variantURL[child.variant];
        }else{
            let used = [child.variant],
                notUsed = Object.keys(file.info.variantURL).filter((size)=>size !== child.variant);
            while(used.length < notUsed.length){
                const otherSize = notUsed.pop();
                used.push(otherSize);
                if (file.info.variantURL[otherSize]){
                    return file.info.variantURL[otherSize].replace(otherSize, child.variant);
                }
            }
        }
        return undefined;
    }

    static async reUploadChildren(file, targetStoreBucket){
        try{
            let children = await getApp().getModel('not-store//File').listAll({
                parent: file._id,
                __closed: false,
                __latest: true,
            });
            if(children && children.length){
                children = children.map(child=>child.toObject());
                let quee = children.map((child) => {
                    const url = this.extractURL(file, child);
                    Log.log('child', file.path,  child.variant, url);
                    return this.reUploadChild(url, child, targetStoreBucket);
                });                
                 await Promise.all(quee);
                 file.reUploadChildrenResults = children;
            }else{
                file.reUploadChildrenResults = [];
            }
        }catch(e){
            file.reUploadChildrenError = e;
            Log.error(e);
            throw e;
        }
    }
    
    static async reUploadFile(file, targetStoreBucket, withChildren = false, userIp, newStoreName){
        if(file.cloud){
            let name_tmp;
            try{
                const stashResult = await targetStoreBucket.stashFile(file.cloud.Location);
                name_tmp = stashResult.name_tmp;
                file.reUploadResult = await targetStoreBucket.directUpload(name_tmp, pathUtil.parse(file.path).base);
                let changes = {
                    cloud: file.reUploadResult,
                    path: file.reUploadResult.Key,
                    userIp,
                };
                if(typeof newStoreName == 'string' && newStoreName.length > 3){
                    changes.store = newStoreName;
                }
                await getApp().getModel('not-store//File').findOneAndUpdate(
                    {
                        _id: file._id.toString(),                        
                    }, 
                    changes
                );
                if(withChildren){
                    await this.reUploadChildren(file, targetStoreBucket);
                    const variants = {};
                    file.reUploadChildrenResults.forEach((variant)=>{
                        variants[variant.variant] = variant.reUploadResult.Location;
                    });
                    await getApp().getModel('not-store//File').findOneAndUpdate(
                        {
                            _id: file._id.toString(),                         
                        }, 
                        {
                            'info.variantURL': variants,
                        }
                    );
                }
            }catch(e){
                file.reUploadError = e;
                Log.error(e);
                throw e;
            }finally{
                if (
                    name_tmp &&
                    (await notNode.Common.tryFileAsync(name_tmp))
                ) {
                    await targetStoreBucket.removeFile(name_tmp);
                }                           
            }
        }else{
            try{
                if(withChildren){
                    await this.reUploadChildren(file, targetStoreBucket);
                    const variants = {};
                    file.reUploadChildrenResults.forEach((variant)=>{
                        variants[variant.variant] = variant.reUploadResult.Location;
                    });
                    await getApp().getModel('not-store//File').findOneAndUpdate(
                        {_id: file._id.toString()}, 
                        {'info.variantURL': variants,}
                    );
                }   
            }catch(e){
                Log.error(e, JSON.stringify(file, null,4));
                throw e;
            }        
        }        
    }

    static async loadAllFiles(models){
        const allPromises = [];
        const allSources = [];
        const filesStats = models.map((modelName, index)=>{
            const Model = getApp().getModel(modelName);
            const modSchema = getApp().getModelSchema(modelName);            
            const fileFields = this.getSchemaFilesFields(modSchema);
            const fileFieldsStats = {};
            fileFields.forEach((field)=>{
                allPromises.push(Model.listAllAndPopulate([field], {
                    [field]:{ $exists: true}
                }));
                allSources.push({modelIndex: index, field});
            });
            
            return {
                model: modelName,
                fields: fileFields,
                stats: fileFieldsStats
            }
        });   
        let results = await Promise.all(allPromises);
        //parents loaded
        allSources.forEach(({modelIndex, field}, index)=>{
            filesStats[modelIndex].stats[field] = results[index].map((item) => item.toObject()[field]).filter(item => item && item.cloud);
        });
        return {filesStats, allSources};
    }

    static async statsForFilesByModels({data, identity, clientIP}){
        Log.info(data.models);
        const storeBucket = await notStore.get(data.storeName);
        const newStoreName = data.newStoreName;
        //parents loading
        const {filesStats, allSources} = await this.loadAllFiles(data.models);        
        let promiseQuee = [], promiseIndexes = [];               
        //reuploading all
        allSources.forEach(({modelIndex, field}, index)=>{            
            filesStats[modelIndex].stats[field].forEach((file, fileIndex)=>{
                if(typeof file === 'undefined'){
                    Log.log('Empty file object', modelIndex, field, index);
                    return Promise.resolve(undefined);
                }
                promiseQuee.push(this.reUploadFile(file, storeBucket, true, clientIP, newStoreName));
                promiseIndexes.push({modelIndex, field, fileIndex});
            });
        });
        await Promise.all(promiseQuee);
        const {filesStats:result} = await this.loadAllFiles(data.models);
        return result;
    }
}

module.exports[MODEL_NAME] = TransferLogic;
