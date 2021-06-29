# -*- coding: utf-8 -*-
import logging
import os
import tempfile

from odoo import api, models

_logger = logging.getLogger(__name__)


class WebsitePDFTranslatorService(models.AbstractModel):
    _name = 'website.pdf.translator.service'
    _description = 'Website PDF Translator Service'

    @api.model
    def run_website_pdf_translator_scheduler_task(self):
        WebsitePDFTranslator = self.env['website.pdf.translator']

        if WebsitePDFTranslator.search_count([('state', 'in', ('pending', 'translating'))]):
            # waiting for next round
            _logger.info('<<<<<<<website pdf translator scheduler task is running')
            return

        pdf_file = WebsitePDFTranslator.search([('state', '=', 'new')], limit=1, order='id ASC')
        if not pdf_file:
            _logger.info('<<<<<<<website pdf translator scheduler task is empty!')
            return

        _logger.info('<<<<<<<Start run website pdf translator scheduler task')

        pdf_file.write({'state': 'pending'})
        # commit first
        self.env.cr.commit()

        full_path = tempfile.mktemp(suffix='.pdf')
        try:
            # with osutil.tempdir() as pdf_dir:
                # full_path = os.path.join(pdf_dir, '%s_%s' % (pdf_file.id, pdf_file.name, ))
            fh = open(full_path, 'wb+')
            fh.write(pdf_file.file)
            fh.close()

            pdf_file.write({'state': 'translating'})
            self.env.cr.commit()

            code, msg, result_full_path = self.env['sgp_toolkit.pdf'].translate_docx(full_path)
            vals = {'state': 'done' if code == 0 else 'error',
                    'state_message': msg}
            if result_full_path and os.path.exists(result_full_path):
                # read file into binary
                result_name = result_full_path.split("/")[-1]
                with open(result_full_path, 'rb') as result_file:
                    vals.update({'result_name': result_name,
                                 'result_file': result_file.read()})
            pdf_file.write(vals)
        except Exception as e:
            _logger.error('保存过程出现异常如下:\n', str(e))
            pdf_file.write({'state': 'error',
                            'state_message': str(e)})
        finally:
            os.remove(full_path)

        _logger.info('<<<<<<<End run website pdf translator scheduler task')
