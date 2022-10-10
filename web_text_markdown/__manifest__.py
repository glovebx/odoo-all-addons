# -*- coding: utf-8 -*-
{
    'name': "Web Text Markdown",
    'summary': "Markdown Widget.",
    'description': """
        Edit & Display markdown content.
    """,
    'author': "Alex@Gu",
    'website': "https://github.com/glovebx",
    'category': 'Technical',
    'version': '0.9',
    'depends': ['base', 'web'],
    'data': [],
    'assets': {
        'web.assets_backend': [
            'web_text_markdown/static/src/js/markdown_text_field.js',
            'web_text_markdown/static/src/js/markdown_text_field.xml',
        ],
        'web.tests_assets': [
            'web_text_markdown/static/lib/easymde.min.css',
            'web_text_markdown/static/lib/easymde.min.js',
        ],
        'web.qunit_suite_tests': [
            'web_text_markdown/static/tests/**/*',
        ],
    },
    'auto_install': True,
}
