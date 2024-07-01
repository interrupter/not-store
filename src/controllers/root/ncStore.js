import { Frame } from "not-bulma";
import { MODULE_NAME } from "../../const.cjs";
import ncaImportFromJSON from "../common/actions/store.import.from.json.js";
import ncaExportToJSON from "../common/actions/store.export.to.json.js";
import CRUDActionList from "not-bulma/src/frame/crud/actions/list.js";

const { notCRUD } = Frame;

const notFormRules = Frame.notFormRules;
const MODEL_NAME = "Store";

const LABELS = {
    plural: `${MODULE_NAME}:store_plural`,
    single: `${MODULE_NAME}:store_single`,
};

const BOTTOM_CLASS = [],
    MAIN_CLASS = [];

let DRIVERS_CACHE = [];
let PROCESSORS_CACHE = [];

notFormRules.add("changeComponent", (value, master, slaves, form) => {
    const el = DRIVERS_CACHE.find((itm) => itm.id === value);
    if (el && el.ui) {
        return {
            _componentName: el.ui,
        };
    } else {
        return {};
    }
});

notFormRules.add("changeProcessorsProps", (value, master, slaves, form) => {
    const el = DRIVERS_CACHE.find((itm) => itm.id === value);
    if (el && el.actions) {
        return {
            actions: el.actions,
            processors: PROCESSORS_CACHE,
        };
    } else {
        return {};
    }
});

class ncStore extends notCRUD {
    static MODULE_NAME = MODULE_NAME;
    static MODEL_NAME = MODEL_NAME;

    constructor(app, params) {
        super(app, `${MODULE_NAME}.${MODEL_NAME}`, {
            actions: {
                exportToJSON: ncaExportToJSON,
                importFromJSON: ncaImportFromJSON,
            },
        });
        this.setModuleName(MODULE_NAME);
        this.setModelName(MODEL_NAME);
        this.setOptions("names", LABELS);
        this.setOptions("Validators", {});
        this.setOptions("params", params);
        const masters = {
            driver: {
                changeComponent: ["options"],
                changeProcessorsProps: ["processors"],
            },
        };
        this.setOptions("details.masters", masters);
        this.setOptions("update.masters", masters);
        this.setOptions("create.masters", masters);
        this.setOptions("list", {
            actions: [
                ncaImportFromJSON.actionButton(this),
                ncaExportToJSON.actionButton(this),
            ],
            endless: false,
            fields: this.buildFieldsList(),
            idField: "_id",
            interface: {
                combined: true,
                factory: this.make.store,
            },
            showSearch: true,
            sorter: {
                storeID: -1,
            },
        });

        this.preloadKeys()
            .then(() => this.start())
            .catch(this.report);
        return this;
    }

    buildFieldsList() {
        return [
            {
                path: ":storeID",
                searchable: true,
                sortable: true,
                title: "ID",
            },
            {
                path: ":name",
                searchable: true,
                sortable: true,
                title: "Имя",
            },
            {
                path: ":driver",
                searchable: true,
                sortable: true,
                title: "Тип",
            },
            {
                path: ":active",
                preprocessor: (value) => {
                    return [
                        {
                            value,
                        },
                    ];
                },
                searchable: true,
                sortable: true,
                title: "Активность",
                type: "boolean",
            },
            {
                path: ":_id",
                preprocessor: (value) =>
                    CRUDActionList.createActionsButtons(this, value),
                title: "Действия",
                type: "button",
            },
        ];
    }

    getFrameClasses() {
        return {
            BOTTOM_CLASS,
            MAIN_CLASS,
            TOP_CLASS: this.TOP_CLASS,
        };
    }

    getItemTitle(itm) {
        return `${itm.name}`;
    }

    createDefault() {
        return {
            active: true,
            driver: "",
            name: "",
            options: {},
            processors: {},
        };
    }

    async preloadKeys() {
        try {
            const driversList = await this.getModel()
                .$listDrivers()
                .then((resp) => resp.result);
            DRIVERS_CACHE = driversList;
            const processorsList = await this.getModel()
                .$listProcessors()
                .then((resp) => resp.result);
            PROCESSORS_CACHE = processorsList;
            const listsSet = {
                drivers: driversList,
                processors: processorsList,
            };
            this.setOptions(`variants.create`, listsSet);
            this.setOptions(`variants.update`, listsSet);
            this.setOptions(`variants.details`, listsSet);
        } catch (e) {
            this.report(e);
            this.showErrorMessage(e);
        }
    }

    async goTest(_id) {
        try {
            const res = await this.getModel({ _id }).$test();
            this.log(res);
        } catch (error) {
            this.error(error);
        }
    }

    async goFiles(_id) {
        try {
            this.log("files of store", _id);
        } catch (error) {
            this.error(error);
        }
    }

    async goUpload(_id) {
        try {
            this.log("upload to store", _id);
        } catch (error) {
            this.error(error);
        }
    }
}

export default ncStore;
