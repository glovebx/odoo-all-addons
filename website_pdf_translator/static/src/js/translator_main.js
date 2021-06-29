odoo.define('website_pdf_translator.translator_main', function (require) {
var ajax = require('web.ajax');
var core = require('web.core');
var qweb = core.qweb;

function openTab(evt, id) {
    $('.tm-tab-content').hide();
    $('#' + id).show();
    $('.tm-tab-link').removeClass('active');
    $(evt.currentTarget).addClass('active');
}

function initPage() {
    let pageId = location.hash;

    if (pageId) {
        try{
            highlightMenu($(`.tm-page-link[href^="${pageId}"]`));
            showPage($(pageId));
        }catch(err){return;}
    } else {
        try{
            pageId = $('.tm-page-link.active').attr('href');
            showPage($(pageId));
        }catch(err){return;}
    }
}

function highlightMenu(menuItem) {
    $('.tm-page-link').removeClass('active');
    menuItem.addClass('active');
}

function showPage(page) {
    $('.tm-page-content').hide();
    page.show();
}

function initTranslator() {
    $('.o_website_translator').click(function (ev) {
        const content = $("textarea[name='source']").val();
        if (!content) {
            // TODO: empty content warning
            return;
        }
        ajax.rpc("/ksg/translator/text", {content: content}).then(function(result) {
            $("textarea[name='destination']").val(result.result);
        });
    });
}

$(document).ready(function() {

    /***************** Pages *****************/

    initPage();
    initTranslator();

    $('.tm-page-link').click(function(event) {

        if ($(event.currentTarget).attr('data') != 'log_in_out'){
            if (window.innerWidth > 991) {
                event.preventDefault();
            }

            highlightMenu($(event.currentTarget));
            showPage($(event.currentTarget.hash));
        }
    });


    /***************** Tabs *******************/

    $('.tm-tab-link').on('click', e => {
        e.preventDefault();
        openTab(e, $(e.target).data('id'));
    });

    $('.tm-tab-link.active').click(); // Open default tab
});
});