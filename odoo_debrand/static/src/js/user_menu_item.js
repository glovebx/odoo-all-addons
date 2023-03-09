/** @odoo-module **/

import {registry} from "@web/core/registry";
// import {user_menuitems} from "@web/webclient/user_menu/user_menu_items";
const userMenuRegistry = registry.category("user_menuitems");

export const debrandService = {  
    dependencies:["title", "menu"],
    start(env, {title, menu}) {
	env.bus.on("WEB_CLIENT_READY", null, async () => {
	    title.setParts({ zopenerp: "MOCO" } );
	    if (userMenuRegistry) {
			userMenuRegistry.remove("documentation");
			userMenuRegistry.remove("separator");
			userMenuRegistry.remove("support");
			userMenuRegistry.remove("odoo_account");
	    }
	});
    }
};

registry.category("services").add("debrandService", debrandService);

