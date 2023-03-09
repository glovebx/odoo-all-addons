# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

import datetime
import logging

import requests
import werkzeug.urls

from ast import literal_eval

from odoo import api, release, SUPERUSER_ID
from odoo.exceptions import UserError
from odoo.models import AbstractModel
from odoo.tools.translate import _
from odoo.tools import config, misc, ustr

_logger = logging.getLogger(__name__)


class PublisherWarrantyContract(AbstractModel):
    _name = "publisher_warranty.contract"
    _inherit = "publisher_warranty.contract"
    _description = 'Publisher Warranty Contract'

    @api.model
    def _get_sys_logs(self):
        """
        Utility method to send a publisher warranty get logs messages.
        """
        msg = self._get_message()
        arguments = {'arg0': ustr(msg), "action": "update"}

        #url = config.get("publisher_warranty_url")

        #r = requests.post(url, data=arguments, timeout=30)
        #r.raise_for_status()
        return ""

