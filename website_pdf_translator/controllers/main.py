# -*- coding: utf-8 -*-
import json
import logging

import werkzeug

from odoo import http, _
from odoo.http import request
from odoo.tools import misc
from odoo.exceptions import UserError

_logger = logging.getLogger(__name__)


class KsgController(http.Controller):

    # Translator Controller

    @http.route('/ksg/translator/pdf', methods=['POST'], auth="public", csrf=False)
    def upload_pdf(self, file, sid, jsonp='callback'):
        if not sid:
            return 'window.top.%s(%s)' % (misc.html_escape(jsonp), json.dumps({'error': 'sid invalid'}))

        # size check!!
        file_data = file.read()
        file_size = len(file_data)
        _logger.info('file_size=%s' % file_size)
        if file_size > 10 * 1024 * 1024:
            # Threshold 10Mb
            return 'window.top.%s(%s)' % (misc.html_escape(jsonp), json.dumps({'error': 'file over-sized'}))

        res = request.env['website.pdf.translator'].create({
            'name': file.filename,
            'sid': sid,
            'file': file_data,
            'file_size': file_size,
            'file_type': 'pdf',
            'state': 'new'
        })

        return 'window.top.%s(%s)' % (misc.html_escape(jsonp), json.dumps({'res_id': res.id}))

    @http.route('/ksg/translator/poll', type='json', auth="none")
    def translate_poll(self, **post):
        _logger.info(post)
        sid = post.get('sid')
        res_id = post.get('res_id')
        if not sid or not res_id:
            return {'error': 'Invalid arguments'}

        pdf_file = request.env['website.pdf.translator'].search([('id', '=', int(res_id)), ('sid', '=', sid)], limit=1)
        if not pdf_file:
            return {'error': 'Invalid file'}
        state_dict = dict(request.env['website.pdf.translator']._fields['state']._description_selection(request.env))
        if pdf_file.state in ('cancel', 'done'):
            return {'success': True,
                    'state': state_dict.get(pdf_file.state) or '',
                    'url': '/ksg/translator/download/%s/%s' % (sid, pdf_file.id) if pdf_file.result_name else '',
                    'tips': ''}
        elif pdf_file.state == 'error':
            return {'error': 'translate_error',
                    'state': state_dict.get(pdf_file.state) or '',
                    'tips': pdf_file.state_message}
        else:
            tips = pdf_file.state == 'translating' and 'Translating...' or 'Please Waiting...'
            if pdf_file.state == 'new':
                count = request.env['website.pdf.translator'].search_count([
                    ('state', 'in', ('new', 'pending', 'translating')),
                    ('id', '<', int(res_id))])
                if count > 0:
                    tips = 'Please Waiting...(%s)' % count

            return {'state': state_dict.get(pdf_file.state) or '',
                    'tips': tips}

    @http.route('/ksg/translator/text', type='json', auth="none")
    def translate_text(self, **post):
        content = post.get('content')
        if not content:
            return False

        src = post.get('src') or 'en'
        dst = post.get('dst') or 'zh'
        # 翻译
        code, result_content, _ = request.env['sgp_toolkit.txt'].translate(content)
        return {'result': result_content}

    @http.route('/ksg/translator/get', type='json', auth="public", website=True, sitemap=False)
    def get_list(self, **post):
        _logger.info(post)
        sid = post.get('sid')
        if not sid:
            return {}
        domain = [('sid', '=', sid)]
        res_id = post.get('res_id')
        if res_id:
            domain += [('id', '=', int(res_id))]
        pdf_file = request.env['website.pdf.translator'].search(domain, limit=1)
        if not pdf_file:
            return {}
        state_dict = dict(request.env['website.pdf.translator']._fields['state']._description_selection(request.env))
        if pdf_file.state in ('cancel', 'done'):
            return {'success': True,
                    'state': state_dict.get(pdf_file.state) or '',
                    'name': pdf_file.name,
                    'url': '/ksg/translator/download/%s' % pdf_file.id if pdf_file.state == 'done' else '',
                    'tips': ''}
        elif pdf_file.state == 'error':
            return {'error': 'translate_error',
                    'name': pdf_file.name,
                    'state': state_dict.get(pdf_file.state) or '',
                    'tips': pdf_file.state_message}
        else:
            return {'name': pdf_file.name,
                    'state': state_dict.get(pdf_file.state) or '',
                    'tips': pdf_file.state == 'translating' and 'Translating...' or 'Waiting...'}

    @http.route('/ksg/translator/download/<string:sid>/<int:res_id>', type='http', auth="public", website=True, sitemap=False)
    def get_translated_result(self, sid, res_id):
        if not sid or not res_id:
            raise UserError(_("Invalid arguments"))

        pdf_file = request.env['website.pdf.translator'].search([('id', '=', int(res_id)), ('sid', '=', sid)], limit=1)
        if not pdf_file:
            raise UserError(_("Invalid file"))
        if pdf_file.state != 'done':
            raise UserError(_("File is not ready"))

        response = werkzeug.wrappers.Response()
        response.data = pdf_file.result_file
        response.mimetype = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        return response
