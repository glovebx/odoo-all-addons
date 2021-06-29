odoo.define('website_pdf_translator.translator_upload', function (require) {
'use strict';

var core = require('web.core');
var ajax = require('web.ajax');
var localStorage = require('web.local_storage');
var Dialog = require('web.Dialog');
var publicWidget = require('web.public.widget');
var utils = require('web.utils');

var QWeb = core.qweb;
var _t = core._t;

var sidKey = 'website_pdf_translator.upload_modal.sid';
var uploadIdKey = 'website_pdf_translator.upload_modal.uploadId';

function jsonp(form, attributes, callback) {
    attributes = attributes || {};
    var options = {jsonp: _.uniqueId('upload_callback_')};
    window[options.jsonp] = function () {
        delete window[options.jsonp];
        callback.apply(null, arguments);
    };
    if ('data' in attributes) {
        _.extend(attributes.data, options);
    } else {
        _.extend(attributes, {data: options});
    }
    _.extend(attributes, {
        dataType: 'script',
    });
    $(form).ajaxSubmit(attributes);
}

publicWidget.registry.websiteTranslatorUpload = publicWidget.Widget.extend({
    selector: '.o_website_js_translator_form',
    xmlDependencies: ['/website_pdf_translator/static/src/xml/translator_upload.xml'],
    events: {
        'change .oe_import_file': '_onFileLoaded',
        'click .oe_select_file': '_onUploadClick',
    },

    _pollCount: 0,

    /**
    * @override
    */
    start: function () {
        var self = this;
        return this._super.apply(this, arguments).then(function () {
            // Init event listener
            self._init();
        });
    },

    _init: function () {
        var sid = localStorage.getItem(sidKey);
        if (!sid) {
            var now = new Date().getTime();
            sid = _.uniqueId('upl') + now;
            localStorage.setItem(sidKey, sid);
        }

        var uploadId = localStorage.getItem(uploadIdKey);
        if (!uploadId) return;
        var self = this;
        ajax.jsonRpc('/ksg/translator/get', 'call', {sid: sid, res_id: uploadId}).then(function(data) {
            console.log(data);
            if (data.name) {
                $('.o_website_js_translator_filename').prop('innerText', data.name);
            }
            if(data.success === true) {
                self.processPolledData(data || {});
               return;
            }
            if (data.error) {
                switch(data.error) {
                case "rpc_error":
                    self.displayContent("translator.rpc_error", {});
                    break;
                default: // if an exception is raised
                    self.displayContent("translator.exception", {exception_msg: data.tips || data.error});
                    break;
                }
                return;
            }
            self.nextPolling();
        }).guardedCatch(function() {
            self.displayContent("translator.rpc_error", {});
        });
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * @private
     * @param {Event} ev
     */
    _onUploadClick: function (ev) {
        ev.preventDefault();
        $('input.oe_import_file').click();
    },

    /* Methods */
    nextPolling: function () {
        var timeout = 3000;
        //
        if(this._pollCount >= 10 && this._pollCount < 20) {
            timeout = 10000;
        }
        else if(this._pollCount >= 20) {
            timeout = 30000;
        }
        //
        setTimeout(this.poll.bind(this), timeout);
        this._pollCount ++;
    },

    poll: function () {
        var self = this;
        var sid = localStorage.getItem(sidKey);
        var uploadId = localStorage.getItem(uploadIdKey);
        ajax.jsonRpc('/ksg/translator/poll', 'call', {sid: sid, res_id: uploadId}).then(function(data) {
            console.log(data);
            if(data.success === true) {
                self._pollCount = 0;
                self.processPolledData(data || {});
               return;
            }
            if (data.error) {
                self._pollCount = 0;
                switch(data.error) {
                case "rpc_error":
                    self.displayContent("translator.rpc_error", {});
                    break;
                default: // if an exception is raised
                    self.displayContent("translator.exception", {exception_msg: data.tips || data.error});
                    break;
                }
                return;
            }
            self.displayContent("translator.processing", {tips: data.tips});
            self.nextPolling();
        }).guardedCatch(function() {
            self.displayContent("translator.rpc_error", {});
            self.nextPolling();
        });
    },

    processPolledData: function (data) {
        if (data.url) {
            this.displayContent("translator.display_result", {url: data.url});
        } else {
            this.displayContent("translator.exception", {exception_msg: data.tips});
        }
    },

    displayContent: function (xmlid, render_values) {
        var html = QWeb.render(xmlid, render_values);
        this.$el.find('.o_website_js_translator_result').html(html);
    },

    displayLoading: function () {
        var msg = _t("We are uploading file, please wait ...");
        $.blockUI({
            'message': '<h2 class="text-white"><img src="/web/static/src/img/spin.png" class="fa-pulse"/>' +
                '    <br />' + msg +
                '</h2>'
        });
    },

    // uploaded -> translating queue
    onUploadCallback: function(data) {
        console.log('onUploadCallback', data);
        if (data.res_id) {
            // 保存到本地！
            localStorage.setItem(uploadIdKey, data.res_id);
            // start long-poll for translate status updating
            this.poll();
        } else if (data.error) {
            this.displayContent("translator.exception", {exception_msg: data.error});
        }
        $.unblockUI();
//        $('.oe_select_file').prop('innerText', 'Upload').prop('disabled', false);
    },

    _onFileLoaded: function (ev) {
        ev.preventDefault();
        // start to upload file
        const file = $('input.oe_import_file')[0].files[0];
        if (!file) return;

        let import_toggle = false;
        if (file.size > 10485760) {
            // 10Mb
            return;
        }
        if ((file.type && _.last(file.type.split('/')) === "pdf") || ( _.last(file.name.split('.')) === "pdf")) {
            import_toggle = true;
        }
        $('.o_website_js_translator_filename').prop('innerText', file.name);
        // loaded -> uploading
//        $('.oe_select_file').prop('innerText', 'Uploading').prop('disabled', import_toggle);
        this.displayLoading();
        var sid = localStorage.getItem(sidKey);
        jsonp(this.$el, {url: '/ksg/translator/pdf', data: {sid: sid}}, this.proxy('onUploadCallback'));
    },

});

return {
    websiteTranslatorUpload: publicWidget.registry.websiteTranslatorUpload
};

});
