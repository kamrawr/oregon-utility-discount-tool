// Data loader for program information
class DataLoader {
    constructor() {
        this.data = null;
    }

    async loadData() {
        if (this.data) {
            return this.data;
        }

        try {
            const response = await fetch('data/programs.json');
            this.data = await response.json();
            return this.data;
        } catch (error) {
            console.error('Error loading program data:', error);
            throw error;
        }
    }

    getPrograms() {
        return this.data?.programs || [];
    }

    getProgramById(id) {
        return this.getPrograms().find(p => p.id === id);
    }

    getStateWideResources() {
        return this.data?.statewide_resources || [];
    }

    getIncomeNotes() {
        return this.data?.income_qualification_notes || {};
    }
}

// Global instance
const dataLoader = new DataLoader();

// Initialize data on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await dataLoader.loadData();
        console.log('Program data loaded successfully');
    } catch (error) {
        console.error('Failed to load program data:', error);
        document.body.innerHTML = '<div class="container"><article><h1>Error</h1><p>Failed to load program data. Please refresh the page.</p></article></div>';
    }
});
