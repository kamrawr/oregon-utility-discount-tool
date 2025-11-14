// Simplified screening tool logic for unified design
class ScreeningTool {
    constructor() {
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadStateWideResources();
    }

    attachEventListeners() {
        const form = document.getElementById('screeningForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitForm();
            });
        }

        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetForm();
            });
        }
    }

    getFormState() {
        const utilities = Array.from(
            document.querySelectorAll('input[name="utility"]:checked')
        ).map(cb => cb.value);

        const benefits = Array.from(
            document.querySelectorAll('input[name="benefit"]:checked')
        ).map(cb => cb.value);

        const incomeFeelInput = document.querySelector('input[name="incomeFeel"]:checked');
        const incomeFeel = incomeFeelInput ? incomeFeelInput.value : null;

        const arrearsYes = document.getElementById('arrears-yes').checked;

        return { utilities, benefits, incomeFeel, arrearsYes };
    }

    computeScreeningOutcome(state) {
        const { utilities, benefits, incomeFeel, arrearsYes } = state;

        const hasUtility = utilities.length > 0;
        const benefitSignal = benefits.length > 0;
        const strongIncome = incomeFeel === 'strong' || (incomeFeel === 'moderate' && benefitSignal);

        let level = 'none';
        let label = 'No utilities selected yet';
        let pillClass = 'is-soft';

        if (!hasUtility) {
            return { level, label, pillClass };
        }

        if (strongIncome || (benefitSignal && incomeFeel !== 'uncertain')) {
            level = 'strong';
            label = 'Very strong candidate for bill discounts';
            pillClass = 'is-success';
        } else if (benefitSignal || incomeFeel === 'moderate') {
            level = 'medium';
            label = 'Likely / possible candidate – worth applying';
            pillClass = 'is-warning';
        } else {
            level = 'weak';
            label = 'Utility discounts might help – more info needed';
            pillClass = 'is-soft';
        }

        if (arrearsYes && level !== 'none') {
            label += ' • High urgency (arrears / shutoff risk)';
        }

        return { level, label, pillClass };
    }

    highlightSelectedUtilities(utilValues) {
        document.querySelectorAll('.utility-card').forEach(card => {
            card.style.boxShadow = 'none';
            card.style.borderColor = 'var(--border)';
        });

        utilValues.forEach(id => {
            const card = document.querySelector(`.utility-card[data-utility-id="${id}"]`);
            if (card) {
                card.style.boxShadow = '0 0 0 2px var(--primary), 0 12px 25px rgba(37, 99, 235, 0.25)';
                card.style.borderColor = 'var(--primary)';
            }
        });
    }

    submitForm() {
        const state = this.getFormState();
        const outcome = this.computeScreeningOutcome(state);
        const hasUtility = state.utilities.length > 0;

        const resultsStatusEl = document.getElementById('resultsStatus');
        const resultsBodyEl = document.getElementById('resultsBody');

        if (!hasUtility) {
            resultsStatusEl.textContent = 'Add at least one IOU first';
            resultsStatusEl.className = 'badge badge-danger';
            resultsBodyEl.innerHTML = `
                <p>
                    Start by figuring out which <strong>investor-owned utilities</strong> serve this home. 
                    Ask to see a recent bill or check the provider name in their online account.
                </p>
                <ul>
                    <li>If it's a <strong>PUD or co-op</strong> (e.g., PGE <em>is</em> an IOU, but Clark PUD, Eugene Water & Electric Board, etc. are not), this navigator won't apply.</li>
                    <li>Once you know the IOU(s), check their boxes and run the screening again.</li>
                </ul>
            `;
            this.highlightSelectedUtilities([]);
            return;
        }

        resultsStatusEl.textContent = outcome.label;
        // Map old pill classes to new badge classes
        const badgeClassMap = {
            'is-success': 'badge-success',
            'is-warning': 'badge-warning',
            'is-soft': 'badge-neutral'
        };
        resultsStatusEl.className = `badge ${badgeClassMap[outcome.pillClass]}`;

        const programs = dataLoader.getPrograms();
        const matchedPrograms = programs.filter(p => state.utilities.includes(p.id));

        const levelTextMap = {
            strong: '<strong>Priority action:</strong> Apply for every IOU discount the household is eligible for. These are almost certainly worth the few minutes of application time.',
            medium: '<strong>Recommended:</strong> Walk through at least one application together. Even if they end up just over the line, it\'s better that the utility make that call based on the real numbers.',
            weak: '<strong>Next step:</strong> Use this as a chance to talk about income, and pair with LIHEAP / OEAP or local assistance if they\'re uncomfortable sharing details yet.',
            none: ''
        };

        const urgencyText = state.arrearsYes
            ? '<li><strong>Flag arrears/shutoff risk:</strong> mention that some programs also connect to reconnection fee waivers or stronger shutoff protections once enrolled.</li>'
            : '';

        const benefitsText = state.benefits && state.benefits.length
            ? '<li>Because they\'re already in means-tested programs (SNAP, OHP, SSI, etc.), it\'s a strong sign they\'ll qualify here too.</li>'
            : '';

        // Build detailed program cards
        let programsHtml = '';
        matchedPrograms.forEach(program => {
            const fuelColor = program.fuel_type.toLowerCase().includes('electric') ? 'var(--color-warning)' : 'var(--color-info)';
            programsHtml += `
                <div style="border-left: 4px solid ${fuelColor}; padding-left: var(--space-4); background: var(--bg-secondary); padding: var(--space-4); border-radius: var(--border-radius); margin-bottom: var(--space-4);">
                    <h4 style="margin: 0 0 var(--space-2);">
                        ${program.utility}
                        <span class="badge badge-neutral" style="margin-left: var(--space-2);">${program.fuel_type}</span>
                    </h4>
                    <p style="margin: var(--space-1) 0; font-size: var(--font-size-sm);">
                        <strong>Program:</strong> ${program.program_name}
                    </p>
                    <p style="margin: var(--space-1) 0; font-size: var(--font-size-sm);">
                        <strong>Discount:</strong> ${program.benefits.discount_range}
                    </p>
                    <p style="margin: var(--space-1) 0; font-size: var(--font-size-sm);">
                        <strong>Eligibility:</strong> ${program.eligibility.income_standard}
                    </p>
                    <p style="margin: var(--space-1) 0; font-size: var(--font-size-sm);">
                        <strong>Documentation:</strong> ${program.application.documentation}
                    </p>
                    <div style="margin-top: var(--space-3); display: flex; gap: var(--space-2); flex-wrap: wrap;">
                        <a href="${program.application.online_form}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">
                            Apply Online →
                        </a>
                        <a href="tel:${program.application.phone.replace(/[^0-9]/g, '')}" class="btn btn-secondary" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">
                            📞 ${program.application.phone}
                        </a>
                    </div>
                </div>
            `;
        });

        resultsBodyEl.innerHTML = `
            <p style="font-size: var(--font-size-base); margin-bottom: var(--space-4);">${levelTextMap[outcome.level]}</p>
            
            <h4 style="margin: var(--space-4) 0 var(--space-3);">Recommended Programs:</h4>
            ${programsHtml}
            
            <h4 style="margin: var(--space-5) 0 var(--space-3);">Action Steps:</h4>
            <ul style="line-height: var(--line-height-relaxed);">
                ${urgencyText}
                ${benefitsText}
                <li>Make it explicit that these discounts <strong>stack</strong> with LIHEAP, OEAP, Oregon Energy Fund, and other help. They don't "use up" other benefits.</li>
                <li>Consider scheduling a brief follow-up once they've had a chance to see the first discounted bill. That builds trust and keeps them engaged.</li>
            </ul>
            
            <div style="margin-top: var(--space-5); padding: var(--space-4); background: var(--color-info-bg); border-radius: var(--border-radius); border: 1px solid var(--color-info-border);">
                <p style="margin: 0; font-size: var(--font-size-sm); color: var(--text-secondary);">
                    <strong>Reminder:</strong> This tool gives you a <em>screening</em>, not a promise. Final eligibility and discount level are determined by the utility based on their income tables and application review.
                </p>
            </div>
        `;

        this.highlightSelectedUtilities(state.utilities);
        
        // Scroll to results
        document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    async loadStateWideResources() {
        await dataLoader.loadData();
        const resources = dataLoader.getStateWideResources();
        const container = document.getElementById('statewide-resources');
        
        if (!container) return;

        container.innerHTML = '';
        const list = document.createElement('ul');
        list.className = 'sidebar-list';
        
        resources.forEach(resource => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="${resource.url}" target="_blank" rel="noopener">${resource.title}</a>
                <span class="sidebar-tag">${resource.description.split(' ')[0].toLowerCase()}</span>
                <br>
                <small style="color: var(--text-muted);">${resource.description}</small>
            `;
            list.appendChild(li);
        });
        
        container.appendChild(list);
    }

    resetForm() {
        document.getElementById('screeningForm').reset();
        const resultsStatusEl = document.getElementById('resultsStatus');
        const resultsBodyEl = document.getElementById('resultsBody');
        
        resultsStatusEl.textContent = 'Run screening above';
        resultsStatusEl.className = 'badge badge-neutral';
        resultsBodyEl.innerHTML = `
            <p>
                Run a screening to see: (1) how strong a fit these programs likely are, 
                (2) which utilities to prioritize, and (3) what to actually say to the household.
            </p>
            <ul>
                <li><strong>Green = very likely eligible</strong> — move fast on applications.</li>
                <li><strong>Yellow = possible</strong> — still worth applying, especially if arrears.</li>
                <li><strong>Gray = unclear</strong> — you may need more income info or to start with consent / trust-building.</li>
            </ul>
        `;
        this.highlightSelectedUtilities([]);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('screeningForm')) {
        const screeningTool = new ScreeningTool();
    }
    
    // Load resources immediately
    if (document.getElementById('resourcesList')) {
        loadResourcesList();
    }
});

// Function to load resources list
async function loadResourcesList() {
    await dataLoader.loadData();
    const programs = dataLoader.getPrograms();
    const resources = dataLoader.getStateWideResources();
    const container = document.getElementById('resourcesList');
    
    if (!container) return;
    
    // Utility Programs Section
    let html = '<h3 style="margin-bottom: var(--space-4);">Utility Application Links</h3>';
    html += '<div style="display: grid; gap: var(--space-4); margin-bottom: var(--space-8);">';
    
    programs.forEach(program => {
        const fuelColor = program.fuel_type.toLowerCase().includes('electric') ? 'var(--color-warning)' : 'var(--color-info)';
        html += `
            <div style="border-left: 4px solid ${fuelColor}; padding-left: var(--space-4); background: var(--bg-secondary); padding: var(--space-4); border-radius: var(--border-radius);">
                <h4 style="margin: 0 0 var(--space-2); color: var(--text-primary);">
                    ${program.utility}
                    <span class="badge badge-neutral" style="margin-left: var(--space-2);">${program.fuel_type}</span>
                </h4>
                <p style="margin: var(--space-1) 0; font-size: var(--font-size-sm); color: var(--text-secondary);">
                    <strong>Program:</strong> ${program.program_name}
                </p>
                <p style="margin: var(--space-1) 0; font-size: var(--font-size-sm); color: var(--text-secondary);">
                    <strong>Discount:</strong> ${program.benefits.discount_range}
                </p>
                <div style="margin-top: var(--space-3); display: flex; gap: var(--space-2); flex-wrap: wrap;">
                    <a href="${program.application.online_form}" target="_blank" rel="noopener" class="btn btn-primary" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">
                        Apply Online →
                    </a>
                    <a href="tel:${program.application.phone.replace(/[^0-9]/g, '')}" class="btn btn-secondary" style="font-size: var(--font-size-sm); padding: var(--space-2) var(--space-4);">
                        📞 ${program.application.phone}
                    </a>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Policy Resources Section
    html += '<h3 style="margin-bottom: var(--space-4);">Policy & Background Resources</h3>';
    html += '<ul style="list-style: none; padding: 0; display: grid; gap: var(--space-3);">';
    
    resources.forEach(resource => {
        html += `
            <li style="border-left: 4px solid var(--color-primary); padding-left: var(--space-4);">
                <h4 style="margin: 0 0 var(--space-2); color: var(--text-primary);">
                    <a href="${resource.url}" target="_blank" rel="noopener">${resource.title}</a>
                </h4>
                <p style="margin: 0; font-size: var(--font-size-sm); color: var(--text-secondary);">
                    ${resource.description}
                </p>
            </li>
        `;
    });
    
    html += '</ul>';
    container.innerHTML = html;
}
