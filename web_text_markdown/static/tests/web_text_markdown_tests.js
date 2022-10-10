/** @odoo-module **/

import { getFixture, triggerEvents } from "@web/../tests/helpers/utils";
import { pagerNext } from "@web/../tests/search/helpers";
import { makeView, setupViewRegistries } from "@web/../tests/views/helpers";

let serverData;
let target;

QUnit.module("Fields", (hooks) => {
    hooks.beforeEach(() => {
        target = getFixture();
        serverData = {
            models: {
                partner: {
                    fields: {
                        foo: {
                            string: "Foo",
                            type: "text",
                            default: "**MDE 编辑测试文本**",
                            searchable: true,
                            trim: true,
                        },
                    },
                    records: [
                        { id: 1, foo: `1. # **第一条测试标题**` },
                        { id: 2, foo: `>  # 第二条测试标题 [点击搜索](https://www.bing.com)` },
                    ],
                },
            },
        };

        setupViewRegistries();
    });

    QUnit.module("MarkdownTextField");


    QUnit.test("MarkdownTextField is updated on value change", async function (assert) {
        await makeView({
            type: "form",
            resModel: "partner",
            resId: 1,
            resIds: [1, 2],
            serverData,
            arch: /* xml */ `
                <form>
                    <field name="foo" widget="markdown"/>
                </form>`,
        });

        assert.ok(target.querySelector(".o_field_markdown").textContent.includes("第一条"));

        await pagerNext(target);

        assert.ok(target.querySelector(".o_field_markdown").textContent.includes("第二条"));
    });


    QUnit.test("MarkdownTextField on text fields works", async function (assert) {
        await makeView({
            type: "form",
            resModel: "partner",
            resId: 1,
            serverData,
            arch: `
                <form>
                    <field name="foo" widget="markdown" />
                </form>`,
        });

        assert.ok("EasyMDE" in window, "the markdown library should be loaded");
        assert.containsOnce(
            target,
            "div.EasyMDEContainer",
            "should have rendered something with markdown editor"
        );

        assert.ok(target.querySelector(".o_field_markdown").textContent.includes("第一条"));
    });

    QUnit.test("MarkdownTextField readonly on text fields works", async function (assert) {
        await makeView({
            type: "form",
            resModel: "partner",
            resId: 1,
            serverData,
            arch: `
                <form>
                    <field name="foo" widget="markdown" readonly="true"/>
                </form>`,
        });

        assert.ok(target.querySelector(".o_field_markdown").textContent.includes("第一条"));
    });
});
