import * as FileStores from "../../standalone/file.stores";
import { getExtension } from "../../mimes";
import { notCommon } from "not-bulma";

const PREVIEW_SIZE = 48;
const ICON_TYPE_FOLDER = "/img/file.type/";
const getFileTypeIconUrl = (ext) =>
    `${ICON_TYPE_FOLDER}${ext.toLowerCase()}.png`;
const getDefaultFileTypeIconUrl = () => `${ICON_TYPE_FOLDER}unknown.svg`;

class nsStore{
    
    TIMEOUT = 10000;
    INTERVAL = 10;

    constructor(app){
        this.app =app;
    }

    get PREVIEW_SIZE() {
        return {
            height: PREVIEW_SIZE,
            width: PREVIEW_SIZE,
        };
    }

    notFinished = [];

    resultsSets = {};

    getPreview(file) {
        if (this.fileIsImage(file)) {
            return this.preloadFilePreview(file);
        } else {
            return this.getFileTypeImageIcon(file);
        }
    }

    createResultsSet(){
        const setId = `sid_` + Math.random();
        this.resultsSets[setId] = {
            id: setId,
            ids: [],
            success: [],
            error: []
        };
        return this.resultsSets[setId];
    }

    removeResultsSets(resultsSet){
        delete this.resultsSets[resultsSet.id];
    }


    /**
     * 
     * @param {object|number} resultsSet 
     * @param {object} upload 
     */
    addUploadToSet(resultsSet, upload){
        if(typeof resultsSet === 'string'){
            resultsSet = this.resultsSets[resultsSet];
        }
        resultsSet.ids.push(upload.id);        
    }

    addUploadToSuccessSet(resultsSet, upload, result){
        if(typeof resultsSet == 'string'){
            resultsSet = this.resultsSets[resultsSet];
        }
        resultsSet.success.push({id: upload.id, result});
    }

    addUploadToErrorSet(resultsSet, upload, result){
        if(typeof resultsSet === 'string'){
            resultsSet = this.resultsSets[resultsSet];
        }
        resultsSet.error.push({id: upload.id, result});
    }

    async onFilesAdded(store, files) {       
        const resultsSet = this.createResultsSet();
        for (let file of files) {
            let preview = await this.getPreview(file);
            file.id = `fid_` + Math.random();
            let upload = {
                file,
                id: file.id,
                name: file.name,
                preview,
                size: file.size,
                type: file.type,
            };            
            this.addToUploads(store, upload, resultsSet.id);
        }
        return this.createResultsPromise(resultsSet);
    }


    fileIsImage({ type }) {
        return type.indexOf("image/") === 0;
    }

    preloadFilePreview(file) {
        return new Promise((res, rej) => {
            try {
                let reader = new FileReader();
                reader.onload = (e) => {
                    let cnvs = document.createElement("canvas");
                    cnvs.width = this.PREVIEW_SIZE.width;
                    cnvs.height = this.PREVIEW_SIZE.height;
                    let ctx = cnvs.getContext("2d"),
                        img = new Image();
                    img.onload = () => {
                        ctx.drawImage(
                            img,
                            0,
                            0,
                            this.PREVIEW_SIZE.width,
                            this.PREVIEW_SIZE.height
                        );
                        res(cnvs.toDataURL("image/png"));
                    };
                    if(typeof e.target.result == 'string'){
                        img.src = e.target.result;
                    }else{
                        throw new Error('Wrong type of image src: ' + (typeof e.target.result));
                    }                    
                };
                reader.onerror = rej;
                // Read in the image file as a data URL.
                reader.readAsDataURL(file);
            } catch (e) {
                rej(e);
            }
        });
    }

    getFileTypeIconUrlByMime({ type }) {
        const removeDot = (str) => str.replace(".", "");
        const ext = getExtension(type);
        if (ext) {
            if (Array.isArray(ext)) {
                return getFileTypeIconUrl(removeDot(ext[0]));
            }
            return getFileTypeIconUrl(removeDot(ext));
        } else {
            return getDefaultFileTypeIconUrl();
        }
    }

    preloadIcon(url) {
        return new Promise((res, rej) => {
            try {
                let cnvs = document.createElement("canvas");
                cnvs.width = this.PREVIEW_SIZE.width;
                cnvs.height = this.PREVIEW_SIZE.height;
                let ctx = cnvs.getContext("2d"),
                    img = new Image();
                img.onload = () => {
                    ctx.drawImage(
                        img,
                        0,
                        0,
                        this.PREVIEW_SIZE.width,
                        this.PREVIEW_SIZE.height
                    );
                    res(cnvs.toDataURL("image/png"));
                };
                img.onerror = rej;
                img.src = url;
            } catch (e) {
                rej(e);
            }
        });
    }

    async getFileTypeImageIcon(file) {
        try {
            const iconUrl = this.getFileTypeIconUrlByMime(file);
            return await this.preloadIcon(iconUrl);
        } catch (e) {
            notCommon.report(e);
            return await this.preloadIcon(getDefaultFileTypeIconUrl());
        }
    }

    addToUploads( storeName, upload, resultsSetId) {        
        this.uploadFile( storeName, upload, resultsSetId).catch((e)=>notCommon.report(e));
        FileStores.get(storeName).uploads.update((val) => {
            val.push(upload);
            this.notFinished.push(upload.id);
            this.addUploadToSet(resultsSetId, upload);
            return val;
        });
    }
    
    uploadFile(storeName, upload, resultsSetId) {
        let reqOpts = {
            store: storeName,            
        };
        const fileModel = notCommon.getApp().getModel('file', reqOpts);
        return fileModel.$create(reqOpts, false, true, upload.file).then((data) => {
            if (data.status === "ok") {
                this.addUploadToSuccessSet(resultsSetId, upload, data.result.file[0]);                
            }else{
                this.addUploadToErrorSet(resultsSetId, upload, data.message);
            }
            this.uploadFinished(upload, storeName);
        });
    }

    uploadFinished(upload, storeName) {
        FileStores.get(storeName).uploads.update((val) => {
            let toRemove;
            val.forEach((item) => {
                if (item.id === upload.id) {
                    upload.uploaded = true;
                    toRemove = upload;
                }
            });
            if (toRemove) {
                val.splice(val.indexOf(toRemove), 1);
                this.notFinished.splice(this.notFinished.indexOf(toRemove.id), 1);
            }
            return val;
        });        
    }

    createResultsPromise(resultsSet){
        return Promise.any([
            this.awaitResult(resultsSet), 
            this.awaitTimeout()
        ]);        
    }
 

    allFinished(uploadsIds){
        return uploadsIds.every((id)=> !this.notFinished.includes(id));
    }


    awaitResult(resultsSet){
        return new Promise((res, rej)=>{
            try{
                let int = setInterval(()=>{
                    if(this.allFinished(resultsSet.ids)){
                        clearInterval(int);
                        this.removeResultsSets(resultsSet);
                        res(resultsSet);
                    }
                }, this.INTERVAL);
            }catch(e){
                notCommon.report(e);
                rej(e);
            }
        })
    }


    async awaitTimeout(){
        await notCommon.wait(this.TIMEOUT/1000);
        throw new Error('nsStore upload timeout, '+this.TIMEOUT);
    }

}

export default nsStore;