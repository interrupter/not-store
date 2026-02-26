import { Frame } from "not-bulma";
import { MODULE_NAME } from "../../const.cjs";
import ncaTransfer from "../common/actions/transfer.js";
import CRUDActionList from "not-bulma/src/frame/crud/actions/list.js";

const { notCRUD } = Frame;

const notFormRules = Frame.notFormRules;
const MODEL_NAME = "Transfer";

const LABELS = {
    plural: `${MODULE_NAME}:transfer_plural`,
    single: `${MODULE_NAME}:transfer_single`,
};

const BOTTOM_CLASS = [],
    MAIN_CLASS = [];


class ncTransfer extends notCRUD {
    static MODULE_NAME = MODULE_NAME;
    static MODEL_NAME = MODEL_NAME;

    constructor(app, params) {
        super(app, `${MODULE_NAME}.${MODEL_NAME}`, {
            actions: {
                transfer: ncaTransfer
            },
        });
        this.setOptions("preload", {
            stores: {
                modelName: "Store", 
                idField:'name', 
                titleField: 'name'
            },
            models: {
                modelName: "Transfer", 
                method: 'listAllModels'
            },
        });
        this.setModuleName(MODULE_NAME);
        this.setModelName(MODEL_NAME);
        this.setOptions("names", LABELS);
        this.setOptions("Validators", {});
        this.setOptions("params", params);
        this.setOptions('defaultAction', 'transfer');
        this.setOptions('preloadable', ['transfer']);
        
        this.preloadVariants('transfer')
            .then(() => this.start())
            .catch(this.report);
        return this;
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
        return {};
    }
   
    

}

export default ncTransfer;
