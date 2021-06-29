odoo.define('website_pdf_translator.translator_sidebar', function (require) {
    $(document).ready(function() {
        if (window.location.pathname == '/'){
            $('.hamburger_menus').hide();
        }
    });
});