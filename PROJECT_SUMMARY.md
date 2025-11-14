# Oregon Utility Bill Discount Finder - Project Summary

## ✅ Project Complete

A fully functional, production-ready GitHub Pages site for screening Oregon households and navigating them to appropriate utility bill discount programs.

## 📦 What Was Built

### Core Features
1. **Interactive Screening Tool** (`index.html`)
   - 4-step questionnaire (location → utility type → provider → household info)
   - Dynamic utility provider matching based on geographic area
   - Eligibility estimation using 60% SMI thresholds
   - Direct links to application forms and phone numbers
   - Statewide resources section

2. **Program Comparison Page** (`compare.html`)
   - Side-by-side view of all 6 IOU programs
   - Filterable by fuel type (electric/gas)
   - Complete program details with eligibility, benefits, and application methods

3. **Comprehensive Data Structure** (`data/programs.json`)
   - All 6 IOU programs fully documented:
     - PGE (electric)
     - Pacific Power (electric)
     - Idaho Power (electric)
     - NW Natural (gas)
     - Avista (gas)
     - Cascade Natural Gas (gas)
   - Every program includes:
     - Eligibility criteria
     - Discount tiers (10-95%)
     - Service areas
     - Application links and phone numbers
     - Additional benefits (arrearage relief, disconnection protections)
   - Statewide resources (HB 2475, UM 2211, OHCS income matrices)

### Technical Implementation
- **Vanilla JavaScript** - No dependencies, fast loading
- **PicoCSS** - Clean, accessible, responsive design
- **Modular architecture**:
  - `data-loader.js` - Data fetching and caching
  - `screening.js` - Screening tool logic and navigation
  - `compare.js` - Comparison page rendering
  - `results.js` - Results display (extensible)
- **Responsive design** - Works on all devices
- **Accessible** - Semantic HTML, ARIA-friendly

## 📁 Repository Structure

```
oregon-utility-discount-tool/
├── index.html              # Main screening tool
├── compare.html            # Program comparison
├── README.md               # Full documentation
├── DEPLOY.md               # Deployment instructions
├── PROJECT_SUMMARY.md      # This file
├── .gitignore             
├── css/
│   └── style.css          # Custom styles (302 lines)
├── js/
│   ├── data-loader.js     # Data management
│   ├── screening.js       # Screening logic (391 lines)
│   ├── compare.js         # Comparison logic (137 lines)
│   └── results.js         # Future enhancements
├── data/
│   └── programs.json      # All program data (295 lines)
└── assets/                # For future images/assets
```

## 🚀 Deployment Steps

The repository is initialized and ready to push to GitHub:

1. **Create GitHub repository** at https://github.com/new
   - Name: `oregon-utility-discount-tool`
   - Public repository

2. **Push to GitHub:**
   ```bash
   cd ~/Projects/oregon-utility-discount-tool
   git remote add origin https://github.com/YOUR-USERNAME/oregon-utility-discount-tool.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Source: Deploy from branch `main`, folder `/` (root)
   - Save

4. **Live site** will be at:
   ```
   https://YOUR-USERNAME.github.io/oregon-utility-discount-tool/
   ```

See `DEPLOY.md` for detailed deployment instructions.

## 🎯 Use Cases

### For CBOs and Social Service Agencies
- Use during client intake to quickly identify eligible programs
- Walk clients through the 4-step screening
- Provide direct application links or phone numbers
- Print or email results for client follow-up

### For Individual Households
- Self-service tool to check eligibility
- Compare programs across utilities
- Apply online or call directly from results page

### For Policy Researchers
- Reference all 6 programs in one place
- Access structured data in `programs.json`
- Cite authoritative links (HB 2475, UM 2211)

## 📊 Program Coverage

All **6 investor-owned utilities** in Oregon:

| Utility | Type | Discount Range | Coverage |
|---------|------|----------------|----------|
| PGE | Electric | 15-60% | Portland metro, Willamette Valley, North Coast |
| Pacific Power | Electric | Up to 60%+ | Southern OR, Eastern OR, parts of Portland metro |
| Idaho Power | Electric | 10-70% | Baker, Malheur, Harney counties |
| NW Natural | Gas | Up to 70%+ | Portland metro, Willamette Valley |
| Avista | Gas | Up to 90% | Medford, Klamath Falls, Southern OR |
| Cascade Natural Gas | Gas | 15-95% | North-central OR, Coastal, parts of Willamette Valley |

## 🔧 Maintenance

### Required Annual Updates
- **Income thresholds** - Update based on OHCS SMI releases (typically October)
- **Phone numbers** - Verify utility contact numbers
- **URLs** - Check all links still work
- **Discount tiers** - Confirm percentages match current tariffs

### Update Process
1. Edit `data/programs.json`
2. Update SMI table in `js/screening.js` (lines 322-331)
3. Test locally
4. Commit and push to GitHub

### Key Data Sources
- OPUC UM 2211: https://apps.puc.state.or.us/edockets/docket.asp?DocketID=22824
- OHCS Income Limits: https://www.oregon.gov/ohcs/get-involved/Pages/income-limits.aspx
- Individual utility program pages (linked in JSON)

## 🌟 Future Enhancements

Consider adding:
- **Spanish language support** - Translate UI and program data
- **Print-friendly results** - PDF generation or print CSS
- **Email results** - Send matched programs to user's email
- **LIHEAP integration** - Auto-populate from LIHEAP enrollment
- **Mobile app** - PWA or native mobile wrapper
- **Analytics** - Track which programs are most viewed/applied
- **User feedback form** - Collect CBO feedback on tool usability
- **Admin panel** - Web-based editor for program data

## 📞 Support & Contact

**Maintained by:**
- Isaiah Kamrar
- Community Consulting Partners LLC
- GitHub: @isaiahkamrar

**For support:**
- Open GitHub Issues for bugs or data errors
- Submit Pull Requests for improvements
- Contact via GitHub for partnership inquiries

## 📄 License

MIT License - Free to use, fork, and adapt for any community.

## 🙏 Acknowledgments

**Data sources:**
- Oregon Public Utility Commission (OPUC)
- Oregon Housing and Community Services (OHCS)
- All 6 Oregon IOUs for program information

**Authorized by:**
- HB 2475 – Energy Affordability Act (2019)
- OPUC Docket UM 2211 – Energy Affordability

---

**Project Status:** ✅ COMPLETE & READY TO DEPLOY  
**Created:** January 2025  
**Version:** 1.0.0
