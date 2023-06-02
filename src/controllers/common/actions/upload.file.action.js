import UIFileUpload from './upload.file.ui.svelte';
import CRUDGenericActionCreate from "not-bulma/src/frame/crud/actions/generic/create";

class notFileCRUDActionCreate extends CRUDGenericActionCreate{
    /**
     * @static {object} UIConstructor    constructor of UI component
     */
    static get UIConstructor() {
        return UIFileUpload;
    }

    static prepareUIOptions(controller, response) {
        const actionName = this.getModelActionName(controller);
        return {
            options: {
                target: controller.getContainerInnerElement(),
                model: controller.getModelName(),
                action: actionName,
                name: `${controller.getName()}.${this.ACTION}Form`,
                validators: controller.getOptions("Validators"),
                variants: controller.getOptions(`variants.${this.ACTION}`, {}),
                masters: controller.getOptions(`${this.ACTION}.masters`, {}),
            },
            data: this.TRANSFORMER(response),
        };
    }

}

export default notFileCRUDActionCreate;
