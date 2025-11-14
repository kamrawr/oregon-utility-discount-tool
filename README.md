# Oregon Utility Bill Discount Finder

A high-quality, interactive screening tool to help Oregon households find and apply for income-qualified utility bill discount programs from investor-owned utilities (IOUs).

**Live Site:** [https://[YOUR-GITHUB-USERNAME].github.io/oregon-utility-discount-tool/](https://[YOUR-GITHUB-USERNAME].github.io/oregon-utility-discount-tool/)

## Overview

Oregon's six investor-owned utilities offer income-qualified bill discount programs that can reduce electric and gas bills by **10-95%** for eligible households. These programs are authorized under Oregon's **HB 2475 (Energy Affordability Act)** and **OPUC Docket UM 2211**.

This tool helps:
- **Community-based organizations (CBOs)** screen clients and navigate them to the right program
- **Individual households** determine eligibility and apply for discounts
- **Caseworkers and navigators** quickly reference program details and application links

## Features

### 🎯 Interactive Screening Tool
- Step-by-step questionnaire guides users through:
  1. Geographic location (7 Oregon regions)
  2. Utility type (electric, gas, or both)
  3. Specific utility provider
  4. Household size and income
- Matches households to **1-6 eligible programs** based on their answers
- Provides eligibility estimates using 60% State Median Income (SMI) thresholds
- Direct links to application forms and phone numbers

### 📊 Program Comparison View
- Side-by-side comparison of all 6 IOU programs
- Filter by fuel type (electric vs. natural gas)
- Detailed breakdowns of:
  - Eligibility requirements
  - Discount tiers (10-95%)
  - Application methods
  - Service areas
  - Additional benefits (arrearage relief, disconnection protections)

### 📚 Comprehensive Data
All program information is structured in JSON format (`data/programs.json`) including:
- Full eligibility criteria and income thresholds
- Discount tier structures
- Application links, phone numbers, and methods
- Statewide policy resources (HB 2475, UM 2211, OHCS income matrices)

## Programs Covered

| Utility | Fuel Type | Program Name | Discount Range |
|---------|-----------|--------------|----------------|
| **PGE** (Portland General Electric) | Electric | Income-Qualified Bill Discount (IQBD) | 15-60% |
| **Pacific Power** (PacifiCorp) | Electric | Oregon Low-Income Discount (LID) | Up to 60%+ |
| **Idaho Power** | Electric | Oregon Bill Discount Program | 10%, 25%, or 70% |
| **NW Natural** | Natural Gas | Income-Qualified Bill Discount | Up to 70%+ |
| **Avista Utilities** | Natural Gas | My Energy Discount – Oregon | Up to 90% |
| **Cascade Natural Gas** | Natural Gas | Energy Discount Program (EDP) | 15-95% |

## Technology Stack

- **Vanilla JavaScript** – No frameworks, lightweight and fast
- **PicoCSS** – Minimal, semantic CSS framework
- **JSON data structure** – Easy to update and maintain
- **GitHub Pages** – Free, reliable hosting
- **Responsive design** – Works on desktop, tablet, and mobile

## Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/[YOUR-USERNAME]/oregon-utility-discount-tool.git
   cd oregon-utility-discount-tool
   ```

2. **Serve locally:**
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

### Deploy to GitHub Pages

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[YOUR-USERNAME]/oregon-utility-discount-tool.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Select **main** branch and **/ (root)** folder
   - Click **Save**
   - Your site will be live at: `https://[YOUR-USERNAME].github.io/oregon-utility-discount-tool/`

## Project Structure

```
oregon-utility-discount-tool/
├── index.html              # Main screening tool page
├── compare.html            # Program comparison page
├── README.md               # This file
├── css/
│   └── style.css          # Custom styles
├── js/
│   ├── data-loader.js     # Data fetching and caching
│   ├── screening.js       # Screening tool logic
│   ├── compare.js         # Comparison page logic
│   └── results.js         # Results display (placeholder)
└── data/
    └── programs.json      # All program data and links
```

## Data Maintenance

### Updating Program Information

All program data lives in `data/programs.json`. To update:

1. **Annual updates** (required):
   - Update income thresholds (60% SMI) based on OHCS annual releases
   - Verify phone numbers and URLs
   - Check discount tier percentages against OPUC tariff filings

2. **As needed**:
   - Add new programs if additional IOUs join
   - Update service areas if utility territories change
   - Revise application processes if utilities change their enrollment flows

### Key Data Sources

- **OPUC Docket UM 2211:** https://apps.puc.state.or.us/edockets/docket.asp?DocketID=22824
- **OHCS Income Limits (SMI/FPL):** https://www.oregon.gov/ohcs/get-involved/Pages/income-limits.aspx
- **Individual utility program pages** (see `data/programs.json` for links)

## Use Cases

### For CBOs and Caseworkers
Use the screening tool during intake:
1. Ask client for location, utility provider, household size, and income
2. Walk through the 4-step form
3. Review matched programs with client
4. Help client apply online or by phone

### For Households
Self-service screening:
1. Visit the live site
2. Complete the questionnaire
3. Review your matched programs
4. Click "Apply Online" or call the utility directly

### For Researchers & Advocates
- Use the comparison page to analyze program differences
- Reference `data/programs.json` for structured program data
- Cite statewide resources (HB 2475, UM 2211) in reports

## Key Eligibility Notes

- **Income standard:** Most programs use ≤60% State Median Income (SMI); Cascade also offers ≤150% FPL
- **Self-attestation:** No documentation required at application across all programs
- **Household size:** All programs consider total household size for income calculation
- **LIHEAP coordination:** Many customers enrolled in LIHEAP automatically qualify

## Contributing

This tool is maintained by **Community Consulting Partners LLC** (Isaiah Kamrar). Contributions are welcome:

1. **Report issues:** Use GitHub Issues to report broken links, data errors, or bugs
2. **Suggest improvements:** Open a discussion for new features or enhancements
3. **Submit pull requests:** For data updates or code improvements

## License

This project is licensed under the **MIT License**. Feel free to fork, adapt, and reuse for your community.

## Credits

**Developed by:** Isaiah Kamrar, Community Consulting Partners LLC  
**Data sources:** OPUC UM 2211, Oregon IOUs, OHCS  
**Built with:** Vanilla JS, PicoCSS, GitHub Pages

## Contact

For questions or partnership inquiries:
- **GitHub:** [@isaiahkamrar](https://github.com/isaiahkamrar)
- **Business:** Community Consulting Partners LLC

---

**Last Updated:** January 2025  
**Data Currency:** Programs and links current as of January 2025; income thresholds based on 2025 OHCS estimates
