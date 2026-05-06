export const izinTemplate = {
    title: "Surat Izin",
    fields: [
        { id: "nama", label: "Nama Lengkap", type: "text", placeholder: "Contoh: Ahmad Fauzi" },
        { id: "tipe", label: "Jenis Izin", type: "select", options: [
            { value: "sekolah", label: "Izin Sekolah" },
            { value: "bekerja", label: "Izin Bekerja" }
        ]},
        { id: "kelas", label: "Kelas/Jabatan", type: "text", placeholder: "Contoh: XII IPA 1 atau Staff IT" },
        { id: "alasan", label: "Alasan Izin", type: "textarea", placeholder: "Contoh: Sakit demam" },
        { id: "tambahan", label: "Isi Tambahan (Opsional)", type: "textarea", placeholder: "Contoh: Oleh karena itu, saya melampirkan surat keterangan dokter." },
        { id: "tanggal", label: "Tanggal Izin", type: "date" },
        { id: "tujuan", label: "Tujuan Surat", type: "text", placeholder: "Contoh: Bapak/Ibu Guru atau HRD Manager" },
        { id: "kota", label: "Kota/Tempat", type: "text", placeholder: "Contoh: Jakarta" }
    ],
    render: (data) => {
        const jenisKegiatan = data.tipe === 'bekerja' ? 'bekerja' : 'belajar';
        
        return `
            <div class="letter-date">${data.kota || '...'}, ${data.tanggal || '...'}</div>
            <div class="letter-address">
                Kepada Yth,<br>
                ${data.tujuan || '...'}<br>
                Di Tempat
            </div>
            <br>
            <p>Dengan hormat,</p>
            <p>Saya yang bertanda tangan di bawah ini:</p>
            <table style="width: 100%; margin-left: 20px; margin-bottom: 15px;">
                <tr><td width="150">Nama</td><td>: ${data.nama || '...'}</td></tr>
                <tr><td>${data.tipe === 'bekerja' ? 'Jabatan' : 'Kelas'}</td><td>: ${data.kelas || '...'}</td></tr>
            </table>
            <p>Memberitahukan bahwa saya bermaksud untuk memohon izin tidak dapat mengikuti kegiatan ${jenisKegiatan} pada hari ini dikarenakan <strong>${data.alasan || '...'}</strong>.</p>
            ${data.tambahan ? `<p>${data.tambahan.replace(/\\n/g, '<br>')}</p>` : ''}
            <p>Demikian surat izin ini saya sampaikan. Atas perhatian dan pengertiannya, saya ucapkan terima kasih.</p>
            <div class="letter-footer">
                <div></div>
                <div class="signature">
                    Hormat Saya,<br><br><br><br>
                    ( <strong>${data.nama || '...'}</strong> )
                </div>
            </div>
        `;
    }
};
