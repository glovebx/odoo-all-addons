odoo.define('sgp_web_tweak.SearchBar', function (require) {
    "use strict";

    const { device } = require('web.config');
    if (!device.touch) {
        return;
    }

    const { patch } = require('web.utils');
    const components = {
        SearchBar: require('web.SearchBar')
    };

    patch(components.SearchBar, 'sgp_web_tweak.SearchBar', {
        mounted() {
            if (this.inputRef.el.autofocus) {
                this.inputRef.el.autofocus = false;
            }
            return this._super(...arguments);
        },
    });

});
