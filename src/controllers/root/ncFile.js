import notFileCRUDActionUploadFile from "../common/actions/upload.file.action";
import Validators from "../common/validators.js";
import { MODULE_NAME } from "../../const.cjs";
import { Frame } from "not-bulma";
import FileFilterUI from "../common/file.filter.svelte";
const { notCRUD } = Frame;

const MODEL_NAME = "file";

const LABELS = {
    plural: "Файлы",
    single: "Файл",
};

const DEFAULT_OPTS = {
    preview: {
        height: 100,
        width: 100,
    },
};

const CUSTOM_ACTIONS = {
    create: notFileCRUDActionUploadFile,
};

class ncFile extends notCRUD {
    static MODULE_NAME = MODULE_NAME;
    static MODEL_NAME = MODEL_NAME;

    constructor(app, params) {
        super(app, `${MODEL_NAME}`, { actions: CUSTOM_ACTIONS });
        this.setModuleName(MODULE_NAME);
        this.setModelName(MODEL_NAME);
        this.setOptions("names", LABELS);
        this.setOptions("Validators", Validators);
        this.setOptions("params", params);
        this.setOptions("list", {
            fields: [
                {
                    path: ":fileID",
                    searchable: true,
                    sortable: true,
                    title: "ID",
                },
                {
                    path: ":name",
                    searchable: true,
                    sortable: true,
                    title: `${MODULE_NAME}:field_name_label`,
                },
                {
                    path: ":extension",
                    searchable: true,
                    sortable: true,
                    title: `${MODULE_NAME}:field_extension_label`,
                },
                {
                    path: ":store",
                    searchable: true,
                    sortable: true,
                    title: `${MODULE_NAME}:field_store_label`,
                },
                {
                    path: ":variant",
                    preprocessor: (value) => {
                        return typeof value === "undefined" ? "" : value;
                    },
                    searchable: true,
                    sortable: true,
                    title: `${MODULE_NAME}:field_variant_label`,
                },
                {
                    path: ":info.previewURL",
                    preprocessor: (value, item) => {
                        if (item.info.variantURL) {
                            return [
                                {
                                    cors: "anonymous",
                                    title: item.name,
                                    url: item.info.variantURL.micro,
                                    urlFull: item.cloud.Location,
                                },
                            ];
                        } else {
                            return [];
                        }
                    },
                    title: "Превью",
                    type: "image",
                },
                {
                    path: ":_id",
                    preprocessor: (value) => {
                        return [
                            {
                                action: this.goDetails.bind(this, value),
                                size: "small",
                                title: "Подробнее",
                            },
                            {
                                action: this.goUpdate.bind(this, value),
                                size: "small",
                                title: "Изменить",
                            },
                            {
                                action: this.goDelete.bind(this, value),
                                size: "small",
                                style: "outlined",
                                title: "Удалить",
                                type: "danger",
                            },
                        ];
                    },
                    title: "Действия",
                    type: "button",
                },
            ],
            filterUI: FileFilterUI,
            interface: {
                combined: true,
                combinedAction: "listAndCount",
                factory: this.getInterface(),
            },
            pager: {
                page: 0,
                size: 100,
            },
            sorter: {
                fileID: -1,
            },
        });

        this.start();
        return this;
    }

    getItemTitle(item) {
        return item.fileID + "#" + item.name;
    }
}

export default ncFile;
