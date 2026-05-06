export function downloadPdf(elementId, getTemplateName, getUserName) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const templateName = getTemplateName() || 'Surat';
    const userName = getUserName() || 'Dokumen';
    
    const opt = {
        margin: 0,
        filename: `${templateName}_${userName}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Temporarily remove transform for high quality capture
    element.style.transform = 'scale(1)';
    
    html2pdf().set(opt).from(element).save().then(() => {
        // Restore transform
        element.style.transform = 'scale(0.9)';
    }).catch(err => {
        console.error("PDF generation error: ", err);
        element.style.transform = 'scale(0.9)';
    });
}
