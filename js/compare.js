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
        const article = document.createElement('div');
        article.className = 'card';

        const fuelColor = program.fuel_type.toLowerCase().includes('electric') ? 'var(--color-warning)' : 'var(--color-info)';

        article.innerHTML = `
            <div style="border-left: 4px solid ${fuelColor}; padding-left: var(--space-4); margin-bottom: var(--space-4);">
                <h3 style="margin: 0 0 var(--space-2);">
                    ${program.utility}
                    <span class="badge badge-neutral" style="margin-left: var(--space-2);">${program.fuel_type}</span>
                </h3>
                <p style="margin: 0; font-size: var(--font-size-sm); color: var(--text-tertiary);">
                    ${program.program_name}
                </p>
            </div>

            <div style="margin-bottom: var(--space-4);">
                <h4 style="font-size: var(--font-size-base); margin-bottom: var(--space-2); color: var(--text-primary);">Service Areas</h4>
                <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin: 0;">${program.service_areas.join(', ')}</p>
            </div>

            <div style="margin-bottom: var(--space-4);">
                <h4 style="font-size: var(--font-size-base); margin-bottom: var(--space-2); color: var(--text-primary);">Eligibility</h4>
                <p style="font-size: var(--font-size-sm); margin: var(--space-1) 0;"><strong>Income:</strong> ${program.eligibility.income_standard}</p>
                <p style="font-size: var(--font-size-sm); margin: var(--space-1) 0;"><strong>Tiers based on:</strong> ${program.eligibility.tiers_based_on}</p>
                ${program.eligibility.special_notes ? `<p style="font-size: var(--font-size-xs); color: var(--text-tertiary); margin-top: var(--space-2);">${program.eligibility.special_notes}</p>` : ''}
            </div>

            <div style="margin-bottom: var(--space-4);">
                <h4 style="font-size: var(--font-size-base); margin-bottom: var(--space-2); color: var(--text-primary);">Benefits</h4>
                <p style="font-size: var(--font-size-sm); margin: var(--space-1) 0;"><strong>Discount:</strong> ${program.benefits.discount_range}</p>
                ${this.renderTiers(program)}
                ${program.benefits.duration ? `<p style="font-size: var(--font-size-xs); color: var(--text-tertiary); margin-top: var(--space-2);">${program.benefits.duration}</p>` : ''}
            </div>

            <div style="margin-bottom: var(--space-4);">
                <h4 style="font-size: var(--font-size-base); margin-bottom: var(--space-2); color: var(--text-primary);">How to Apply</h4>
                <p style="font-size: var(--font-size-sm); margin: var(--space-1) 0;"><strong>Phone:</strong> ${program.application.phone}</p>
                <p style="font-size: var(--font-size-sm); margin: var(--space-1) 0;"><strong>Methods:</strong> ${program.application.methods.join(', ')}</p>
            </div>

            <div class="btn-group">
                <a href="${program.application.online_form}" target="_blank" rel="noopener" class="btn btn-primary">
                    Apply Online →
                </a>
                <a href="${program.application.primary_link}" target="_blank" rel="noopener" class="btn btn-secondary">
                    Program Details
                </a>
            </div>

            <details style="margin-top: var(--space-4); font-size: var(--font-size-sm);">
                <summary style="cursor: pointer; font-weight: var(--font-weight-semibold); color: var(--text-primary);">Additional Resources</summary>
                <ul style="margin-top: var(--space-2); padding-left: var(--space-5);">
                    ${program.resources.map(r => `
                        <li style="margin-bottom: var(--space-1);"><a href="${r.url}" target="_blank" rel="noopener">${r.title}</a></li>
                    `).join('')}
                </ul>
            </details>
        `;

        return article;
    }

    renderTiers(program) {
        if (Array.isArray(program.benefits.tiers)) {
            return `
                <ul style="font-size: var(--font-size-sm); margin-top: var(--space-2); padding-left: var(--space-5); line-height: var(--line-height-relaxed);">
                    ${program.benefits.tiers.map(tier => {
                        if (tier.income) {
                            return `<li style="margin-bottom: var(--space-1);"><strong>Tier ${tier.tier}:</strong> ${tier.income} → ${tier.bill_discount} discount</li>`;
                        } else if (tier.discount) {
                            return `<li style="margin-bottom: var(--space-1);"><strong>Tier ${tier.tier}:</strong> ${tier.discount} (${tier.criteria})</li>`;
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
