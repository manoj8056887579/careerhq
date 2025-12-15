# Course Bulk Import - Quick Reference

## File Format

- **Type:** CSV (UTF-8)
- **Max Size:** 5MB
- **Max Rows:** 1000 courses
- **Header:** Required (first row)

## Required Fields (Must Fill)

1. **universityName** - Name of university
2. **countryName** - Country name (auto-creates if new)
3. **programName** - Course/Program name
4. **studyLevel** - Must be exactly: `Undergraduate`, `Postgraduate`, or `Doctorate`
5. **campus** - Campus location
6. **duration** - Format: "2 years" or "18 months"
7. **openIntakes** - Months separated by `;` e.g., "Jan;Sep"
8. **intakeYear** - Years separated by `;` e.g., "2024;2025"
9. **entryRequirements** - Admission requirements
10. **ieltsScore** - Minimum IELTS (0-9)
11. **ieltsNoBandLessThan** - Min band score (0-9)
12. **yearlyTuitionFees** - Annual fee amount (number only)

## Optional Fields

- **pteScore** (0-90)
- **pteNoBandLessThan** (0-90)
- **toeflScore** (0-120)
- **duolingo** (0-160)
- **gmatScore** (200-800)
- **greScore** (260-340)
- **currency** - USD, GBP, AUD, EUR, etc.
- **applicationDeadline** - Format: DD-Mmm-YYYY
- **workExperience** - e.g., "2+ years"
- **scholarships** - Separate multiple with `;`
- **careerProspects** - Separate multiple with `;`
- **accreditation** - Separate multiple with `;`

## Valid Study Levels

✓ Undergraduate
✓ Postgraduate
✓ Doctorate
✓ Certificate
✓ Diploma

❌ Invalid: "Masters", "Bachelors", "PhD", "Foundation"

## Examples

### Valid Entry

```
MIT,United States,Master of Computer Science,Postgraduate,Boston,2 years,Sep,2024;2025,Bachelor's in CS,7.0,6.5,65,58,90,120,315,165,60000,USD,15-Dec-2024,Not required,Fellowship available,Tech; Research,ABET
```

### Date Format

- ✓ Correct: "31-Mar-2025" or "31-Dec-2024"
- ❌ Wrong: "2025-31-03" or "31/03/2025"

### Multiple Values (use semicolon)

- intakeYear: "2024;2025"
- openIntakes: "Jan;Sep;Apr"
- scholarships: "Merit; Need-based; International"

## Common Errors & Fixes

| Error                         | Fix                            |
| ----------------------------- | ------------------------------ |
| Invalid study level "Masters" | Use "Postgraduate"             |
| Missing required field        | Fill in all 12 required fields |
| Invalid IELTS score           | Must be 0-9                    |
| Date format error             | Use DD-Mmm-YYYY format         |

## Import Steps

1. Prepare CSV file (use template provided)
2. Validate all required fields are filled
3. Go to Admin → Courses → Bulk Import
4. Upload CSV file
5. Review results
6. Fix any errors and re-upload if needed

## Download Files

- **[courses-import-example.csv](courses-import-example.csv)** - 5 sample courses
- **[courses-import-template.csv](courses-import-template.csv)** - Blank template to fill
