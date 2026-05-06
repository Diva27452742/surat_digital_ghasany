export class FormHandler {
    constructor(templates, previewContentEl, templateTitleEl, formFieldsContainer) {
        this.templates = templates;
        this.previewContent = previewContentEl;
        this.templateTitle = templateTitleEl;
        this.formFieldsContainer = formFieldsContainer;
        this.currentTemplateKey = null;
        this.formData = {};
    }

    initForm(templateKey) {
        this.currentTemplateKey = templateKey;
        const template = this.templates[templateKey];
        this.templateTitle.textContent = `Data ${template.title}`;
        
        // Reset form data for the new template
        this.formData = {};
        this.formFieldsContainer.innerHTML = '';
        
        template.fields.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';
            
            const label = document.createElement('label');
            label.textContent = field.label;
            label.setAttribute('for', field.id);
            
            let input;
            if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.rows = 4;
            } else if (field.type === 'select') {
                input = document.createElement('select');
                field.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    input.appendChild(option);
                });
            } else {
                input = document.createElement('input');
                input.type = field.type;
                if (field.accept) {
                    input.accept = field.accept;
                }
            }
            
            input.id = field.id;
            input.placeholder = field.placeholder || '';
            
            if (field.type === 'file') {
                input.addEventListener('change', (e) => this.handleFileUpload(e, field.id));
            } else {
                input.addEventListener('input', (e) => this.handleInput(e, field.id));
            }
            
            // Initialize formData with default values
            if (field.type !== 'file') {
                this.formData[field.id] = input.value;
            }
            
            group.appendChild(label);
            group.appendChild(input);
            this.formFieldsContainer.appendChild(group);
        });
        
        this.updatePreview();
    }

    handleInput(e, fieldId) {
        this.formData[fieldId] = e.target.value;
        this.updatePreview();
    }

    handleFileUpload(e, fieldId) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                this.formData[`${fieldId}Base64`] = event.target.result;
                this.updatePreview();
            };
            reader.readAsDataURL(file);
        } else {
            this.formData[`${fieldId}Base64`] = null;
            this.updatePreview();
        }
    }

    updatePreview() {
        if (!this.currentTemplateKey) return;
        const template = this.templates[this.currentTemplateKey];
        this.previewContent.innerHTML = template.render(this.formData);
    }
}
