export class DataStore {
    static STORAGE_KEY = 'suratdigital_data';

    static getLetters() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    static saveLetter(letterData) {
        const letters = this.getLetters();
        // Add timestamp and ID
        const newLetter = {
            ...letterData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        letters.unshift(newLetter); // Add to beginning
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(letters));
        return newLetter;
    }

    static deleteLetter(id) {
        let letters = this.getLetters();
        letters = letters.filter(l => l.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(letters));
    }

    static getStats() {
        const letters = this.getLetters();
        const stats = {
            total: letters.length,
            izin: letters.filter(l => l.type === 'izin').length,
            lamaran: letters.filter(l => l.type === 'lamaran').length,
            resmi: letters.filter(l => l.type === 'resmi').length,
        };
        return stats;
    }
}
