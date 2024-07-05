import UIFileUpload from "./upload.file.ui.svelte";
import CRUDGenericActionCreate from "not-bulma/src/frame/crud/actions/generic/create";
import * as FileStores from "../../../standalone/file.stores";
import { getExtension } from "../../../mimes";
import { notCommon } from "not-bulma";

const PREVIEW_SIZE = 48;
const ICON_TYPE_FOLDER = "/img/file.type/";
const getFileTypeIconUrl = (ext) =>
    `${ICON_TYPE_FOLDER}${ext.toLowerCase()}.png`;
const getDefaultFileTypeIconUrl = () => `${ICON_TYPE_FOLDER}unknown.svg`;

class notFileCRUDActionCreate extends CRUDGenericActionCreate {
    static get PREVIEW_SIZE() {
        return {
            height: PREVIEW_SIZE,
            width: PREVIEW_SIZE,
        };
    }
    /**
     * @static {object} UIConstructor    constructor of UI component
     */
    static get UIConstructor() {
        return UIFileUpload;
    }

    static prepareUIOptions(controller, response) {
        //const actionName = this.getModelActionName(controller);
        return {
            props: {},
            target: controller.getContainerInnerElement(),
        };
    }

    static bindUIEvents(controller) {
        this.bindUIEvent(controller, "filesAdded", ({ detail }) => {
            const { files, store } = detail;
            this.onFilesAdded(controller, store, files);
        });
    }

    static getPreview(file) {
        if (this.fileIsImage(file)) {
            return this.preloadFilePreview(file);
        } else {
            return this.getFileTypeImageIcon(file);
        }
    }

    static async onFilesAdded(controller, store, files) {
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
            this.addToUploads(controller, store, upload);
        }
    }

    static fileIsImage({ type }) {
        return type.indexOf("image/") === 0;
    }

    static preloadFilePreview(file) {
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
                    img.src = e.target.result;
                };
                reader.onerror = rej;
                // Read in the image file as a data URL.
                reader.readAsDataURL(file);
            } catch (e) {
                rej(e);
            }
        });
    }

    static getFileTypeIconUrlByMime({ type }) {
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

    static preloadIcon(url) {
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

    static async getFileTypeImageIcon(file) {
        try {
            const iconUrl = this.getFileTypeIconUrlByMime(file);
            return await this.preloadIcon(iconUrl);
        } catch (e) {
            notCommon.report(e);
            return await this.preloadIcon(getDefaultFileTypeIconUrl());
        }
    }

    static addToUploads(controller, storeName, upload) {
        this.uploadFile(controller, storeName, upload).catch(console.error);
        FileStores.get(storeName).uploads.update((val) => {
            val.push(upload);
            return val;
        });
    }

    static removeUpload() {
        //let ids = ev.detail.selected;
    }

    static uploadFile(controller, storeName, upload) {
        let reqOpts = {
            store: storeName,
            //session: this.options.session
        };
        const model = controller.getModel(reqOpts);
        return model.$create(reqOpts, false, true, upload.file).then((data) => {
            if (data.status === "ok") {
                this.uploadFinished(upload, storeName);
            }
        });
    }

    static uploadFinished(upload, storeName) {
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
            }
            return val;
        });
        //this.loadFilesData().catch(console.error);
    }
}

export default notFileCRUDActionCreate;
