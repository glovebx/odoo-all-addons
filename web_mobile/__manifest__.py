# -*- coding: utf-8 -*-
{
    'name': 'Mobile',
    'category': 'Hidden',
    'summary': 'Odoo Mobile Core Module for CE',
    'author': "Alex@Gu",
    'website': "https://github.com/glovebx",    
    'version': '0.9.0', 
    'description': """
        Odoo Mobile Core Module for CE.
        """,
    'depends': ['web'],
    'data': [],
    'assets': {
        'web.assets_backend': [
            'web_mobile/static/src/js/services/core.js',
            'web_mobile/static/src/js/user_menu.js',
        ],
    },    
    'installable': True,
    'auto_install': True,
    'license': 'LGPL-3',
}
