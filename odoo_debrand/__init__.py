# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
import odoo

def post_init_hook(env):
    # env = odoo.api.Environment(cr, odoo.SUPERUSER_ID, {})
    odoo_root = env.ref("base.partner_root")
    odoo_root.write({"name": "MocoBot", "email": "mocobot@example.com"})
    
