import notFileCRUDActionUploadFile from '../common/actions/upload.file.action';
import Validators from "../common/validators.js";
import { MODULE_NAME } from "../../const.cjs";
import { Frame } from "not-bulma";
import FileFilterUI from '../common/file.filter.svelte';
const { notCRUD } = Frame;


const MODEL_NAME = "file";

const LABELS = {
    plural: "Файлы",
    single: "Файл",
};


const DEFAULT_OPTS = {	
	preview: {
		width: 100,
		height: 100
	}
};

const CUSTOM_ACTIONS = {
    create: notFileCRUDActionUploadFile
};

class ncFile extends notCRUD {
    static MODULE_NAME = MODULE_NAME;
    static MODEL_NAME = MODEL_NAME;

    constructor(app, params) {
        super(app, `${MODEL_NAME}`, {actions:CUSTOM_ACTIONS});
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
                    title: `${MODULE_NAME}:field_name_label`,
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":extension",
                    title: `${MODULE_NAME}:field_extension_label`,
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":store",
                    title: `${MODULE_NAME}:field_store_label`,
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":variant",
                    title: `${MODULE_NAME}:field_variant_label`,
                    searchable: true,
                    sortable: true,
                    preprocessor: (value)=>{
                        return typeof value === 'undefined'?'':value;
                    }
                },
                {
                    path: ":info.previewURL",
                    title: "Превью",                    
                    type: "image",
                    preprocessor: (value, item) => {
                        if(item.info.variantURL){
                            return [
                                {
                                    title: item.name,
                                    url: item.info.variantURL.micro,
                                    urlFull: item.cloud.Location,
                                    cors: "anonymous",
                                },
                            ];
                        }else{
                            return [];
                        }
                        
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
