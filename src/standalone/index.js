const DEFAULT_OPTS = {
    store: "client",
    server: "",
    selectMany: false,
    preview: {
        width: 100,
        height: 100,
    },
};
//выбор из уже загруженных
import StorageComponent from "./storage.svelte";
//загрузка с локального диска
import UploadComponent from "./upload.svelte";
//
import ComplexComponent from "./complex.svelte";

import * as FileStores from "./file.stores.js";

import { default as StandartInterface } from "./file.manifest.js";

import netInterface from "./interface.js";

class notStore {
    constructor(options) {
        this.options = Object.assign({}, DEFAULT_OPTS, options);
        this.ui = {};
        this.init();
    }

    init() {
        this.generateID();
        this.createStore();
        if (this.options.complex && this.options.complex.popup) {
            this.renderComplex();
            this.loadFilesData().catch(console.error);
        } else {
            if (this.options.storageEl) {
                this.renderStorage();
                this.loadFilesData().catch(console.error);
            }
            if (this.options.uploadEl) {
                this.renderUpload();
            }
        }
        if (this.options.preload) {
            this.loadFilesData().catch(console.error);
        }
    }

    generateID() {
        if (!this.options.id) {
            this.options.id = Math.random();
        }
    }

    createStore() {
        this.storage = FileStores.create(this.options.id);
        this.storage.files.subscribe((files) => {
            this.files = files;
        });
        this.storage.selected.subscribe((selected) => {
            this.selected = selected;
        });
        this.storage.uploads.subscribe((selected) => {
            this.uploads = selected;
        });
    }

    renderComplex() {
        this.ui.complex = new ComplexComponent({
            target: this.options.complexEl,
            props: {
                files: this.files,
                id: this.options.id,
                selectMany: this.options.selectMany,
                selectOnClick: this.options.selectOnClick,
                show: this.options.complex && this.options.complex.show,
                popup: this.options.complex && this.options.complex.popup,
                short: this.options.complex && this.options.complex.short,
            },
        });
        this.ui.complex.$on("remove", this.removeFiles.bind(this));
        this.ui.complex.$on("filesAdded", this.onUploads.bind(this));
    }

    renderStorage() {
        this.ui.storage = new StorageComponent({
            target: this.options.storageEl,
            props: {
                files: this.files,
                id: this.options.id,
                selectMany: this.options.selectMany,
                popup: this.options?.storage?.popup,
                show: this.options?.storage?.show,
                selectOnClick: this.options.selectOnClick,
            },
        });
        this.ui.storage.$on("remove", this.removeFiles.bind(this));
    }

    renderUpload() {
        this.ui.upload = new UploadComponent({
            target: this.options.uploadEl,
            props: {
                id: this.options.id,
                popup: this.options?.upload?.popup,
                show: this.options?.upload?.show,
                short: this.options?.upload?.short,
            },
        });
        this.ui.upload.$on("filesAdded", this.onUploads.bind(this));
        this.ui.upload.$on("remove", this.removeUpload.bind(this));
    }

    loadFilesData() {
        let reqOpts = {
            store: this.options.store,
            session: this.options.session,
        };
        let req = this.getInterface()
            .setFilter(reqOpts)
            .setSorter({ fileID: -1 })
            .$list({});
        return req
            .then(({ status, result }) => {
                if (status === "ok") {
                    this.storage.files.update((value) => {
                        value.splice(0, value.length, ...result);
                        return value;
                    });
                    return result;
                } else {
                    return [];
                }
            })
            .catch((err) => {
                console.error(err, "Список загруженных файлов не доступен!");
            });
    }

    getInfo(_id, action = "get") {
        let reqOpts = {
            store: this.options.store,
            session: this.options.session,
        };
        let req = this.getInterface().setFilter(reqOpts)["$" + action]({ _id });
        return req.catch((err) => {
            console.error(err, "Информация о файле не доступна!");
        });
    }

    useGlobalInterface() {
        return this.options.useGlobalInterface && this.nrFile;
    }

    getInterface() {
        return new netInterface(StandartInterface, this.options);
    }

    show() {
        return new Promise((resolve, reject) => {
            if (this.ui.storage) {
                this.ui.storage.$set({
                    show: true,
                    onResolve: resolve,
                    onReject: reject,
                });
            } else if (this.ui.complex) {
                this.ui.complex.$set({
                    show: true,
                    onResolve: resolve,
                    onReject: reject,
                });
            }
        });
    }

    async removeFiles(ev) {
        let uuids = ev.detail.selected;
        let reqOpts = {
            store: this.options.store,
            session: this.options.session,
        };
        let toRemove = [];
        for (let uuid of uuids) {
            let file = this.findFileByUUID(uuid);
            if (file) {
                try {
                    let result = await this.getInterface()
                        .setFilter(reqOpts)
                        .$delete({
                            _id: file._id,
                        });
                    if (this.isGood(result)) {
                        toRemove.push(file);
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        }
        toRemove.forEach(this.removeFromStore.bind(this));
        this.resetSelected();
    }

    findFileByUUID(uuid) {
        let res = false;
        this.files.forEach((file) => {
            if (file.uuid === uuid) {
                res = file;
            }
        });
        return res;
    }

    isGood(res) {
        return res.status && res.status === "ok";
    }

    removeFromStore(file) {
        this.storage.files.update((list) => {
            let indx = list.indexOf(file);
            if (indx > -1) {
                list.splice(indx, 1);
            }
            return list;
        });
    }

    resetSelected() {
        this.storage.selected.update((val) => {
            val.splice(0, val.length);
            return val;
        });
    }

    async onUploads(data) {
        let files = data.detail;
        for (let file of files) {
            let preview = await this.preloadFilePreview(file);
            file.id = `fid_` + Math.random();
            let upload = {
                id: file.id,
                name: file.name,
                size: file.size,
                type: file.type,
                file,
                preview,
            };
            this.addToUploads(upload);
        }
    }

    preloadFilePreview(file) {
        return new Promise((res, rej) => {
            try {
                let reader = new FileReader();
                reader.onload = (e) => {
                    let cnvs = document.createElement("canvas");
                    cnvs.width = this.options.preview.width;
                    cnvs.height = this.options.preview.height;
                    let ctx = cnvs.getContext("2d"),
                        img = new Image();
                    img.onload = () => {
                        ctx.drawImage(
                            img,
                            0,
                            0,
                            this.options.preview.width,
                            this.options.preview.height
                        ); // Or at whatever offset you like
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

    addToUploads(upload) {
        this.uploadFile(upload).catch(console.error);
        this.storage.uploads.update((val) => {
            val.push(upload);
            return val;
        });
    }

    removeUpload() {
        //let ids = ev.detail.selected;
    }

    uploadFile(upload) {
        let reqOpts = {
            store: this.options.store,
            session: this.options.session,
        };
        return this.getInterface()
            .setFilter(reqOpts)
            .$create(reqOpts, false, true, upload.file)
            .then((data) => {
                if (data.status === "ok") {
                    this.uploadFinished(upload);
                }
            });
    }

    uploadFinished(upload) {
        this.storage.uploads.update((val) => {
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
        this.loadFilesData().catch(console.error);
    }
}

export {
    StorageComponent,
    UploadComponent,
    ComplexComponent,
    FileStores,
    notStore,
};
