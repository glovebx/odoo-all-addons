/** @odoo-module **/

import { registry } from "@web/core/registry";

export function switchAccountItem(env)  {
    return {
        type: "item",
        id: "switch",
        hide: env.services.mobile.methods.switchAccount === undefined,
        description: env._t("Switch Account"),
        callback: () => {
            env.services.mobile.methods.switchAccount();
        },
        sequence: 65,
    };    
}

registry.category("user_menuitems").add('switch', switchAccountItem)
