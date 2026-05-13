import { izinTemplate } from './templates/izin.js';
import { lamaranTemplate } from './templates/lamaran.js';
import { resmiTemplate } from './templates/resmi.js';
import { FormHandler } from './formHandler.js';
import { downloadPdf } from './pdfExporter.js';
import { DataStore } from './dataStore.js';
import { Toast } from './toast.js';

const templates = {
    izin: izinTemplate,
    lamaran: lamaranTemplate,
    resmi: resmiTemplate
};

let suratChart = null;

document.addEventListener('DOMContentLoaded', () => {
    const formFieldsContainer = document.getElementById('form-fields');
    const previewContent = document.getElementById('preview-content');
    const templateTitle = document.getElementById('template-title');
    const saveDownloadBtn = document.getElementById('save-download-pdf');

    // Initialize Form Handler
    const formHandler = new FormHandler(
        templates, 
        previewContent, 
        templateTitle, 
        formFieldsContainer
    );

    // Initial Load - Dashboard
    updateDashboardStats();
    initChart();
    
    // View Management
    const views = document.querySelectorAll('.view-section');
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active state in nav
            document.querySelector('.nav-item.active').classList.remove('active');
            item.classList.add('active');

            // Switch view
            const viewName = item.getAttribute('data-view');
            views.forEach(v => v.classList.remove('active'));
            document.getElementById(`view-${viewName}`).classList.add('active');

            if (viewName === 'form') {
                const templateKey = item.getAttribute('data-template');
                formHandler.initForm(templateKey);
            } else if (viewName === 'dashboard') {
                updateDashboardStats();
                updateChart();
            } else if (viewName === 'riwayat') {
                renderRiwayatTable();
            }
        });
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.setAttribute('data-lucide', 'sun');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.setAttribute('data-lucide', 'moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.setAttribute('data-lucide', 'sun');
            localStorage.setItem('theme', 'dark');
        }
        lucide.createIcons();
    });

    // Save & Download Logic
    saveDownloadBtn.addEventListener('click', () => {
        const templateKey = formHandler.currentTemplateKey;
        const template = templates[templateKey];
        const userName = document.getElementById('nama') ? document.getElementById('nama').value : 'Dokumen';
        
        try {
            // Save to LocalStorage
            DataStore.saveLetter({
                type: templateKey,
                title: template.title,
                userName: userName
            });

            // Show Toast Success
            Toast.success('Berhasil', `Surat ${template.title} untuk ${userName} berhasil disimpan dan diunduh.`);

            // Trigger Download
            downloadPdf(
                'letter-preview',
                () => template.title,
                () => userName
            );
        } catch (error) {
            Toast.error('Gagal', 'Terjadi kesalahan saat menyimpan atau mengunduh surat.');
            console.error(error);
        }
    });

    // Riwayat Search & Filter
    document.getElementById('search-input').addEventListener('input', renderRiwayatTable);
    document.getElementById('filter-select').addEventListener('change', renderRiwayatTable);

    // Initial render for icons that were added dynamically
    lucide.createIcons();
});

function updateDashboardStats() {
    const stats = DataStore.getStats();
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-izin').textContent = stats.izin;
    document.getElementById('stat-lamaran').textContent = stats.lamaran;
    document.getElementById('stat-resmi').textContent = stats.resmi;
}

function initChart() {
    const ctx = document.getElementById('suratChart').getContext('2d');
    const stats = DataStore.getStats();
    
    suratChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Surat Izin', 'Surat Lamaran', 'Surat Resmi'],
            datasets: [{
                label: 'Jumlah Surat',
                data: [stats.izin, stats.lamaran, stats.resmi],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } }
            }
        }
    });
}

function updateChart() {
    if (suratChart) {
        const stats = DataStore.getStats();
        suratChart.data.datasets[0].data = [stats.izin, stats.lamaran, stats.resmi];
        suratChart.update();
    }
}

function renderRiwayatTable() {
    const tbody = document.getElementById('riwayat-table-body');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filterType = document.getElementById('filter-select').value;
    
    let letters = DataStore.getLetters();
    
    // Filter
    if (filterType !== 'all') {
        letters = letters.filter(l => l.type === filterType);
    }
    
    // Search
    if (searchTerm) {
        letters = letters.filter(l => 
            l.userName.toLowerCase().includes(searchTerm) || 
            l.title.toLowerCase().includes(searchTerm)
        );
    }

    tbody.innerHTML = '';
    
    if (letters.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">Belum ada data surat.</td></tr>`;
        return;
    }

    letters.forEach(l => {
        const date = new Date(l.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${date}</td>
            <td><strong>${l.title}</strong><br><small style="color: var(--text-muted);">${l.userName}</small></td>
            <td><span class="badge ${l.type}">${l.type}</span></td>
            <td>
                <button class="btn-secondary" onclick="deleteLetter('${l.id}')">
                    Hapus
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Make delete available globally for the inline onclick
window.deleteLetter = function(id) {
    if(confirm('Apakah Anda yakin ingin menghapus data surat ini?')) {
        DataStore.deleteLetter(id);
        renderRiwayatTable();
        Toast.success('Berhasil', 'Data surat telah dihapus.');
    }
};
