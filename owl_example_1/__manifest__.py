# -*- coding: utf-8 -*-
{
    'name': 'OWL Example 1',
    'version': '1.0',
    'author': 'Alex',
    'sequence': 110,
    'category': 'Tutorials',
    'website': 'https://www.github.com/glovebx',
    'summary': 'OWL',
    'description': """
OWL Example 1
==================================
Main Features
-------------
* Show owl components on Partner
""",
    'depends': [
        'sale',
        'sale_management'
    ],
    'data': [
        'views/assets.xml',
        'views/views.xml'
    ],
    'qweb': [
        "static/src/js/components/PartnerOrderSummary.xml"
    ]
}
