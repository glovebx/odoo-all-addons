# -*- coding: utf-8 -*-
{
    'name': 'Website PDF Translator',
    'category': 'Website',
    'author': 'glovebx',
    'description': '',
    "website": "https://github.com/glovebx",
    'depends': [
        'base',
        'website',
        'sgp_toolkit',
    ],
    'data': [
        'security/ir.model.access.csv',
        # 'views/menu.xml',
        'template/assets.xml',
        'template/header.xml',
        'template/footer.xml',
        'pages/home.xml',
        'data/website_pdf_translator_data.xml'
    ],
    'qweb': [
        'static/src/xml/translator_upload.xml',
    ],
    'images': ['static/description/banner.png'],
    'license': 'AGPL-3',
    'installable': True,
    'application': False,
    'auto_install': False,
    # 'pre_init_hook': 'pre_init_hook',
}
