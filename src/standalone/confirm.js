import ConfirmationComponent from "./confirm.svelte";

class Confirmation {
    static ask({ approval, text, title }) {
        return new Promise((res, rej) => {
            let comp = new ConfirmationComponent({
                props: {
                    approval,
                    reject() {
                        comp.$destroy();
                        rej();
                    },
                    resolve() {
                        comp.$destroy();
                        res();
                    },
                    text,
                    title,
                },
                target: document.body,
            });
        });
    }
}

export { Confirmation };
