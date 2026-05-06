export const resmiTemplate = {
    title: "Surat Resmi",
    fields: [
        { id: "jenis_instansi", label: "Jenis Instansi", type: "select", options: [
            { value: "sekolah", label: "Sekolah" },
            { value: "perusahaan", label: "Perusahaan/Pemerintah" }
        ]},
        { id: "logo_kiri", label: "Logo Kiri (Opsional)", type: "file", accept: "image/*" },
        { id: "logo_kanan", label: "Logo Kanan (Opsional)", type: "file", accept: "image/*" },
        { id: "sekolah", label: "Nama Instansi", type: "text", placeholder: "Contoh: SMA Negeri 1 Jakarta atau PT. Sukses Makmur" },
        { id: "alamat", label: "Alamat Lengkap Instansi", type: "text", placeholder: "Jl. Jend. Sudirman No. 1, Jakarta" },
        { id: "telepon", label: "Nomor Telepon Instansi", type: "text", placeholder: "(021) 123456" },
        { id: "nomor", label: "Nomor Surat", type: "text", placeholder: "001/SK/2024" },
        { id: "perihal", label: "Perihal", type: "text", placeholder: "Undangan Rapat" },
        { id: "tujuan", label: "Ditujukan Kepada", type: "text", placeholder: "Contoh: Bapak/Ibu Wali Murid atau Manager HRD" },
        { id: "isi", label: "Isi Surat", type: "textarea", placeholder: "Isi pokok surat resmi" },
        { id: "kepala", label: "Penanggung Jawab", type: "text", placeholder: "Contoh: Drs. Budi Santoso" },
        { id: "kota", label: "Kota", type: "text", placeholder: "Jakarta" },
        { id: "tanggal", label: "Tanggal Surat (Opsional)", type: "date" }
    ],
    render: (data) => {
        const pimpinanLabel = data.jenis_instansi === 'sekolah' ? 'Kepala Sekolah' : 'Pimpinan / Direktur';
        const dateObj = data.tanggal ? new Date(data.tanggal) : new Date();
        const dateStr = dateObj.toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'});
        
        return `
            <div class="letter-header">
                ${data.logo_kiriBase64 ? `<div class="logo-container logo-kiri"><img src="${data.logo_kiriBase64}" alt="Logo Kiri"></div>` : ''}
                <div class="header-text">
                    <h2>${data.sekolah || 'NAMA INSTANSI'}</h2>
                    <p>${data.alamat || 'Alamat Lengkap Instansi Anda'} <br> Telp: ${data.telepon || '(021) 123456'}</p>
                </div>
                ${data.logo_kananBase64 ? `<div class="logo-container logo-kanan"><img src="${data.logo_kananBase64}" alt="Logo Kanan"></div>` : ''}
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <div>
                    Nomor: ${data.nomor || '...'}<br>
                    Hal: ${data.perihal || '...'}
                </div>
                <div>
                    ${data.kota || '...'}, ${dateStr}
                </div>
            </div>
            <br>
            <p>Kepada Yth,<br>${data.tujuan || 'Bapak/Ibu/Saudara/i'}<br>Di Tempat</p>
            <br>
            <p>Dengan hormat,</p>
            <p>${data.isi ? data.isi.replace(/\\n/g, '<br>') : 'Silakan isi bagian isi surat pada form di samping...'}</p>
            <br>
            <p>Demikian surat ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.</p>
            <div class="letter-footer">
                <div></div>
                <div class="signature">
                    Mengetahui,<br>
                    ${pimpinanLabel}<br><br><br><br>
                    ( <strong>${data.kepala || '...'}</strong> )
                </div>
            </div>
        `;
    }
};
