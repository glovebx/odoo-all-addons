/** @odoo-module **/

import { registry } from "@web/core/registry";
import { _lt } from "@web/core/l10n/translation";
import { loadJS, loadBundle } from "@web/core/assets";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { formatText } from "@web/views/fields/formatters";

const { Component, onMounted, onWillStart, onWillUpdateProps, useEffect, useRef } = owl;

export class MarkdownTextField extends Component {
    setup() {

        this.easymde = null;
        this.editorRef = useRef('editor');

        onWillStart(async () => {
            await loadBundle({
                jsLibs: [
                    '/web_text_markdown/static/lib/easymde.min.js'
                ],
                cssLibs: [
                    '/web_text_markdown/static/lib/easymde.min.css'
                ]
            })
        });

        onWillUpdateProps(this.updateMDE);

        useEffect(
            () => {
                this.setupMDE();
                this.updateMDE(this.props);
                return () => this.destroyMDE();
            },
            () => [this.editorRef.el]
        );
    }

    setupMDE() {
        this.easymde = new EasyMDE({
            element: this.editorRef.el,
            renderingConfig: {
                singleLineBreaks: false,
                codeSyntaxHighlighting: true,
                //sanitizerFunction: (renderedHTML) => {
                    // Using DOMPurify and only allowing <b> tags
                //    return DOMPurify.sanitize(renderedHTML, {ALLOWED_TAGS: ['b']})
                //},
            }
        });
if (!this.props.readonly) {
        this.easymde.codemirror.on("blur", this.onBlur.bind(this));
}
    }

    updateMDE({ readonly, value }) {
        if (!this.easymde) {
            return;
        }

        const formattedValue = formatText(value);
        if (this.easymde.value() !== formattedValue) {
            this.easymde.value(formattedValue);
        }
        if (this.props.readonly) {
            this.easymde.togglePreview();
	    //this.easymde.toolbar_div.hidden = true	
        }	    
    }

    destroyMDE() {
        if (this.easymde) {
            this.easymde.cleanup();
        }
    }

    onBlur() {
        if (!this.props.readonly) {
            this.props.update(this.easymde.value());
        }
    }
}

MarkdownTextField.template = "web_text_markdown.MarkdownTextField";
MarkdownTextField.props = {
    ...standardFieldProps
};

MarkdownTextField.displayName = _lt("Markdown Editor");
MarkdownTextField.supportedTypes = ["text"];
registry.category("fields").add('markdown', MarkdownTextField);
