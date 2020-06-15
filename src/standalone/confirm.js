/* global document */

import ConfirmationComponent from './confirm.svelte';

class Confirmation {
	static ask({
		title,
		text,
		approval
	}) {
		return new Promise((res, rej) => {
			let comp = new ConfirmationComponent({
				target: document.body,
				props: {
					title,
					text,
					approval,
					reject() {
						comp.$destroy();
						rej();
					},
					resolve() {
						comp.$destroy();
						res();
					}
				}
			});
		});
	}
}

export {
	Confirmation
};
