# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _


class WebsitePDFTranslator(models.Model):
    _name = 'website.pdf.translator'
    _description = 'Website PDF Translator'
    # _order = 'sequence, id'

    name = fields.Char('Name')
    sid = fields.Char('Client Session ID', readonly=True, index=True)
    file = fields.Binary('File', help='Binary file', attachment=False)
    file_size = fields.Integer('File Size', readonly=True)
    file_type = fields.Selection([
        ('pdf', 'PDF'),
        ('doc', 'Doc/Docx'),
        ('text', 'Text')],
        string="File Type", default="pdf")
    state = fields.Selection([
        ('new', 'New'),
        ('pending', 'Pending'),
        ('translating', 'Translating'),
        ('done', 'Done'),
        ('cancel', 'Canceled'),
        ('error', 'Error')],
        string='Status', copy=False, default='new', required=True, readonly=True)
    state_message = fields.Char('State message')
    result_name = fields.Char('Translated file name')
    result_file = fields.Binary('File', help='Translated Binary file', attachment=False)
    note = fields.Text('Description')

