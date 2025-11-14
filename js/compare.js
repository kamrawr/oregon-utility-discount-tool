// Program comparison page logic
class ProgramComparison {
    constructor() {
        this.filterValue = 'all';
        this.init();
    }

    async init() {
        await dataLoader.loadData();
        this.attachEventListeners();
        this.renderPrograms();
    }

    attachEventListeners() {
        const filter = document.getElementById('fuel-filter');
        if (filter) {
            filter.addEventListener('change', (e) => {
                this.filterValue = e.target.value;
                this.renderPrograms();
            });
        }
    }

    renderPrograms() {
        const container = document.getElementById('comparison-grid');
        if (!container) return;

        const programs = dataLoader.getPrograms();
        const filteredPrograms = this.filterPrograms(programs);

        container.innerHTML = '';

        if (filteredPrograms.length === 0) {
            container.innerHTML = '<p>No programs match the selected filter.</p>';
            return;
        }

        filteredPrograms.forEach(program => {
            const card = this.createComparisonCard(program);
            container.appendChild(card);
        });
    }

    filterPrograms(programs) {
        if (this.filterValue === 'all') {
            return programs;
        }

        return programs.filter(p => {
            const fuelType = p.fuel_type.toLowerCase();
            if (this.filterValue === 'electric') {
                return fuelType.includes('electric');
            } else if (this.filterValue === 'gas') {
                return fuelType.includes('gas');
            }
            return true;
        });
    }

    createComparisonCard(program) {
        const article = document.createElement('article');
        article.className = 'comparison-card';

        const fuelClass = program.fuel_type.toLowerCase().includes('electric') ? 'electric' : 'gas';

        article.innerHTML = `
            <div class="utility-name">${program.utility}</div>
            <div class="program-name">${program.program_name}</div>
            <span class="fuel-badge ${fuelClass}">${program.fuel_type}</span>

            <div class="detail-section">
                <h5>Service Areas</h5>
                <p>${program.service_areas.join(', ')}</p>
            </div>

            <div class="detail-section">
                <h5>Eligibility</h5>
                <p><strong>Income:</strong> ${program.eligibility.income_standard}</p>
                <p><strong>Tiers based on:</strong> ${program.eligibility.tiers_based_on}</p>
                ${program.eligibility.special_notes ? `<p><small>${program.eligibility.special_notes}</small></p>` : ''}
            </div>

            <div class="detail-section">
                <h5>Benefits</h5>
                <p><strong>Discount:</strong> ${program.benefits.discount_range}</p>
                ${this.renderTiers(program)}
                ${program.benefits.duration ? `<p><small>${program.benefits.duration}</small></p>` : ''}
            </div>

            <div class="detail-section">
                <h5>How to Apply</h5>
                <ul>
                    ${program.application.methods.map(m => `<li>${m}</li>`).join('')}
                </ul>
                <p><strong>Phone:</strong> ${program.application.phone}</p>
            </div>

            <div style="margin-top: 1rem;">
                <a href="${program.application.primary_link}" target="_blank" role="button">Visit Program Page</a>
            </div>

            <details style="margin-top: 1rem;">
                <summary>Additional Resources</summary>
                <ul>
                    ${program.resources.map(r => `
                        <li><a href="${r.url}" target="_blank">${r.title}</a></li>
                    `).join('')}
                </ul>
            </details>
        `;

        return article;
    }

    renderTiers(program) {
        if (Array.isArray(program.benefits.tiers)) {
            return `
                <ul style="font-size: 0.9rem; margin-top: 0.5rem;">
                    ${program.benefits.tiers.map(tier => {
                        if (tier.income) {
                            return `<li><strong>Tier ${tier.tier}:</strong> ${tier.income}<br>${tier.bill_discount} discount</li>`;
                        } else if (tier.discount) {
                            return `<li><strong>Tier ${tier.tier}:</strong> ${tier.discount} (${tier.criteria})</li>`;
                        }
                        return '';
                    }).join('')}
                </ul>
            `;
        }
        return '';
    }
}

// Initialize on page load
if (document.getElementById('comparison-grid')) {
    const programComparison = new ProgramComparison();
}
