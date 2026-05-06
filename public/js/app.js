import { izinTemplate } from './templates/izin.js';
import { lamaranTemplate } from './templates/lamaran.js';
import { resmiTemplate } from './templates/resmi.js';
import { FormHandler } from './formHandler.js';
import { downloadPdf } from './pdfExporter.js';

const templates = {
    izin: izinTemplate,
    lamaran: lamaranTemplate,
    resmi: resmiTemplate
};

document.addEventListener('DOMContentLoaded', () => {
    const formFieldsContainer = document.getElementById('form-fields');
    const previewContent = document.getElementById('preview-content');
    const templateTitle = document.getElementById('template-title');
    const downloadBtn = document.getElementById('download-pdf');

    // Initialize Form Handler
    const formHandler = new FormHandler(
        templates, 
        previewContent, 
        templateTitle, 
        formFieldsContainer
    );

    // Initial Load
    formHandler.initForm('izin');

    // Sidebar Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelector('.nav-item.active').classList.remove('active');
            item.classList.add('active');
            const templateKey = item.getAttribute('data-template');
            formHandler.initForm(templateKey);
        });
    });

    // Download PDF
    downloadBtn.addEventListener('click', () => {
        downloadPdf(
            'letter-preview',
            () => templates[formHandler.currentTemplateKey].title,
            () => document.getElementById('nama') ? document.getElementById('nama').value : 'Dokumen'
        );
    });

    // Handle Resize (if needed later)
    window.addEventListener('resize', () => {
        // Handled by CSS scale primarily
    });
});
