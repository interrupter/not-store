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
        width: 100,
        height: 100,
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
            filterUI: FileFilterUI,
            interface: {
                factory: this.getInterface(),
                combined: true,
                combinedAction: "listAndCount",
            },
            pager: {
                size: 100,
                page: 0,
            },
            sorter: {
                fileID: -1,
            },
            fields: [
                {
                    path: ":fileID",
                    title: "ID",
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":name",
                    title: "Имя",
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":extension",
                    title: "Формат",
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":store",
                    title: "Бакет",
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":info.thumbs.micro.cloud.Location",
                    title: "Превью",
                    searchable: true,
                    sortable: true,
                    type: "image",
                    preprocessor: (value, item) => {
                        return [
                            {
                                title: item.name,
                                url: value,
                                urlFull: item.info.thumbs.small.cloud.Location,
                                cors: "anonymous",
                            },
                        ];
                    },
                },
                {
                    path: ":_id",
                    title: "Действия",
                    type: "button",
                    preprocessor: (value) => {
                        return [
                            {
                                action: this.goDetails.bind(this, value),
                                title: "Подробнее",
                                size: "small",
                            },
                            {
                                action: this.goUpdate.bind(this, value),
                                title: "Изменить",
                                size: "small",
                            },
                            {
                                action: this.goDelete.bind(this, value),
                                type: "danger",
                                title: "Удалить",
                                size: "small",
                                style: "outlined",
                            },
                        ];
                    },
                },
            ],
        });

        this.start();
        return this;
    }

    getItemTitle(item) {
        return item.fileID + "#" + item.name;
    }
}

export default ncFile;
