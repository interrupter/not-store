import { Frame } from "not-bulma";
import { MODULE_NAME } from "../../const.cjs";

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
    console.log("change component", value, master, slaves, form);
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
    console.log("change processors props", value, master, slaves, form);
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
        super(app, `${MODULE_NAME}.${MODEL_NAME}`);
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
            interface: {
                combined: true,
                factory: this.make.store,
            },
            endless: false,
            sorter: {
                storeID: -1,
            },
            actions: [],
            showSearch: true,
            idField: "_id",
            fields: this.buildFieldsList(),
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
                path: ":driver",
                title: "Тип",
                searchable: true,
                sortable: true,
            },
            {
                path: ":active",
                title: "Активность",
                sortable: true,
                searchable: true,
                type: "boolean",
                preprocessor: (value) => {
                    return [
                        {
                            value,
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
                            action: this.goTest.bind(this, value),
                            title: "Тест",
                            size: "small",
                        },
                        {
                            action: this.goFiles.bind(this, value),
                            title: "Файлы",
                            size: "small",
                        },
                        {
                            action: this.goUpload.bind(this, value),
                            title: "Загрузить",
                            size: "small",
                        },
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
        ];
    }

    getFrameClasses() {
        return {
            TOP_CLASS: this.TOP_CLASS,
            MAIN_CLASS,
            BOTTOM_CLASS,
        };
    }

    getItemTitle(itm) {
        return `${itm.name}`;
    }

    createDefault() {
        return {
            name: "",
            driver: "",
            options: {},
            processors: {},
            active: true,
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
