// Screening tool logic
class ScreeningTool {
    constructor() {
        this.currentStep = 1;
        this.formData = {
            location: '',
            utilityTypes: [],
            selectedUtilities: [],
            householdSize: 0,
            householdIncome: 0
        };
        
        this.utilityMap = {
            'portland-metro': {
                electric: ['pge', 'pacificpower'],
                gas: ['nwnatural', 'cascade']
            },
            'willamette-valley': {
                electric: ['pge', 'pacificpower'],
                gas: ['nwnatural', 'cascade']
            },
            'north-coast': {
                electric: ['pge'],
                gas: ['nwnatural', 'cascade']
            },
            'southern-oregon': {
                electric: ['pacificpower'],
                gas: ['nwnatural', 'avista', 'cascade']
            },
            'eastern-oregon': {
                electric: ['pacificpower'],
                gas: ['cascade']
            },
            'north-central-oregon': {
                electric: ['pacificpower'],
                gas: ['cascade']
            },
            'baker-malheur-harney': {
                electric: ['idahopower'],
                gas: []
            }
        };
        
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.loadStateWideResources();
    }

    attachEventListeners() {
        // Next buttons
        document.querySelectorAll('.next-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const nextStep = parseInt(e.target.dataset.next);
                if (this.validateStep(this.currentStep)) {
                    this.goToStep(nextStep);
                }
            });
        });

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const backStep = parseInt(e.target.dataset.back);
                this.goToStep(backStep);
            });
        });

        // Form submission
        const form = document.getElementById('screeningForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitForm();
            });
        }

        // Start over button
        const startOverBtn = document.getElementById('start-over');
        if (startOverBtn) {
            startOverBtn.addEventListener('click', () => {
                this.resetForm();
            });
        }

        // Location change
        const locationSelect = document.getElementById('location');
        if (locationSelect) {
            locationSelect.addEventListener('change', (e) => {
                this.formData.location = e.target.value;
            });
        }

        // Utility type checkboxes
        document.querySelectorAll('input[name="utility-type"]').forEach(cb => {
            cb.addEventListener('change', () => {
                this.updateUtilityTypes();
                this.updateUtilityOptions();
            });
        });
    }

    validateStep(step) {
        switch(step) {
            case 1:
                if (!this.formData.location) {
                    alert('Please select your location.');
                    return false;
                }
                return true;
            case 2:
                const utilityTypes = document.querySelectorAll('input[name="utility-type"]:checked');
                if (utilityTypes.length === 0) {
                    alert('Please select at least one utility type.');
                    return false;
                }
                return true;
            case 3:
                const selectedUtilities = document.querySelectorAll('input[name="utility-company"]:checked');
                if (selectedUtilities.length === 0) {
                    alert('Please select at least one utility provider.');
                    return false;
                }
                return true;
            case 4:
                const householdSize = document.getElementById('household-size').value;
                const householdIncome = document.getElementById('household-income').value;
                if (!householdSize || householdSize < 1) {
                    alert('Please enter your household size.');
                    return false;
                }
                if (!householdIncome || householdIncome < 0) {
                    alert('Please enter your household income.');
                    return false;
                }
                return true;
            default:
                return true;
        }
    }

    goToStep(step) {
        // Hide all steps
        document.querySelectorAll('.screening-step').forEach(s => {
            s.style.display = 'none';
        });

        // Show target step
        const targetStep = document.querySelector(`[data-step="${step}"]`);
        if (targetStep) {
            targetStep.style.display = 'block';
            this.currentStep = step;
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateUtilityTypes() {
        this.formData.utilityTypes = Array.from(
            document.querySelectorAll('input[name="utility-type"]:checked')
        ).map(cb => cb.value);
    }

    updateUtilityOptions() {
        const container = document.getElementById('utility-options');
        if (!container || !this.formData.location || this.formData.utilityTypes.length === 0) {
            return;
        }

        const availableUtilities = new Set();
        const locationMap = this.utilityMap[this.formData.location];

        if (!locationMap) return;

        this.formData.utilityTypes.forEach(type => {
            if (locationMap[type]) {
                locationMap[type].forEach(util => availableUtilities.add(util));
            }
        });

        const programs = dataLoader.getPrograms();
        container.innerHTML = '';

        availableUtilities.forEach(utilId => {
            const program = programs.find(p => p.id === utilId);
            if (!program) return;

            const option = document.createElement('label');
            option.className = 'utility-option';
            option.innerHTML = `
                <input type="checkbox" name="utility-company" value="${utilId}">
                <strong>${program.utility}</strong>
                <br>
                <small>${program.fuel_type} · ${program.program_name}</small>
            `;
            container.appendChild(option);
        });
    }

    async submitForm() {
        // Collect form data
        this.formData.selectedUtilities = Array.from(
            document.querySelectorAll('input[name="utility-company"]:checked')
        ).map(cb => cb.value);
        
        this.formData.householdSize = parseInt(document.getElementById('household-size').value);
        this.formData.householdIncome = parseFloat(document.getElementById('household-income').value);

        // Hide form, show results
        document.getElementById('screening-tool').style.display = 'none';
        document.getElementById('intro').style.display = 'none';
        document.getElementById('results').style.display = 'block';

        // Display results
        this.displayResults();
    }

    displayResults() {
        const container = document.getElementById('results-container');
        container.innerHTML = '';

        const programs = dataLoader.getPrograms();
        const matchedPrograms = programs.filter(p => 
            this.formData.selectedUtilities.includes(p.id)
        );

        if (matchedPrograms.length === 0) {
            container.innerHTML = '<article><p>No programs found. Please try again.</p></article>';
            return;
        }

        matchedPrograms.forEach(program => {
            const card = this.createProgramCard(program);
            container.appendChild(card);
        });
    }

    createProgramCard(program) {
        const article = document.createElement('article');
        article.className = 'program-card';

        const eligibilityInfo = this.checkEligibility(program);
        
        const fuelClass = program.fuel_type.toLowerCase().includes('electric') ? 'electric' : 'gas';

        article.innerHTML = `
            <header>
                <h3>
                    ${program.utility}
                    <span class="fuel-badge ${fuelClass}">${program.fuel_type}</span>
                </h3>
            </header>
            
            <div class="eligibility-status ${eligibilityInfo.class}">
                ${eligibilityInfo.message}
            </div>

            <p><strong>Program:</strong> ${program.program_name}</p>
            <p><strong>Service Area:</strong> ${program.service_areas.join(', ')}</p>

            <div class="benefits-list">
                <h4>Benefits</h4>
                <p><strong>Discount Range:</strong> ${program.benefits.discount_range}</p>
                ${this.renderBenefitTiers(program)}
                ${program.benefits.additional ? `
                    <p><strong>Additional Benefits:</strong></p>
                    <ul>
                        ${program.benefits.additional.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>

            <div>
                <h4>Eligibility</h4>
                <p><strong>Income Standard:</strong> ${program.eligibility.income_standard}</p>
                <p><strong>Documentation:</strong> ${program.application.documentation}</p>
            </div>

            <div class="action-buttons">
                <a href="${program.application.online_form}" target="_blank" role="button">Apply Online</a>
                <a href="tel:${program.application.phone.replace(/[^0-9]/g, '')}" role="button" class="secondary">Call: ${program.application.phone}</a>
            </div>

            <details style="margin-top: 1.5rem;">
                <summary>More Resources</summary>
                <ul>
                    ${program.resources.map(r => `
                        <li><a href="${r.url}" target="_blank">${r.title}</a></li>
                    `).join('')}
                </ul>
            </details>
        `;

        return article;
    }

    renderBenefitTiers(program) {
        if (Array.isArray(program.benefits.tiers)) {
            return `
                <p><strong>Tiers:</strong></p>
                <ul>
                    ${program.benefits.tiers.map(tier => {
                        if (tier.income) {
                            return `<li>Tier ${tier.tier}: ${tier.income} → ${tier.bill_discount} discount, ${tier.arrearage_relief} arrearage relief</li>`;
                        } else if (tier.discount) {
                            return `<li>Tier ${tier.tier}: ${tier.discount} discount (${tier.criteria})</li>`;
                        }
                        return '';
                    }).join('')}
                </ul>
            `;
        }
        return `<p>${program.benefits.tiers}</p>`;
    }

    checkEligibility(program) {
        // Simplified eligibility check based on 60% SMI
        // Oregon 2025 SMI estimates (would need to be updated annually)
        const smiTable = {
            1: 42000,
            2: 48000,
            3: 54000,
            4: 60000,
            5: 66000,
            6: 72000,
            7: 78000,
            8: 84000
        };

        const householdSmi = smiTable[this.formData.householdSize] || (84000 + (this.formData.householdSize - 8) * 6000);
        const threshold60 = householdSmi * 0.6;

        if (this.formData.householdIncome <= threshold60) {
            return {
                class: 'eligible',
                message: '✓ You likely qualify for this program based on your income!'
            };
        } else if (this.formData.householdIncome <= householdSmi) {
            return {
                class: 'likely-eligible',
                message: '⚠ You may qualify. Some programs have tiers up to 150% FPL. Contact the utility to confirm.'
            };
        } else {
            return {
                class: 'check-details',
                message: 'ℹ Your income may be above standard thresholds. Contact the utility for specific eligibility details.'
            };
        }
    }

    async loadStateWideResources() {
        await dataLoader.loadData();
        const resources = dataLoader.getStateWideResources();
        const container = document.getElementById('statewide-resources');
        
        if (!container) return;

        resources.forEach(resource => {
            const card = document.createElement('div');
            card.className = 'resource-card';
            card.innerHTML = `
                <h4><a href="${resource.url}" target="_blank">${resource.title}</a></h4>
                <p>${resource.description}</p>
            `;
            container.appendChild(card);
        });
    }

    resetForm() {
        this.formData = {
            location: '',
            utilityTypes: [],
            selectedUtilities: [],
            householdSize: 0,
            householdIncome: 0
        };
        document.getElementById('screeningForm').reset();
        document.getElementById('results').style.display = 'none';
        document.getElementById('screening-tool').style.display = 'block';
        document.getElementById('intro').style.display = 'block';
        this.goToStep(1);
    }
}

// Initialize on page load
if (document.getElementById('screeningForm')) {
    const screeningTool = new ScreeningTool();
}
