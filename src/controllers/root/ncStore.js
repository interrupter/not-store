import { Frame } from "not-bulma";
import { MODULE_NAME } from "../../const";

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

notFormRules.add("changeComponent", (value, master, slaves, form) => {
    console.log("change component", value, master, slaves, form);
    return {
        _componentName: DRIVERS_CACHE.find((itm) => itm.id === value).ui,
    };
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
        this.setOptions("update.masters", {
            driver: {
                changeComponent: ["options"],
            },
        });
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
        return {};
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
}

export default ncStore;
