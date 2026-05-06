export const lamaranTemplate = {
    title: "Surat Lamaran Kerja",
    fields: [
        { id: "nama", label: "Nama Lengkap", type: "text", placeholder: "Nama Lengkap Anda" },
        { id: "alamat", label: "Alamat", type: "textarea", placeholder: "Alamat Lengkap" },
        { id: "email", label: "Email", type: "email", placeholder: "email@anda.com" },
        { id: "perusahaan", label: "Nama Perusahaan", type: "text", placeholder: "PT. Maju Bersama" },
        { id: "posisi", label: "Posisi Dilamar", type: "text", placeholder: "Contoh: Web Developer" },
        { id: "tambahan", label: "Isi Tambahan/Keahlian (Paragraf Bebas)", type: "textarea", placeholder: "Contoh: Saya memiliki pengalaman 3 tahun di bidang web development menggunakan React dan Node.js..." },
        { id: "kota", label: "Kota", type: "text", placeholder: "Jakarta" },
        { id: "tanggal", label: "Tanggal Surat (Opsional)", type: "date" }
    ],
    render: (data) => {
        const dateObj = data.tanggal ? new Date(data.tanggal) : new Date();
        const dateStr = dateObj.toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'});
        
        return `
        <div class="letter-date">${data.kota || '...'}, ${dateStr}</div>
        <div class="letter-address">
            Hal: Lamaran Pekerjaan<br><br>
            Kepada Yth,<br>
            HRD ${data.perusahaan || '...'}<br>
            Di Tempat
        </div>
        <br>
        <p>Dengan hormat,</p>
        <p>Melalui surat ini, saya bermaksud untuk mengajukan diri guna mengisi posisi <strong>${data.posisi || '...'}</strong> di ${data.perusahaan || '...'} sebagaimana informasi yang saya dapatkan.</p>
        <p>Saya adalah seorang profesional yang memiliki dedikasi tinggi dan bersedia memberikan kontribusi terbaik bagi perusahaan. Berikut data singkat saya:</p>
        <table style="width: 100%; margin-left: 20px; margin-bottom: 15px;">
            <tr><td width="150">Nama</td><td>: ${data.nama || '...'}</td></tr>
            <tr><td>Alamat</td><td>: ${data.alamat || '...'}</td></tr>
            <tr><td>Email</td><td>: ${data.email || '...'}</td></tr>
        </table>
        ${data.tambahan ? `<p>${data.tambahan.replace(/\n/g, '<br>')}</p><br>` : ''}
        <p>Sebagai bahan pertimbangan, saya lampirkan pula Curriculum Vitae (CV) saya. Besar harapan saya untuk dapat diberikan kesempatan wawancara.</p>
        <p>Demikian surat lamaran ini saya sampaikan, atas perhatian Bapak/Ibu saya ucapkan terima kasih.</p>
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
